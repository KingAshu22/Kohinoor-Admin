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
  product: z.string().min(2),
  totalWeight: z.preprocess((val) => Number(val), z.number().positive()),
  partialWeight: z.preprocess((val) => Number(val), z.number().positive()),
  vendor: z.string().min(2),
  gross: z.number().positive().optional(),
  pieces: z.number().positive().optional(),
  date: z.string().min(2),
});

interface PolishFormProps {
  initialData?: materialType | null; // Must have "?" to make it optional
}

const PolishForm: React.FC<PolishFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [calculateClicked, setCalculateClicked] = useState(false); // State to track if Calculate button is clicked

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
          (vendor: VendorType) => vendor.type === "Polishing"
        );

        setProducts(productsData);
        setVendors(filteredVendors);
      } catch (err) {
        console.log("[fetchData]", err);
        toast.error("Failed to load products or vendors");
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          product: "",
          totalWeight: 0,
          partialWeight: 0,
          vendor: "",
          date: new Date().toISOString().split("T")[0], // Pre-fill with today's date
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
    const gross = Math.round(totalWeight / partialWeight);
    const pieces = gross * 144; // Assuming 144 pieces per gross
    form.setValue("gross", gross); // Set value of gross in the form
    form.setValue("pieces", pieces); // Set value of pieces in the form
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const url = initialData
        ? `/api/polish/${initialData._id}`
        : "/api/polish";
      const res = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Polish ${initialData ? "updated" : "created"}`);
        router.push("/polish");
      } else {
        console.log(res);
        toast.error("Failed to create/update Polish");
      }
    } catch (err) {
      console.log("[polish_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Polish Entry</p>
          <Delete id={initialData._id} item="polish" />
        </div>
      ) : (
        <p className="text-heading2-bold">Add Polish Entry</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <select {...field}>
                    <option value="">Select a product</option>
                    {products.map((product) => (
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

          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <FormControl>
                  <select {...field}>
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

          <FormField
            control={form.control}
            name="totalWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Total Weight"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="partialWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partial Weight (1 gross = 144 pieces)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Partial Weight"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
                {!calculateClicked && (
                  <Button
                    type="button"
                    onClick={() => {
                      const totalWeight = form.getValues().totalWeight;
                      const partialWeight = field.value as number;
                      calculateGrossAndPieces(totalWeight, partialWeight);
                      setCalculateClicked(true);
                    }}
                    className="bg-blue-1 text-white mt-2"
                  >
                    Calculate
                  </Button>
                )}
              </FormItem>
            )}
          />
          {calculateClicked && ( // Only show gross and pieces fields after Calculate button is clicked
            <>
              <FormField
                control={form.control}
                name="gross"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Gross"
                        {...field}
                        onKeyDown={handleKeyPress}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pieces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pieces</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Pieces"
                        {...field}
                        onKeyDown={handleKeyPress}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            </>
          )}
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/polish")}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PolishForm;
