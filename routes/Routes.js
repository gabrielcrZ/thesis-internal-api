import { Router } from "express";
import {
  getOrders,
  getOrderContent,
  updateOrder,
  getDashboardTableContents,
  getOrdersTableContents,
  unassignOrderPickup,
  assignOrderPickup,
  assignOrderShipment,
  unassignOrderShipping,
  assignOrderDelivery,
  unassignOrderDelivery,
  cancelOrder,
} from "../controllers/OrdersController.js";
import {
  addTransport,
  getTransports,
  getAvailableTransports,
  updateTransport,
  deleteTransport,
  assignDelivery,
  getTransportsTableContent,
  getDeliveryAssignInformation,
  unassignDelivery,
} from "../controllers/TransportsController.js";
import {
  addClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  getPaginatedClients,
  getClientContentDetails,
} from "../controllers/ClientsController.js";
import {
  addDelivery,
  getDeliveries,
  getDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveriesInformation,
  getDeliveriesTableContent,
  cancelDelivery,
} from "../controllers/DeliveriesController.js";
import { getDashboardMetrics } from "../controllers/DashboardController.js";
import { newClientHandler } from "../helpers/Handlers.js";
import {
  addUser,
  getUserDetails,
  requireToken,
} from "../controllers/UsersController.js";
import { newUserHandler, tokenRequestHandler } from "../middlewares/Auth.js";
import {
  getMessages,
  getPaginatedMessages,
  getUncheckedMessages,
  updateMessageStatus,
} from "../controllers/MessagesController.js";

const router = Router();
//Orders
router.route("/get-orders").post(getOrders);
router.route("/get-order-content/:id").get(getOrderContent);
router.route("/update-order/:id").patch(updateOrder);
router.route("/get-dashboard-table-contents").post(getDashboardTableContents);
router.route("/get-orders-table-contents").post(getOrdersTableContents);
router.route("/unassign-pickup").post(unassignOrderPickup);
router.route("/assign-pickup").post(assignOrderPickup);
router.route("/assign-shipping").post(assignOrderShipment);
router.route("/unassign-shipment").post(unassignOrderShipping);
router.route("/assign-delivery").post(assignOrderDelivery);
router.route("/unassign-delivery").post(unassignOrderDelivery);
router.route("/cancel-order").post(cancelOrder);
//Async updates are being handled in AsyncHandler.js
//Async order cancel is handled in AsyncHandler.js

//Transports
router.route("/add-transport").post(addTransport);
router.route("/get-transports").post(getTransports);
router.route("/get-available-transports").post(getAvailableTransports);
router.route("/update-transport/:id").patch(updateTransport);
router.route("/delete-transport").post(deleteTransport);
router.route("/assign-transport-delivery").post(assignDelivery);
router.route("/unassign-transport-delivery").post(unassignDelivery);
router.route("/get-transports-table").post(getTransportsTableContent);
router.route("/get-available-deliveries").post(getDeliveryAssignInformation);

//Clients
router.route("/add-client").post(newClientHandler, addClient);
router.route("/get-clients").post(getClients);
router.route("/get-client/:id").get(getClient);
router.route("/update-client/:id").patch(updateClient);
router.route("/delete-client").post(deleteClient);
router.route("/get-paginated-clients").post(getPaginatedClients);
router.route("/get-client-content/:id").get(getClientContentDetails);

//Deliveries
router.route("/add-delivery").post(addDelivery);
router.route("/get-deliveries").post(getDeliveries);
router.route("/get-delivery/:id").get(getDelivery);
router.route("/update-delivery/:id").patch(updateDelivery);
router.route("/delete-delivery/:id").delete(deleteDelivery);
router.route("/get-deliveries-information").get(getDeliveriesInformation);
router.route("/get-deliveries-table").post(getDeliveriesTableContent);
router.route("/cancel-delivery").post(cancelDelivery);

//Dashboard
router.route("/get-dashboard-metrics").get(getDashboardMetrics);

//Users
router.route("/add-user").post(newUserHandler, addUser);
router.route("/require-token").post(tokenRequestHandler, requireToken);
router.route("/get-user-details").post(getUserDetails);

//Messages
router.route("/get-unchecked-messages").get(getUncheckedMessages);
router.route("/get-messages-count").get(getMessages);
router.route("/update-message").post(updateMessageStatus);
router.route("/get-paginated-messages").post(getPaginatedMessages);
export default router;
