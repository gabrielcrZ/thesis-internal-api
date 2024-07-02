import { convertMongoCurrency } from "./Helpers.js";

export const mapCancelUpdate = (updatedOrder) => {
  return {
    operationType: "Cancel",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been cancelled!",
  };
};

export const mapAssignPickup = (updatedOrder) => {
  return {
    operationType: "Assign pickup",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been assigned for pickup!",
  };
};

export const mapPickupSuccess = (updatedOrder) => {
  return {
    operationType: "Pickup success",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been picked up successfully!",
  };
};

export const mapPickupFailure = (updatedOrder, failReason) => {
  return {
    operationType: "Pickup fail",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: failReason,
  };
};

export const mapAssignShipment = (updatedOrder) => {
  return {
    operationType: "Assign shipping",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been assigned for shipping!",
  };
};

export const mapShipmentSuccess = (updatedOrder) => {
  return {
    operationType: "Shipping success",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been shipped successfully",
  };
};

export const mapAssignDelivery = (updatedOrder) => {
  return {
    operationType: "Assign delivery",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been assigned for delivery",
  };
};

export const mapDeliverySuccess = (updatedOrder) => {
  return {
    operationType: "Delivery success",
    orderId: updatedOrder._id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been successfully delivered to client",
  };
};

export const mapAddNewTransport = (transportRequest, email) => {
  return {
    currentStatus: "Ready",
    assignedShipment: null,
    createdBy: email,
    lastUpdatedBy: email,
    ...transportRequest,
  };
};

