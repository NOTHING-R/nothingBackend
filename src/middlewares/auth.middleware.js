import ApiError from '../utils/ApiError.js';
import { asyncHandeler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { Users } from '../models/user.model.js';

// export const verifyJWT = asyncHandeler(async (req, res, next) => {
//I didn't understand why I did it but I think it is for I didn's used res perametter in this code thats why it should be just a undescore nothing else
export const verifyJWT = asyncHandeler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer', '');
    if (!token) {
      throw new ApiError(401, 'Unauthorized request ');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await Users.findById(decodedToken?._id).select(
      '-password, -refreshToken'
    );

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error?.message || 'Invalid Access Token');
  }
});
