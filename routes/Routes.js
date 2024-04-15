import { Router } from "express";
import {
  getOrders,
  getOrder,
  updateOrder,
} from "../controllers/OrdersController.js";
import {
  addTransport,
  getTransports,
  getAvailableTransports,
  updateTransport,
} from "../controllers/TransportsController.js";
import { addClient } from "../controllers/ClientsController.js";

const router = Router();
//Orders
router.route("/get-orders").get(getOrders);
router.route("/get-order/:id").get(getOrder);
router.route("/update-order").patch(updateOrder);
//Async updates are being handled in AsyncHandler.js

//Transports
router.route("/add-transport").post(addTransport);
router.route("/get-transports").get(getTransports);
router.route("/get-available-transports").post(getAvailableTransports);
router.route("/update-transport/:id").patch(updateTransport);

// //Clients
// router.route("/add-client").post(addClient);
// router.route("/get-clients").get(getClients);
// router.route("/get-client-information/:id").post(getClientInformation);

// //Dashboard
// router.route("/get-dashboard-metrics").get(getDashboardMetrics);

export default router;
