import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, MessageSquareText, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import FeedbackForm from "../components/FeedbackForm";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import laundryPortalAPI, { formatCurrency } from "../services/laundryPortalAPI";

export default function History() {
    const { isLight } = useTheme();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [feedbackMap, setFeedbackMap] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const fetchData = async () => {
        const data = await laundryPortalAPI.fetchOrders(user);
        setOrders(data);

        // Load feedback for all completed orders
        const completedIds = data
            .filter((order) => order.current_step === "Completed")
            .map((order) => order.id);

        if (completedIds.length > 0) {
            const fbMap = await laundryPortalAPI.fetchFeedbackForOrders(completedIds);
            setFeedbackMap(fbMap);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const completedOrders = useMemo(
        () => orders.filter((order) => order.current_step === "Completed"),
        [orders],
    );

    const handleBeriUlasan = (order) => {
        setSelectedOrder(order);
        setShowFeedbackForm(true);
    };

    const handleFeedbackSuccess = () => {
        fetchData();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < rating ? "#f59e0b" : "transparent"}
                stroke={i < rating ? "#f59e0b" : "#d1d5db"}
                strokeWidth={1.5}
            />
        ));
    };

    return (
        <main className="space-y-6">
            <PageHeader title="History" breadcrumb={["Home", "History"]} />

            <DataTable columns={["Invoice", "Service", "Completed At", "Final Price", "Points", "Ulasan", "Detail"]}>
                {completedOrders.map((order) => {
                    const feedback = feedbackMap[order.id];
                    return (
                        <tr key={order.id} className={`border-t transition ${isLight ? "border-slate-100 hover:bg-white" : "border-white/5 hover:bg-white/5"}`}>
                            <td className={`px-5 py-4 font-semibold ${isLight ? "text-teal-700" : "text-teal-300"}`}>{order.invoice_number}</td>
                            <td className={`px-5 py-4 ${isLight ? "text-slate-700" : "text-white"}`}>{order.service_name}</td>
                            <td className={`px-5 py-4 ${isLight ? "text-slate-500" : "text-gray-400"}`}>{order.updated_at ? new Date(order.updated_at).toLocaleDateString("id-ID") : "-"}</td>
                            <td className={`px-5 py-4 ${isLight ? "text-slate-700" : "text-gray-200"}`}>{formatCurrency(order.final_amount)}</td>
                            <td className={`px-5 py-4 ${isLight ? "text-slate-700" : "text-gray-200"}`}>{order.points_earned || 0} pts</td>
                            <td className="px-5 py-4">
                                {feedback ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            {renderStars(feedback.rating)}
                                        </div>
                                        {feedback.comment && (
                                            <p className={`max-w-[200px] truncate text-xs ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                                "{feedback.comment}"
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${isLight ? "text-teal-600" : "text-teal-400"}`}>
                                                <CheckCircle2 className="h-3 w-3" />
                                                Sudah Diulas
                                            </span>
                                            <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-gray-500"}`}>
                                                {new Date(feedback.created_at).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleBeriUlasan(order)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-all hover:bg-teal-100 hover:shadow-md"
                                    >
                                        <MessageSquareText className="h-3.5 w-3.5" />
                                        Beri Ulasan
                                    </button>
                                )}
                            </td>
                            <td className="px-5 py-4">
                                <Link to={`/tracking/${order.invoice_number}`} className={isLight ? "font-semibold text-teal-700 hover:text-teal-800" : "font-semibold text-teal-300 hover:text-teal-200"}>
                                    Open Invoice
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </DataTable>

            {!completedOrders.length && (
                <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Belum ada completed order.</p>
            )}

            {/* Feedback Form Dialog */}
            {selectedOrder && (
                <FeedbackForm
                    open={showFeedbackForm}
                    onOpenChange={setShowFeedbackForm}
                    order={selectedOrder}
                    user={user}
                    onSuccess={handleFeedbackSuccess}
                />
            )}
        </main>
    );
}
