/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";
import services from "./data/data.json";

import {
    ViewSelector,
    SearchFilter,
    GuestView,
    AdminView,
} from "./components/showitemcard";

function Root() {
    const [view, setView] = useState("guest");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [availability, setAvailability] = useState("");

    const categories = [
        ...new Set(services.map((item) => item.category)),
    ];

    const filteredServices = services.filter((service) => {
        return (
            service.name.toLowerCase().includes(search.toLowerCase()) &&
            (category ? service.category === category : true) &&
            (availability
                ? service.schedule.availability === availability
                : true)
        );
    });

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ViewSelector view={view} setView={setView} />

            <SearchFilter
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                availability={availability}
                setAvailability={setAvailability}
                categories={categories}
            />

            {view === "guest" ? (
                <GuestView services={filteredServices} />
            ) : (
                <AdminView services={filteredServices} />
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
