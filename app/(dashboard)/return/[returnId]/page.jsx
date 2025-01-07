"use client";

import Loader from "@/components/custom ui/Loader";
import ReturnForm from "@/components/return/ReturnForm";
import React, { useEffect, useState } from "react";

const ReturnDetails = ({ params }) => {
    const [loading, setLoading] = useState(true);
    const [returnDetails, setReturnDetails] = useState(null);

    const getReturnDetails = async () => {
        try {
            const res = await fetch(`/api/return/${params.returnId}`, {
                method: "GET",
            });
            const data = await res.json();
            setReturnDetails(data);
            setLoading(false);
        } catch (err) {
            console.log("[returnId_GET]", err);
        }
    };

    useEffect(() => {
        getReturnDetails();
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <ReturnForm initialData={returnDetails} />
    );
};

export default ReturnDetails;
