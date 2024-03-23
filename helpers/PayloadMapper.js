export const mapCancelUpdate = (cancelUpdate, existingOrder) => {
  return {
    currentLocation: existingOrder.currentLocation,
    currentStatus: "Cancelled",
    updatedBy: existingOrder.clientEmail,
    additionalInfo: "Order was cancelled by the client!",
    ...cancelUpdate,
  };
};
