import { connect, connection } from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

async function InitDBConnection() {
  if (connection.readyState != 1) {
    try {
      await connect(uri);
      console.log("DB connection successful");
    } catch {
      throw new Error("DB connection not successful");
    }
  }
}

InitDBConnection();
