import { orderModel, ordersHistoryModel } from "../models/Models.js";

export const getOrders = async (req, res) => {
  try {
    const filters = req.body.filters;
    await orderModel
      .find({ filters })
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
        _id: req.params.id,
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
    await orderModel
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(async (updatedOrder) => {
        await ordersHistoryModel
          .create({
            operationType: "Force updated",
            orderId: updatedOrder._id,
            updatedBy: "Administrator",
            additionalInfo: req.body.updateReason,
          })
          .then(() => {
            res.status(200).json({
              msg: `Order ${updatedOrder._id} has been updated`,
              updates: req.body,
            });
          });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getDashboardTableContents = async (req, res) => {
  try {
    const page = req.body.pageNumber;
    const offset = (page - 1) * 5;
    await orderModel
      .find()
      .sort("createdAt")
      .skip(offset)
      .limit(5)
      .then((clientOrders) => {
        res.status(200).json({
          orders: clientOrders,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getOrdersTableContents = async (req, res) => {
  try {
    const page = req.body.pageNumber;
    const offset = (page - 1) * 15;
    await orderModel
      .find()
      .sort("createdAt")
      .skip(offset)
      .limit(15)
      .then((clientOrders) => {
        res.status(200).json({
          orders: clientOrders,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
