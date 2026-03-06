import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();

  return (
    <div className="pr-10 flex flex-col gap-3">
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        {/* No orders */}
        {!userOrder || userOrder.length === 0 ? (
          <p className="text-gray-800 text-2xl">No orders found for this user</p>
        ) : (
          <div className="space-y-6 w-full">
            {userOrder.map((order) => (
              <div
                key={order._id}
                className="shadow-lg rounded-2xl p-5 border border-gray-200"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Order Id: <span className="text-gray-600">{order._id}</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Amount:{" "}
                    <span className="font-bold">
                      {order.currency} {order?.amount?.toFixed?.(2) || "0.00"}
                    </span>
                  </p>
                </div>

                {/* User Info & Status */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">User:</span>{" "}
                      {order.user?.firstName || "Unknown"} {order.user?.lastName || ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {order.user?.email || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`${
                      order.status === "Paid"
                        ? "bg-green-500"
                        : order.status === "Failed"
                        ? "bg-red-500"
                        : "bg-orange-300"
                    } text-white px-2 py-1 rounded-lg`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Products List */}
                <div>
                  <h3 className="font-medium mb-2">Products:</h3>
                  <ul className="space-y-2">
                    {(order.products || []).map((product, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <img
                          onClick={() =>
                            navigate(`/products/${product?.productId?._id}`)
                          }
                          className="w-20 h-20 object-cover cursor-pointer rounded-md"
                          src={product.productId?.productImg?.[0]?.url}
                          alt={product.productId?.productName || 'Product Image'}
                        />
                        <span className="w-[200px] line-clamp-2">
                          {product.productId?.productName || 'Unnamed Product'}
                        </span>
                        <span className="text-gray-500">{product.productId?._id}</span>
                        <span className="font-medium">
                          ₹{product.productId?.productPrice || 0} x {product.quantity || 0}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;