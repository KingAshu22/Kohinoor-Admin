"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Delete from "../custom ui/Delete";
import Loader from "../custom ui/Loader";

const formSchema = z.object({
  date: z.string().min(2),
  product: z.string().min(2),
  totalWeight: z.preprocess((val) => Number(val), z.number().positive()),
  partialWeight: z.preprocess((val) => Number(val), z.number().positive()),
  vendor: z.string().min(2),
  rate: z.preprocess((val) => Number(val), z.number().positive().optional()),
  gross: z.number().positive().optional(),
  pieces: z.number().positive().optional(),
});

interface PackagingFormProps {
  initialData?: PackagingProductType | null; // Make it optional
}

const PackagingForm: React.FC<PackagingFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState<ProductType[]>([]);
  const [vendors, setVendors] = useState<VendorType[]>([]);

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
          (vendor: VendorType) => vendor.type === "Work From Home"
        );

        setProductsList(productsData);
        setVendors(filteredVendors);
      } catch (err) {
        console.log("[fetchData]", err);
        toast.error("Failed to load products or vendors");
      }
    };

    fetchData();
  }, []);

  // Set form default values based on initialData
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          date: initialData.packaging[0]?.date || "", // Date from packaging array
          product: initialData.product || "",
          totalWeight: initialData.totalWeight || 0,
          partialWeight: initialData.packaging[0]?.partialWeight || 0,
          vendor: initialData.vendor || "",
          rate: initialData.rate || 4,
          gross: initialData.packaging[0]?.gross || 0,
          pieces: initialData.packaging[0]?.pieces || 0,
        }
      : {
          date: new Date().toISOString().split("T")[0],
          product: "",
          totalWeight: 0,
          partialWeight: 0,
          vendor: "",
          rate: 4,
        },
  });

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const calculateGrossAndPieces = (
    totalWeight: number,
    partialWeight: number
  ) => {
    const gross = Math.round(totalWeight / (partialWeight / 1000));
    const pieces = gross * 144;
    return { gross, pieces };
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const url = initialData
        ? `/api/packagings/${initialData._id}`
        : "/api/packagings";
      const res = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Packaging ${initialData ? "Updated" : "Created"}`);
        router.push("/packaging");
      } else {
        console.log(res);
        toast.error("Failed to create/update Packaging");
      }
    } catch (err) {
      console.log("[packaging_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-white rounded-md shadow p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Packaging Entry</p>
          <Delete id={initialData._id} item="raw material" />
        </div>
      ) : (
        <p className="text-heading2-bold">Add Packaging Entry</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-8">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onKeyDown={handleKeyPress}
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Product */}
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                    >
                      <option value="">Select a product</option>
                      {productsList.map((product) => (
                        <option key={product._id} value={product.title}>
                          {product.title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Vendor */}
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                    >
                      <option value="">Select a vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor.name}>
                          {vendor.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Total Weight */}
            <FormField
              control={form.control}
              name="totalWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Wt (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Total Weight"
                      {...field}
                      onKeyDown={handleKeyPress}
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                      onChange={(e) => {
                        field.onChange(e);
                        const totalWeight = Number(e.target.value);
                        const partialWeight = form.getValues("partialWeight");
                        const { gross, pieces } = calculateGrossAndPieces(
                          totalWeight,
                          partialWeight
                        );
                        form.setValue("gross", gross);
                        form.setValue("pieces", pieces);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Partial Weight */}
            <FormField
              control={form.control}
              name="partialWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partial Wt (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Partial Weight"
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                      {...field}
                      onKeyDown={handleKeyPress}
                      onChange={(e) => {
                        field.onChange(e);
                        const partialWeight = Number(e.target.value);
                        const totalWeight = form.getValues("totalWeight");
                        const { gross, pieces } = calculateGrossAndPieces(
                          totalWeight,
                          partialWeight
                        );
                        form.setValue("gross", gross);
                        form.setValue("pieces", pieces);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Rate */}
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate (Rs.)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Rate"
                      {...field}
                      onKeyDown={handleKeyPress}
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Gross */}
            <FormField
              control={form.control}
              name="gross"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      placeholder="Gross"
                      {...field}
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Pieces */}
            <FormField
              control={form.control}
              name="pieces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pieces</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      placeholder="Pieces"
                      {...field}
                      className="border-gray-200 border-2 p-2 rounded-lg w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="bg-blue-1 text-white">
            {initialData ? "Update Packaging Entry" : "Add Packaging Entry"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PackagingForm;
