import {
  mapAssignDelivery,
  mapAssignDeliveryMessage,
  mapAssignPickup,
  mapAssignPickupMessage,
  mapAssignShipment,
  mapAssignShippingMessage,
  mapCancelUpdate,
  mapForceCancelOrderMessage,
  mapUnassignDelivery,
  mapUnassignDeliveryMessage,
  mapUnassignPickup,
  mapUnassignPickupMessage,
  mapUnassignShipping,
  mapUnassignShippingMessage,
  mapUpdateOrderMessage,
} from "../helpers/PayloadMapper.js";
import { decodeAuthorizationToken } from "../middlewares/Auth.js";
import {
  deliveryModel,
  messagesModel,
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
          .then(async (foundHistory) => {
            const availablePickups = await deliveryModel
              .find({
                deliveryType: "Pickup",
              })
              .where(
                "placeOfDeparture.departureCountry",
                foundOrder.pickupDetails.pickupCountry
              )
              .where(
                "placeOfDelivery.deliveryCountry",
                foundOrder.pickupDetails.pickupCountry
              )
              .select("_id");
            const availableShippings = await deliveryModel
              .find({
                deliveryType: "Shipping",
              })
              .where(
                "placeOfDeparture.departureCountry",
                foundOrder.pickupDetails.pickupCountry
              )
              .where(
                "placeOfDelivery.deliveryCountry",
                foundOrder.shippingDetails.shippingCountry
              )
              .select("_id");
            const availableDeliveries = await deliveryModel
              .find({
                deliveryType: "Delivery",
              })
              .where(
                "placeOfDeparture.departureCountry",
                foundOrder.shippingDetails.shippingCountry
              )
              .where(
                "placeOfDelivery.deliveryCountry",
                foundOrder.shippingDetails.shippingCountry
              )
              .select("_id");
            res.status(200).json({
              order: foundOrder,
              orderHistory: foundHistory,
              availablePickups: availablePickups,
              availableShippings: availableShippings,
              availableDeliveries: availableDeliveries,
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
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );

    await orderModel
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${req.params.id} could not be updated!`);
        }

        const orderHistoryUpdate = {
          operationType: "Force updated",
          orderId: updatedOrder._id,
          updatedBy: email,
          additionalInfo:
            "Order has been updated through the ShippingApp Dashboard",
        };
        const messageModel = mapUpdateOrderMessage(email, updatedOrder._id);
        await ordersHistoryModel.create(orderHistoryUpdate);
        await messagesModel.create(messageModel);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been updated`,
          updates: req.body,
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
      .sort({createdAt: "desc"})
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
          "pickupDetails.pickupClient.clientName",
          req.body.filters.clientName || ""
        )
        .where("createdAt")
        .gte(
          req.body.timeFilter?.startDate || `${new Date().getFullYear()}-01-01`
        )
        .lte(
          req.body.timeFilter?.endDate || `${new Date().getFullYear()}-12-31`
        )
        .sort({createdAt: "desc"})
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
      .sort({createdAt: "desc"})
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

export const unassignOrderPickup = async (req, res) => {
  try {
    await orderModel.findById(req.body.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${req.body.orderId} was found`);
      }

      const { email, userId } = decodeAuthorizationToken(
        req.headers.authorization
      );
      const oldPickupId = foundOrder.pickupDetails.pickupId;

      foundOrder.currentStatus = "Registered by client";
      foundOrder.lastUpdatedBy = email;
      foundOrder.pickupDetails.pickupId = null;
      foundOrder.pickupDetails.pickupStatus = "Not assigned";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${foundOrder._id} could not be updated!`);
        }
        const messageModel = mapUnassignPickupMessage(
          email,
          updatedOrder._id,
          oldPickupId
        );

        const orderHistoryUpdate = mapUnassignPickup(updatedOrder._id, email);

        await messagesModel.create(messageModel);
        await ordersHistoryModel.create(orderHistoryUpdate);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been unassigned from pickup!`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const assignOrderPickup = async (req, res) => {
  try {
    await orderModel.findById(req.body.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${req.body.orderId} was found`);
      }

      const { email, userId } = decodeAuthorizationToken(
        req.headers.authorization
      );
      foundOrder.currentStatus = "In pickup process";
      foundOrder.lastUpdatedBy = email;
      foundOrder.pickupDetails.pickupId = req.body.pickupId;
      foundOrder.pickupDetails.pickupStatus = "Assigned for pickup";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${foundOrder._id} could not be updated!`);
        }
        const messageModel = mapAssignPickupMessage(
          email,
          updatedOrder._id,
          updatedOrder.pickupDetails.pickupId,
          updatedOrder.pickupDetails.pickupCity
        );
        const orderHistoryUpdate = mapAssignPickup(updatedOrder);

        await messagesModel.create(messageModel);
        await ordersHistoryModel.create(orderHistoryUpdate);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been assigned for pickup!`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const assignOrderShipment = async (req, res) => {
  try {
    await orderModel.findById(req.body.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${req.body.orderId} was found`);
      }

      const { email, userId } = decodeAuthorizationToken(
        req.headers.authorization
      );
      foundOrder.currentStatus = "Assigned to be shipped";
      foundOrder.lastUpdatedBy = email;
      foundOrder.shippingDetails.shippingId = req.body.shippingId;
      foundOrder.shippingDetails.shippingStatus = "Assigned for shipping";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${foundOrder._id} could not be updated!`);
        }

        const messageModel = mapAssignShippingMessage(
          email,
          updatedOrder._id,
          updatedOrder.shippingDetails.shippingId
        );
        const orderHistoryUpdate = mapAssignShipment(updatedOrder);

        await messagesModel.create(messageModel);
        await ordersHistoryModel.create(orderHistoryUpdate);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been assigned for shipping!`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const unassignOrderShipping = async (req, res) => {
  try {
    await orderModel.findById(req.body.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${req.body.orderId} was found`);
      }

      const { email, userId } = decodeAuthorizationToken(
        req.headers.authorization
      );
      const oldShippingId = foundOrder.shippingDetails.shippingId;

      foundOrder.currentStatus = "Picked up from client";
      foundOrder.shippingDetails.shippingId = null;
      foundOrder.shippingDetails.shippingStatus = "Not assigned";
      foundOrder.lastUpdatedBy = email;
      foundOrder.currentLocation = "In our local storage facility";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${foundOrder._id} could not be updated!`);
        }
        const messageModel = mapUnassignShippingMessage(
          email,
          updatedOrder._id,
          oldShippingId
        );

        const orderHistoryUpdate = mapUnassignShipping(updatedOrder._id, email);

        await messagesModel.create(messageModel);
        await ordersHistoryModel.create(orderHistoryUpdate);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been unassigned from shipping!`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const assignOrderDelivery = async (req, res) => {
  try {
    await orderModel.findById(req.body.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${req.body.orderId} was found`);
      }

      const { email, userId } = decodeAuthorizationToken(
        req.headers.authorization
      );

      foundOrder.currentStatus = "In delivery process";
      foundOrder.lastUpdatedBy = email;
      foundOrder.shippingDetails.shippingId = req.body.deliveryId;
      foundOrder.shippingDetails.shippingStatus = "Assigned for delivery";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${foundOrder._id} could not be updated!`);
        }

        const messageModel = mapAssignDeliveryMessage(
          email,
          updatedOrder._id,
          updatedOrder.shippingDetails.shippingId,
          updatedOrder.shippingDetails.shippingAddress
        );
        const orderHistoryUpdate = mapAssignDelivery(updatedOrder);

        await messagesModel.create(messageModel);
        await ordersHistoryModel.create(orderHistoryUpdate);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been assigned for delivery!`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const unassignOrderDelivery = async (req, res) => {
  try {
    await orderModel.findById(req.body.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${req.body.orderId} was found`);
      }

      const { email, userId } = decodeAuthorizationToken(
        req.headers.authorization
      );
      const oldDeliveryId = foundOrder.shippingDetails.shippingId;

      foundOrder.currentStatus = "Successfully shipped";
      foundOrder.shippingDetails.shippingId = null;
      foundOrder.shippingDetails.shippingStatus = "Success";
      foundOrder.lastUpdatedBy = email;
      foundOrder.currentLocation = "In our destination's storage facility";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${foundOrder._id} could not be updated!`);
        }
        const messageModel = mapUnassignDeliveryMessage(
          email,
          updatedOrder._id,
          oldDeliveryId
        );

        const orderHistoryUpdate = mapUnassignDelivery(updatedOrder._id, email);

        await messagesModel.create(messageModel);
        await ordersHistoryModel.create(orderHistoryUpdate);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been unassigned from delivery process!`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    await orderModel.findById(req.body.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${req.body.orderId} was found`);
      }

      const { email, userId } = decodeAuthorizationToken(
        req.headers.authorization
      );

      foundOrder.currentStatus = "Cancelled";
      foundOrder.lastUpdatedBy = email;

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(`Order ${foundOrder._id} could not be updated!`);
        }

        const messageModel = mapForceCancelOrderMessage(
          email,
          updatedOrder._id
        );
        const orderHistoryUpdate = mapCancelUpdate(updatedOrder);

        await messagesModel.create(messageModel);
        await ordersHistoryModel.create(orderHistoryUpdate);

        res.status(200).json({
          msg: `Order ${updatedOrder._id} has been successfully cancelled!`,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
