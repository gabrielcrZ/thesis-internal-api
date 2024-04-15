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

export const mapUpdateTransport = (
  updateTransportRequest,
  existingTransport
) => {
  return {
    deliveryType:
      updateTransportRequest.deliveryType || existingTransport.deliveryType,
    placeOfDeparture: {
      departureRegion:
        updateTransportRequest.placeOfDeparture.departureRegion ||
        existingTransport.placeOfDeparture.departureRegion,
      departureCity:
        updateTransportRequest.placeOfDeparture.departureCity ||
        existingTransport.placeOfDeparture.departureCity,
      departureAddress:
        updateTransportRequest.placeOfDeparture.departureAddress ||
        existingTransport.placeOfDeparture.departureAddress,
    },
    placeOfDelivery: {
      deliveryRegion:
        updateTransportRequest.placeOfDelivery.deliveryRegion ||
        existingTransport.placeOfDelivery.deliveryRegion,
      deliveryCity:
        updateTransportRequest.placeOfDelivery.deliveryCity ||
        existingTransport.placeOfDelivery.deliveryCity,
      deliveryAddress:
        updateTransportRequest.placeOfDelivery.deliveryAddress ||
        existingTransport.placeOfDelivery.deliveryAddress,
    },
    currentStatus:
      updateTransportRequest.currentStatus || existingTransport.currentStatus,
    estimatedDeliveryCost:
      updateTransportRequest.estimatedDeliveryCost ||
      existingTransport.estimatedDeliveryCost,
  };
};
