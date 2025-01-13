"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PackagingForm = ({ initialData }) => {
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

  const calculateGrossAndPieces = (totalWeight, partialWeight) => {
    const gross = Math.round(totalWeight / (partialWeight / 1000));
    const pieces = gross * 144;
    return { gross, pieces };
  };

  const updateGrossAndPieces = (index) => {
    const totalWeight = parseFloat(getValues(`entries[${index}].totalWeight`)) || 0;
    const partialWeight = parseFloat(getValues(`entries[${index}].partialWeight`)) || 0;

    if (totalWeight && partialWeight) {
      const { gross, pieces } = calculateGrossAndPieces(totalWeight, partialWeight);
      setValue(`entries[${index}].gross`, gross);
      setValue(`entries[${index}].pieces`, pieces);
    } else {
      setValue(`entries[${index}].gross`, "");
      setValue(`entries[${index}].pieces`, "");
    }
    setValue(`entries[${index}].rate`, 4);
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const url = initialData ? `/api/packagings/${initialData._id}` : "/api/packagings";
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
        toast.success(`Packaging ${initialData ? "Updated" : "Created"}`);
        router.push("/packaging");
      } else {
        console.error(response);
        toast.error("Failed to create/update Packaging");
      }
    } catch (err) {
      console.error("[packaging_submit]", err);
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
        {initialData ? "Edit Packaging" : "New Packaging"}
      </h2>

      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Packaging
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
        <div key={index} className="grid grid-cols-1 sm:grid-cols-8 md:grid-cols-9 gap-4 items-end mb-4">
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
              htmlFor={`entries[${index}].totalWeight`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Total Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              id={`entries[${index}].totalWeight`}
              {...register(`entries[${index}].totalWeight`, {
                required: true,
                onChange: () => updateGrossAndPieces(index),
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor={`entries[${index}].partialWeight`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Partial Weight (g)
            </label>
            <input
              type="number"
              step="0.01"
              id={`entries[${index}].partialWeight`}
              {...register(`entries[${index}].partialWeight`, {
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
          {loading ? "Submitting..." : initialData ? "Update Packaging" : "Create Packaging"}
        </button>
      </div>
    </form>
  );
};

export default PackagingForm;
