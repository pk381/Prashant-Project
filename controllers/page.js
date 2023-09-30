const path = require("path");
const rootDir = require("../util/path");

exports.getAboutUs = (req, res)=>{
    res.sendFile(path.join(rootDir, "views", "about_us.html"));
}
exports.getContactUs = (req, res)=>{
    res.sendFile(path.join(rootDir, "views", "contact_us.html"));
}

exports.getUserPage = (req, res)=>{
    res.sendFile(path.join(rootDir, "views/user", "user.html"));
}

