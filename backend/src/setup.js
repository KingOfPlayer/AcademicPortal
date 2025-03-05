const fs = require("fs");
const path = require("path");
var crypto  = require('crypto');
const { ErrorHandler } = require("./logger/error-handler");
const { GetDBConnection, CloseDBConnection } = require("./services/database-service");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

require('dotenv').config();

class Setup {
    static databaseVersioncollection = "database_version";
    #models = [];

    async DatabaseUpdate() {

        console.log(`Models loading`);
        this.#LoadModels();
        if (process.env.DebugLevel == 0) {
            console.log(this.#models);
        }
        console.log(this.#models.length, ` Models loaded`);

        const db_VersionDetails = await this.#GetDatabaseVersionDetails();
        const calculatedVersionDetails = await this.#CalculateVersionDetails();

        if (db_VersionDetails == null) {
            console.log(`Database version not found`);
        } else {
            if (db_VersionDetails.hash == calculatedVersionDetails.hash) {
                console.log(`Database version same. Not need to database update`);
                process.exit();
            } else {
                console.log(`Database version different. Can database update`);
            }
        }

        await new Promise((resolve) => {
            readline.question('Confirm to update database (Enter Y) \n', response => {
                if (response !== "Y") {
                    console.log(`Database update aborted`);
                    process.exit();
                }
                readline.close();
                resolve();
            });
        });

        let result = await this.#UpdateCollections();
        if (result) {
            console.log(`Database updated`);
        }

        await this.#SetDatabaseVersionDetails(calculatedVersionDetails);

        process.exit();
    }
    async #GetDatabaseVersionDetails() {
        const db = await GetDBConnection();
        const collection = await db.createCollection(Setup.databaseVersioncollection);
        const version = await collection.findOne({ _id: 1 });
        return version;
    }
    async #SetDatabaseVersionDetails(db_version) {
        const db = await GetDBConnection();
        const collection = await db.createCollection(Setup.databaseVersioncollection);
        await collection.updateOne({ _id: 1 }, { $set: db_version }, { upsert: true });
    }
    #CalculateVersionDetails() {
        try {
            const models = JSON.stringify(this.#models);
            const _hash = crypto.createHash('md5').update(models).digest('hex');
            return { hash:_hash };
        } catch (err) {
            ErrorHandler("Calculate while version hash",err)
        }
    }
    /**
     * Load models
     */
    #LoadModels() {
        const normalizedPath = path.join(__dirname, process.env.ModelDir);
        const modelFiles = fs.readdirSync(normalizedPath, { recursive: true }).filter(path => path.endsWith(".js"))
        for (const modelFile in modelFiles) {
            const models = require(`./${process.env.ModelDir}/` + modelFiles[modelFile].replace(".js", ''))
            for (const model in models) {
                this.#models.push(models[model]);
            }
        }
    }
    async #UpdateCollections() {
        try {
            for (const model in this.#models) {
                await this.#CreateCollection(this.#models[model]);
            }
        } catch (err) {
            ErrorHandler("While database update", err);
            return false;
        }
        return true;
    }
    /**
     * Create collection
     * 
     * @param {any} Models Model Class
     */
    async #CreateCollection(Model) {
        try {
            const db = await GetDBConnection();
            await db.createCollection(Model.collection_name, Model.collection_option);
        } catch (err) {
            ErrorHandler(`While Create ${Model.collection_name} collection`, err);
        }
    }
    /**
     * Drop Collection
     * 
     * @param {any} Model Model Class
     */
    async #DropCollection(Model) {
        try {
            const db = await GetDBConnection();
            const collection = await db.collection(Model.collection_name);
            const result = await collection.drop();
            if (result) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            ErrorHandler(`While Create ${Model.collection_name} collection`, err);
        }
    }
}
async function run() {
    const setup = new Setup();
    await setup.DatabaseUpdate();
}
run();
