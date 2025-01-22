import Order from "../orders/model/order.model.js";
import Product from "../products/model/product.model.js";
import User from "../users/model/user.model.js";

const getAnalysisData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

const getDailySalesData = async (startDate, endDate) => {
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  const dateArray = getDatesInRange(startDate, endDate);
  return dateArray.map((date) => {
    const foundata = salesData.find((item) => item._id === date.toISOString());
    return {
      date,
      sales: foundata.sales || 0,
      revenue: foundata.sales || 0,
    };
  });
};

function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(new Date(date.toISOString().split("T")[0]));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

export const AnalysisService = { getAnalysisData, getDailySalesData };
