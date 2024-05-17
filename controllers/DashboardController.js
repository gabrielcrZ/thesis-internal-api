import {
  clientModel,
  orderModel,
  ordersHistoryModel,
  deliveryModel,
} from "../models/Models.js";

export const getDashboardMetrics = async (req, res) => {
  const cardsInfo = {
    totalOrders: 0,
    unprocessedOrders: {
      thisYear: 0,
      lastYear: 0,
    },
    operationalCosts: {
      thisYear: 0,
      lastYear: 0,
    },
    revenue: {
      thisYear: 0,
      lastYear: 0,
    },
  };
  const stackedBarChartInfo = {
    pickedUp: {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
    },
    shipped: {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
    },
    delivered: {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
    },
  };
  const barChartInfo = {
    Q1: {
      currentYear: 0,
      lastYear: 0,
    },
    Q2: {
      currentYear: 0,
      lastYear: 0,
    },
    Q3: {
      currentYear: 0,
      lastYear: 0,
    },
    Q4: {
      currentYear: 0,
      lastYear: 0,
    },
  };
  const lineChartInfo = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  };

  try {
    //Cards info
    cardsInfo.totalOrders = await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .countDocuments();
    cardsInfo.unprocessedOrders.thisYear = await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .where("currentStatus", "Registered by client")
      .countDocuments();
    cardsInfo.unprocessedOrders.lastYear = await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear() - 1}-01-01`)
      .lte(`${new Date().getFullYear() - 1}-12-31`)
      .where("currentStatus", "Registered by client")
      .countDocuments();
    await deliveryModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .then((foundDeliveries) => {
        foundDeliveries.forEach(
          (x) =>
            (cardsInfo.operationalCosts.thisYear += parseInt(
              x.estimatedDeliveryCost
            ))
        );
      });
    await deliveryModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear() - 1}-01-01`)
      .lte(`${new Date().getFullYear() - 1}-12-31`)
      .then((foundDeliveries) => {
        foundDeliveries.forEach(
          (x) =>
            (cardsInfo.operationalCosts.lastYear += parseInt(
              x.estimatedDeliveryCost
            ))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .then((foundOrders) => {
        foundOrders.forEach((x) => {
          cardsInfo.revenue.thisYear += parseInt(x.estimatedRevenue);
        });
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear() - 1}-01-01`)
      .lte(`${new Date().getFullYear() - 1}-12-31`)
      .then((foundOrders) => {
        foundOrders.forEach((x) => {
          cardsInfo.revenue.lastYear += parseInt(x.estimatedRevenue);
        });
      });

    //Cards info end

    //Stacked bar chart
    stackedBarChartInfo.pickedUp.Q1 = await ordersHistoryModel
      .find()
      .where("operationType", "Pickup success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-03-31`)
      .countDocuments();
    stackedBarChartInfo.pickedUp.Q2 = await ordersHistoryModel
      .find()
      .where("operationType", "Pickup success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-04-01`)
      .lte(`${new Date().getFullYear()}-06-30`)
      .countDocuments();
    stackedBarChartInfo.pickedUp.Q3 = await ordersHistoryModel
      .find()
      .where("operationType", "Pickup success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-07-01`)
      .lte(`${new Date().getFullYear()}-09-30`)
      .countDocuments();
    stackedBarChartInfo.pickedUp.Q4 = await ordersHistoryModel
      .find()
      .where("operationType", "Pickup success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-10-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .countDocuments();
    stackedBarChartInfo.shipped.Q1 = await ordersHistoryModel
      .find()
      .where("operationType", "Shipping success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-03-31`)
      .countDocuments();
    stackedBarChartInfo.shipped.Q2 = await ordersHistoryModel
      .find()
      .where("operationType", "Shipping success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-04-01`)
      .lte(`${new Date().getFullYear()}-06-30`)
      .countDocuments();
    stackedBarChartInfo.shipped.Q3 = await ordersHistoryModel
      .find()
      .where("operationType", "Shipping success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-07-01`)
      .lte(`${new Date().getFullYear()}-09-30`)
      .countDocuments();
    stackedBarChartInfo.shipped.Q4 = await ordersHistoryModel
      .find()
      .where("operationType", "Shipping success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-10-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .countDocuments();
    stackedBarChartInfo.delivered.Q1 = await ordersHistoryModel
      .find()
      .where("operationType", "Delivery success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-03-31`)
      .countDocuments();
    stackedBarChartInfo.delivered.Q2 = await ordersHistoryModel
      .find()
      .where("operationType", "Delivery success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-04-01`)
      .lte(`${new Date().getFullYear()}-06-30`)
      .countDocuments();
    stackedBarChartInfo.delivered.Q3 = await ordersHistoryModel
      .find()
      .where("operationType", "Delivery success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-07-01`)
      .lte(`${new Date().getFullYear()}-09-30`)
      .countDocuments();
    stackedBarChartInfo.delivered.Q4 = await ordersHistoryModel
      .find()
      .where("operationType", "Delivery success")
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-10-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .countDocuments();
    //Stacked bar chart end

    //Bar chart
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-03-31`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q1.currentYear += parseInt(x.estimatedRevenue))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear() - 1}-01-01`)
      .lte(`${new Date().getFullYear() - 1}-03-31`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q1.lastYear += parseInt(x.estimatedRevenue))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-04-01`)
      .lte(`${new Date().getFullYear()}-06-30`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q2.currentYear += parseInt(x.estimatedRevenue))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear() - 1}-04-01`)
      .lte(`${new Date().getFullYear() - 1}-06-30`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q2.lastYear += parseInt(x.estimatedRevenue))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-07-01`)
      .lte(`${new Date().getFullYear()}-09-30`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q3.currentYear += parseInt(x.estimatedRevenue))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear() - 1}-07-01`)
      .lte(`${new Date().getFullYear() - 1}-09-30`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q3.lastYear += parseInt(x.estimatedRevenue))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-10-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q4.currentYear += parseInt(x.estimatedRevenue))
        );
      });
    await orderModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear() - 1}-10-01`)
      .lte(`${new Date().getFullYear() - 1}-12-31`)
      .then((foundOrders) => {
        foundOrders.forEach(
          (x) => (barChartInfo.Q4.lastYear += parseInt(x.estimatedRevenue))
        );
      });
    //Bar chart end

    //Line chart
    await deliveryModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-01-01`)
      .lte(`${new Date().getFullYear()}-03-31`)
      .then((foundDeliveries) => {
        foundDeliveries.forEach(
          (x) => (lineChartInfo.Q1 += parseInt(x.estimatedDeliveryCost))
        );
      });
    await deliveryModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-04-01`)
      .lte(`${new Date().getFullYear()}-06-30`)
      .then((foundDeliveries) => {
        foundDeliveries.forEach(
          (x) => (lineChartInfo.Q2 += parseInt(x.estimatedDeliveryCost))
        );
      });
    await deliveryModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-07-01`)
      .lte(`${new Date().getFullYear()}-09-30`)
      .then((foundDeliveries) => {
        foundDeliveries.forEach(
          (x) => (lineChartInfo.Q3 += parseInt(x.estimatedDeliveryCost))
        );
      });
    await deliveryModel
      .find()
      .where("createdAt")
      .gte(`${new Date().getFullYear()}-10-01`)
      .lte(`${new Date().getFullYear()}-12-31`)
      .then((foundDeliveries) => {
        foundDeliveries.forEach(
          (x) => (lineChartInfo.Q4 += parseInt(x.estimatedDeliveryCost))
        );
      });

    //Line chart end
    res.status(200).json({
      cards: cardsInfo,
      stackedBarChart: stackedBarChartInfo,
      barChart: barChartInfo,
      lineChart: lineChartInfo,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
