import { decodeAuthorizationToken } from "../middlewares/Auth.js";
import { messagesModel, usersModel } from "../models/Models.js";

export const addUser = async (req, res) => {
  try {
    await usersModel.create({ ...req.body }).then((newUser) => {
      if (!newUser) {
        res.status(400).json({
          msg: `Create new user operation failed.`,
        });
      }
      res.status(200).json({
        msg: `User ${newUser._id} created successfully!`,
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const requireToken = async (req, res) => {
  if (!res.token) {
    res.status(400).json({
      body: req.body,
    });
  }
  res.status(200).json({
    token: res.token,
  });
};

export const updateUser = async (req, res) => {
  try {
    res.status(200).json({
      msg: "TBA",
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const page = req.body.pageNumber;
    const offset = (page - 1) * 10;
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );

    const userDetails = await usersModel.findById(userId).select("email role");
    const userActions = await messagesModel
      .find({ from: email })
      .sort({ createdAt: "desc" })
      .skip(offset)
      .limit(10);

    res.status(200).json({
      userDetails: userDetails,
      userActions: userActions,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
