import React from "react";
import { Badge } from "./ui/badge";

const statusVariant = {
    Completed: "success",
    Pending: "warning",
    Cancelled: "destructive",
    Paid: "success",
    Unpaid: "warning",
};

const loyaltyTone = {
    Gold: "bg-amber-400 text-white",
    Silver: "bg-gray-300 text-white",
    Bronze: "bg-orange-600 text-white",
};

export const StatusBadge = ({ status }) => {
    return (
        <Badge variant={statusVariant[status] || "secondary"}>
            {status}
        </Badge>
    );
};

export const LoyaltyBadge = ({ loyalty }) => {
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${loyaltyTone[loyalty] || loyaltyTone.Silver}`}>
            {loyalty}
        </span>
    );
};

export default StatusBadge;
