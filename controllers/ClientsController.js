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