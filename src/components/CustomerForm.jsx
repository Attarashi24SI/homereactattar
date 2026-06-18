import React from "react";
import FormActions from "./FormActions";
import FormInput from "./FormInput";
import FormPanel from "./FormPanel";
import FormSelect from "./FormSelect";

const CustomerForm = ({ formData, onChange, onSubmit, onCancel }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ target: { name, value } });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <FormPanel title="Add New Customer">
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
                <FormInput
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname || ""}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </FormSelect>
                <FormInput
                    type="date"
                    name="birthDate"
                    placeholder="Birth Date"
                    value={formData.birthDate || ""}
                    onChange={handleChange}
                    required
                />
                <FormSelect
                    name="plan"
                    value={formData.plan || ""}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Plan</option>
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD">GOLD</option>
                    <option value="PLATINUM">PLATINUM</option>
                </FormSelect>
                <div className="md:col-span-4">
                    <FormActions onCancel={onCancel} />
                </div>
            </form>
        </FormPanel>
    );
};

export default CustomerForm;

