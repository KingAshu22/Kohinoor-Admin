"use client";

import Loader from "@/components/custom ui/Loader";
import { useEffect, useState, useRef } from "react";

const VendorDetails = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salaryData, setSalaryData] = useState([]);
  const [total, setTotal] = useState(0);

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
    }
  };

  // Fetch Salary Details for Work From Home Vendors
  const getSalaryDetailsForWFH = async () => {
    try {
      // Fetch combined data for packaging and return entries
      const res = await fetch(`/api/packagings/vendor/${vendorDetails.name}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Error fetching data: ${res.statusText}`);
      }

      const { result, totalAmount } = await res.json();

      if (!Array.isArray(result)) {
        console.error("Invalid response structure:", { result, totalAmount });
        return;
      }

      // Group data by product name and sum up the values
      const groupedData = result.reduce((acc, entry) => {
        const existingEntry = acc.find(item => item.product === entry.product);
        if (existingEntry) {
          existingEntry.packagingWeight += Number(entry.packagingWeight || 0);
          existingEntry.returnedWeight += Number(entry.returnedWeight || 0);
          existingEntry.weightDiff += Number(entry.weightDiff || 0);
          existingEntry.rate = Number(entry.rate) || 0;
          existingEntry.packetValue = Number(entry.packetValue) || 0;
          existingEntry.amount += Number(entry.amount || 0);
        } else {
          acc.push({
            product: entry.product,
            weightTaken: Number(entry.weightTaken || 0),
            weightReturned: Number(entry.weightReturned || 0),
            weightDiff: Number(entry.weightDiff || 0),
            rate: Number(entry.rate) || 0,
            packetValue: Number(entry.packetValue) || 0,
            amount: Number(entry.amount || 0),
          });
        }
        return acc;
      }, []);

      // Set the state with the grouped data and total amount
      setSalaryData(groupedData);
      setTotal(totalAmount);
    } catch (err) {
      console.error("[getSalaryDetailsForWFH] Error:", err);
    }
  };

  const handleFetchSalary = () => {
    if (startDate && endDate) {
      if (vendorDetails.type === "Work From Home") {
        getSalaryDetailsForWFH();
      }
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

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <div ref={printRef}>
        <h1 className="text-2xl font-bold mb-4">
          Employee: {vendorDetails?.name}
        </h1>
        <p className="text-lg mb-2">
          Period: {startDate} to {endDate}
        </p>

        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleFetchSalary}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Fetch Salary Details
        </button>
      </div>

      {salaryData.length > 0 && (
        <div>
          <table className="min-w-full mt-6 bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Product Name</th>
                <th className="py-2 px-4 border">Weight Taken</th>
                <th className="py-2 px-4 border">Weight Returned</th>
                <th className="py-2 px-4 border">Weight Difference</th>
                <th className="py-2 px-4 border">Rate</th>
                <th className="py-2 px-4 border">Packet Value</th>
                <th className="py-2 px-4 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">
                    {new Date(item.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-2 px-4 border">{item.product}</td>
                  <td className="py-2 px-4 border">{item.weightTaken}</td>
                  <td className="py-2 px-4 border">{item.weightReturned}</td>
                  <td className="py-2 px-4 border">{item.weightDiff}</td>
                  <td className="py-2 px-4 border">{item.rate}</td>
                  <td className="py-2 px-4 border">{item.packetValue}</td>
                  <td className="py-2 px-4 border">
                    ₹ {parseFloat(item.amount.toFixed(2)).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={7} className="py-2 px-4 border font-bold">
                  Total
                </td>
                <td className="py-2 px-4 border font-bold">
                  ₹ {parseFloat(total.toFixed(2)).toLocaleString("en-IN")}/-
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
