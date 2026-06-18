import { useState, useEffect } from "react";
import { customerAPI } from "../services/customerAPI";
import PageHeader from "../components/PageHeader";
import AddButton from "../components/AddButton";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export default function Customers() {
  // useState
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await customerAPI.fetchCustomers();

      // Petakan data dari Supabase ke format yang diharapkan tabel
      const mappedData = Array.isArray(data) ? data.map(c => ({
        id: c.id,
        fullname: c.fullname, // Supabase kolomnya fullname
        username: c.username,
        gender: c.gender,
        birthDate: c.birthDate, // Supabase kolomnya birthDate
        plan: c.plan
      })) : [];

      setCustomers(mappedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    gender: "L",
    birthDate: "",
    plan: "SILVER",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    if (formData.fullname && formData.username && formData.birthDate) {
      try {
        const newCustomerData = {
          id: `CUST${String(customers.length + 1).padStart(4, "0")}`,
          fullname: formData.fullname,
          username: formData.username,
          gender: formData.gender,
          birthDate: formData.birthDate,
          plan: formData.plan
        };

        await customerAPI.createCustomer(newCustomerData);

        // Ambil data terbaru dari server
        fetchData();

        alert("Customer berhasil ditambahkan!");

        setFormData({
          fullname: "",
          username: "",
          gender: "L",
          birthDate: "",
          plan: "SILVER",
        });

        setShowForm(false);
      } catch (error) {
        console.error("Gagal menambah customer:", error);
        alert("Gagal menyimpan data ke API: " + (error.response?.data?.message || error.message));
      }
    } else {
      alert("Mohon isi semua data yang wajib!");
    }
  };

  return (
    <main className="space-y-5">
      <PageHeader title="Customers" breadcrumb={["Home", "Customers"]} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <div className="flex justify-end">
          <DialogTrigger asChild>
            <AddButton>Add Customer</AddButton>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Isi data lengkap pelanggan baru.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleAddCustomer}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center p-8">Loading data...</div>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </main>
  );
}
