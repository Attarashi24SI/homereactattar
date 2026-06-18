import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./Badge";
import DataTable from "./DataTable";
import { useTheme } from "../context/ThemeContext";

const formatDate = (date) => new Date(date).toLocaleDateString("id-ID");

const formatPrice = (price) => new Intl.NumberFormat("id-ID").format(price);

const OrderTable = ({ orders, compact }) => {
    const { isLight } = useTheme();

    return (
        <DataTable
            columns={["Order ID", "Pelanggan", "Tanggal", "Total", "Status"]}
            compact={compact}
        >
            {orders.map((order) => (
                <tr
                    key={order.orderId}
                    className={`border-t transition ${isLight ? "border-slate-100 hover:bg-white" : "border-white/5 hover:bg-white/5"}`}
                >
                    <td className={`px-5 py-4 ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                        {order.orderId}
                    </td>
                    <td className={`px-5 py-4 font-medium ${isLight ? "text-slate-700" : "text-white"}`}>
                        <Link
                            to={`/orders/${order.orderId}`}
                            className="text-teal-500 hover:text-teal-600"
                        >
                            {order.customerName || order.customerId}
                        </Link>
                    </td>
                    <td className="px-5 py-4">{formatDate(order.date)}</td>
                    <td className="px-5 py-4">Rp {formatPrice(order.total)}</td>
                    <td className="px-5 py-4">
                        <StatusBadge status={order.status} isLight={isLight} />
                    </td>
                </tr>
            ))}
        </DataTable>
    );
};

export default OrderTable;
