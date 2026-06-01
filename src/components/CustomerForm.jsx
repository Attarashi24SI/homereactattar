import React from "react";
import FormActions from "./FormActions";
import FormInput from "./FormInput";
import FormPanel from "./FormPanel";
import FormSelect from "./FormSelect";

const CustomerForm = ({ formData, onChange, onSubmit, onCancel }) => {
    return (
        <FormPanel title="Add New Customer">
            <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-4">
                <FormInput
                    type="text"
                    name="fullName"
                    placeholder="Nama Lengkap"
                    value={formData.fullName}
                    onChange={onChange}
                    required
                />
                <FormInput
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={onChange}
                    required
                />
                <FormInput
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={onChange}
                    required
                />
                <FormSelect
                    name="gender"
                    value={formData.gender}
                    onChange={onChange}
                >
                    <option value="L">L</option>
                    <option value="P">P</option>
                </FormSelect>
                <div className="md:col-span-4">
                    <FormActions onCancel={onCancel} />
                </div>
            </form>
        </FormPanel>
    );
};

export default CustomerForm;
