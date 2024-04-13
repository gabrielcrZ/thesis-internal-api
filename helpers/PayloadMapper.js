export const mapCancelUpdate = (cancelUpdate, existingOrder) => {
  return {
    currentLocation: existingOrder.currentLocation,
    currentStatus: "Cancelled",
    updatedBy: existingOrder.clientEmail,
    additionalInfo: "Order was cancelled by the client!",
    ...cancelUpdate,
  };
};

export const mapAssignPickup = (existingOrder, updateRequest) => {
  return {
    operationType: updateRequest.operationType,
    orderId: existingOrder.id,
    currentLocation: `${existingOrder.pickupDetails.pickupCity}, ${existingOrder.pickupDetails.pickupCountry}`,
    currentStatus: "In pickup process",
    pickupId: updateRequest.pickupId,
    pickupStatus: "Assigned for pickup",
    shippingId: null,
    shippingStatus: "Not assigned",
    updatedBy: updateRequest.updatedBy,
  };
};

export const mapPickupSuccess = (existingOrder, updateRequest) => {
  return {
    operationType: updateRequest.operationType,
    orderId: existingOrder.id,
    currentLocation: `In ${existingOrder.pickupDetails.pickupCountry} storage facility`,
    currentStatus: "In local storage",
    pickupId: null,
    pickupStatus: "Success",
    shippingId: null,
    shippingStatus: "Not assigned",
    updatedBy: updateRequest.updatedBy,
  };
};

export const mapPickupFailure = (existingOrder, updateRequest) => {
  return {
    operationType: updateRequest.operationType,
    orderId: existingOrder.id,
    currentLocation: `${existingOrder.pickupDetails.pickupCity}, ${existingOrder.pickupDetails.pickupCountry}`,
    currentStatus: "Failed to pickup",
    pickupId: updateRequest.pickupId,
    pickupStatus: "Failed",
    shippingId: null,
    shippingStatus: "Not assigned",
    updatedBy: updateRequest.updatedBy,
  };
};

export const mapAssignShipment = (existingOrder, updateRequest) => {
  return {
    operationType: updateRequest.operationType,
    orderId: existingOrder.id,
    currentLocation: `In ${existingOrder.pickupDetails.pickupCountry} storage facility`,
    currentStatus: "In shipping process",
    pickupId: null,
    pickupStatus: "Success",
    shippingId: updateRequest.shippingId,
    shippingStatus: "Assigned for shipping",
    updatedBy: updateRequest.updatedBy,
  };
};

export const mapShipmentSuccess = (existingOrder, updateRequest) => {
  return {
    operationType: updateRequest.operationType,
    orderId: existingOrder.id,
    currentLocation: `${existingOrder.shippingDetails.shippingCity}, ${existingOrder.shippingDetails.shippingCountry}`,
    currentStatus: `In ${existingOrder.shippingDetails.shippingCountry} storage facility`,
    pickupId: null,
    pickupStatus: "Success",
    shippingId: updateRequest.shippingId,
    shippingStatus: "Shipped",
    updatedBy: updateRequest.updatedBy,
  };
}

export const mapDeliverySuccess = (existingOrder, updateRequest) => {
  return {
    operationType: updateRequest.operationType,
    orderId: existingOrder.id,
    currentLocation: `${existingOrder.shippingDetails.shippingAddress}, ${existingOrder.shippingDetails.shippingCity}, ${existingOrder.shippingDetails.shippingCountry}`,
    currentStatus: `Delivered`,
    pickupId: null,
    pickupStatus: "Success",
    shippingId: null,
    shippingStatus: "Success",
    updatedBy: updateRequest.updatedBy,
  };
}
