import { orderModel } from "../models/Models.js";

export const getOrders = async (req, res) => {
  try {
    await orderModel
      .find()
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
    await orderModel
      .findOne({
        id: req.orderId,
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

export const updateOrder = async (req, res) => {
  try {
    let existingOrder = orderModel.findOne({ _id: req.params.id });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
