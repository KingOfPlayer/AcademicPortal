const { MongoClient, ServerApiVersion } = require("mongodb");
const { ErrorHandler } = require("../logger/error-handler");

const { User } = require("../models/user");

require('dotenv').config()

const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`;

const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db_Connection;

async function GetDBConnection() {
    if (db_Connection == undefined) {
        try {
            await client.connect();
            console.log("DB connection successful");
            db_Connection = await client.db(process.env.DB_NAME);
        } catch (err) {
            ErrorHandler("While connecting to DB", err);
        }
    }
    return db_Connection;
}
async function CloseDBConnection() {
    try {

    } catch (err) {
        ErrorHandler("While closeing DB connection", err);
    }
}

module.exports.GetDBConnection = GetDBConnection;
module.exports.CloseDBConnection = CloseDBConnection;