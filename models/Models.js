import mongoose from "mongoose";

const clientModel = mongoose.model(
  "Client",
  new mongoose.Schema({
    email: {
      type: String,
      required: [true, "No email provided!"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Email address is invalid!"],
      unique: true,
    },
    clientCode: {
      type: String,
      required: [true, "Client code is invalid!"],
    },
    clientName: {
      type: String,
      required: [true, "No client name provided!"],
    },
    clientAddress: {
      type: String,
      required: [true, "No client address provided!"],
    },
    clientPhone: {
      type: String,
      required: [true, "No phone number provided"],
    },
  })
);

const orderModel = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      clientEmail: {
        type: String,
        required: [true, "No email provided!"],
        match: [
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          "Email address is not valid!",
        ],
      },
      products: {
        type: [String],
        required: [true, "A list of products is required!"],
      },
      departFrom: {
        type: String,
        required: [true, "No departure location provided!"],
      },
      shipTo: {
        type: String,
        required: [true, "No delivery location provided!"],
      },
      shipmentWeight: {
        type: String,
        match: [
          /\d+\.{0,1}\d{1,3}kg$/gm,
          "Provided weight format is not valid (only kg's)!",
        ],
      },
      currentLocation: {
        type: String,
        required: [true, "No current location provided for the shipment!"],
      },
      currentStatus: {
        type: String,
        required: [true, "No status provided for the shipment!"],
      },
      lastUpdatedBy: {
        type: String,
        required: [true, "No last updater provided for the shipment!"],
      },
    },
    {
      timestamps: true,
    }
  )
);

const ordersHistoryModel = mongoose.model(
  "OrdersUpdate",
  new mongoose.Schema(
    {
      operationType: {
        type: String,
        required: [true, "No operation type provided for the update"]
      },
      orderId: {
        type: String,
        required: [true, "No order Id was provided for the update!"],
      },
      clientEmail: {
        type: String,
        required: [true, "No information regarding client email was provided"],
        match: [
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
          "Email address is not valid!",
        ],
      },
      currentLocation: {
        type: String,
        required: [true, "No current location provided for the update!"],
      },
      currentStatus: {
        type: String,
        required: [true, "No status provided for the update!"],
      },
      updatedBy: {
        type: String,
        required: [true, "No information regarding the updater was provided!"],
      },
      additionalInfo: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )
);

export { clientModel, orderModel, ordersHistoryModel };
