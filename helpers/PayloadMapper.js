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
    shortMessage: "A new delivery has been created!d",
    longMessage: `Delivery: ${deliveryId} has been created. Pickup location: ${pickupLocation}, delivery to: ${deliveryLocation} with estimated cost: ${estimatedCost}`,
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
    shortMessage: "A delivery has been updated",
    longMessage: `Delivery: ${deliveryId} has been updated by: ${updatedBy} at: ${updatedTime}`,
    referenceId: deliveryId,
    messageStatus: "Unseen",
  };
};
