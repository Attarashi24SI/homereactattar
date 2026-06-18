import React from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

const AddButton = ({ children, onClick, ...props }) => {
    return (
        <Button
            onClick={onClick}
            className="h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(13,148,136,0.22)] transition-all hover:from-teal-600 hover:to-cyan-700 hover:shadow-[0_14px_24px_rgba(13,148,136,0.28)]"
            {...props}
        >
            <Plus data-icon="inline-start" />
            {children}
        </Button>
    );
};

export default AddButton;
