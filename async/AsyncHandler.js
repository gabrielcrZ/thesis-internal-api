import { ordersHistoryModel, orderModel } from "../models/Models.js";
import {
  mapCancelUpdate,
  mapAssignPickup,
  mapPickupSuccess,
  mapPickupFailure,
  mapAssignShipment,
  mapShipmentSuccess,
  mapAssignDelivery,
  mapDeliverySuccess,
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

const handleOrderCancel = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "Cancelled",
        lastUpdatedBy: messageBody.updatedBy,
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapCancelUpdate(updatedOrder);
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

const handleAssignPickup = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "In pickup process",
        lastUpdatedBy: messageBody.updatedBy,
        pickupDetails: {
          pickupId: messageBody.pickupId,
          pickupStatus: "Assigned for pickup",
          ...pickupDetails,
        },
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapAssignPickup(updatedOrder);
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

const handlePickupSuccess = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "Picked up from client",
        lastUpdatedBy: messageBody.updatedBy,
        pickupDetails: {
          pickupId: null,
          pickupStatus: "Success",
          ...pickupDetails,
        },
        currentLocation: `In our local storage facility`,
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapPickupSuccess(updatedOrder);
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

const handlePickupFailure = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "Failed to pickup from client",
        lastUpdatedBy: messageBody.updatedBy,
        pickupDetails: {
          pickupStatus: "Failed",
          ...pickupDetails,
        },
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapPickupFailure(
        updatedOrder,
        messageBody.failReason
      );
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

const handleAssignShipping = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "Assign to be shipped",
        lastUpdatedBy: messageBody.updatedBy,
        shippingDetails: {
          shippingId: messageBody.shippingId,
          shippingStatus: "Assigned for shipping",
        },
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapAssignShipment(updatedOrder);
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

const handleShippingSuccess = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "Shipping success",
        lastUpdatedBy: messageBody.updatedBy,
        shippingDetails: {
          shippingId: null,
          shippingStatus: "Shipped",
        },
        currentLocation: "In our destination's storage facility",
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapShipmentSuccess(updatedOrder);
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

const handleAssignDelivery = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "In delivery process",
        lastUpdatedBy: messageBody.updatedBy,
        pickupDetails: {
          shippingId: messageBody.deliveryId,
          shippingStatus: "Assigned for delivery",
        },
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapAssignDelivery(updatedOrder);
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

const handleDeliverySuccess = async (messageBody) => {
  await orderModel
    .findOneAndUpdate(
      {
        _id: messageBody.orderId,
        clientEmail: messageBody.clientEmail,
      },
      {
        currentStatus: "Delivered to final destination",
        lastUpdatedBy: messageBody.updatedBy,
        shippingDetails: {
          shippingId: null,
          shippingStatus: "Success",
        },
        currentLocation: "At client's final destination",
      }
    )
    .then(async (updatedOrder) => {
      const cancelOrderUpdate = mapDeliverySuccess(updatedOrder);
      await ordersHistoryModel.create(cancelOrderUpdate);
    });
};

export default handleOrderUpdate;
