import {
  ordersHistoryModel,
  orderModel,
  messagesModel,
} from "../models/Models.js";
import {
  mapCancelUpdate,
  mapAssignPickup,
  mapPickupSuccess,
  mapPickupFailure,
  mapAssignShipment,
  mapShipmentSuccess,
  mapAssignDelivery,
  mapDeliverySuccess,
  mapCancelOrderMessage,
  mapAssignPickupMessage,
  mapPickupSuccessMessage,
  mapPickupFailureMessage,
  mapAssignShippingMessage,
  mapShippingSuccessMessage,
  mapAssignDeliveryMessage,
  mapDeliverySuccessMessage,
} from "../helpers/PayloadMapper.js";

const handleOrderUpdate = async (messageBody) => {
  try {
    const existingOrder = await orderModel.findOne({
      _id: messageBody.orderId,
    });

    if (!existingOrder) {
      throw new Error(
        `No order with id: ${messageBody.orderId} found for this client!`
      );
    }

    if (existingOrder.currentStatus === "Cancelled") {
      throw new Error(
        `Order: ${messageBody.orderId} has been cancelled by the client. No further operations can be done!`
      );
    }

    if (messageBody.operationType === "Cancel") handleOrderCancel(messageBody);
    if (messageBody.operationType === "Assign pickup")
      handleAssignPickup(messageBody);
    if (messageBody.operationType === "Pickup success")
      handlePickupSuccess(messageBody);
    if (messageBody.operationType === "Pickup fail")
      handlePickupFailure(messageBody);
    if (messageBody.operationType === "Assign shipping")
      handleAssignShipping(messageBody);
    if (messageBody.operationType === "Shipping success")
      handleShippingSuccess(messageBody);
    if (messageBody.operationType === "Assign delivery")
      handleAssignDelivery(messageBody);
    if (messageBody.operationType === "Delivery success")
      handleDeliverySuccess(messageBody);
  } catch (error) {
    throw error;
  }
};

