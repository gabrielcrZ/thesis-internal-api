import {
  mapNewClientMessage,
  mapClientUpdateMessage,
  mapClientDeleteMessage,
} from "../helpers/PayloadMapper.js";
import { clientModel, messagesModel } from "../models/Models.js";

export const addClient = async (req, res) => {
  try {
    await clientModel.create({ ...req.body }).then(async (newClient) => {
      if (!newClient) throw new Error("Client could not be created!");

      const messageModel = mapNewClientMessage(
        req.email,
        newClient._id,
        req.clientName,
        reg.clientPhone
      );
      await messagesModel.create(messageModel);
    });

    res.status(200).json({
      msg: `User ${newClient.id} created!`,
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
      .then(async (updatedClient) => {
        if (!updatedClient)
          throw new Error(`Client: ${req.params.id} could not be updated!`);

        const messageModel = mapClientUpdateMessage(
          updatedClient.email,
          updateClient._id
        );
        await messagesModel.create(messageModel);

        res.status(200).json({
          msg: `Client ${req.params.id} has been updated!`,
          updates: clientUpdates,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    await clientModel
      .deleteOne({
        _id: req.params.id,
      })
      .then(async (deletedClient) => {
        if (!deletedClient)
          throw new Error(`Client: ${req.params.id} could not be deleted!`);

        const messageModel = mapClientDeleteMessage(deletedClient.email);
        await messagesModel.create(messageModel);
        res.status(200).json({
          msg: `Client ${req.params.id} has been deleted`,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
