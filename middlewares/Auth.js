import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { usersModel } from "../models/Models.js";

const tokenRequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      msg: "Email address or password was not provided or is invalid!",
    });
  }

  await usersModel.findOne({ email: email }).then(async (foundUser) => {
    if (!foundUser) {
      res.status(400).json({
        msg: `No user found with email: ${email}`,
      });
    } else {
      const isMatchingPasswords = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!isMatchingPasswords) {
        res.status(400).json({
          msg: `Provided password is invalid for email: ${email}`,
        });
      } else {
        const userId = foundUser._id;
        const token = jwt.sign(
          { email, password, userId },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.token = token;
      }
    }
  });
  next();
};

// const authorizationHandler = async (req, res, next) => {
//   const authFromHeaders = req.headers.authorization;

//   if (!authFromHeaders || !authFromHeaders.startsWith("Bearer")) {
//     res.status(401).json({
//       msg: "Authorization token was not provided or is invalid!",
//     });
//   }

//   const token = authFromHeaders.split(" ")[1];
//   const decodedToken = decodeAuthorizationToken(token);
//   const decodedEmail = decodedToken.email;
//   const decodedClientCode = decodedToken.clientCode;

//   try {
//     const client = await clientModel.findOne({ email: decodedEmail });
//     if (!client) {
//       res.status(400).json({
//         msg: `No client found with email: ${decodedEmail}`,
//       });
//     }

//     const isMatchingClientCode = await bcrypt.compare(
//       decodedClientCode,
//       client.clientCode
//     );
//     if (!isMatchingClientCode) {
//       res.status(400).json({
//         msg: `Provided client code is not valid for client: ${client.email}!`,
//       });
//     }
//     next();
//   } catch (error) {
//     res.status(500).json({
//       msg: error.message,
//     });
//   }
// };

const newUserHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      msg: "Email or password was not provided for the registration",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  req.body = { ...req.body, password: hashedPassword };
  next();
};

const decodeAuthorizationToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { tokenRequestHandler, newUserHandler, decodeAuthorizationToken };
