import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ordersData from "../assets/data/OrderData.json";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function Orders() {
  const { isLight } = useTheme();
  const [orders, setOrders] = useState(ordersData);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    status: "Pending",
    totalPrice: "",
    orderDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddOrder = (e) => {
    e.preventDefault();

    if (formData.customerName && formData.totalPrice && formData.orderDate) {
      setOrders([
        ...orders,
        {
          id: Math.max(...orders.map((order) => Number(order.id)), 0) + 1,
          ...formData,
          totalPrice: Number(formData.totalPrice),
        },
      ]);

      setFormData({
        customerName: "",
        status: "Pending",
        totalPrice: "",
        orderDate: "",
      });

      setShowForm(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return isLight
          ? "bg-emerald-100 text-emerald-700"
          : "bg-green-500 text-white";
      case "Pending":
        return isLight ? "bg-sky-100 text-sky-700" : "bg-yellow-400 text-white";
      case "Cancelled":
        return isLight ? "bg-rose-100 text-rose-700" : "bg-red-500 text-white";
      default:
        return isLight
          ? "bg-slate-100 text-slate-700"
          : "bg-gray-400 text-white";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400 ${
    isLight
      ? "border-slate-100 bg-white text-slate-700 placeholder:text-slate-400"
      : "border-white/10 bg-[#0f1724] text-white placeholder:text-gray-500"
  }`;

  return (
    <main className="space-y-6">
      <PageHeader title="Orders" breadcrumb={["Home", "Orders"]} />
      {/* BUTTON */}
      <div>
        <button
          onClick={() => setShowForm(true)}
          className={`${isLight ? "bg-rose-400 hover:bg-rose-500" : "bg-emerald-500 hover:bg-emerald-600"} text-white px-4 py-2 rounded-md`}
        >
          + Add Order
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div
          className={`rounded-lg border p-4 shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 shadow-teal-100" : "border-white/5 bg-[#06090f] shadow-black/30"}`}
        >
          <h2
            className={`mb-3 text-base font-semibold ${isLight ? "text-teal-600" : "text-white"}`}
          >
            Add New Order
          </h2>
          <form onSubmit={handleAddOrder} className="grid gap-3 md:grid-cols-4">
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={handleInputChange}
              className={inputClass}
              required
            />

            <input
              type="number"
              name="totalPrice"
              placeholder="Total Price"
              value={formData.totalPrice}
              onChange={handleInputChange}
              className={inputClass}
              required
            />

            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleInputChange}
              className={inputClass}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={inputClass}
            >
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <div className="flex justify-end gap-3 md:col-span-4">
              <button
                type="submit"
                className={`${isLight ? "bg-rose-400 hover:bg-rose-500" : "bg-emerald-500 hover:bg-emerald-600"} rounded-lg px-5 py-2 text-sm font-semibold text-white`}
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`rounded-lg border px-5 py-2 text-sm font-semibold ${isLight ? "border-slate-100 bg-white text-slate-500 hover:bg-teal-50" : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div
        className={`${showForm ? "max-h-[260px]" : "max-h-[360px]"} overflow-auto rounded-lg border shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 shadow-teal-100" : "border-white/5 bg-[#06090f] shadow-black/30"}`}
      >
        <table
          className={`w-full min-w-[760px] text-left text-sm ${isLight ? "text-slate-700" : "text-gray-300"}`}
        >
          <thead
            className={`sticky top-0 z-10 text-xs uppercase tracking-wide ${isLight ? "bg-white text-slate-400" : "bg-[#0f1724] text-gray-400"}`}
          >
            <tr>
              <th className="px-5 py-4 font-semibold">Order ID</th>
              <th className="px-5 py-4 font-semibold">Customer</th>
              <th className="px-5 py-4 font-semibold">Date</th>
              <th className="px-5 py-4 font-semibold">Total</th>
              <th className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className={`border-t transition ${isLight ? "border-slate-100 hover:bg-white" : "border-white/5 hover:bg-white/5"}`}
              >
                <td
                  className={`px-5 py-4 ${isLight ? "text-slate-500" : "text-gray-400"}`}
                >
                  {order.id}
                </td>
                <td
                  className={`px-5 py-4 font-medium ${isLight ? "text-slate-700" : "text-white"}`}
                >
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-emerald-400 hover:text-emerald-500"
                  >
                    {order.customerName}
                  </Link>
                </td>
                <td className="px-5 py-4">{formatDate(order.orderDate)}</td>
                <td className="px-5 py-4">
                  Rp {formatPrice(order.totalPrice)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`${getStatusColor(
                      order.status,
                    )} px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
