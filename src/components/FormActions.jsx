import React from "react";
import { Button } from "./ui/button";

const FormActions = ({
    submitLabel = "Save",
    cancelLabel = "Cancel",
    onCancel,
    submitType = "submit",
}) => {
    return (
        <div className="flex justify-end gap-3">
            <Button type={submitType} className="bg-teal-500 text-white hover:bg-teal-600">
                {submitLabel}
            </Button>

            <Button
                type="button"
                onClick={onCancel}
                variant="outline"
            >
                {cancelLabel}
            </Button>
        </div>
    );
};

export default FormActions;
