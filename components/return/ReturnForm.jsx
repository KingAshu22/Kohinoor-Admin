"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ReturnForm = ({ initialData }) => {
    const router = useRouter();
    const { register, handleSubmit, setValue, watch, reset, getValues } = useForm({
        defaultValues: initialData || { date: new Date().toISOString().split("T")[0] }, // Set today's date by default
    });

    const [productsList, setProductsList] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [entries, setEntries] = useState(initialData?.entries || [{}]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, vendorsRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch("/api/vendors"),
                ]);

                const productsData = await productsRes.json();
                const vendorsData = await vendorsRes.json();

                const filteredVendors = vendorsData.filter(
                    (vendor) => vendor.type === "Work From Home"
                );

                setProductsList(productsData);
                setVendors(filteredVendors);
            } catch (err) {
                console.error("[fetchData]", err);
                toast.error("Failed to load products or vendors");
            }
        };

        fetchData();

        if (initialData) {
            setEntries(initialData.entries || [{}]);
            reset(initialData); // Reset form to initial data
        }
    }, [initialData, reset]);

    const calculateGrossAndPieces = (packets, piecesPerPacket) => {
        const totalPieces = packets * piecesPerPacket; // Calculate total pieces based on packets and pieces per packet
        const gross = Math.floor(totalPieces / 144); // Assuming 144 pieces = 1 gross
        return { gross, pieces: totalPieces };
    };

    const updateGrossAndPieces = (index) => {
        const packets = parseFloat(getValues(`entries[${index}].packets`)) || 0;
        const piecesPerPacket = parseFloat(getValues(`entries[${index}].piecesPerPacket`)) || 0;

        if (packets && piecesPerPacket) {
            const { gross, pieces } = calculateGrossAndPieces(packets, piecesPerPacket);
            setValue(`entries[${index}].gross`, gross);
            setValue(`entries[${index}].pieces`, pieces);
        } else {
            setValue(`entries[${index}].gross`, "");
            setValue(`entries[${index}].pieces`, "");
        }
    };

    const onSubmit = async (values) => {
        try {
            setLoading(true);

            const url = initialData ? `/api/return/${initialData._id}` : "/api/return";
            const method = initialData ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setLoading(false);
                toast.success(`${initialData ? "Updated" : "Created"} Return`);
                router.push("/return");
            } else {
                console.error(response);
                toast.error("Failed to create/update Return");
            }
        } catch (err) {
            console.error("[return_submit]", err);
            toast.error("Something went wrong! Please try again.");
            setLoading(false);
        }
    };

    const addEntry = () => {
        setEntries([...entries, {}]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {initialData ? "Edit Return" : "New Return"}
            </h2>

            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Return
                </label>
                <input
                    type="date"
                    id="date"
                    {...register("date", { required: true })}
                    defaultValue={
                        initialData?.date
                            ? new Date(initialData.date).toISOString().split("T")[0]
                            : new Date().toISOString().split("T")[0] // Set today's date if editing
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {entries.map((_, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-8 md:grid-cols-10 gap-4 items-end mb-4">
                    <div className="sm:col-span-2">
                        <label
                            htmlFor={`entries[${index}].product`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Product Name
                        </label>
                        <select
                            id={`entries[${index}].product`}
                            {...register(`entries[${index}].product`, { required: true })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a product</option>
                            {productsList.map((product) => (
                                <option
                                    key={product._id}
                                    value={product.title}
                                    selected={product.title === getValues(`entries[${index}].product`)}
                                >
                                    {product.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor={`entries[${index}].vendor`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Vendor Name
                        </label>
                        <select
                            id={`entries[${index}].vendor`}
                            {...register(`entries[${index}].vendor`, { required: true })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a vendor</option>
                            {vendors.map((vendor) => (
                                <option
                                    key={vendor._id}
                                    value={vendor.name}
                                    selected={vendor.name === getValues(`entries[${index}].vendor`)}
                                >
                                    {vendor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-1">
                        <label
                            htmlFor={`entries[${index}].weight`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Weight (g)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id={`entries[${index}].weight`}
                            {...register(`entries[${index}].weight`, {
                                required: true,
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label
                            htmlFor={`entries[${index}].packets`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            No. of Packets
                        </label>
                        <input
                            type="number"
                            step="1"
                            id={`entries[${index}].packets`}
                            {...register(`entries[${index}].packets`, {
                                required: true,
                                onChange: () => updateGrossAndPieces(index),
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label
                            htmlFor={`entries[${index}].piecesPerPacket`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Pieces per Packet
                        </label>
                        <input
                            type="number"
                            step="1"
                            id={`entries[${index}].piecesPerPacket`}
                            {...register(`entries[${index}].piecesPerPacket`, {
                                required: true,
                                onChange: () => updateGrossAndPieces(index),
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label
                            htmlFor={`entries[${index}].rate`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Rate per Gross
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id={`entries[${index}].rate`}
                            {...register(`entries[${index}].rate`, { required: true })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label
                            htmlFor={`entries[${index}].gross`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gross
                        </label>
                        <input
                            type="number"
                            readOnly
                            id={`entries[${index}].gross`}
                            {...register(`entries[${index}].gross`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="sm:col-span-1">
                        <label
                            htmlFor={`entries[${index}].pieces`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Pieces
                        </label>
                        <input
                            type="number"
                            readOnly
                            id={`entries[${index}].pieces`}
                            {...register(`entries[${index}].pieces`)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            ))}

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={addEntry}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                    Add More
                </button>

                <button
                    type="submit"
                    className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Submit Return"}
                </button>
            </div>
        </form>
    );
};

export default ReturnForm;