export const mapCancelOrderMessage = (providedEmail, orderId) => {
  return {
    from: providedEmail,
    shortMessage: "An order has been cancelled!",
    longMessage: `Order: ${orderId} has been cancelled by the client`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapForceCancelOrderMessage = (updatedBy, orderId) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been cancelled!",
    longMessage: `Order ${orderId} has been cancelled through the ShippingApp Dashboard`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};
export const mapAssignPickupMessage = (
  assignedBy,
  orderId,
  pickupId,
  pickupLocation
) => {
  return {
    from: assignedBy,
    shortMessage: "An order has been assigned for pickup!",
    longMessage: `Order: ${orderId} has been assigned for pickup. Pickup id: ${pickupId} and pickup location: ${pickupLocation}.`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapPickupSuccessMessage = (updatedBy, orderId, orderLocation) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been successfully picked up!",
    longMessage: `Order: ${orderId} has been successfully picked up. Current location: ${orderLocation} local storage.`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapPickupFailureMessage = (updatedBy, orderId, pickupId) => {
  return {
    from: updatedBy,
    shortMessage: "An order has failed to pickup!",
    longMessage: `Order: ${orderId}, assigned to pickup: ${pickupId} has failed to pickup.`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapAssignShippingMessage = (updatedBy, orderId, shippingId) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been assigned for shipping!",
    longMessage: `Order: ${orderId} has been assigned for delivery/shipping, id: ${shippingId}`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapShippingSuccessMessage = (
  updatedBy,
  orderId,
  currentLocation
) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been successfully shipped!",
    longMessage: `Order: ${orderId} was delivered successfully delivered. Current location: ${currentLocation} local storage.`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapAssignDeliveryMessage = (
  updatedBy,
  orderId,
  deliveryId,
  deliveryAddress
) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been assigned for delivery!",
    longMessage: `Order: ${orderId} has been assigned to delivery: ${deliveryId}. Delivery address: ${deliveryAddress}`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapDeliverySuccessMessage = (
  updatedBy,
  orderId,
  currentLocation
) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been successfully delivered!",
    longMessage: `Order: ${orderId} has been successfully delivered and it's now at: ${currentLocation}`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapNewClientMessage = (
  clientEmail,
  clientId,
  clientName,
  clientPhone
) => {
  return {
    from: clientEmail,
    shortMessage: "A new client has been created!",
    longMessage: `A new client has been added. Client id: ${clientId}, name: ${clientName} and phone: ${clientPhone}`,
    referenceId: clientId,
    messageStatus: "Unseen",
  };
};

export const mapClientUpdateMessage = (clientEmail, clientId) => {
  return {
    from: clientEmail,
    shortMessage: "A client's information has been updated!",
    longMessage: `Client: ${clientId} has updated his information`,
    referenceId: clientId,
    messageStatus: "Unseen",
  };
};

export const mapClientDeleteMessage = (clientEmail) => {
  return {
    from: clientEmail,
    shortMessage: "A client has deleted his account!",
    longMessage: `Client: ${clientEmail} has deleted his account`,
    referenceId: null,
    messageStatus: "Unseen",
  };
};

export const mapNewDeliveryMessage = (
  createdBy,
  deliveryId,
  pickupLocation,
  deliveryLocation,
  estimatedCost
) => {
  return {
    from: createdBy,
    shortMessage: "A new delivery has been created!",
    longMessage: `Delivery: ${deliveryId} has been created. Pickup location: ${pickupLocation}, delivery to: ${deliveryLocation} with estimated cost: ${convertMongoCurrency(
      estimatedCost
    )}`,
    referenceId: deliveryId,
    messageStatus: "Unseen",
  };
};

export const mapDeliveryUpdateMessage = (
  updatedBy,
  deliveryId,
  updatedTime
) => {
  return {
    from: updatedBy,
    shortMessage: "A delivery has been updated!",
    longMessage: `Delivery: ${deliveryId} has been updated by: ${updatedBy} at: ${updatedTime}`,
    referenceId: deliveryId,
    messageStatus: "Unseen",
  };
};

export const mapUnassignPickupMessage = (updatedBy, orderId, pickupId) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been unassign from pickup process!",
    longMessage: `Order ${orderId} it's no longer assigned to pickup ${pickupId}. Unassigned by ${updatedBy}.`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapUnassignPickup = (orderId, updatedBy) => {
  return {
    operationType: "Unassign pickup",
    orderId: orderId,
    updatedBy: updatedBy,
    additionalInfo: "Order has been unassign from pickup process!",
  };
};

export const mapUnassignShippingMessage = (updatedBy, orderId, shippingId) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been unassigned from shipping process!",
    longMessage: `Order ${orderId} it's no longer assigned to shipment ${shippingId}. Unassigned by ${updatedBy}.`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapUnassignShipping = (orderId, updatedBy) => {
  return {
    operationType: "Unassign shipping",
    orderId: orderId,
    updatedBy: updatedBy,
    additionalInfo: "Order has been unassigned from shipping process!",
  };
};

export const mapUnassignDeliveryMessage = (updatedBy, orderId, deliveryId) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been unassigned from delivery process!",
    longMessage: `Order ${orderId} it's no longer assigned to delivery ${deliveryId}. Unassigned by ${updatedBy}.`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapUnassignDelivery = (orderId, updatedBy) => {
  return {
    operationType: "Unassign delivery",
    orderId: orderId,
    updatedBy: updatedBy,
    additionalInfo: "Order has been unassigned from delivery process!",
  };
};

export const mapUpdateOrderMessage = (updatedBy, orderId) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been force-updated!",
    longMessage: `Order ${orderId} has been updated through the ShippingApp Dashboard. Updated by ${updatedBy}`,
    referenceId: orderId,
    messageStatus: "Unseen",
  };
};

export const mapAddTransportMessage = (createdBy, transportId) => {
  return {
    from: createdBy,
    shortMessage: "A new transport has been created!",
    longMessage: `A new transport has been created. Transport id: ${transportId}. Created by ${createdBy}`,
    referenceId: transportId,
    messageStatus: "Unseen",
  };
};

export const mapCancelDeliveryMessage = (
  updatedBy,
  deliveryId,
  cancelledAt
) => {
  return {
    from: updatedBy,
    shortMessage: "A delivery has been cancelled",
    longMessage: `Delivery ${deliveryId} has been cancelled by ${updatedBy}. Cancellation time ${cancelledAt}`,
    referenceId: deliveryId,
    messageStatus: "Unseen",
  };
};
