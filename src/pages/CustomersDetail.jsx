import { useParams, Link } from "react-router-dom";
import customersData from "../assets/data/customer.json";
import ordersData from "../assets/data/order.json";
import PageHeader from "../components/PageHeader";
import OrderTable from "../components/OrderTable";
import { useTheme } from "../context/ThemeContext";

export default function CustomersDetail() {
  const { id } = useParams();
  const { isLight } = useTheme();

  const customer = customersData.find((c) => c.id === id);

  if (!customer) {
    return <div className="p-6 text-red-500">Customer not found.</div>;
  }

  const customerOrders = ordersData
    .filter((order) => order.customerId === id)
    .map((order) => ({ ...order, customerName: customer.fullName }));

  return (
    <main className="space-y-6">
      <PageHeader
        title="Customer Detail"
        breadcrumb={["Home", "Customers", customer.fullName]}
      />

      <div className={`p-6 rounded-2xl border ${isLight ? "bg-white border-slate-100 shadow-sm" : "bg-white/5 border-white/10"}`}>
        <h2 className={`text-xl font-bold mb-4 ${isLight ? "text-slate-800" : "text-white"}`}>
          Informasi Pelanggan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>ID Pelanggan</p>
            <p className={`font-semibold ${isLight ? "text-slate-700" : "text-gray-200"}`}>{customer.id}</p>
          </div>
          <div>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Nama Lengkap</p>
            <p className={`font-semibold ${isLight ? "text-slate-700" : "text-gray-200"}`}>{customer.fullName}</p>
          </div>
          <div>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Username</p>
            <p className={`font-semibold ${isLight ? "text-slate-700" : "text-gray-200"}`}>{customer.username}</p>
          </div>
          <div>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Jenis Kelamin</p>
            <p className={`font-semibold ${isLight ? "text-slate-700" : "text-gray-200"}`}>{customer.gender === "L" ? "Laki-laki" : "Perempuan"}</p>
          </div>
          <div>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>Tanggal Lahir</p>
            <p className={`font-semibold ${isLight ? "text-slate-700" : "text-gray-200"}`}>{new Date(customer.birthDate).toLocaleDateString("id-ID")}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className={`text-lg font-bold mb-4 ${isLight ? "text-slate-800" : "text-white"}`}>
          Riwayat Transaksi
        </h3>
        {customerOrders.length > 0 ? (
          <OrderTable orders={customerOrders} />
        ) : (
          <p className={isLight ? "text-slate-500" : "text-gray-400"}>Belum ada transaksi.</p>
        )}
      </div>
    </main>
  );
}
