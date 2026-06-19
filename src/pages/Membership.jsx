import { useState, useMemo } from "react";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import DataTable from "../components/DataTable";
import { useTheme } from "../context/ThemeContext";
import { Badge } from "../components/ui/badge";
import { Search, Filter } from "lucide-react";
import membershipData from "../assets/data/membership.json";
import customerData from "../assets/data/customer.json";

// Build a lookup map: customerId -> customer info
const customerMap = new Map(customerData.map((c) => [c.id, c]));

// Enrich membership data with customer name
const memberships = membershipData.map((m) => {
    const customer = customerMap.get(m.customerId);
    return {
        ...m,
        customerName: customer?.fullName || m.customerId,
        customerUsername: customer?.username || "-",
    };
});

export default function Membership() {
    const { isLight } = useTheme();
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("All");

    // Metrics
    const totalMembers = memberships.length;
    const silverCount = memberships.filter((m) => m.membershipLevel === "Silver").length;
    const goldCount = memberships.filter((m) => m.membershipLevel === "Gold").length;
    const activeCount = memberships.filter((m) => m.isActive).length;

    const metrics = [
        {
            label: "Total Member",
            value: totalMembers,
            change: `${activeCount} aktif`,
            positive: true,
            description: "seluruh membership",
        },
        {
            label: "Silver",
            value: silverCount,
            change: `${((silverCount / totalMembers) * 100).toFixed(0)}%`,
            positive: true,
            description: "dari total member",
        },
        {
            label: "Gold",
            value: goldCount,
            change: `${((goldCount / totalMembers) * 100).toFixed(0)}%`,
            positive: true,
            description: "dari total member",
        },
        {
            label: "Member Aktif",
            value: activeCount,
            change: `${((activeCount / totalMembers) * 100).toFixed(0)}%`,
            positive: true,
            description: "status aktif",
        },
    ];

    // Filtered data
    const filtered = useMemo(() => {
        return memberships.filter((m) => {
            const matchSearch =
                m.membershipId.toLowerCase().includes(search.toLowerCase()) ||
                m.customerName.toLowerCase().includes(search.toLowerCase()) ||
                m.customerId.toLowerCase().includes(search.toLowerCase()) ||
                m.referralCode.toLowerCase().includes(search.toLowerCase());

            const matchLevel =
                levelFilter === "All" || m.membershipLevel === levelFilter;

            return matchSearch && matchLevel;
        });
    }, [search, levelFilter]);

    const levelBadge = (level) => {
        const base = "capitalize font-semibold";
        if (level === "Gold") {
            return isLight
                ? `${base} bg-amber-100 text-amber-800`
                : `${base} bg-amber-500/20 text-amber-300`;
        }
        return isLight
            ? `${base} bg-slate-100 text-slate-700`
            : `${base} bg-slate-800 text-slate-300`;
    };

    const statusBadge = (status) => {
        const base = "capitalize font-semibold";
        if (status === "Active") {
            return isLight
                ? `${base} bg-emerald-100 text-emerald-800`
                : `${base} bg-emerald-500/20 text-emerald-300`;
        }
        return isLight
            ? `${base} bg-red-100 text-red-800`
            : `${base} bg-red-500/20 text-red-300`;
    };

    return (
        <main className="space-y-5">
            <PageHeader title="Membership" breadcrumb={["Home", "Membership"]} />

            {/* Metric Cards */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                ))}
            </section>

            {/* Filters */}
            <section
                className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                    isLight
                        ? "border-slate-200/80 bg-white shadow-slate-200/70"
                        : "border-white/5 bg-[#06090f]/95 shadow-black/35"
                }`}
            >
                {/* Search */}
                <div
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition focus-within:ring-2 ${
                        isLight
                            ? "border-slate-200 bg-slate-50 focus-within:border-teal-400 focus-within:ring-teal-100"
                            : "border-white/10 bg-white/5 focus-within:ring-white/10"
                    }`}
                >
                    <Search className={`h-4 w-4 ${isLight ? "text-teal-600" : "text-gray-400"}`} />
                    <input
                        type="text"
                        placeholder="Cari member ID, nama, atau referral..."
                        className={`w-full bg-transparent text-sm font-medium outline-none ${
                            isLight
                                ? "text-slate-700 placeholder:text-slate-400"
                                : "text-white placeholder:text-gray-500"
                        }`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Level Filter */}
                <div className="flex items-center gap-2">
                    <Filter className={`h-4 w-4 ${isLight ? "text-slate-500" : "text-gray-400"}`} />
                    {["All", "Silver", "Gold"].map((level) => (
                        <button
                            key={level}
                            onClick={() => setLevelFilter(level)}
                            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                                levelFilter === level
                                    ? isLight
                                        ? "bg-teal-600 text-white shadow-md"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
                                    : isLight
                                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </section>

            {/* Result Info */}
            <p className={`text-sm font-medium ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                Menampilkan <span className={isLight ? "text-teal-700 font-bold" : "text-emerald-300 font-bold"}>{filtered.length}</span> dari {totalMembers} member
            </p>

            {/* Table */}
            <DataTable
                columns={[
                    "Membership ID",
                    "Customer",
                    "Customer ID",
                    "Level",
                    "Status",
                    "Register Date",
                    "Referral Code",
                ]}
            >
                {filtered.slice(0, 50).map((m) => (
                    <tr
                        key={m.membershipId}
                        className={`transition-colors ${
                            isLight ? "hover:bg-teal-50/70" : "hover:bg-white/5"
                        }`}
                    >
                        <td
                            className={`border-b px-6 py-4 font-semibold ${
                                isLight
                                    ? "border-slate-100 text-teal-700"
                                    : "border-white/5 text-gray-400"
                            }`}
                        >
                            {m.membershipId}
                        </td>
                        <td
                            className={`border-b px-6 py-4 font-semibold ${
                                isLight
                                    ? "border-slate-100 text-slate-900"
                                    : "border-white/5 text-white"
                            }`}
                        >
                            {m.customerName}
                        </td>
                        <td
                            className={`border-b px-6 py-4 ${
                                isLight
                                    ? "border-slate-100 text-slate-600"
                                    : "border-white/5 text-gray-400"
                            }`}
                        >
                            {m.customerId}
                        </td>
                        <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                            <Badge variant={isLight ? "secondary" : "outline"} className={levelBadge(m.membershipLevel)}>
                                {m.membershipLevel}
                            </Badge>
                        </td>
                        <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                            <Badge variant={isLight ? "secondary" : "outline"} className={statusBadge(m.memberStatus)}>
                                {m.memberStatus}
                            </Badge>
                        </td>
                        <td
                            className={`border-b px-6 py-4 ${
                                isLight
                                    ? "border-slate-100 text-slate-600"
                                    : "border-white/5 text-gray-400"
                            }`}
                        >
                            {new Date(m.registerDate).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </td>
                        <td
                            className={`border-b px-6 py-4 font-mono text-sm ${
                                isLight
                                    ? "border-slate-100 text-slate-600"
                                    : "border-white/5 text-gray-400"
                            }`}
                        >
                            {m.referralCode}
                        </td>
                    </tr>
                ))}
            </DataTable>

            {filtered.length > 50 && (
                <p className={`text-center text-sm ${isLight ? "text-slate-400" : "text-gray-500"}`}>
                    Menampilkan 50 data teratas dari {filtered.length} hasil pencarian. Gunakan filter untuk mempersempit data.
                </p>
            )}
        </main>
    );
}
