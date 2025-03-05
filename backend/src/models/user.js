const { ErrorHandler } = require("../logger/error-handler");
class User {

    static collection_name = "users";

    static collection_option = {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                title: `${User.collection_name} Object Validation`,
                required: ["tc", "name", "age"],
                properties: {
                    tc: {
                        bsonType: "int",
                        description: "'tc' must be an integer and is required"
                    },
                    name: {
                        bsonType: "string",
                        description: "'name' must be an string and is required"
                    },
                    age: {
                        bsonType: "int",
                        description: "'age' must be a integer and is required"
                    }
                }
            }
        }
    };

    tc;
    name;
    age;
    /**
     * Create user class
     * 
     * @param {*} data Mongodb response or data array
     */
    constructor(data) {
        this.tc = data.tc;
        this.name = data.name;
        this.age = data.age;
    }
    /**
     * Add user
     * 
     * @param {*} db Mongodb database
     */
    async Add(db) {
        try {
            const collection = await db.collection(User.collection_name);
            const user = await collection.findOne({ tc: this.tc }, {});
            if (user == null) {
                await collection.insertOne(this);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            ErrorHandler(`While insert data to ${User.collection_name} collection`, err);
        }
    }
    /**
     * Update user
     * 
     * @param {*} db Mongodb database
     */
    async Update(db) {
        try {
            const collection = await db.collection(User.collection_name);
            const options = { upsert: true };
            const updateDoc = {
                $set: this,
            };
            const updateresult = await collection.updateOne({ tc: this.tc }, updateDoc, options);
        } catch (err) {
            ErrorHandler(`While update data in ${User.collection_name} collection`, err);
        }
    }
    /**
     * Get user data
     * 
     * @param {any} db Mongodb database
     */
    async Attach(db) {
        try {
            const collection = await db.collection(User.collection_name);
            const user = await collection.findOne({ tc: this.tc }, {});
            if (user !== null) {
                this.name = user.name
                this.age = user.age
                return true;
            } else {
                return false;
            }
        } catch (err) {
            ErrorHandler(`While attach data on ${User.collection_name} collection`, err);
        }
    }
    /**
     * Search user
     * 
     * @param {any} db Mongodb database
     */
    static async Search(db) {
        try {
            const collection = await db.collection(User.collection_name);
            const user = await collection.findOne({ tc: this.tc }, {  });
            return user;
        } catch (err) {
            ErrorHandler(`While Search data on ${User.collection_name} collection`, err);
        }
    }
}

module.exports.User = User;