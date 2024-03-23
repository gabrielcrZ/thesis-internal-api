import { ordersHistoryModel, orderModel } from "../models/Models.js";
import { mapCancelUpdate } from "../helpers/PayloadMapper.js";

const handleOrderUpdate = async (messageBody) => {
  try {
    const existingOrder = await orderModel.findOne({
      _id: messageBody.orderId,
      clientEmail: messageBody.clientEmail,
    });

    if (!existingOrder) {
      throw new Error(
        `No order with id: ${messageBody.orderId} found for this client!`
      );
    }

    if (messageBody.operationType === "Cancel") {
      if (existingOrder.currentStatus !== "Registered by client") {
        throw new Error(
          `Order: ${messageBody.orderId} can't be cancelled because it was already processed. Current status: ${existingOrder.currentStatus}`
        );
      } else {
        await orderModel.findOneAndUpdate(
          {
            _id: messageBody.orderId,
            clientEmail: messageBody.clientEmail,
          },
          {
            currentStatus: "Cancelled",
            lastUpdatedBy: messageBody.clientEmail,
          }
        );

        const cancelOrderUpdate = mapCancelUpdate(messageBody, existingOrder);
        await ordersHistoryModel.create(cancelOrderUpdate);
      }
    }

    if (messageBody.operationType === "Update") {
      if (existingOrder.currentStatus === "Cancelled") {
        throw new Error(
          `Order: ${messageBody.orderId} has been cancelled by the client. No further operations can be done!`
        );
      } else {
        await orderModel.findOneAndUpdate(
          {
            _id: messageBody.orderId,
            clientEmail: messageBody.clientEmail,
          },
          {
            currentLocation: messageBody.currentLocation,
            currentStatus: messageBody.currentStatus,
            lastUpdatedBy: messageBody.updatedBy,
          }
        );
        await ordersHistoryModel.create(messageBody);
      }
    }
  } catch (error) {
    throw error;
  }
};

export default handleOrderUpdate;
