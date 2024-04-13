import { orderModel } from "../models/Models.js";
import { decodeAuthorizationToken } from "../middlewares/Auth.js";

export const getOrders = async (req, res) => {
  try {
    let authFromHeaders = req.headers.authorization;
    const token = authFromHeaders.split(" ")[1];
    const decodedEmail = decodeAuthorizationToken(token).email;

    await orderModel
      .find({ clientEmail: decodedEmail })
      .sort("createdAt")
      .then((clientOrders) => {
        res.status(200).json({
          orders: clientOrders,
          count: clientOrders.length,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    let authFromHeaders = req.headers.authorization;
    const token = authFromHeaders.split(" ")[1];
    const decodedEmail = decodeAuthorizationToken(token).email;

    await orderModel
      .findOne({
        id: req.orderId,
        clientEmail: decodedEmail,
      })
      .then((foundOrder) => {
        res.status(200).json({
          order: foundOrder,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
