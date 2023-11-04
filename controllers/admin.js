const path = require("path");
const rootDir = require("../util/path");
const { Op, and } = require("sequelize");

const Admin = require("../models/admin");
const User = require("../models/user");
const Company = require("../models/company");
const UpgradeRequest = require("../models/upgradeRequest");
const DailyClub = require('../util/updateDatabase').createDailyClub();
const WidthdrawlRequest = require("../models/widthdrawlRequest");
const Earning = require("../models/earning");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateToken(data) {
  return jwt.sign(data, "secretKey");
}

exports.getLogin = async (req, res) => {

  const admin = await Admin.findAll();

  if(admin.length === 0){
    
    bcrypt.hash('Prabhat123@', 10, async (err, hash)=>{
      if(err){
        console.log(err);
      }
      else{
        await Admin.create({
          name: 'Admin',
          email: 'admin@email.com',
          phone: '70906080202',
          password: hash
        })
      }
    });
  }
  res.sendFile(path.join(rootDir, "views/admin", "admin_login.html"));
};

exports.getSearch = (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin", "searchAndModify.html"));
};

exports.getTreePage = (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin", "tree.html"));
};

exports.requestPage = (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin", "request.html"));
};

exports.getMain = async (req, res) => {
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

    const comp = await Company.findAll();

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
        earning: comp[0].earningInLifetime
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
  console.log("geting tree");

  async function createTreeData(nodeId) {
    const element = await User.findOne({
      where: { id: nodeId },
      attributes: ["id", "name", "direct"],
    });
    let children = await User.findAll({
      where: { underId: nodeId },
      attributes: ["id", "name", "direct"],
    });

    if (children.length === 0) {
      return { element, children: [] };
    } else {
      const childs = [];

      for (let i = 0; i < children.length; i++) {
        const child = await createTreeData(children[i].id);

        childs.push(child);
      }
      return { element, children: childs };
    }
  }

  try {
    const nodeId = parseInt(req.params.nodeId);

    const data = await createTreeData(nodeId);

    res.status(201).json({ message: "got", data: data });
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

      const company = await Company.findAll();
      company[0].earningInLifetime += 10;
      await company[0].save();

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

async function updateAutopool(userId) {
  try {
    const user = await User.findByPk(userId);
    const direct = user.direct;

    if (user.autoPoolLevel >= 1) {

      if (user.autoPoolLevel === 1) {

        if ((direct & ~(direct - 1)) == direct) {

          let power = Math.log(direct) / Math.log(2);

          if (power < 7 && power > 1) {
            user.Earning.autoPool += Math.pow(2, n - 2);
          } else if (n >= 7) {

            const idNumber = Math.pow(2, n-7);         
            user.Earning.autopool += Math.pow(2, n - 2)- idNumber*3;

            user.autoPoolLevel += idNumber;
          }

        }
        else{

          const newDirect = direct - 128;

          if ((newDirect & ~(newDirect - 1)) == newDirect) {

            let power = Math.log(newDirect) / Math.log(2);
  
            if (power < 7 && power > 1) {
              user.Earning.autoPool += Math.pow(2, n - 2)*user.autoPoolLevel-1;
            }
  
          }
        }
      }
      
    }
  } catch (err) {
    console.log(err);
  }
}
exports.updateJoiningRequest = async (req, res) => {
  try {
    const request = await UpgradeRequest.findByPk(req.body.id);

    if (req.body.status === "APPROVED") {

      request.status = "APPROVED";

      const user = await User.findByPk(request.userId);

      const sponserEarning = await Earning.findOne({where: {userId: user.underId}});

      sponserEarning.direct += 3.6;

      await sponserEarning.save();

      DailyClub.amount += 3;
      DailyClub.starter += 1;

      await DailyClub.save();

      await request.save();

      await updateAutopool(user.underId);

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

    if (user.password !== req.body.password) {
      console.log("changing password");

      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          user.password = hash;
          await user.save();
          console.log(hash);
        }
      });
    } else {
      await user.save();
    }

    res.status(201).json({ message: "done", user: user });
  } catch (err) {
    res.status(201).json({ message: "err" });
    console.log("error in updateing user info", err);
  }
};

exports.searchUsers = async (req, res) => {
  try {
    let users;
    if (req.body.emailOrId === "Id") {
      users = await User.findAll({
        where: { id: parseInt(req.body.searchBy) },
        attributes: ["id", "name", "email", "phone", "password", "createdAt"],
      });
    } else if (req.body.emailOrId === "Email") {
      users = await User.findAll({
        where: { email: req.body.searchBy },
        attributes: ["id", "name", "email", "phone", "password", "createdAt"],
      });
    } else {
      users = await User.findAll({
        where: {
          name: {
            [Op.like]: `%${req.body.searchBy}%`,
          },
        },
        attributes: ["id", "name", "email", "phone", "password", "createdAt"],
      });
    }

    res.status(201).json({ message: "got", users: users });
  } catch (err) {
    console.log(err);
  }
};
