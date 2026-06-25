import React from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import DataTable from "./DataTable";
import { useTheme } from "../context/ThemeContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

const CustomerTable = ({ customers, compact }) => {
    const { isLight } = useTheme();

    return (
        <DataTable
            columns={["Customer ID", "Nama", "Username", "Gender", "Tanggal Lahir", "Plan", "Aksi"]}
            compact={compact}
        >
            {customers.map((customer) => (
                <tr
                    key={customer.customerid}
                    className={`transition-colors ${isLight ? "hover:bg-teal-50/70" : "hover:bg-white/5"}`}
                >
                    <td className={`border-b px-6 py-4 font-semibold ${isLight ? "border-slate-100 text-teal-700" : "border-white/5 text-gray-400"}`}>
                        {customer.customerid}
                    </td>
                    <td className={`border-b px-6 py-4 font-semibold ${isLight ? "border-slate-100 text-slate-900" : "border-white/5 text-white"}`}>
                        <Link to={`/customers/${customer.customerid}`} className="transition hover:text-teal-700">
                            {customer.fullname}
                        </Link>
                    </td>
                    <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100 text-slate-600" : "border-white/5"}`}>{customer.username}</td>
                    <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100 text-slate-600" : "border-white/5"}`}>{customer.gender}</td>
                    <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100 text-slate-600" : "border-white/5"}`}>{new Date(customer.birthDate).toLocaleDateString("id-ID")}</td>
                    <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                        {customer.plan ? (
                            <Badge
                                variant={isLight ? "secondary" : "outline"}
                                className={`capitalize ${
                                    customer.plan === 'PLATINUM' ? 'bg-slate-800 text-slate-100' :
                                    customer.plan === 'GOLD' ? 'bg-amber-100 text-amber-800' :
                                    'bg-slate-100 text-slate-700'
                                }`}
                            >
                                {customer.plan}
                            </Badge>
                        ) : "None"}
                    </td>
                    <td className={`border-b px-6 py-4 ${isLight ? "border-slate-100" : "border-white/5"}`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={`focus:outline-none p-1 rounded-md transition ${isLight ? "hover:bg-slate-100" : "hover:bg-white/10"}`}>
                                <MoreHorizontal className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={isLight ? "bg-white" : "bg-slate-900 border-white/10 text-slate-200"}>
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuSeparator className={isLight ? "" : "bg-white/10"} />
                                <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950 dark:focus:text-red-500">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </td>
                </tr>
            ))}
        </DataTable>
    );
};

export default CustomerTable;
