"use client";

import Loader from "@/components/custom ui/Loader";
import { useEffect, useState, useRef } from "react";

const VendorDetails = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [packagingData, setPackagingData] = useState([]);
  const [returnData, setReturnData] = useState([]);
  const [summarizedData, setSummarizedData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const printRef = useRef(null);

  // Fetch Vendor Details
  const getVendorDetails = async () => {
    try {
      const res = await fetch(`/api/vendors/${params.vendorId}`, {
        method: "GET",
      });
      const data = await res.json();
      setVendorDetails(data);
      setLoading(false);
    } catch (err) {
      console.error("[vendorId_GET]", err);
      setLoading(false);
    }
  };

  // Fetch Packaging and Return Details
  const fetchVendorData = async () => {
    try {
      if (!vendorDetails || !startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }

      const res = await fetch(
        `/api/packagings/vendor/${vendorDetails.name}?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.statusText}`);
      }

      const { packagingDates, returnDates, summary, totalAmount } =
        await res.json();

      setPackagingData(packagingDates);
      setReturnData(returnDates);
      setSummarizedData(summary);
      setTotalAmount(totalAmount);
    } catch (err) {
      console.error("[fetchVendorData] Error:", err);
    }
  };

  const handleFetchSalary = () => {
    if (startDate && endDate) {
      fetchVendorData();
    } else {
      alert("Please select both start and end dates");
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  useEffect(() => {
    getVendorDetails();
  }, []);

  useEffect(() => {
    const today = new Date();

    // Ensure we reset time to midnight to avoid time zone issues
    today.setHours(0, 0, 0, 0);

    // Get the first day of the previous month
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Get the last day of the previous month
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Format dates as 'YYYY-MM-DD' (common for input[type="date"])
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(firstDayOfLastMonth));
    setEndDate(formatDate(lastDayOfLastMonth));
  }, []);


  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <div ref={printRef}>
        <h1 className="text-2xl font-bold mb-4">
          Vendor: {vendorDetails?.name}
        </h1>
        <p className="text-lg mb-2">
          Period: {startDate || "N/A"} to {endDate || "N/A"}
        </p>

        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleFetchSalary}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Fetch Data
        </button>
      </div>

      {packagingData.length > 0 && returnData.length > 0 && (
        <div className="flex mt-6 space-x-8">
          <div className="w-1/2">
            <h2 className="text-lg font-bold mb-4">Packaging Details</h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Product Name</th>
                  <th className="py-2 px-4 border">Weight Taken</th>
                </tr>
              </thead>
              <tbody>
                {packagingData.map((entry, index) =>
                  entry.entries.map((e, subIndex) => (
                    <tr key={`${index}-${subIndex}`}>
                      <td className="py-2 px-4 border">
                        {new Date(entry.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-2 px-4 border">{e.product}</td>
                      <td className="py-2 px-4 border">{e.totalWeight}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="w-1/2">
            <h2 className="text-lg font-bold mb-4">Return Details</h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Product Name</th>
                  <th className="py-2 px-4 border">Weight Returned</th>
                  <th className="py-2 px-4 border">Packets</th>
                </tr>
              </thead>
              <tbody>
                {returnData.map((entry, index) =>
                  entry.entries.map((e, subIndex) => (
                    <tr key={`${index}-${subIndex}`}>
                      <td className="py-2 px-4 border">
                        {new Date(entry.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-2 px-4 border">{e.product}</td>
                      <td className="py-2 px-4 border">{e.weight}</td>
                      <td className="py-2 px-4 border">{e.packets.toLocaleString("en-in")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {summarizedData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Product</th>
                <th className="py-2 px-4 border">Weight Taken</th>
                <th className="py-2 px-4 border">Weight Returned</th>
                <th className="py-2 px-4 border">Remaining Weight</th>
                <th className="py-2 px-4 border">Rate/12 Packets</th>
                <th className="py-2 px-4 border">Packets</th>
                <th className="py-2 px-4 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {summarizedData.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{item.product}</td>
                  <td className="py-2 px-4 border">{item.packagingWeight}</td>
                  <td className="py-2 px-4 border">{item.returnedWeight}</td>
                  <td className="py-2 px-4 border">{item.weightDiff}</td>
                  <td className="py-2 px-4 border">{item.rate}</td>
                  <td className="py-2 px-4 border">{item.totalPackets.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-4 border">
                    ₹ {parseFloat(item.subtotal.toFixed(2)).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} className="py-2 px-4 border font-bold">
                  Total
                </td>
                <td className="py-2 px-4 border font-bold">
                  ₹ {parseFloat(totalAmount.toFixed(2)).toLocaleString("en-IN")}/-
                </td>
              </tr>
            </tfoot>
          </table>

          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-green-700"
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;
