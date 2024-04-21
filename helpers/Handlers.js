import bcrypt from "bcrypt";

const newClientHandler = async (req, res, next) => {
  const { email, clientCode } = req.body;
  if (!email || !clientCode) {
    return res.status(400).json({
      msg: "Email or client code was not provided for the registration",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedClientCode = await bcrypt.hash(clientCode, salt);

  req.body = { ...req.body, clientCode: hashedClientCode };
  next();
};

export { newClientHandler };
