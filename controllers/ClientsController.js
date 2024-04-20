import { response } from "express";
import { clientModel } from "../models/Models.js";

export const addClient = async (req, res) => {
  try {
    await clientModel.create({ ...req.body }).then((newClient) => {
      res.status(200).json({
        msg: `User ${newClient.id} created!`,
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getClients = async (req, res) => {
  try {
    await clientModel.find(req.body).then((foundClients) => {
      res.status(200).json({
        clients: foundClients,
        count: foundClients.length,
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getClient = async (req, res) => {
  try {
    await clientModel
      .findOne({
        _id: req.params.id,
      })
      .then((foundClient) => {
        res.status(200).json({
          client: foundClient,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const clientUpdates = req.body;
    await clientModel
      .updateOne(
        {
          _id: req.params.id,
        },
        clientUpdates
      )
      .then(() => {
        res.status(200).json({
          msg: `Client ${req.params.id} has been update`,
          updates: clientUpdates,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
