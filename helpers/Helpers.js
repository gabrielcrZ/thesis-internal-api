export const mapOrderUpdate = (order, orderUpdate) => {
  return {
    orderId: order.id,
    clientEmail: order.clientEmail,
    products: order.products,
    departFrom: order.departFrom,
    shipTo: order.shipTo,
    shipmentWeight: order.shipmentWeight,
    currentLocation: orderUpdate.currentLocation,
    currentStatus: orderUpdate.currentStatus,
    createdAt: order.createdAt,
    updatedAt: orderUpdate.updatedAt,
    updatedBy: orderUpdate.updatedBy,
    additionalInfo: orderUpdate.additionalInfo,
  };
};
