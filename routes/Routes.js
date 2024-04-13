import { Router } from "express";
import { getOrders, getOrder } from "../controllers/OrdersController.js";
import { addClient } from "../controllers/ClientsController.js";

const router = Router();
//Orders
router.route("/get-orders").get(getOrders);
router.route("/get-order/:id").get(getOrder);
router.route("/update-order/:id").patch(updateOrder);

//Pickups
router.route("/add-pickup").post(addPickup);
router.route("/get-pickups").get(getPickups);
router.route("/get-available-pickups").post(getAvailablePickups);
router.route("/update-pickup/:id").patch(updatePickup);

//Shipments
router.route("/get-shipments").get(getShipments);
router.route("/get-available-shipments").post(getAvailableShipments);
router.route("/update-shipment/:id").patch(updateShipment);

//Clients
router.route("/add-client").post(addClient);
router.route("/get-clients").get(getClients);
router.route("/get-client-information/:id").post(getClientInformation);

//Dashboard
router.route("/get-dashboard-metrics").get(getDashboardMetrics);

export default router;
