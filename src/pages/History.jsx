import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import laundryPortalAPI, { formatCurrency } from "../services/laundryPortalAPI";

export default function History() {
    const { isLight } = useTheme();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        laundryPortalAPI.fetchOrders(user).then(setOrders);
    }, [user]);

    const completedOrders = useMemo(
        () => orders.filter((order) => order.current_step === "Completed"),
        [orders],
    );

    return (
        <main className="space-y-6">
            <PageHeader title="History" breadcrumb={["Home", "History"]} />
            <DataTable columns={["Invoice", "Service", "Completed At", "Final Price", "Points", "Detail"]}>
                {completedOrders.map((order) => (
                    <tr key={order.id} className={`border-t transition ${isLight ? "border-slate-100 hover:bg-white" : "border-white/5 hover:bg-white/5"}`}>
                        <td className={`px-5 py-4 font-semibold ${isLight ? "text-teal-700" : "text-teal-300"}`}>{order.invoice_number}</td>
                        <td className={`px-5 py-4 ${isLight ? "text-slate-700" : "text-white"}`}>{order.service_name}</td>
                        <td className={`px-5 py-4 ${isLight ? "text-slate-500" : "text-gray-400"}`}>{order.updated_at ? new Date(order.updated_at).toLocaleDateString("id-ID") : "-"}</td>
                        <td className={`px-5 py-4 ${isLight ? "text-slate-700" : "text-gray-200"}`}>{formatCurrency(order.final_amount)}</td>
                        <td className={`px-5 py-4 ${isLight ? "text-slate-700" : "text-gray-200"}`}>{order.points_earned || 0} pts</td>
                        <td className="px-5 py-4">
                            <Link to={`/tracking/${order.invoice_number}`} className={isLight ? "font-semibold text-teal-700 hover:text-teal-800" : "font-semibold text-teal-300 hover:text-teal-200"}>
                                Open Invoice
                            </Link>
                        </td>
                    </tr>
                ))}
            </DataTable>
            {!completedOrders.length && (
                <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Belum ada completed order.</p>
            )}
        </main>
    );
}

