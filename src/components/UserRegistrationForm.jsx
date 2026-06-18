import React, { useState } from "react";
import userAPI from "../services/userAPI";
import FormActions from "./FormActions";
import FormInput from "./FormInput";
import FormPanel from "./FormPanel";
import FormSelect from "./FormSelect";

/**
 * UserRegistrationForm – a standalone form for registering new users.
 * It collects username, password, and confirm password, validates that the
 * passwords match, then calls the userAPI.registerUser endpoint. The role is
 * hard‑coded to "user" as required.
 */
const UserRegistrationForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }
    try {
      await userAPI.registerUser({
        username: formData.username,
        password: formData.password,
        role: "user",
      });
      alert("User registered successfully");
      // Reset form after success
      setFormData({ username: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to register user");
    }
  };

  return (
    <FormPanel title="Register New User">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
        <FormInput
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <FormInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <FormInput
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <FormSelect name="role" value="user" onChange={handleChange} disabled>
          <option value="user">User</option>
        </FormSelect>
        <div className="md:col-span-4">
          <FormActions onCancel={onCancel} />
        </div>
      </form>
    </FormPanel>
  );
};

export default UserRegistrationForm;
