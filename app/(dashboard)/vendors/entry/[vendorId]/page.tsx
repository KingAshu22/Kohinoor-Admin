"use client";

import { useEffect, useState } from "react";

type ProductType = {
  _id: string;
  product: string;
  vendor: string;
  rate: number;
  gross: number;
  pieces: number;
  weight: number;
  isCompleted: boolean; // Include isCompleted in the type definition
};

const VendorEntryPage = ({ params }: { params: { vendorId: string } }) => {
  const [vendorName, setVendorName] = useState("");
  const [packagingProducts, setPackagingProducts] = useState<ProductType[]>([]);
  const [returnProducts, setReturnProducts] = useState<any[]>([]);
  const [returnedWeight, setReturnedWeight] = useState<number>(0);
  const [remainingWeight, setRemainingWeight] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const getVendorDetails = async () => {
    try {
      const res = await fetch(`/api/vendors/${params.vendorId}`, {
        method: "GET",
      });
      const data = await res.json();
      setVendorName(data.name);
    } catch (err) {
      console.log("[vendorId_GET]", err);
    }
  };

  const getPackagingProducts = async () => {
    try {
      const res = await fetch(`/api/packagings/vendor/${vendorName}`);
      const data = await res.json();
      const filteredProducts = data.filter((entry: ProductType) => !entry.isCompleted);
      setPackagingProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching packaging products:", error);
    }
  };

  const getReturnDetails = async () => {
    try {
      const res = await fetch(`/api/return`, {
        method: "GET",
      });
      const data = await res.json();
      setReturnProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("[return_GET]", err);
    }
  };

  useEffect(() => {
    if (vendorName) {
      getPackagingProducts();
      getReturnDetails();
    }
  }, [vendorName]);

  useEffect(() => {
    getVendorDetails();
  }, [params.vendorId]);

  useEffect(() => {
    if (selectedProduct) {
      // Calculate the remaining weight based on the selected product's packaging weight
      setRemainingWeight(selectedProduct.weight);
    }
  }, [selectedProduct]);

  if (!params.vendorId || !vendorName) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Vendor: {vendorName}</h1>

      {/* Packaging Products Section */}
      <h2 className="text-xl font-semibold mb-2">Packaging Products</h2>
      {packagingProducts.length === 0 ? (
        <p className="text-gray-500">No products found for this vendor.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Product</th>
                <th className="border px-4 py-2 text-left">Weight</th>
                <th className="border px-4 py-2 text-left">Gross</th>
                <th className="border px-4 py-2 text-left">Pieces</th>
              </tr>
            </thead>
            <tbody>
              {packagingProducts.map((entry: any) => (
                <tr key={entry._id}>
                  <td className="border px-4 py-2">{entry.date}</td>
                  <td className="border px-4 py-2">{entry.product}</td>
                  <td className="border px-4 py-2">{entry.packaging.weight}</td>
                  <td className="border px-4 py-2">{entry.packaging.gross}</td>
                  <td className="border px-4 py-2">{entry.packaging.pieces}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Return Products Section */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Return Products</h2>
      {returnProducts.length === 0 ? (
        <p className="text-gray-500">No return data found. Please add return data below:</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Product</th>
                <th className="border px-4 py-2 text-left">Vendor</th>
                <th className="border px-4 py-2 text-left">Rate</th>
                <th className="border px-4 py-2 text-left">Gross</th>
                <th className="border px-4 py-2 text-left">Pieces</th>
                <th className="border px-4 py-2 text-left">Returned Weight</th>
                <th className="border px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {returnProducts.map((entry, index) =>
                entry.products && Array.isArray(entry.products) ? (
                  entry.products.map((product: ProductType, productIndex: number) => (
                    <tr key={`${index}-${productIndex}`}>
                      <td className="border px-4 py-2">{product.product}</td>
                      <td className="border px-4 py-2">{product.vendor}</td>
                      <td className="border px-4 py-2">{product.rate}</td>
                      <td className="border px-4 py-2">{product.gross}</td>
                      <td className="border px-4 py-2">{product.pieces}</td>
                      <td className="border px-4 py-2">{product.weight}</td>
                      <td className="border px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr key={index}>
                    <td className="border px-4 py-2" colSpan={7}>
                      No product data available for this entry.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Section */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Add Return Data</h3>
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const formEntries = Object.fromEntries(formData.entries());

          // Create the request body
          const requestBody = {
            date: new Date().toISOString(), // Add current date
            product: formEntries.product,
            vendor: vendorName, // Use the vendor name from state
            weight: Number(formEntries.weight),
            remainingWeight: remainingWeight, // Use the calculated remaining weight
            gross: Number(formEntries.gross),
            pieces: Number(formEntries.pieces),
          };

          // Log the request body
          console.log("Request Body:", requestBody);

          // Send product name, vendor name, returned weight, remaining weight, gross, and pieces
          try {
            await fetch(`/api/return`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                date: new Date().toISOString(), // Add current date
                product: formEntries.product,
                vendor: vendorName, // Use the vendor name from state
                weight: Number(formEntries.weight),
                remainingWeight: remainingWeight, // Use the calculated remaining weight
                gross: Number(formEntries.gross),
                pieces: Number(formEntries.pieces),
              }),
            });
            // Refetch return data after successful submission
            getReturnDetails();
            // Reset form fields
            setReturnedWeight(0);
            setRemainingWeight(0);
            setSelectedProduct(null);
          } catch (err) {
            console.log("[return_POST]", err);
          }
        }}
      >
        <div className="flex flex-col">
          <label htmlFor="product" className="mb-1 font-medium">
            Product
          </label>
          <select
            name="product"
            id="product"
            required
            className="p-2 border border-gray-300 rounded"
            onChange={(e) => {
              const selected = packagingProducts.find(p => p.product === e.target.value);
              setSelectedProduct(selected || null);
            }}
          >
            {packagingProducts.map((entry: ProductType) => (
              <option key={entry._id} value={entry.product}>
                {entry.product}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="returnedWeight" className="mb-1 font-medium">
            Returned Weight
          </label>
          <input
            type="number"
            name="weight"
            required
            value={returnedWeight}
            onChange={(e) => {
              const value = Number(e.target.value);
              setReturnedWeight(value);
              if (selectedProduct) {
                // Ensure remainingWeight does not go negative
                const newRemainingWeight = Math.max(selectedProduct.weight - value, 0);
                setRemainingWeight(newRemainingWeight);
              }
            }}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="gross" className="mb-1 font-medium">
            Gross
          </label>
          <input
            type="number"
            name="gross"
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="pieces" className="mb-1 font-medium">
            Pieces
          </label>
          <input
            type="number"
            name="pieces"
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Return
        </button>
      </form>
    </div>
  );
};

export default VendorEntryPage;
