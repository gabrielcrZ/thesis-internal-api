import { deliveryModel } from "../models/Models.js";
import { calculateShippingCost } from "../helpers/ShippingCostCalculation.js";

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
      .then((addedDelivery) => {
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
      .then(() => {
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
      .then(() => {
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
