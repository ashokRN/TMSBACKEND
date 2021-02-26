require("dotenv").config(); //instatiate environment variables

let CONFIG = {};

CONFIG.APP = process.env.APP || "Development";

CONFIG.PORT = process.env.PORT || "5000";

CONFIG.DB_URI = process.env.DB_URI || "mongodb://localhost:27017/TMS_APP"

CONFIG.JWT_ENCRYPTION = process.env.JWT_ENCRYPTION || "jwt_please_change";

CONFIG.JWT_EXPIRATION = process.env.JWT_EXPIRATION || "10000";

CONFIG.TASK_STATUS = ['NOT ASSIGN', 'PENDING', 'COMPLETED', 'IN PROGRESS']

module.exports = CONFIG;