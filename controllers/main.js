const path = require("path");
const rootDir = require("../util/path");
const User = require("../models/user");

const { Op } = require("sequelize");

exports.getMain = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "main.html"));
};

exports.postMessage = async (req, res, next) => {
  try {
    const message = await Message.create({
      message: req.body.message,
      isFile: false,
      senderName: req.user.name,
      userId: req.user.id,
    });

    res.status(201).json({ message: message });
  } catch (err) {
    console.log(err);
  }
};

exports.getMessages = async (req, res, next) => {
  const lastId = parseInt(req.params.lastId);

  try {
    if (lastId == 0) {
      const messages = await Message.findAll();

      res.status(201).json({ messages: messages });
    } else {
      const messages = await Message.findAll({
        where: {
          id: { [Op.gt]: lastId },
          userId: req.user.id,
        },
      });

      res.status(201).json({ messages: messages });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const allUser = await User.findAll();

    res.status(201).json({ friends: allUser });
  } catch (err) {
    console.log(err);
  }
};

exports.postFileMessage = async (req, res, next) => {
  try {

    const file = req.files.file;

    const url = await S3service.uploadToS3(file.data, file.name);

    const message = await Message.create({
      message: url,
      isFile: true,
      senderName: req.user.name,
      userId: req.user.id
    });

    console.log('uploading file');

    res.status(201).json({message: message});

  } catch (err) {
    console.log(err);
  }
};
