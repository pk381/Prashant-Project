const path = require("path");
const rootDir = require("../util/path");
const User = require("../models/user");
const Earning = require("../models/earning");
const WidthdrawlRequest = require('../models/widthdrawlRequest');
const UpgradeRequest = require('../models/upgradeRequest');


// const { Op } = require("sequelize");
exports.getMain = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views/user", "dashboard.html"));
};

exports.getWallet = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views/user", "wallet.html"));
};

exports.getEarnings = async (req, res)=>{

  try{

    let earning = await Earning.findOne({where: {userId: req.user.id}})

    res.status(201).json({message: 'got', earning: earning});

  }
  catch(err){
    console.log(err);
  }
}


async function getTotalTeam(userId){

  try{

    let children = await User.findAll({where: {underId: userId}, attributes: ['id','name', 'planType', 'createdAt']});

    const array = [...children];

    for(let i = 0;i<children.length;i++){

      let childs = await getTotalTeam(children[i].id);
      array.concat(childs);
    }

    return array;

  }
  catch(err){
    console.log(err);
  }
}

exports.getMembers = async (req, res)=>{

  try{

    const team = await getTotalTeam(req.user.id);

    const directTeam = await User.findAll({where: {underId: req.user.id}, attributes: ['id','name', 'planType', 'createdAt']});
    
    res.status(201).json({message: 'got', members: {team: team, directTeam: directTeam}});
    // active: active, notActive: notActive

  }
  catch(err){
    console.log(err);
  }
}

exports.getWalletInfo = async (req, res) =>{

  try{

    const earning = await Earning.findOne({where: {userId: req.user.id}});

    res.status(201).json({ message: 'got', wallet : {available: (earning.total - earning.widthdrawl), widthdrawl: earning.widthdrawl}});

  }
  catch(err){
    console.log(err);
  }
}

exports.widthdrawlRequest = async(req, res)=>{
  try{

    const request = await WidthdrawlRequest.create({
      name: req.body.name,
      amount: parseFloat(req.body.amount),
      status: 'PENDING',
      userId: req.user.id
    });

    res.status(201).json({message: 'got', request: request});

  }
  catch(err){
    console.log(err);
  }
}

exports.widthdrawlHistory = async (req, res)=>{
  try{

    const history = await WidthdrawlRequest.findAll({where: {userId: req.user.id}});

    res.status(201).json({message: 'got', history: history});

  }
  catch(err){
    console.log(err);
  }
}

exports.joiningRequest = async(req, res)=>{

  try{

    const file = req.files.file.data;
    const info = JSON.parse(req.body.info);
    // console.log(file);

    console.log(info.name, info.amount, info.transactionId);

    const request = await UpgradeRequest.create({
      name: info.name,
      amount: parseFloat(info.amount),
      transactionId: info.transactionId,
      photo: file,
      userId: req.user.id
    })

    // console.log(request);

    res.status(201).json({message: 'got'});
  }
  catch(err){
    console.log("err in joining request- ",err);
  }

}

// exports.getImage = async (req, res) =>{
//   try{

//     const images = await UpgradeRequest.findAll({where: {userId: req.user.id}});

//     res.status(201).json({images: images});
//   }
//   catch(err){
//     console.log(err);
//   }
// }

exports.getImage = async (req, res) =>{
  try{

    const images = await UpgradeRequest.findAll();

    // res.setHeader('Content-Type', 'image/jpg')
    // res.send(images[1].photo);
    res.status(201).json({images: images[1].photo});

  }
  catch(err){
    console.log(err);
  }
}