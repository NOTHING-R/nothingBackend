import { asyncHandeler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Users } from '../models/user.model.js';
import { uploadFileToCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

const genareteAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Users.findById(userId);
    const AccessToken = await user.genareteAccessToken();
    const RefreshToken = await user.genareteRefreshToken();

    user.refreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false });

    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went worng while genareting access and refresh token'
    );
  }
};

const registerUser = asyncHandeler(async (req, res) => {
  // get user details from frontend
  // check validation
  // if user exixts - username password
  // imgae r avatar ace kina,
  // image avatar cloudinary te upoload kora lagbe,
  // response er theke password r token remove korte hobe
  // object create korte hobe bd te add korar jonno
  // check for user creation
  // return response
  const { name, username, email, password } = req.body;
  if ([name, username, email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are reuqired');
  }

  const userExixt = await Users.findOne({
    $or: [{ username }, { email }],
  });

  if (userExixt) {
    throw new ApiError(409, 'User with email or password already exixted');
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  console.log('req.files:', JSON.stringify(req.files, null, 2));
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }
  const avatar = await uploadFileToCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadFileToCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(409, 'Avatar file is required');
  }

  const user = await Users.create({
    name,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = await Users.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Server Failed to Register User ');
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Created Successfully'));
});

const loginUser = asyncHandeler(async (req, res) => {
  // req.body data
  // email & username check
  // find user
  // password check
  // accesstoken & refreshtoken

  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, 'Username or email ir required');
  }

  const user = await Users.findOne({
    $or: [{ username }, { email }],
  });

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid User Credentials');
  }

  const { AccessToken, RefreshToken } = await genareteAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await Users.findById(user._id).select(
    '-password -refreshToken'
  );
  const options = {
    httpOnly: true,
    read: false,
  };
  return res
    .status(200)
    .cookie('accessToken', AccessToken, options)
    .cookie('refreshToken', RefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          AccessToken,
          RefreshToken,
        },
        'User logged in successfully'
      )
    );
});

const logoutUser = asyncHandeler(async (req, res) => {
  Users.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    read: false,
  };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User Logged Out'));
});

const refreshAccessToken = asyncHandeler(async (req, res) => {
  const incomeingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomeingRefreshToken) {
    throw new ApiError(400, 'Unauthorized Request');
  }

  try {
    const decodedToken = jwt.verify(
      incomeingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await Users.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(400, 'Invalid Refresh Token');
    }

    if (incomeingRefreshToken !== user?.refreshToken) {
      throw new ApiError(400, 'RefreshToken expired or used');
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { AccessToken, RefreshToken } = await genareteAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie('accessToken', AccessToken, options)
      .cookie('refreshToken', RefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: AccessToken, refreshToken: RefreshToken },
          'Access Token Refreshed'
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message ||
        'Error while trying to refresh the access and refresh token'
    );
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
