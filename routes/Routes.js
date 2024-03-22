import { Router } from "express";
import {
  addClient,
  getToken,
  addOrder,
  getOrders,
  getOrder,
} from "../controllers/OrdersController.js";
import {
  tokenRequestHandler,
  authorizationHandler,
  newClientHandler,
} from "../middlewares/Auth.js";

const router = Router();
router.route("/add-client").post(newClientHandler, addClient);
router.route("/get-token").post(tokenRequestHandler, getToken);
router.route("/add-order").post(authorizationHandler, addOrder);
router.route("/get-orders").get(authorizationHandler, getOrders);
router.route("/get-order/:id").get(authorizationHandler, getOrder);

export default router;
