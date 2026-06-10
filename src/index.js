import dotenv from "dotenv";
import ConnectDB from "./db/index.js";

dotenv.config({ path: "./.env" });

ConnectDB();


// require('dotenv').config({ path: "./env" })
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constants.js";
// import ConnectDB from "./db/index.js";
// import dotenv from "dotenv";
// import ConnectDB from "./db/index.js";
//
// dotenv.config({ path: "./.env" });
//
// ConnectDB()


// const app = express()
// ; (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODD_URI}/${DB_NAME}`)
//     app.on("error", (error) => {
//       console.log("Database connection failed", error)
//
//       app.listen(process.env.PORT, () => {
//         console.log(`App is listening on ${process.env.PORT}`)
//       })
//     })
//
//   } catch (error) {
//     console.log("You got an error ", error)
//     throw error
//   }
// })()
