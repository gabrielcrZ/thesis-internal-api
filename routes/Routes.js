import { Router } from "express";
import {
  getOrders,
  getOrder,
  updateOrder,
  getDashboardTableContents,
  getOrdersTableContents,
} from "../controllers/OrdersController.js";
import {
  addTransport,
  getTransports,
  getAvailableTransports,
  updateTransport,
  deleteTransport,
  assignDelivery,
} from "../controllers/TransportsController.js";
import {
  addClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} from "../controllers/ClientsController.js";
import {
  addDelivery,
  getDeliveries,
  getDelivery,
  updateDelivery,
  deleteDelivery,
} from "../controllers/DeliveriesController.js";
import { getDashboardMetrics } from "../controllers/DashboardController.js";
import { newClientHandler } from "../helpers/Handlers.js";

const router = Router();
//Orders
router.route("/get-orders").post(getOrders);
router.route("/get-order/:id").get(getOrder);
router.route("/update-order").patch(updateOrder);
router.route("/get-dashboard-table-contents").post(getDashboardTableContents);
router.route("/get-orders-table-contents").post(getOrdersTableContents);
//Async updates are being handled in AsyncHandler.js
//Async order cancel is handled in AsyncHandler.js

//Transports
router.route("/add-transport").post(addTransport);
router.route("/get-transports").post(getTransports);
router.route("/get-available-transports").post(getAvailableTransports);
router.route("/update-transport/:id").patch(updateTransport);
router.route("/delete-transport/:id").delete(deleteTransport);
router.route("/assign-delivery/:id").patch(assignDelivery);

//Clients
router.route("/add-client").post(newClientHandler, addClient);
router.route("/get-clients").post(getClients);
router.route("/get-client/:id").get(getClient);
router.route("/update-client/:id").patch(updateClient);
router.route("/delete-client/:id").delete(deleteClient);

//Deliveries
router.route("/add-delivery").post(addDelivery);
router.route("/get-deliveries").post(getDeliveries);
router.route("/get-delivery/:id").get(getDelivery);
router.route("/update-delivery/:id").patch(updateDelivery);
router.route("/delete-delivery/:id").delete(deleteDelivery);

//Dashboard
router.route("/get-dashboard-metrics").get(getDashboardMetrics);

export default router;
