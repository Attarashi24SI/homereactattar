import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ordersData from "../assets/data/order.json";
import customersData from "../assets/data/customer.json";
import AddButton from "../components/AddButton";
import OrderForm from "../components/OrderForm";
import OrderTable from "../components/OrderTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

const customerNameById = new Map(customersData.map((customer) => [customer.id, customer.fullName]));
const initialOrders = ordersData.map((order) => ({
  ...order,
  customerName: customerNameById.get(order.customerId),
}));

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    customerId: "",
    status: "Pending",
    total: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddOrder = (e) => {
    e.preventDefault();

    if (formData.customerId && formData.total && formData.date) {
      setOrders([
        ...orders,
        {
          orderId: `ORD${String(orders.length + 1).padStart(4, "0")}`,
          ...formData,
          customerName: customerNameById.get(formData.customerId) || formData.customerId,
          total: Number(formData.total),
        },
      ]);

      setFormData({
        customerId: "",
        status: "Pending",
        total: "",
        date: "",
      });

      setShowForm(false);
    }
  };

  return (
    <main className="space-y-6">
      <PageHeader title="Orders" breadcrumb={["Home", "Orders"]} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <AddButton>Add Order</AddButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
            <DialogDescription>
              Isi data pelanggan, total transaksi, tanggal, dan status order.
            </DialogDescription>
          </DialogHeader>
          <OrderForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleAddOrder}
            onCancel={() => setShowForm(false)}
            compact
          />
        </DialogContent>
      </Dialog>

      <OrderTable orders={orders} />
    </main>
  );
}
