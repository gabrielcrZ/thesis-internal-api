import {
  mapAddNewTransport,
  mapAddTransportMessage,
} from "../helpers/PayloadMapper.js";
import { decodeAuthorizationToken } from "../middlewares/Auth.js";
import {
  transportModel,
  deliveryModel,
  messagesModel,
} from "../models/Models.js";

export const addTransport = async (req, res) => {
  try {
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );
    const newTransport = mapAddNewTransport(req.body, email);
    await transportModel.create(newTransport).then(async (addedTransport) => {
      if (!addedTransport) {
        throw new Error("Transport could not be added");
      }

      const messageModel = mapAddTransportMessage(email, addedTransport._id);
      await messagesModel.create(messageModel);
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
      .findById(req.body.transportId)
      .then(async (foundTransport) => {
        if (!foundTransport)
          throw new Error(
            `No transport with id ${req.body.transportId} was found`
          );

        if (foundTransport.assignedShipment !== null)
          throw new Error(
            `Transport ${req.body.transportId} has an assigned shipment and it can't be deleted!`
          );

        await transportModel
          .findByIdAndDelete(req.body.transportId)
          .then((deletedTransport) => {
            if (!deletedTransport) {
              throw new Error(
                `Transport ${req.body.transportId} could not be deleted!`
              );
            }
            res.status(200).json({
              msg: `Transport ${req.body.transportId} has been deleted`,
            });
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
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );

    await transportModel
      .findById(req.body.transportId)
      .then(async (foundTransport) => {
        if (!foundTransport)
          throw new Error(
            `No transport with id ${req.body.transportId} was found!`
          );

        foundTransport.currentStatus = "Assigned for delivery";
        foundTransport.assignedShipment = req.body.deliveryId;
        foundTransport.lastUpdatedBy = email;

        await foundTransport.save().then(async (updatedTransport) => {
          if (!updatedTransport)
            throw new Error(
              `Transport ${req.body.transportId} could not be updated!`
            );

          await deliveryModel
            .findById(req.body.deliveryId)
            .then(async (foundDelivery) => {
              if (!foundDelivery)
                throw new Error(
                  `No delivery with id ${req.body.deliveryId} was found`
                );

              foundDelivery.currentStatus = "Assigned to transport";
              foundDelivery.lastUpdatedBy = email;
              await foundDelivery.save().then((updatedDelivery) => {
                if (!updatedDelivery)
                  throw new Error(
                    `Delivery ${req.body.deliveryId} could not be updated!`
                  );

                res.status(200).json({
                  msg: `Transport has been assigned to delivery ${req.body.deliveryId}`,
                });
              });
            });
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getDeliveryAssignInformation = async (req, res) => {
  try {
    await transportModel
      .findById(req.body.transportId)
      .then(async (foundTransport) => {
        if (!foundTransport)
          throw new Error(
            `Transport ${req.body.transportId} could not be found!`
          );
        const hasDeliveryAssigned = foundTransport.assignedShipment !== null;
        const availableDeliveries = await deliveryModel
          .find()
          .where("currentStatus", "Created")
          .where(
            "placeOfDeparture.departureCountry",
            foundTransport.transportLocation.transportCountry
          )
          .in(
            "placeOfDelivery.deliveryRegion",
            foundTransport.transportCapabilities.availableRegions
          )
          .select("_id deliveryType");

        res.status(200).json({
          hasDeliveryAssigned: hasDeliveryAssigned,
          availableDeliveries: availableDeliveries,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const unassignDelivery = async (req, res) => {
  try {
    const { email, userId } = decodeAuthorizationToken(
      req.headers.authorization
    );

    await transportModel
      .findById(req.body.transportId)
      .then(async (foundTransport) => {
        if (!foundTransport)
          throw new Error(
            `No transport with id ${req.body.transportId} was found!`
          );
        const oldDeliveryId = foundTransport.assignedShipment;
        foundTransport.currentStatus = "Ready";
        foundTransport.assignedShipment = null;
        foundTransport.lastUpdatedBy = email;

        await foundTransport.save().then(async (updatedTransport) => {
          if (!updatedTransport)
            throw new Error(
              `Transport ${req.body.transportId} could not be updated!`
            );

          await deliveryModel
            .findById(oldDeliveryId)
            .then(async (foundDelivery) => {
              if (!foundDelivery)
                throw new Error(
                  `No delivery with id ${oldDeliveryId} was found`
                );

              foundDelivery.currentStatus = "Created";
              foundDelivery.lastUpdatedBy = email;
              await foundDelivery.save().then((updatedDelivery) => {
                if (!updatedDelivery)
                  throw new Error(
                    `Delivery ${oldDeliveryId} could not be updated!`
                  );

                res.status(200).json({
                  msg: `Transport has been unassigned from delivery ${oldDeliveryId}`,
                });
              });
            });
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
export const completeDelivery = () => {
  
};
