"use client";

import Loader from "@/components/custom ui/Loader";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type PackagingProductType = {
  _id: string;
  date: string;
  product: string;
  vendor: string;
  rate: number;
  remainingWeight: number;
  isCompleted: boolean;
  packaging: {
    weight: number;
    gross: number;
    pieces: number;
  };
  return: {
    _id: string;
    date: string;
    weight: number;
    gross: number;
    pieces: number;
    isVerified: boolean;
  }[];
};

const VendorEntryPage = ({ params }: { params: { vendorId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [weight, setWeight] = useState<number | undefined>();
  const [remainingWeight, setRemainingWeight] = useState<number | undefined>(0);
  const [packagingProducts, setPackagingProducts] = useState<
    PackagingProductType[]
  >([]);
  const [incompleteProducts, setIncompleteProducts] = useState<
    PackagingProductType[]
  >([]);

  const getVendorDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vendors/${params.vendorId}`, {
        method: "GET",
      });
      const data = await res.json();
      setVendorName(data.name);
      setLoading(false);
    } catch (err) {
      console.error("[vendorId_GET]", err);
    }
  };

  const getPackagingProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/packagings/vendor/${vendorName}`);
      const data = await res.json();
      setPackagingProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packaging products:", error);
    }
  };

  useEffect(() => {
    getVendorDetails();
  }, [params.vendorId]);

  useEffect(() => {
    if (vendorName) {
      getPackagingProducts();
    }
  }, [vendorName]);

  useEffect(() => {
    if (selectedProduct) {
      const product = packagingProducts.find(
        (p) => p.product === selectedProduct
      );
      if (product) {
        setRemainingWeight(product.remainingWeight);
      }
    }
  }, [selectedProduct, packagingProducts]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedProduct(selected);
    setWeight(undefined); // Reset weight when a new product is selected
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputWeight = Number(e.target.value);
    setWeight(inputWeight);

    if (selectedProduct) {
      const product = packagingProducts.find(
        (p) => p.product === selectedProduct
      );
      if (product) {
        setRemainingWeight(product.remainingWeight - inputWeight);
      }
    }
  };

  const handleRemainingWeightChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputRemainingWeight = Number(e.target.value);
    setRemainingWeight(inputRemainingWeight);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const requestBody = {
      date: new Date().toISOString(),
      product: formData.get("product") as string,
      vendor: vendorName,
      weight: Number(formData.get("weight")),
      remainingWeight: remainingWeight, // Use the manually edited remaining weight
      gross: Number(formData.get("gross")),
      pieces: Number(formData.get("pieces")),
    };

    try {
      await fetch(`/api/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      toast.success("Return Successfully Saved");
      getPackagingProducts();
      setSelectedProduct(undefined);
      setWeight(undefined);
      setRemainingWeight(0);
    } catch (err) {
      console.error("[return_POST]", err);
    }
  };

  useEffect(() => {
    setLoading(!(params.vendorId && vendorName)); // Update loading state based on vendorId and vendorName
  }, [params.vendorId, vendorName]);

  useEffect(() => {
    if (packagingProducts.length > 0) {
      setIncompleteProducts(
        packagingProducts.filter((entry) => !entry.isCompleted)
      );
    }
  }, [packagingProducts]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Vendor: {vendorName}</h1>

          {packagingProducts.length === 0 ? (
            <p>No Products to be return</p>
          ) : (
            <>
              {/* Packaging Products Table */}
              <h2 className="text-xl font-semibold mb-2">
                All Packaging Products
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-left">Product</th>
                      <th className="border px-4 py-2 text-left">Weight</th>
                      <th className="border px-4 py-2 text-left">Remaining</th>
                      <th className="border px-4 py-2 text-left">Gross</th>
                      <th className="border px-4 py-2 text-left">Pieces</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagingProducts.map((entry) => (
                      <tr key={entry._id}>
                        <td className="border px-4 py-2">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                        <td className="border px-4 py-2">{entry.product}</td>
                        <td className="border px-4 py-2">
                          {entry.packaging.weight}
                        </td>
                        <td className="border px-4 py-2">
                          {entry.remainingWeight}
                        </td>
                        <td className="border px-4 py-2">
                          {entry.packaging.gross}
                        </td>
                        <td className="border px-4 py-2">
                          {entry.packaging.pieces}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Incomplete Products Table */}
              <h2 className="text-xl font-semibold mt-8 mb-2">
                Returns for Incomplete Products
              </h2>
              {incompleteProducts.length === 0 ? (
                <p className="text-gray-500">
                  No incomplete products with returns.
                </p>
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
                        <th className="border px-4 py-2 text-left">Verified</th>
                        <th className="border px-4 py-2 text-left">Edit</th>
                        <th className="border px-4 py-2 text-left">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incompleteProducts.flatMap((entry) =>
                        entry.return.map((ret) => (
                          <tr key={ret.date + ret.weight}>
                            <td className="border px-4 py-2">
                              {new Date(ret.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </td>
                            <td className="border px-4 py-2">
                              {entry.product}
                            </td>
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                className="w-12"
                                value={ret.weight}
                              />
                            </td>
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                className="w-12"
                                value={ret.gross}
                              />
                            </td>
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                className="w-12"
                                value={ret.pieces}
                              />
                            </td>
                            <td
                              className={`border px-4 py-2 ${
                                ret.isVerified
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {ret.isVerified ? "Verified" : "Unverified"}
                            </td>
                            <td className="border px-4 py-2">
                              <Link href={`/${ret._id}`}>
                                <Pencil />
                              </Link>
                            </td>
                            <td className="border px-4 py-2">
                              <Trash />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Form Section */}
              <h3 className="text-xl font-semibold mt-6 mb-2">
                Add Return Data
              </h3>
              <form
                className="grid grid-cols-1 gap-4 md:grid-cols-5"
                onSubmit={handleSubmit}
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
                    onChange={handleProductChange}
                  >
                    <option value="">Select a product</option>
                    {packagingProducts.map((product) => (
                      <option key={product._id} value={product.product}>
                        {product.product}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="weight" className="mb-1 font-medium">
                    Weight
                  </label>
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    required
                    value={weight || ""}
                    onChange={handleWeightChange}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="remainingWeight" className="mb-1 font-medium">
                    Remaining Weight
                  </label>
                  <input
                    type="number"
                    name="remainingWeight"
                    id="remainingWeight"
                    required
                    value={remainingWeight || ""}
                    onChange={handleRemainingWeightChange}
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
                    required
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center col-span-1 md:col-span-5">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Submit Return
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default VendorEntryPage;
