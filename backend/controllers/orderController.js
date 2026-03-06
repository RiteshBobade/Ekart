import axios from "axios";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

// Cashfree REST API client - no SDK needed
const cashfreeAPI = axios.create({
  baseURL: "https://sandbox.cashfree.com/pg",
  headers: {
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    "x-api-version": "2023-08-01",
    "Content-Type": "application/json",
  },
});

// --- Function 1: Create Order ---
export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, customerDetails } = req.body;
    const orderId = "ORD_" + Date.now();

    const response = await cashfreeAPI.post("/orders", {
      order_id: orderId,
      order_amount: Number(amount).toFixed(2),
      order_currency: "INR",
      customer_details: {
        customer_id: customerDetails.customer_id,
        customer_phone: customerDetails.customer_phone,
        customer_email: customerDetails.customer_email,
        customer_name: customerDetails.customer_name || "Customer",
      },
    });

    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      status: "Pending",
      cashfreeOrderId: orderId,
    });

    await newOrder.save();

    res.json({
      success: true,
      payment_session_id: response.data.payment_session_id,
      order_id: orderId,
    });
  } catch (error) {
    console.error("======= CASHFREE CREATE ERROR =======");
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .json({ success: false, message: "Payment initialization failed" });
  }
};

// --- Function 2: Verify Payment ---
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const response = await cashfreeAPI.get(`/orders/${orderId}`);

    if (response.data.order_status === "PAID") {
      await Order.findOneAndUpdate(
        { cashfreeOrderId: orderId },
        { status: "Paid" },
      );

      await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { items: [], totalPrice: 0 } },
      );

      return res.json({
        success: true,
        message: "Payment Verified Successfully",
      });
    }

    res.status(400).json({ success: false, message: "Payment not completed" });
  } catch (error) {
    console.error("======= CASHFREE VERIFY ERROR =======");
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Function 3: Get My Orders ---
export const getMyOrder = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ fixed: was req.body

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Function 3: Get My Orders (Admins Only) ---
export const getuserOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching user order", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// --- Function 3: Get All Orders ---
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("products.productId", "productName productPrice");

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failded to fetch all orders",
      error: error.message,
    });
  }
};

//

export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({ status: "Paid" });

    // Total sales amount
    const totalSaleAgg = await Order.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSales = Number((totalSaleAgg[0]?.total || 0).toFixed(2));

    //sales group by date(last 30 days)
    const thirtydaysAgo = new Date();
    thirtydaysAgo.setDate(thirtydaysAgo.getDate() - 30);
    const salesByDate = await Order.aggregate([
      { $match: { status: "Paid", createdAt: { $gte: thirtydaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedSales = salesByDate.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));

    res.json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      sales: formattedSales,
    });
  } catch (error) {
    console.error("Error fetching sales data", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
