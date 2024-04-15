import {
  mapUpdateTransport,
  mapAddNewTransport,
} from "../helpers/PayloadMapper.js";
import { transportModel } from "../models/Models.js";

export const addTransport = async (req, res) => {
  try {
    const newTransport = mapAddNewTransport(req.body);
    console.log(newTransport);
    await transportModel.create(newTransport).then((addedOrder) => {
      res.status(200).json({
        msg: `Transport ${addedOrder._id} has been created!`,
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.msg,
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
      msg: error.msg,
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
      // .where(req.body.placeOfDelivery).in("transportCapabilities.availableRegions")
      .then((transportsList) => {
        res.status(200).json({
          transports: transportsList,
          transportsCount: transportsList.length,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.msg,
    });
  }
};

export const updateTransport = async (req, res) => {
  try {
    const transportUpdates = req.body;
    const existingTransport = await transportModel.findOne({
      _id: req.params.id,
    });
    const mappedTransportUpdates = mapUpdateTransport(
      transportUpdates,
      existingTransport
    );
    await transportModel
      .updateOne({ _id: req.params.id }, { mappedTransportUpdates })
      .then(() => {
        res.status(200).json({
          msg: `Transport ${req.params.id} has been updated`,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.msg,
    });
  }
};
