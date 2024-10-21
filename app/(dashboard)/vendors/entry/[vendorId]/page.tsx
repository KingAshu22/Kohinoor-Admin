"use client";

import Loader from "@/components/custom ui/Loader";
import Modal from "@/components/custom ui/Modal";
import { Button } from "@/components/ui/button";
import { Box, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VendorEntryPage = ({ params }: { params: { vendorId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [weight, setWeight] = useState<number | undefined>();
  const [packets, setPackets] = useState<number | undefined>();
  const [gross, setGross] = useState<number | undefined>();
  const [remainingWeight, setRemainingWeight] = useState<number | undefined>();
  const [packagingProducts, setPackagingProducts] = useState<
    PackagingProductType[]
  >([]);
  const [incompleteProducts, setIncompleteProducts] = useState<
    PackagingProductType[]
  >([]);
  const [returnId, setReturnId] = useState("");
  const [packagingId, setPackagingId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [returnData, setReturnData] = useState<ReturnData>();
  const [editPackets, setEditPackets] = useState(returnData?.packets || 0);
  const [editGross, setEditGross] = useState(returnData?.gross || 0);

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

      // Fetch packaging products
      const res = await fetch(`/api/packagings/vendor/${vendorName}`);
      const data: PackagingProductType[] = await res.json();
      setPackagingProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packaging products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorDetails();
  }, [params.vendorId]);

  useEffect(() => {
    if (returnData) {
      setEditPackets(returnData.packets || 0);
      setEditGross(returnData.gross || 0);
    }
  }, [returnData]);

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
        const remainingWeight = product.remainingWeight - inputWeight;
        remainingWeight < 0
          ? toast.error("Weight cannot exceed Total Weight")
          : setRemainingWeight(product.remainingWeight - inputWeight);
      }
    }
  };

  const handlePacketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPacket = Number(e.target.value);
    setPackets(inputPacket);

    setGross(Number((inputPacket / 12).toFixed(1)));
  };

  const handleRemainingWeightChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputRemainingWeight = Number(e.target.value);
    setRemainingWeight(inputRemainingWeight);
  };

  const handleGrossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gross = Number(e.target.value);
    setGross(gross);
  };

  const handleDelete = async (returnId: string, productId: string) => {
    try {
      await fetch(`/api/return`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnId,
          productId,
        }),
      });
      toast.success("Return Successfully Deleted");
      getPackagingProducts();
    } catch (err) {
      console.error("[return_DELETE]", err);
    }
  };

  const handleReturnEdit = (returnId: string, productId: string) => {
    const returnPackage = packagingProducts.find((p) => p._id === packagingId);
    const returnData = returnPackage?.return.find((p) => p._id === returnId);
    setReturnData(returnData);
    setReturnId(returnId);
    setPackagingId(productId);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const requestBody = {
      date: new Date().toISOString(),
      product: formData.get("product") as string,
      vendor: vendorName,
      weight: Number(formData.get("weight")),
      packets: packets,
      remainingWeight: remainingWeight, // Use the manually edited remaining weight
      gross: gross,
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
      setGross(0);
    } catch (err) {
      console.error("[return_POST]", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const requestBody = {
      date: new Date().toISOString(),
      packagingId,
      returnId,
      packets: Number(formData.get("packets")),
      gross: Number(formData.get("gross")),
    };

    try {
      await fetch(`/api/return`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      toast.success("Return Successfully Edited");
      setShowModal(false);
      getPackagingProducts();
      setSelectedProduct(undefined);
      setWeight(undefined);
      setPackets(undefined);
      setRemainingWeight(0);
      setGross(0);
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
                      <th className="border px-4 py-2 text-left">Product</th>
                      <th className="border px-4 py-2 text-left">Weight</th>
                      <th className="border px-4 py-2 text-left">Remaining</th>
                      <th className="border px-4 py-2 text-left">Dozens</th>
                      <th className="border px-4 py-2 text-left">Pieces</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagingProducts.map((entry) => {
                      const totalGross = entry.packaging.reduce(
                        (sum, pkg) => sum + pkg.gross,
                        0
                      );
                      const totalPieces = entry.packaging.reduce(
                        (sum, pkg) => sum + pkg.pieces,
                        0
                      );

                      return (
                        <tr key={entry._id}>
                          <td className="border px-4 py-2">{entry.product}</td>
                          <td className="border px-4 py-2">
                            {entry.totalWeight.toLocaleString("en-in")}
                          </td>
                          <td className="border px-4 py-2">
                            {entry.remainingWeight.toLocaleString("en-in")}
                          </td>
                          <td className="border px-4 py-2">
                            {totalGross.toLocaleString("en-in")}
                          </td>
                          <td className="border px-4 py-2">
                            {totalPieces.toLocaleString("en-in")}
                          </td>
                        </tr>
                      );
                    })}
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
                        <th className="border px-4 py-2 text-left">Dozens</th>
                        <th className="border px-4 py-2 text-left">Packets</th>
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
                            <td className="border px-4 py-2">{ret.weight}</td>
                            <td className="border px-4 py-2">{ret.gross}</td>
                            <td className="border px-4 py-2">{ret.packets}</td>
                            <td className="border px-4 py-2">
                              <Button
                                onClick={() => {
                                  handleReturnEdit(ret._id, entry._id);
                                }}
                              >
                                <Pencil />
                              </Button>
                            </td>
                            <td className="border px-4 py-2">
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <Button className="bg-red-1 text-white">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white text-grey-1">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-red-1">
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete your Return Entry
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-1 text-white"
                                      onClick={() => {
                                        handleDelete(ret._id, entry._id);
                                      }}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Modal
                    isOpen={showModal}
                    onClose={() => {
                      setShowModal(false);
                    }}
                    title={"Edit Return Entry Details"}
                  >
                    <form
                      className="grid grid-cols-1 gap-4 md:grid-cols-5"
                      onSubmit={handleEditSubmit}
                    >
                      <div className="flex flex-col">
                        <label htmlFor="packets" className="mb-1 font-medium">
                          Packets
                        </label>
                        <input
                          type="number"
                          name="packets"
                          id="packets"
                          required
                          className="p-2 border border-gray-300 rounded"
                          value={editPackets}
                          onChange={(e) => {
                            setEditPackets(Number(e.target.value));
                            setEditGross(
                              Number((Number(e.target.value) / 122).toFixed(1))
                            );
                          }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="gross" className="mb-1 font-medium">
                          Dozens
                        </label>
                        <input
                          type="number"
                          name="gross"
                          id="gross"
                          required
                          className="p-2 border border-gray-300 rounded"
                          value={editGross}
                          onChange={(e) => setEditGross(Number(e.target.value))}
                        />
                      </div>

                      <div className="flex items-center col-span-1 md:col-span-5">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </Modal>
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
                  <label htmlFor="weight" className="mb-1 font-medium">
                    Packets
                  </label>
                  <input
                    type="number"
                    name="packets"
                    id="packets"
                    required
                    value={packets || ""}
                    onChange={handlePacketChange}
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
                    value={remainingWeight !== undefined ? remainingWeight : ""}
                    onChange={handleRemainingWeightChange}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="gross" className="mb-1 font-medium">
                    Dozens
                  </label>
                  <input
                    type="number"
                    name="gross"
                    id="gross"
                    value={gross !== undefined ? gross : ""}
                    required
                    onChange={handleGrossChange}
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
