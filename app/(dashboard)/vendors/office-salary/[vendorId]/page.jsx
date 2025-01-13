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
            console.log("[vendorId_GET]", err);
        }
    };

    // Fetch Salary Details
    const getSalaryDetails = async () => {
        try {
            const res = await fetch(
                `/api/vendors/salary/${params.vendorId}?startDate=${startDate}&endDate=${endDate}`,
                { method: "GET" }
            );
            const data = await res.json();

            let totalAmount = 0;

            const formattedData =
                vendorDetails?.type === "Work From Office"
                    ? Array.isArray(data)
                        ? data
                            .flatMap((entry) =>
                                entry.products.map((product) => {
                                    const amount = product.rate * product.sheetCount;
                                    totalAmount += amount;
                                    return {
                                        date: entry.date,
                                        product: product.product,
                                        rate: product.rate,
                                        gross: product.sheetCount,
                                        amount,
                                    };
                                })
                            )
                        : []
                    : Array.isArray(data)
                        ? data.flatMap((entry) =>
                            entry.products.map((product) => {
                                const amount = product.rate * product.gross;
                                totalAmount += amount;
                                return {
                                    date: entry.date,
                                    product: product.product,
                                    rate: product.rate,
                                    gross: product.gross,
                                    amount,
                                };
                            })
                        )
                        : [];

            setSalaryData(formattedData);
            setTotal(totalAmount);
        } catch (err) {
            console.log("[salary_GET]", err);
        }
    };

    const handleFetchSalary = () => {
        if (startDate && endDate) {
            getSalaryDetails();
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
                                <th className="py-2 px-4 border">Rate</th>
                                <th className="py-2 px-4 border">Count</th>
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
                                    <td className="py-2 px-4 border">
                                        {item.rate.toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {item.gross.toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        ₹ {parseFloat(item.amount.toFixed(2)).toLocaleString("en-IN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4} className="py-2 px-4 border font-bold">Total</td>
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
