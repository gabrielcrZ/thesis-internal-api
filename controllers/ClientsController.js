import {
  mapNewClientMessage,
  mapClientUpdateMessage,
  mapClientDeleteMessage,
} from "../helpers/PayloadMapper.js";
import { decodeAuthorizationToken } from "../middlewares/Auth.js";
import { clientModel, messagesModel, orderModel } from "../models/Models.js";

export const addClient = async (req, res) => {
  try {
    const clientInfo = { ...req.body, lastUpdatedBy: req.body.email };
    await clientModel.create(clientInfo).then(async (newClient) => {
      if (!newClient) throw new Error("Client could not be created!");

      const messageModel = mapNewClientMessage(
        req.body.email,
        newClient._id,
        req.body.clientName,
        req.body.clientPhone
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
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );

    const clientUpdates = { ...req.body.updates, lastUpdatedBy: email };
    await clientModel.updateOne(
      {
        _id: req.params.id,
      },
      clientUpdates
    );
    await clientModel.findById(req.params.id).then(async (foundClient) => {
      const messageModel = mapClientUpdateMessage(
        foundClient.email,
        foundClient._id
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
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );
    let oldClient;
    await clientModel.findById(req.body.clientId).then(async (foundClient) => {
      if (!foundClient)
        throw new Error(`No client with id ${req.body.clientId} was found!`);

      const hasOngoingOrders =
        (await orderModel
          .find({ clientId: req.body.clientId })
          .where("currentStatus")
          .ne("At client's final destination")
          .countDocuments()) > 0;
      if (hasOngoingOrders) throw new Error(`Client ${req.body.clientId}`);
      oldClient = foundClient;
      await clientModel
        .deleteOne({
          _id: req.body.clientId,
        })
        .then(async () => {
          const messageModel = mapClientDeleteMessage(
            oldClient.email,
            email,
            userId
          );
          await messagesModel.create(messageModel);
          res.status(200).json({
            msg: `Client ${req.body.clientId} has been deleted`,
          });
        });
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getPaginatedClients = async (req, res) => {
  try {
    const page = req.body.pageNumber;
    const offset = (page - 1) * 10;
    let emailFilter = {};
    let clientFilter = {};

    if (req.body.clientFilter.clientEmail)
      emailFilter = { email: req.body.clientFilter.clientEmail };
    if (req.body.clientFilter.clientName)
      clientFilter = { clientName: req.body.clientFilter.clientName };
    await clientModel
      .find(emailFilter)
      .find(clientFilter)
      .sort({ createdAt: "desc" })
      .skip(offset)
      .limit(10)
      .select(
        "_id email clientName clientAddress clientPhone createdAt updatedAt"
      )
      .then(async (foundClients) => {
        const mappedClients = await Promise.all(
          foundClients.map(async (client) => {
            const hasOrders =
              (await orderModel
                .find({ clientId: client._id })
                .countDocuments()) > 0;
            return {
              _id: client._id,
              email: client.email,
              clientName: client.clientName,
              clientAddress: client.clientAddress,
              clientPhone: client.clientPhone,
              createdAt: client.createdAt,
              updatedAt: client.updatedAt,
              hasOrders: hasOrders,
            };
          })
        );
        res.status(200).json({
          paginatedClients: mappedClients,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getClientContentDetails = async (req, res) => {
  try {
    const clientInfo = await clientModel
      .findById(req.params.id)
      .then((foundClient) => {
        if (!foundClient)
          throw new Error(`No client with id ${req.params.id} was found`);
        return foundClient;
      });

    const ordersHistory = await orderModel.find({ clientId: req.params.id });

    res.status(200).json({
      clientInfo: clientInfo,
      ordersHistory: ordersHistory,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
