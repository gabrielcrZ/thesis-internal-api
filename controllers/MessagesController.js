import { messagesModel } from "../models/Models.js";

export const getMessages = async (req, res) => {
  try {
    let uncheckedMessages;
    let allMessages;

    await messagesModel
      .find({ messageStatus: "Unseen" })
      .then((foundMessages) => (uncheckedMessages = foundMessages.length));

    await messagesModel
      .find({})
      .then((foundMessages) => (allMessages = foundMessages.length));

    res.status(200).json({
      inbox: allMessages,
      unchecked: uncheckedMessages,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    await messagesModel
      .findOneAndUpdate({ _id: req.body.messageId }, { messageStatus: "Seen" })
      .then((updatedMessage) => {
        if (!updatedMessage) throw new Error("Message could not be updated!");

        res.status(200).json({
          msg: `Message: ${req.body.messageId} has been updated to status: Seen`,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getUncheckedMessages = async (req, res) => {
  try {
    let uncheckedMessages;

    await messagesModel
      .find({ messageStatus: "Unseen" })
      .then((foundMessages) => (uncheckedMessages = foundMessages.length));

    res.status(200).json({
      count: uncheckedMessages,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

export const getPaginatedMessages = async (req, res) => {
  try {
    const page = req.body.pageNumber;
    const offset = (page - 1) * 10;
    let paginatedMessages;
    await messagesModel
      .find()
      .sort({ createdAt: "desc" })
      .skip(offset)
      .limit(10)
      .then((foundMessages) => (paginatedMessages = foundMessages));
    res.status(200).json({
      paginatedMessages: paginatedMessages,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
