const path = require("path");
const rootDir = require("../util/path");
const { Op, and } = require("sequelize");

const Admin = require("../models/admin");
const User = require("../models/user");
const Company = require("../models/company");
const UpgradeRequest = require("../models/upgradeRequest");
const WidthdrawlRequest = require("../models/widthdrawlRequest");
const Earning = require("../models/earning");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateToken(data) {
  return jwt.sign(data, "secretKey");
}

exports.getLogin = (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin", "admin_login.html"));
};

exports.getSearch = (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin", "searchAndModify.html"));
};

exports.getTreePage = (req, res) => {
  res.sendFile(path.join(rootDir, "views", "tree.html"));
};

exports.requestPage = (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin", "request.html"));
};

exports.getMain = async (req, res) => {
  // const newCompany = await Company.create({
  //     name: 'Prashant Company',
  //     earningInLifetime: 0,
  //     earningInThisMonth: 0,
  //     greenMemberInLifetime: 0,
  //     greenMemberInThisMonth: 0,
  //     redMemberInLifetime: 0,
  //     redMemberInThisMonth: 0
  // });

  res.sendFile(path.join(rootDir, "views/admin", "admin.html"));
};

exports.postLogin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { email: req.body.email } });

    if (admin === null) {
      console.log("user not exist");

      res.status(201).json({ message: "userNotExist" });
    } else {
      bcrypt.compare(req.body.password, admin.password, async (err, result) => {
        if (err) {
          res.status(201).json({ message: "passwordIncorrect" });
          console.log(err);
        } else {
          res.status(201).json({
            admin: {
              name: admin.name,
              email: admin.email,
              type: "admin",
            },
            message: "loginSuccessfully",
            token: generateToken(admin.id),
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "somthing went wrong" });

    console.log(err);
  }
};

exports.getInfo = async (req, res) => {
  try {
    const allUser = await User.findAll({
      attributes: ["planType", "createdAt"],
    });

    let allActive = 0;
    let notActive = 0;
    let notActiveInMonth = 0;
    let allActiveInMonth = 0;

    allUser.forEach((user) => {
      let date = new Date();
      date = new Date(`${date.getFullYear()}/${date.getMonth()}/01`);

      if (user.planType === null) {
        if (user.createdAt >= date && user.createdAt <= new Date()) {
          notActiveInMonth++;
        }
        notActive++;
      } else {
        if (user.createdAt >= date && user.createdAt <= new Date()) {
          allActiveInMonth++;
        }
        allActive++;
      }
    });

    res.status(200).json({
      message: "got",
      info: {
        allActive: allActive,
        allActiveInMonth: allActiveInMonth,
        notActive: notActive,
        notActiveInMonth: notActiveInMonth,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMemberInfo = async (req, res) => {
  try {
    const date = new Date();

    const newMembers = await User.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(`${date.getFullYear()}/${date.getMonth()}/01`),
          [Op.lte]: new Date(),
        },
      },
    });

    res.status(201).json({ message: "got", newMembers: newMembers });
  } catch (err) {
    console.log(err);
  }
};

exports.getTree = async (req, res) => {
  async function createTreeData(nodeId) {
    const element = await User.findOne({ where: { id: nodeId } });
    let children = await User.findAll({ where: { underId: nodeId } });

    children = children.map((element) => {
      return { element, children: [] };
    });

    return { element, children };
  }

  try {
    const nodeId = parseInt(req.params.nodeId);

    if (nodeId === 0) {
      const data = await createTreeData(1);

      res.status(201).json({ message: "got", data: data });
    } else {
      const data = await createTreeData(nodeId);

      res.status(201).json({ message: "got", data: data });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.joiningRequests = async (req, res) => {
  try {
    const requests = await UpgradeRequest.findAll({
      where: { status: "PENDING" },
      attributes: [
        "id",
        "userId",
        "name",
        "amount",
        "transactionId",
        "createdAt",
      ],
    });

    res.status(201).json({ message: "got", requests: requests });
  } catch (err) {
    console.log("err in geting joining requests", err);
  }
};

exports.widthdrawlRequests = async (req, res) => {
  try {
    const requests = await WidthdrawlRequest.findAll({
      where: { status: "PENDING" },
      attributes: ["id", "userId", "name", "amount", "cryptoId", "createdAt"],
    });

    res.status(201).json({ message: "got", requests: requests });
  } catch (err) {
    console.log("err in geting widthdrawl requests", err);
  }
};

exports.updateWidthdrawlRequest = async (req, res) => {
  try {
    const request = await WidthdrawlRequest.findByPk(req.body.id);

    if (req.body.status === "APPROVED") {
      request.status = "APPROVED";
      await request.save();

      const earning = await Earning.findOne({
        where: { userId: request.userId },
      });
      earning.widthdrawl += request.amount;
      await earning.save();

      res.status(201).json({ message: "approved", request: request });
    } else {
      request.status = "CANCELED";
      await request.save();
      res.status(201).json({ message: "cancel", request: request });
    }
  } catch (err) {
    console.log("err in updating widthdrawl requests", err);
  }
};

exports.updateJoiningRequest = async (req, res) => {
  try {
    const request = await UpgradeRequest.findByPk(req.body.id);

    if (req.body.status === "APPROVED") {
      request.status = "APPROVED";
      const user = await User.findByPk(request.userId);

      await request.save();

      user.planType = "starter";

      await user.save();

      res.status(201).json({ message: "approved", request: request });
    } else {
      request.status = "CANCELED";

      await request.save();
      res.status(201).json({ message: "cancel", request: request });
    }
  } catch (err) {
    console.log("err in updating joining requests", err);
  }
};

exports.updateUser = async (req, res) => {
  try {

    console.log(req.body);

    const user = await User.findByPk(parseInt(req.body.id));

    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;

    if(user.password !== req.body.password){

      console.log("chnaging password");

      bcrypt.hash(req.body.password, 10, async (err, hash) => {

        if (err) {
          console.log(err);
        } else {
          user.password = hash;
        }
      });
    }

    // user.isActive = req.user.isActive;

    await user.save();
    res.status(201).json({ message: "done", user: user});
  } catch (err) {
    res.status(201).json({ message: "err"});
    console.log("error in updateing user info",err);
  }
};

exports.searchUsers = async (req, res) => {
  try {
    let users;
    if (req.body.emailOrId === "Id") {
      users = await User.findAll({where: {id: parseInt(req.body.searchBy)}, attributes:['id', 'name', 'email','phone','password', 'createdAt']});
    } else if (req.body.emailOrId === "Email") {
      users = await User.findAll({ where: { email: req.body.searchBy }, attributes:['id', 'name', 'email','phone','password', 'createdAt'] });
    }
    else{
      users = await User.findAll({ where: {
        name:{
          [Op.like]: `%${req.body.searchBy}%`
        }
        }, attributes:['id', 'name', 'email','phone','password', 'createdAt']});
    }

    res.status(201).json({ message: "got", users: users });
  } catch (err) {
    console.log(err);
  }
};

