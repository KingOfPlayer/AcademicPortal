/**
 * Printing Error with custom message
 * 
 * @param {any} msg Message
 * @param {any} error Error
 */
function ErrorHandler(msg, error) {
    console.log("\x1b[31m", msg," encounter a unexpected error. \x1b[0m\n\t");
    if (process.env.ErrorLevel == 0) {
        console.log(error);
    } else if (process.env.ErrorLevel == 4) {
        console.log(error.message);
    }
}

module.exports.ErrorHandler = ErrorHandler;