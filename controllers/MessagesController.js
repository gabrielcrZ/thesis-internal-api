import { messagesModel } from "../models/Models";

export const getMessages = async (req, res) => {
  try {
    const page = req.body.pageNumber;
    const offset = (page - 1) * 15;

    let paginatedMessages;
    let uncheckedMessages;
    let allMessages;

    await messagesModel
      .find({})
      .sort({ createdAt: "desc" })
      .skip(offset)
      .limit(15)
      .then((foundMessages) => (paginatedMessages = foundMessages));

    await messagesModel
      .find({ messageStatus: "Unseen" })
      .then((foundMessages) => (uncheckedMessages = foundMessages.length));

    await messagesModel
      .find({})
      .then((foundMessages) => (allMessages = foundMessages.length));

    res.status(200).json({
      messages: paginatedMessages,
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
      .findOneAndUpdate({ _id: req.messageId }, { messageStatus: "Seen" })
      .then((updatedMessage) => {
        if (!updatedMessage) throw new Error("Message could not be updated!");

        res.status(200).json({
          msg: `Message: ${req.messageId} has been updated to status: Seen`,
        });
      });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
