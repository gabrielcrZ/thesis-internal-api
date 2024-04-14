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
      type: Object,
      required: [true, "No client address information provided!"],
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
      products: {
        type: [
          {
            productDescription: String,
            productWeight: String,
            _id: false,
          },
        ],
        required: [true, "A list of products is required!"],
      },
      pickupDetails: {
        type: {
          pickupCountry: String,
          pickupCity: String,
          pickupAddress: String,
          pickupRegion: String,
          pickupId: String,
          pickupStatus: String,
          pickupClient: {
            clientEmail: String,
            clientName: String,
            clientPhone: String,
          },
          _id: false,
        },
        required: [true, "Pickup details were not provided!"],
      },
      shippingDetails: {
        type: {
          shippingCountry: String,
          shippingCity: String,
          shippingAddress: String,
          shippingRegion: String,
          shippingId: String,
          shippingStatus: String,
          shippingClient: {
            clientEmail: String,
            clientName: String,
            clientPhone: String,
          },
          _id: false,
        },
        required: [true, "No shipping details were provided!"],
      },
      currentStatus: {
        type: String,
        required: [true, "No status provided for the shipment!"],
      },
      currentLocation: {
        type: String,
        required: [true, "Order current location was not provided!"],
      },
      estimatedRevenue: {
        type: String,
        required: [
          true,
          "Estimated revenue could not be calculated for this order!",
        ],
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
        required: [true, "No operation type provided for the update"],
      },
      orderId: {
        type: String,
        required: [true, "No order Id was provided for the update!"],
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
