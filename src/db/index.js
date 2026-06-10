import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB = async () => {
  try {
    const databaseConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`MongoDB Connected!!! ${databaseConnectionInstance.connection.host}`)

    console.log(databaseConnectionInstance)

  } catch (error) {
    console.log("MONGODB CONNECTION FAILED!!!", error)
    process.exit(1)
  }
}

export default ConnectDB
