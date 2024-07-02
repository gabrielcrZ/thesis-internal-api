import {
  deliveryModel,
  messagesModel,
  transportModel,
} from "../models/Models.js";
import { calculateShippingCost } from "../helpers/ShippingCostCalculation.js";
import {
  mapNewDeliveryMessage,
  mapDeliveryUpdateMessage,
} from "../helpers/PayloadMapper.js";
import { decodeAuthorizationToken } from "../middlewares/Auth.js";

export const addDelivery = async (req, res) => {
  try {
    const request = req.body;
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );
    await deliveryModel
      .create({
        createdBy: email,
        updatedBy: email,
        currentStatus: "Created",
        estimatedDeliveryCost: calculateShippingCost(
          request.placeOfDeparture.departureRegion,
          request.placeOfDelivery.deliveryRegion
        ),
        ...request,
      })
      .then(async (addedDelivery) => {
        if (!addedDelivery) throw new Error("Delivery could not be added");

        const messageModel = mapNewDeliveryMessage(
          addedDelivery.createdBy,
          addedDelivery._id,
          addedDelivery.placeOfDeparture.departureCity,
          addedDelivery.placeOfDelivery.deliveryCity,
          addedDelivery.estimatedDeliveryCost
        );
        await messagesModel.create(messageModel);
        res.status(200).json({
          msg: `Delivery ${addedDelivery._id} has been created successfully`,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getDeliveries = async (req, res) => {
  try {
    await deliveryModel.find(req.body).then((foundDeliveries) => {
      res.status(200).json({
        deliveries: foundDeliveries,
        count: foundDeliveries.length,
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getDelivery = async (req, res) => {
  try {
    await deliveryModel
      .findOne({
        _id: req.params.id,
      })
      .then((foundDelivery) => {
        res.status(200).json({
          delivery: foundDelivery,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getDeliveriesTableContent = async (req, res) => {
  try {
    const page = req.body.pagination;
    const offset = (page - 1) * 5;

    await deliveryModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(5)
      .then((foundDeliveries) => {
        res.status(200).json({
          deliveries: foundDeliveries,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const updateDelivery = async (req, res) => {
  try {
    const deliveryUpdates = req.body;
    await deliveryModel
      .updateOne(
        {
          _id: req.params.id,
        },
        deliveryUpdates
      )
      .then(async (updatedDelivery) => {
        if (!updatedDelivery)
          throw new Error(`Delivery: ${req.params.id} could not be updated!`);

        const messageModel = mapDeliveryUpdateMessage(
          updatedDelivery.updatedBy,
          updatedDelivery._id,
          updatedDelivery.updatedAt
        );
        await messagesModel.create(messageModel);
        res.status(200).json({
          msg: `Delivery ${req.params.id} has been updated`,
          updates: deliveryUpdates,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const deleteDelivery = async (req, res) => {
  try {
    await deliveryModel
      .deleteOne({
        _id: req.params.id,
      })
      .then(async (deletedDelivery) => {
        res.status(200).json({
          msg: `Delivery ${req.params.id} has been deleted`,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getDeliveriesInformation = async (req, res) => {
  try {
    const unprocessedDeliveries = await deliveryModel
      .find()
      .where("currentStatus", "Created")
      .countDocuments();
    const processedDeliveries = await deliveryModel
      .find()
      .where("currentStatus", "Assigned to transport")
      .countDocuments();
    const completedDeliveries = await deliveryModel
      .find()
      .where("currentStatus", "Completed")
      .countDocuments();

    const readyTransports = await transportModel
      .find()
      .where("currentStatus", "Ready")
      .countDocuments();
    const assignedTransports = await transportModel
      .find()
      .where("currentStatus", "Assigned to delivery")
      .countDocuments();
    const transitTransports = await transportModel
      .find()
      .where("currentStatus", "In transit")
      .countDocuments();

    res.status(200).json({
      deliveries: {
        unprocessedDeliveries: unprocessedDeliveries,
        processedDeliveries: processedDeliveries,
        completedDeliveries: completedDeliveries,
      },
      transports: {
        readyTransports: readyTransports,
        transitTransports: transitTransports,
        assignedTransports: assignedTransports,
      },
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
