import { Router } from "express";
import {
  addClient,
  getToken,
  addOrder,
  getOrders,
  getOrder,
} from "../controllers/OrdersController.js";

const router = Router();
router.route("/get-clients").post(addClient);
router.route("/get-token").post(getToken);
router.route("/add-order").post(addOrder);
router.route("/get-orders").get(getOrders);
router.route("/get-order/:id").get(getOrder);

export default router;
