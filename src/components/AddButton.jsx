import React from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

const AddButton = ({ children, onClick, ...props }) => {
    return (
        <Button
            onClick={onClick}
            className="bg-emerald-500 text-white hover:bg-emerald-600"
            {...props}
        >
            <Plus data-icon="inline-start" />
            {children}
        </Button>
    );
};

export default AddButton;
