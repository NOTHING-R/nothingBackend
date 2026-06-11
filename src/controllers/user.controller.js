import { asyncHandeler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Users } from '../models/user.model.js';
import { uploadFileToCloudinary } from '../utils/cloudinary.js';

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

  const userExixt = Users.findOne({
    $or: [{ username }, { email }],
  });

  if (userExixt) {
    throw new ApiError(409, 'User with email or password already exixted');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(409, 'Avatar file is required');
  }
  const avatar = await uploadFileToCloudinary(avatarLocalPath);
  const coverImage = await uploadFileToCloudinary(coverImageLocalPath);

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

  const createdUser = Users.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Server Failed to Register User ');
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Created Successfully'));
});

export { registerUser };
