import {
  // clientModel,
  orderModel,
  ordersHistoryModel,
} from "../models/Models.js";

export const getOrders = async (req, res) => {
  try {
    const filters = req.body.filters;
    await orderModel
      .find(filters)
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

export const getOrderContent = async (req, res) => {
  try {
    await orderModel
      .findOne({
        _id: req.params.id,
      })
      .then(async (foundOrder) => {
        await ordersHistoryModel
          .find({ orderId: req.params.id })
          .sort({ createdAt: -1 })
          .then((foundHistory) => {
            // add transports model call to retrieve the available pickups/deliveries/shippings
            res.status(200).json({
              order: foundOrder,
              orderHistory: foundHistory,
            });
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
    let orderFilter = {};
    let isClientFiltering = false;

    if (req.body.filters.orderId)
      orderFilter = { _id: req.body.filters.orderId };

    if (req.body.filters.clientName) isClientFiltering = true;
    // var mappedOrders = []
    // if (req.body.filters.clientName) {
    //   var foundClientId = await clientModel
    //     .findOne({
    //       clientName: req.body.filters.clientName,
    //     })
    //     .then((foundClient) => foundClient.id);

    //   if (req.body.filters.orderId) {
    //     filters = {
    //       clientId: foundClientId,
    //       _id: req.body.filters._id,
    //     };
    //   } else {
    //     filters = {
    //       clientId: foundClientId,
    //     };
    //   }
    // }
    if (isClientFiltering) {
      await orderModel
        .find(orderFilter)
        .where(
          `${isClientFiltering ? "pickupDetails.pickupClient.clientName" : ""}`,
          req.body.filters.clientName || ""
        )
        .where("createdAt")
        .gte(
          req.body.timeFilter?.startDate || `${new Date().getFullYear()}-01-01`
        )
        .lte(
          req.body.timeFilter?.endDate || `${new Date().getFullYear()}-12-31`
        )
        .sort("createdAt")
        .skip(offset)
        .limit(15)
        .then((clientOrders) => {
          res.status(200).json({
            orders: clientOrders,
          });
        });
    }
    await orderModel
      .find(orderFilter)
      .where("createdAt")
      .gte(
        req.body.timeFilter?.startDate || `${new Date().getFullYear()}-01-01`
      )
      .lte(req.body.timeFilter?.endDate || `${new Date().getFullYear()}-12-31`)
      .sort("createdAt")
      .skip(offset)
      .limit(15)
      .then((clientOrders) => {
        // clientOrders.forEach(async (order) => {
        //   console.log(order);
        //   if (req.body.filters.clientName) {
        //     const clientNameFilter = req.body.filters.clientName;
        //     mappedOrders = [
        //       ...mappedOrders,
        //       { clientName: clientNameFilter, ...order._doc },
        //     ];
        //   } else {
        //     const foundClientName = await clientModel
        //       .findOne({
        //         _id: order.clientId,
        //       })
        //       .then((foundClient) => foundClient.clientName);
        //     mappedOrders = [
        //       ...mappedOrders,
        //       { clientName: foundClientName, ...order._doc },
        //     ];
        //   }
        // });
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
