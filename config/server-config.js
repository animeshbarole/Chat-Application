const dotevn   = require("dotenv");

dotevn.config();

module.exports = {
    DB_URL : process.env.DB_URL,
}
