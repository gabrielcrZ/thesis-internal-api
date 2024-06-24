import { usersModel } from "../models/Models.js";

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