// TO DO - Add logging for console.log cases
const handleOrderCancel = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder)
        throw new Error(`No order with id ${messageBody.orderId} was found`);

      foundOrder.currentStatus = "Cancelled";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder)
          throw new Error(`Order ${messageBody.orderId} could not be updated!`);

        const cancelOrderUpdate = mapCancelUpdate(updatedOrder);
        const messageModel = mapCancelOrderMessage(
          messageBody.updatedBy,
          messageBody.orderId
        );
        await ordersHistoryModel.create(cancelOrderUpdate);
        await messagesModel.create(messageModel).then(() => {
          console.log(`Order ${messageBody.orderId} has been cancelled`);
        });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handleAssignPickup = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${messageBody.orderId} was found`);
      }
      foundOrder.currentStatus = "In pickup process";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;
      foundOrder.pickupDetails.pickupId = messageBody.pickupId;
      foundOrder.pickupDetails.pickupStatus = "Assigned for pickup";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(
            `Something went wrong while updating order ${messageBody.orderId}`
          );
        }

        const messageModel = mapAssignPickupMessage(
          messageBody.updatedBy,
          messageBody.orderId,
          messageBody.pickupId,
          updatedOrder.pickupDetails.pickupCity
        );
        await messagesModel.create(messageModel);
        await ordersHistoryModel
          .create(mapAssignPickup(updatedOrder))
          .then(() => {
            console.log(
              `Order ${messageBody.orderId} has been assigned for pickup`
            );
          });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handlePickupSuccess = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${messageBody.orderId} was found`);
      }
      foundOrder.currentStatus = "Picked up from client";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;
      foundOrder.pickupDetails.pickupId = null;
      foundOrder.pickupDetails.pickupStatus = "Success";
      foundOrder.currentLocation = "In our local storage facility";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(
            `Something went wrong while updating order ${messageBody.orderId}`
          );
        }

        const messageModel = mapPickupSuccessMessage(
          messageBody.updatedBy,
          messageBody.orderId,
          updatedOrder.currentLocation
        );
        await messagesModel.create(messageModel);
        await ordersHistoryModel
          .create(mapPickupSuccess(updatedOrder))
          .then(() => {
            console.log(
              `Order ${messageBody.orderId} was updated with pickupStatus: success`
            );
          });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handlePickupFailure = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${messageBody.orderId} was found`);
      }
      foundOrder.currentStatus = "Failed to pickup from client";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;
      foundOrder.pickupDetails.pickupStatus = "Failed";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(
            `Something went wrong while updating order ${messageBody.orderId}`
          );
        }

        const messageModel = mapPickupFailureMessage(
          messageBody.updatedBy,
          messageBody.orderId,
          updatedOrder.pickupDetails.pickupId
        );
        await messagesModel.create(messageModel);
        await ordersHistoryModel
          .create(mapPickupFailure(updatedOrder, messageBody.failReason))
          .then(() => {
            console.log(
              `Order ${messageBody.orderId} was updated with pickupStatus: failed`
            );
          });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handleAssignShipping = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${messageBody.orderId} was found`);
      }
      foundOrder.currentStatus = "Assigned to be shipped";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;
      foundOrder.shippingDetails.shippingId = messageBody.shippingId;
      foundOrder.shippingDetails.shippingStatus = "Assigned for shipping";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(
            `Something went wrong while updating order ${messageBody.orderId}`
          );
        }

        const messageModel = mapAssignShippingMessage(
          messageBody.updatedBy,
          messageBody.orderId,
          messageBody.shippingId
        );
        await messagesModel.create(messageModel);
        await ordersHistoryModel
          .create(mapAssignShipment(updatedOrder))
          .then(() => {
            console.log(
              `Order ${messageBody.orderId} has been assigned for shipping`
            );
          });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handleShippingSuccess = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${messageBody.orderId} was found`);
      }
      foundOrder.currentStatus = "Successfully shipped";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;
      foundOrder.shippingDetails.shippingId = null;
      foundOrder.shippingDetails.shippingStatus = "Success";
      foundOrder.currentLocation = "In our destination's storage facility";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(
            `Something went wrong while updating order ${messageBody.orderId}`
          );
        }

        const messageModel = mapShippingSuccessMessage(
          messageBody.updatedBy,
          messageBody.orderId,
          updatedOrder.shippingDetails.shippingCity
        );
        await messagesModel.create(messageModel);
        await ordersHistoryModel
          .create(mapShipmentSuccess(updatedOrder))
          .then(() => {
            console.log(
              `Order ${messageBody.orderId} has been updated with shippingStatus: success`
            );
          });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handleAssignDelivery = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${messageBody.orderId} was found`);
      }
      foundOrder.currentStatus = "In delivery process";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;
      foundOrder.shippingDetails.shippingId = messageBody.deliveryId;
      foundOrder.shippingDetails.shippingStatus = "Assigned for delivery";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(
            `Something went wrong while updating order ${messageBody.orderId}`
          );
        }

        const messageModel = mapAssignDeliveryMessage(
          messageBody.updatedBy,
          messageBody.orderId,
          messageBody.deliveryId,
          updatedOrder.shippingDetails.shippingAddress
        );
        await messagesModel.create(messageModel);
        await ordersHistoryModel
          .create(mapAssignDelivery(updatedOrder))
          .then(() => {
            console.log(
              `Order ${messageBody.orderId} has been assigned for delivery`
            );
          });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handleDeliverySuccess = async (messageBody) => {
  try {
    await orderModel.findById(messageBody.orderId).then(async (foundOrder) => {
      if (!foundOrder) {
        throw new Error(`No order with id ${messageBody.orderId} was found`);
      }
      foundOrder.currentStatus = "Delivered to final destination";
      foundOrder.lastUpdatedBy = messageBody.updatedBy;
      foundOrder.shippingDetails.shippingId = null;
      foundOrder.shippingDetails.shippingStatus = "Success";
      foundOrder.currentLocation = "At client's final destination";

      await foundOrder.save().then(async (updatedOrder) => {
        if (!updatedOrder) {
          throw new Error(
            `Something went wrong while updating order ${messageBody.orderId}`
          );
        }

        const messageModel = mapDeliverySuccessMessage(
          messageBody.updatedBy,
          messageBody.orderId,
          updatedOrder.shippingDetails.shippingAddress
        );
        await messagesModel.create(messageModel);
        await ordersHistoryModel
          .create(mapDeliverySuccess(updatedOrder))
          .then(() => {
            console.log(
              `Order ${messageBody.orderId} has been updated with currentStatus: At client's final destination`
            );
          });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default handleOrderUpdate;
