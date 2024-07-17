import Customer from "../models/Customer";
import Order from "../models/Order";
import { connectToDB } from "../mongoDB"
import RawMaterial from '../models/RawMaterial';
import Polish from "../models/Polish";
import Color from "../models/Color";

export const getTotalSales = async () => {
  await connectToDB();
  const orders = await Order.find()
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
  return { totalOrders, totalRevenue }
}

export const getTotalRaw = async () => {
  await connectToDB();
  const rawMaterials = await RawMaterial.find()
  const totalGross = rawMaterials.reduce((acc, rawMaterial) => acc + rawMaterial.gross, 0);
  return totalGross;
}

export const getTotalPolish = async () => {
  await connectToDB();
  const polishes = await Polish.find()
  const totalGross = polishes.reduce((acc, polish) => acc + polish.gross, 0);
  return totalGross;
}

export const getTotalColor = async () => {
  await connectToDB();
  const colors = await Color.find()
  const totalGross = colors.reduce((acc, color) => acc + color.gross, 0);
  return totalGross;
}

export const getTotalCustomers = async () => {
  await connectToDB();
  const customers = await Customer.find()
  const totalCustomers = customers.length
  return totalCustomers
}

export const getSalesPerMonth = async () => {
  await connectToDB()
  const orders = await Order.find()

  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth(); // 0 for Janruary --> 11 for December
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    // For June
    // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
    return acc
  }, {})

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
    // if i === 5 => month = "Jun"
    return { name: month, sales: salesPerMonth[i] || 0 }
  })

  return graphData
}