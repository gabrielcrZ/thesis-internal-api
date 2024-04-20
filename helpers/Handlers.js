import bcrypt from "bcrypt";

const newClientHandler = async (req, res, next) => {
  const clientCode = req.body.clientCode;
  if (!clientCode) {
    return res.status(400).json({
      msg: "Client code was not provided!",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedClientCode = await bcrypt.hash(clientCode, salt);

  req.body = { ...req.body, clientCode: hashedClientCode };
  next();
};

export { newClientHandler };
