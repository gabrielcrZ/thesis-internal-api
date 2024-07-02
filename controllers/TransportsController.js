import { mapAddNewTransport } from "../helpers/PayloadMapper.js";
import { transportModel, deliveryModel } from "../models/Models.js";

export const addTransport = async (req, res) => {
  try {
    const newTransport = mapAddNewTransport(req.body);
    await transportModel.create(newTransport).then((addedTransport) => {
      if (!addedTransport) {
        res.status(400).json({
          msg: "Transport could not be added",
        });
      }
      res.status(200).json({
        msg: `Transport ${addedTransport._id} has been added!`,
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getTransports = async (req, res) => {
  try {
    await transportModel
      .find(req.body)
      .sort("createdAt")
      .then((transportsList) => {
        res.status(200).json({
          transports: transportsList,
          transportsCount: transportsList.length,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getTransportsTableContent = async (req, res) => {
  try {
    const page = req.body.pagination;
    const offset = (page - 1) * 5;

    await transportModel
      .find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(5)
      .then((foundTransports) => {
        res.status(200).json({
          transports: foundTransports,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getAvailableTransports = async (req, res) => {
  try {
    await transportModel
      .find({
        currentStatus: "Ready",
      })
      .where("transportLocation.transportRegion", req.body.placeOfDeparture)
      .in("transportCapabilities.availableRegions", req.body.placeOfDelivery)
      .then((transportsList) => {
        res.status(200).json({
          transports: transportsList,
          transportsCount: transportsList.length,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const updateTransport = async (req, res) => {
  try {
    const transportUpdates = req.body;
    await transportModel
      .updateOne({ _id: req.params.id }, transportUpdates)
      .then((updatedTransport) => {
        if (updatedTransport.modifiedCount === 0) {
          res.status(400).json({
            msg: `Transport ${req.params.id} could not be updated or is invalid`,
          });
        }
        res.status(200).json({
          msg: `Transport ${req.params.id} has been updated`,
          updates: transportUpdates,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const deleteTransport = async (req, res) => {
  try {
    await transportModel
      .deleteOne({ _id: req.params.id })
      .then((deletedTransport) => {
        if (deletedTransport.getDeletedCount() === 0) {
          res.status(400).json({
            msg: `Transport ${req.params.id} could not be deleted or is invalid`,
          });
        }
        res.status(200).json({
          msg: `Transport ${req.params.id} has been deleted`,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const assignDelivery = async (req, res) => {
  try {
    await transportModel
      .updateOne(
        { _id: req.params.id },
        {
          currentStatus: `Assigned for ${req.body.deliveryType}`,
          assignedShipment: req.body.deliveryId,
        }
      )
      .then((updatedTransport) => {
        if (!updatedTransport) {
          res.status(400).json({
            msg: "Transport could not be updated or is invalid",
          });
        }
        deliveryModel
          .updateOne(
            { _id: req.body.deliveryId },
            {
              currentStatus: "Assigned to transport",
            }
          )
          .then(async (updatedDelivery) => {
            if (!updatedDelivery) {
              res.status(400).json({
                msg: "Delivery could not be updated or is invalid",
              });
            }
            res.status(200).json({
              msg: `Transport has been assigned to delivery ${req.body.deliveryId}`,
            });
          });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const unassignDelivery = () => {};
export const completeDelivery = () => {};
