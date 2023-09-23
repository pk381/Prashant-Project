const path = require("path");
const rootDir = require("../util/path");

exports.getLogin = (req, res)=>{
    res.sendFile(path.join(rootDir, "views", "admin_login.html"));
}
exports.getAdmin = (req, res)=>{
    res.sendFile(path.join(rootDir, "views", "admin.html"));
}