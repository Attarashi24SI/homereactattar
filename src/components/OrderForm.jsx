import React from "react";
import FormActions from "./FormActions";
import FormInput from "./FormInput";
import FormPanel from "./FormPanel";
import FormSelect from "./FormSelect";

const OrderForm = ({ formData, onChange, onSubmit, onCancel, compact = false }) => {
    const form = (
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-4">
            <FormInput
                type="text"
                name="customerId"
                placeholder="Customer ID"
                value={formData.customerId}
                onChange={onChange}
                required
            />
            <FormInput
                type="number"
                name="total"
                placeholder="Total"
                value={formData.total}
                onChange={onChange}
                required
            />
            <FormInput
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
            />
            <FormSelect
                name="status"
                value={formData.status}
                onChange={onChange}
            >
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
            </FormSelect>
            <div className="md:col-span-4">
                <FormActions onCancel={onCancel} />
            </div>
        </form>
    );

    if (compact) {
        return form;
    }

    return (
        <FormPanel title="Add New Order">
            {form}
        </FormPanel>
    );
};

export default OrderForm;
