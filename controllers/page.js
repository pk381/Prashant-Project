const path = require("path");
const rootDir = require("../util/path");

exports.getAboutUs = (req, res)=>{
    res.sendFile(path.join(rootDir, "views/common", "about_us.html"));
}
exports.getContactUs = (req, res)=>{
    res.sendFile(path.join(rootDir, "views/common", "contact_us.html"));
}

exports.getUserPage = (req, res)=>{
    res.sendFile(path.join(rootDir, "views/user", "user.html"));
}

