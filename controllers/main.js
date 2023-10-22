const path = require("path");
const rootDir = require("../util/path");

const User = require("../models/user");
const Earning = require("../models/earning");
const WidthdrawlRequest = require("../models/widthdrawlRequest");
const UpgradeRequest = require("../models/upgradeRequest");
const BoostDetails = require("../models/boostDetails");
const BoostBoard = require("../models/boostBoard");

exports.getMain = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views/user", "dashboard.html"));
};

exports.getWallet = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views/user", "wallet.html"));
};

exports.getTreePage = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views/user", "tree.html"));
};

exports.getEarnings = async (req, res) => {
  try {
    let earning = await Earning.findOne({ where: { userId: req.user.id } });

    res.status(201).json({ message: "got", earning: earning });
  } catch (err) {
    console.log(err);
  }
};

async function getTotalTeam(userId) {
  try {
    let children = await User.findAll({
      where: { underId: userId },
      attributes: ["id", "name", "planType", "createdAt"],
    });

    let array = [...children];

    for (let i = 0; i < children.length; i++) {
      let childs = await getTotalTeam(children[i].id);
      array = array.concat(childs);
    }

    return array;
  } catch (err) {
    console.log(err);
  }
}

exports.getMembers = async (req, res) => {
  try {
    const team = await getTotalTeam(req.user.id);

    const directTeam = await User.findAll({
      where: { underId: req.user.id },
      attributes: ["id", "name", "planType", "createdAt"],
    });

    res.status(201).json({
      message: "got",
      members: { team: team, directTeam: directTeam },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getWalletInfo = async (req, res) => {
  try {
    const earning = await Earning.findOne({ where: { userId: req.user.id } });

    res.status(201).json({
      message: "got",
      wallet: {
        available: earning.total - earning.widthdrawl,
        widthdrawl: earning.widthdrawl,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.widthdrawlRequest = async (req, res) => {
  try {

    if(req.user.isActive === true){
      const request = await WidthdrawlRequest.create({
        name: req.user.name,
        amount: parseFloat(req.body.amount),
        status: "PENDING",
        cryptoId: req.body.cryptoId,
        userId: req.user.id,
      });
      res.status(201).json({ message: "got", request: request });
    }
    else{
      res.status(201).json({ message: "notActive"});
    }
    
  } catch (err) {
    console.log(err);
  }
};

exports.widthdrawlHistory = async (req, res) => {
  try {
    const history = await WidthdrawlRequest.findAll({
      where: { userId: req.user.id },
    });

    res.status(201).json({ message: "got", history: history });
  } catch (err) {
    console.log(err);
  }
};

exports.joiningRequest = async (req, res) => {
  try {
    const file = req.files.file.data;
    const info = JSON.parse(req.body.info);

    console.log(info.name, info.amount, info.transactionId);

    const request = await UpgradeRequest.create({
      name: info.name,
      amount: parseFloat(info.amount),
      transactionId: info.transactionId,
      status: "PENDING",
      photo: file,
      userId: req.user.id,
    });

    res.status(201).json({ message: "got" });
  } catch (err) {
    console.log("err in joining request- ", err);
  }
};

exports.getImage = async (req, res) => {
  try {
    const upgradeRequest = await UpgradeRequest.findOne({
      where: { id: req.params.requestId },
      attributes: ["photo"],
    });

    // res.setHeader('Content-Type', 'image/jpg')
    res.send(upgradeRequest.photo);
  } catch (err) {
    console.log(err);
  }
};

async function addToBoostBoard(user) {
  try {
    const boostDetails = await BoostDetails.findOne({
      where: { planType: user.planType },
    });

    if (boostDetails.parent === null) {
      await BoostBoard.create({
        planType: user.planType,
        nodeNo: 0,
        userId: user.id,
        parent: null,
        leftChild: null,
        righChild: null,
      });

      boostDetails.parent = 0;
      boostDetails.lastChild = 0;

      await boostDetails.save();
    } else {
      const parent = await BoostBoard.findOne({
        where: { planType: user.planType, nodeNo: boostDetails.parent },
      });

      if (boostDetails.lastChild % 2 === 0) {
        parent.leftChild = boostDetails.lastChild + 1;

        await BoostBoard.create({
          planType: user.planType,
          nodeNo: boostDetails.lastChild + 1,
          userId: user.id,
          parent: boostDetails.parent,
          leftChild: null,
          righChild: null,
        });

        boostDetails.lastChild = boostDetails.lastChild + 1;

        await boostDetails.save();
        await parent.save();
      } else {
        parent.righChild = boostDetails.lastChild + 1;

        await BoostBoard.create({
          planType: user.planType,
          nodeNo: boostDetails.lastChild + 1,
          userId: user.id,
          parent: boostDetails.parent,
          leftChild: null,
          righChild: null,
        });

        boostDetails.lastChild = boostDetails.lastChild + 1;
        boostDetails.parent += 1;

        await parent.save();
        await boostDetails.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

exports.joinBoostBoard = async (req, res) => {
  try {

    if(req.user.boost === 0){
      res.status(201).json({ message: "not available" });
    }
    else{

      await addToBoostBoard(req.user);
      req.user.boost-= 1;
      await req.user.save();

      res.status(201).json({ message: "done" });

    }
    
    

    

    
  } catch (err) {
    console.log(err);
  }
};

exports.userImage = async (req, res) => {
  try {
    const id = req.params.userId;

    const user = await User.findByPk(id, {
      attributes: ["photo"],
    });
    res.send(user.photo);
  } catch (err) {
    console.log("err in geting user image", err);
  }
};

exports.getTree = async (req, res) => {
  async function createTreeData(nodeId) {
    const element = await User.findOne({ where: { id: nodeId } });
    let children = await User.findAll({ where: { underId: nodeId } });

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


exports.activateFriend = async (req, res) =>{
  try{

    const earning = await Earning.findOne({where: {userId: req.user.id}});

    console.log('activating');

    if(earning.total > 10){

      const id = parseInt(req.body.friendId.match(/\d+/g)[0]);
      const user = await User.findByPk(id);

      if(user === null){
        res.status(201).json({message: 'notuser'});
      }
      else{

        user.planType = 'starter';

        earning.total -= 10;

        await earning.save();

        await user.save();

        res.status(201).json({message: 'done'});

      }
    }
    else{
      res.status(201).json({message: 'notenough'});
    }
  }
  catch(err){
    console.log(err);
  }
}