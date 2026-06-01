import { useState } from "react";
import customersData from "../assets/data/customer.json";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/AddButton";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

export default function Customers() {
  const [customers, setCustomers] = useState(customersData);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    gender: "L",
    birthDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();

    if (formData.fullName && formData.username && formData.birthDate) {
      const newCustomer = {
        id: `CUST${String(customers.length + 1).padStart(4, "0")}`,
        ...formData,
      };

      setCustomers([...customers, newCustomer]);

      setFormData({
        fullName: "",
        username: "",
        gender: "L",
        birthDate: "",
      });

      setShowForm(false);
    }
  };

  return (
    <main className="space-y-6">
      <PageHeader title="Customers" breadcrumb={["Home", "Customers"]} />

      <div>
        <AddButton onClick={() => setShowForm(true)}>+ Add Customer</AddButton>
      </div>

      {showForm && (
        <CustomerForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleAddCustomer}
          onCancel={() => setShowForm(false)}
        />
      )}

      <CustomerTable customers={customers} compact={showForm} />
    </main>
  );
}
