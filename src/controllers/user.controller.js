import { asyncHandeler } from "../utils/asyncHandler.js";

const registerUser = asyncHandeler(async (req, res) => {
  res.status(200).json(
    {
      message: "User resitration sussessfull"
    }
  )
})

export { registerUser }
