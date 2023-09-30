const path = require("path");
const rootDir = require("../util/path");
const { Op } = require('sequelize');

const Admin = require('../models/admin');
const User = require('../models/user');
const Company = require('../models/company');
const UpgradeRequest = require('../models/upgradeRequest');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


function generateToken(data) {
    return jwt.sign(data, "secretKey");
  }


exports.getLogin = (req, res)=>{
    res.sendFile(path.join(rootDir, "views", "admin_login.html"));
}

exports.getTreePage = (req, res)=>{
  res.sendFile(path.join(rootDir, "views", "tree.html"));
}

exports.requestPage = (req, res)=>{
  res.sendFile(path.join(rootDir, "views/admin", "request.html"));
}

exports.getMain = async (req, res)=>{

    // const newCompany = await Company.create({
    //     name: 'Prashant Company',
    //     earningInLifetime: 100000.00,
    //     earningInThisMonth: 20000.00,
    //     greenMemberInLifetime: 900,
    //     greenMemberInThisMonth: 100,
    //     redMemberInLifetime: 200,
    //     redMemberInThisMonth: 20
    // });

    res.sendFile(path.join(rootDir, "views/admin", "admin.html"));
}

exports.postLogin = async (req, res)=>{
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
              res
                .status(201)
                .json({
                  admin: admin,
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
}

exports.getInfo = async(req, res)=>{

    try{

        const company = await Company.findOne({where: {id: 1}});

        res.status(200).json({message: "got", info: company});

    }
    catch(err){
        console.log(err);
    }
}

exports.getMemberInfo = async (req, res)=>{

  try{
    const date = new Date();

    const newMembers = await User.findAll({where: {

      createdAt: {
        [Op.gte]: new Date(`${date.getFullYear()}/${date.getMonth()}/01`),
        [Op.lte]: new Date()
      }
    }});

    res.status(201).json({message: 'got', newMembers: newMembers});
  }
  catch(err){

    console.log(err);
  }
}


exports.getTree = async (req, res)=>{

  async function createTreeData(nodeId){

    const element = await User.findOne({where: {id: nodeId}});
    let children = await User.findAll({where:{underId: nodeId}});

    children = children.map( (element)=> { return {element, children: []}});

    return {element, children};
  }

  try{

    const nodeId = parseInt(req.params.nodeId);

    if(nodeId === 0){

      const data = await createTreeData(1);

      res.status(201).json({message: "got", data: data});

    }
    else{

      const data = await createTreeData(nodeId);

      res.status(201).json({message: "got", data: data});

    }

  }
  catch(err){
    console.log(err);
  }

}

exports.requests = async(req, res)=>{

  try{

    const requests = await UpgradeRequest.findAll({where: {status: 'PENDING'}, attributes: ['id','userId', 'amount', 'transactionId', 'createdAt']});

    res.status(201).json({message: 'got', requests: requests});
  }
  catch(err){

    console.log("err in geting requests", err);
  }
}

exports.updateRequest = async(req, res)=>{
  try{

    const request = await UpgradeRequest.findOne({where: {status: 'PENDING', id: req.body.id}});

    if(req.body.status === 'APPROVED'){
      
      request.status = 'APPROVED'

      await request.save();
      res.status(201).json({message: 'approved', request: request});

    }
    else{
      request.status = 'CANCELED'

      await request.save();
      res.status(201).json({message: 'cancel', request: request});
    }

  }
  catch(err){

    console.log("err in geting requests", err);
  }
}