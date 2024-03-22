import { ordersHistoryModel, orderModel } from "../models/Models.js";

const handleOrderUpdate = async (messageBody) => {
  try {
    await orderModel
      .findByIdAndUpdate(messageBody.orderId, {
        clientEmail: messageBody.clientEmail,
        currentLocation: messageBody.currentLocation,
        currentStatus: messageBody.currentStatus,
      })
      .then(() => {
        console.log(`Updated order with id: ${messageBody.orderId}`);
      });

    await ordersHistoryModel.create(messageBody).then(() => {
      console.log("Order update added to the database!");
    });
  } catch (error) {
    throw error;
  }
};

export default handleOrderUpdate;
