import {
  mapAddNewTransport,
} from "../helpers/PayloadMapper.js";
import { transportModel } from "../models/Models.js";

export const addTransport = async (req, res) => {
  try {
    const newTransport = mapAddNewTransport(req.body);
    await transportModel.create(newTransport).then((addedOrder) => {
      res.status(200).json({
        msg: `Transport ${addedOrder._id} has been created!`,
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
    const filters = req.body.filters;
    await transportModel
      .find({ filters })
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
      .then(() => {
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
