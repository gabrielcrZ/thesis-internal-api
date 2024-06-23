import { deliveryModel, messagesModel } from "../models/Models.js";
import { calculateShippingCost } from "../helpers/ShippingCostCalculation.js";
import {
  mapNewDeliveryMessage,
  mapDeliveryUpdateMessage,
} from "../helpers/PayloadMapper.js";

export const addDelivery = async (req, res) => {
  try {
    const request = req.body;
    await deliveryModel
      .create({
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
