import { useState } from "react";
import customersData from "../assets/data/CustomersData.json";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function Customers() {
  const { isLight } = useTheme();
  const [customers, setCustomers] = useState(customersData);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    loyalty: "Bronze",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();

    if (formData.name && formData.email && formData.phone) {
      const newCustomer = {
        id: customers.length + 1,
        ...formData,
      };

      setCustomers([...customers, newCustomer]);

      setFormData({
        name: "",
        email: "",
        phone: "",
        loyalty: "Bronze",
      });

      setShowForm(false);
    }
  };

  const getLoyaltyBgColor = (loyalty) => {
    switch (loyalty) {
      case "Gold":
        return "bg-amber-400";
      case "Silver":
        return "bg-gray-300";
      case "Bronze":
        return "bg-orange-600";
      default:
        return "bg-gray-300";
    }
  };

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400 ${isLight
    ? "border-slate-100 bg-white text-slate-700 placeholder:text-slate-400"
    : "border-white/10 bg-[#0f1724] text-white placeholder:text-gray-500"
    }`;

  return (


        <main className="space-y-6">
          <PageHeader
  title="Customers"
  breadcrumb={["Home", "Customers"]}
/>

          {/* BUTTON */}
          <div>
            <button
              onClick={() => setShowForm(true)}
              className={`${isLight ? "bg-rose-400 hover:bg-rose-500" : "bg-emerald-500 hover:bg-emerald-600"} text-white px-4 py-2 rounded-md`}
            >
              + Add Customer
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <div className={`rounded-lg border p-4 shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 shadow-teal-100" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
              <h2 className={`mb-3 text-base font-semibold ${isLight ? "text-teal-600" : "text-white"}`}>
                Add New Customer
              </h2>

              <form
                onSubmit={handleAddCustomer}
                className="grid gap-3 md:grid-cols-4"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />

                <select
                  name="loyalty"
                  value={formData.loyalty}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
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
          <div className={`${showForm ? "max-h-[260px]" : "max-h-[360px]"} overflow-auto rounded-lg border shadow-2xl ${isLight ? "border-teal-100 bg-teal-50 shadow-teal-100" : "border-white/5 bg-[#06090f] shadow-black/30"}`}>
            <table className={`w-full min-w-[760px] text-left text-sm ${isLight ? "text-slate-700" : "text-gray-300"}`}>
              <thead className={`sticky top-0 z-10 text-xs uppercase tracking-wide ${isLight ? "bg-white text-slate-400" : "bg-[#0f1724] text-gray-400"}`}>
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Loyalty</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className={`border-t transition ${isLight ? "border-slate-100 hover:bg-white" : "border-white/5 hover:bg-white/5"}`}>
                    <td className={`px-5 py-4 ${isLight ? "text-slate-500" : "text-gray-400"}`}>{c.id}</td>
                    <td className={`px-5 py-4 font-medium ${isLight ? "text-slate-700" : "text-white"}`}>
                      <Link to={`/customers/${c.id}`} className="hover:underline">
                        {c.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4">{c.email}</td>
                    <td className="px-5 py-4">{c.phone}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`${getLoyaltyBgColor(
                          c.loyalty
                        )} text-white px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {c.loyalty}
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
