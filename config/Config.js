require("dotenv").config(); //instatiate environment variables

let CONFIG = {};

CONFIG.APP = process.env.APP || "Development";

CONFIG.PORT = process.env.PORT || "5000";

CONFIG.DB_URI = process.env.DB_URI || "mongodb+srv://ashoka:ashoka@22@cluster0.tnzbw.mongodb.net/TMS_APP?retryWrites=true&w=majority"

CONFIG.JWT_ENCRYPTION = process.env.JWT_ENCRYPTION || "jwt_please_change";

CONFIG.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "10000";

CONFIG.TASK_STATUS = ['NOT ASSIGN', 'PENDING', 'COMPLETED', 'IN PROGRESS']

module.exports = CONFIG;