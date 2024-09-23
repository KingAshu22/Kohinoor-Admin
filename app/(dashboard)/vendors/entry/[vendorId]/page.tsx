"use client";

import { useEffect, useState } from "react";

type ProductType = {
  product: string;
  vendor: string;
  rate: number;
  gross: number;
  pieces: number;
  weight: number;
};

const VendorEntryPage = ({ params }: { params: { vendorId: string } }) => {
  const [vendorName, setVendorName] = useState("");
  const [packagingProducts, setPackagingProducts] = useState([]);
  const [returnProducts, setReturnProducts] = useState<any[]>([]);

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

  const getReturnDetails = async () => {
    try {
      const res = await fetch(`/api/return`, {
        method: "GET",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setReturnProducts(data);
      } else {
        setReturnProducts([]);
      }
    } catch (err) {
      console.log("[return_GET]", err);
    }
  };

  useEffect(() => {
    if (vendorName) {
      fetch(`/api/packagings/vendor/${vendorName}`)
        .then((res) => res.json())
        .then((data) => {
          setPackagingProducts(data);
          getReturnDetails();
        })
        .catch((error) => console.error("Error fetching packaging products:", error));
    }
  }, [vendorName]);

  useEffect(() => {
    getVendorDetails();
  }, [params.vendorId]);

  if (!params.vendorId || !vendorName) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {/* Vendor Name and Details */}
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
                <th className="border px-4 py-2 text-left">Product</th>
                <th className="border px-4 py-2 text-left">Total Weight</th>
                <th className="border px-4 py-2 text-left">Partial Weight</th>
                <th className="border px-4 py-2 text-left">Gross</th>
                <th className="border px-4 py-2 text-left">Pieces</th>
                <th className="border px-4 py-2 text-left">Rate</th>
              </tr>
            </thead>
            <tbody>
              {packagingProducts.map((entry: any) =>
                entry.products.map((product: any, index: number) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{product.product}</td>
                    <td className="border px-4 py-2">{product.totalWeight}</td>
                    <td className="border px-4 py-2">{product.partialWeight}</td>
                    <td className="border px-4 py-2">{product.gross}</td>
                    <td className="border px-4 py-2">{product.pieces}</td>
                    <td className="border px-4 py-2">{product.rate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Return Products Section */}
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
  )}
</tbody>
    </table>
  </div>
)}

      {/* Form Section */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Add Return Data</h3>
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-7"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const formEntries = Object.fromEntries(formData.entries());

          try {
            await fetch(`/api/return`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                date: new Date().toISOString(), // Add current date
                products: [
                  {
                    product: formEntries.product,
                    weight: formEntries.weight,
                    remainingWeight: formEntries.remainingWeight,
                    vendor: formEntries.vendor,
                    rate: formEntries.rate,
                    gross: formEntries.gross,
                    pieces: formEntries.pieces,
                  },
                ],
              }),
            });
            // Refetch return data after successful submission
            getReturnDetails();
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
          >
            {packagingProducts.map((entry: any) =>
              entry.products.map((product: any, index: number) => (
                <option key={index} value={product.product}>
                  {product.product}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="vendor" className="mb-1 font-medium">
            Worker
          </label>
          <select
            name="vendor"
            id="vendor"
            required
            className="p-2 border border-gray-300 rounded"
          >
            {packagingProducts.map((entry: any) =>
              entry.products.map((product: any, index: number) => (
                <option key={index} value={product.vendor}>
                  {product.vendor}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="returnedWeight" className="mb-1 font-medium">
            Returned Weight
          </label>
          <input
            type="number"
            name="weight"
            id="weight"
            placeholder="Returned Weight"
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="returnRemaining" className="mb-1 font-medium">
            Remaining Weight
          </label>
          <input
            type="number"
            name="remainingWeight"
            id="remainingWeight"
            placeholder="Remaining Weight"
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="rate" className="mb-1 font-medium">
            Rate
          </label>
          <input
            type="number"
            name="rate"
            id="rate"
            placeholder="Rate"
            required
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
            id="gross"
            placeholder="Gross"
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
            id="pieces"
            placeholder="Pieces"
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-start col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorEntryPage;