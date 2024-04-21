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
      clientId: {
        type: String,
        required: [true, "Client id is required for this order"],
      },
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

const transportModel = mongoose.model(
  "Transport",
  new mongoose.Schema(
    {
      transportType: {
        type: String,
        required: [true, "No transport type was provided!"],
      },
      transportLocation: {
        type: {
          transportRegion: String,
          transportCity: String,
        },
        _id: false,
        required: [true, "No location was provided for this transport!"],
      },
      currentStatus: {
        type: String,
        required: [true, "Current status was not specified for this transport"],
      },
      transportCapabilities: {
        type: {
          canPickup: Boolean,
          canShip: Boolean,
          availableRegions: [String],
          transportCapacity: String,
          loadedPercent: String,
        },
        _id: false,
        required: [true, "No transport capabilities were provided!"],
      },
      assignedShipment: {
        type: {
          shipmentId: String,
          pickupId: String,
          shipmentWeight: String,
        },
        _id: false,
      },
    },
    {
      timestamps: true,
    }
  )
);

const deliveryModel = mongoose.model(
  "Delivery",
  new mongoose.Schema(
    {
      deliveryType: {
        type: String,
        required: [true, "Delivery type was not specified!"],
      },
      placeOfDeparture: {
        type: {
          departureRegion: String,
          departureCity: String,
          departureAddress: String,
        },
        _id: false,
        required: [
          true,
          "Departure information was not provided for this delivery!",
        ],
      },
      placeOfDelivery: {
        type: {
          deliveryRegion: String,
          deliveryCity: String,
          deliveryAddress: String,
        },
        _id: false,
        required: [true, "Delivery information was not provided!"],
      },
      currentStatus: {
        type: String,
        required: [true, "Current status was not provided for this delivery!"],
      },
      estimatedDeliveryCost: {
        type: String,
        required: [true, "Delivery could not be calculated!"],
      },
    },
    { timestamps: true }
  )
);
export {
  clientModel,
  orderModel,
  ordersHistoryModel,
  transportModel,
  deliveryModel,
};
