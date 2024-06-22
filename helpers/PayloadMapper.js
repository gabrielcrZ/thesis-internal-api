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
    orderId: updatedOrder.id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been assigned for pickup!",
  };
};

export const mapPickupSuccess = (updatedOrder) => {
  return {
    operationType: "Pickup success",
    orderId: updatedOrder.id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been picked up successfully!",
  };
};

export const mapPickupFailure = (updatedOrder, failReason) => {
  return {
    operationType: "Pickup fail",
    orderId: updatedOrder.id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: failReason,
  };
};

export const mapAssignShipment = (updatedOrder) => {
  return {
    operationType: "Assign shipping",
    orderId: updatedOrder.id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been assigned for shipping!",
  };
};

export const mapShipmentSuccess = (updatedOrder) => {
  return {
    operationType: "Shipping success",
    orderId: updatedOrder.id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been shipped successfully",
  };
};

export const mapAssignDelivery = (updatedOrder) => {
  return {
    operationType: "Assign delivery",
    orderId: updatedOrder.id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been assigned for delivery",
  };
};

export const mapDeliverySuccess = (updatedOrder) => {
  return {
    operationType: "Delivery success",
    orderId: updatedOrder.id,
    updatedBy: updatedOrder.lastUpdatedBy,
    additionalInfo: "Order has been successfully delivered to client",
  };
};

export const mapAddNewTransport = (transportRequest) => {
  return {
    currentStatus: "Ready",
    assignedShipment: null,
    ...transportRequest,
  };
};

export const mapCancelOrderMessage = (providedEmail, orderId) => {
  return {
    from: providedEmail,
    shortMessage: "An order has been cancelled!",
    longMessage: `Order: ${orderId} has been cancelled by the client`,
    referenceId: orderId,
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
  };
};

export const mapPickupSuccessMessage = (updatedBy, orderId, orderLocation) => {
  return {
    from: updatedBy,
    shortMessage: "An order has been successfully picked up!",
    longMessage: `Order: ${orderId} has been successfully picked up. Current location: ${orderLocation} local storage.`,
    referenceId: orderId,
  };
};

export const mapPickupFailureMessage = (providedEmail, orderId) => {};

export const mapAssignShippingMessage = (providedEmail, orderId) => {};

export const mapShippingSuccessMessage = (providedEmail, orderId) => {};

export const mapAssignDeliveryMessage = (providedEmail, orderId) => {};

export const mapDeliverySuccessMessage = (providedEmail, orderId) => {};
