const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = "mongodb://localhost:27017/commonModules";
// db.userModel = require("./UserModel")(mongoose);
module.exports = db;
