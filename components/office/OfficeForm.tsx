"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
  products: z.array(
    z.object({
      product: z.string().min(2),
      vendor: z.string().min(2),
      sheetType: z.string().min(2),
      sheetCount: z.preprocess((val) => Number(val), z.number().positive()),
      rate: z.preprocess((val) => Number(val), z.number().positive()),
    })
  ),
});

interface OfficeFormProps {
  initialData?: materialType | null; // Must have "?" to make it optional
}

const OfficeForm: React.FC<OfficeFormProps> = ({ initialData }) => {
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
          (vendor: VendorType) => vendor.type === "Work From Office"
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          date: new Date().toISOString().split("T")[0], // Pre-fill with today's date
          products: [
            {
              product: "",
              vendor: "",
              sheetType: "",
              sheetCount: 0,
              rate: 0,
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const url = initialData
        ? `/api/office/${initialData._id}`
        : "/api/office";
      const res = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Office ${initialData ? "Updated" : "Created"}`);
        router.push("/office");
      } else {
        console.log(res);
        toast.error("Failed to create/update Office Entry");
      }
    } catch (err) {
      console.log("[office_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Office Work Entry</p>
          <Delete id={initialData._id} item="office" />
        </div>
      ) : (
        <p className="text-heading2-bold">Add Office Work Entry</p>
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

          {fields.map((item, index) => (
            <div
              key={item.id}
              className="grid lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-2 gap-2 items-center"
            >
              <FormField
                control={form.control}
                name={`products.${index}.product`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <br />
                    <FormControl>
                      <select
                        {...field}
                        className="border-gray border-2 w-32 h-10 rounded-lg"
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

              <FormField
                control={form.control}
                name={`products.${index}.vendor`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <br />
                    <FormControl>
                      <select
                        {...field}
                        className="border-gray border-2 w-32 h-10 rounded-lg"
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

              <FormField
                control={form.control}
                name={`products.${index}.sheetType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sheet Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="border-gray border-2 w-32 h-10 rounded-lg"
                      >
                        <option value="">Select Sheet Type</option>
                        <option value="1C">1C</option>
                        <option value="2C">2C</option>
                        <option value="Blue">Blue</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`products.${index}.sheetCount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="whitespace-nowrap">
                      Sheet Count
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Sheet Count"
                        className="w-28"
                        {...field}
                        onKeyDown={handleKeyPress}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`products.${index}.rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate/Sheet</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Rate"
                        className="w-28"
                        {...field}
                        onKeyDown={handleKeyPress}
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white mt-8 w-2"
              >
                X
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                product: "",
                vendor: "",
                sheetType: "",
                sheetCount: 0,
                rate: 0,
              })
            }
            className="bg-blue-1 text-white"
          >
            Add Product
          </Button>

          <Separator className="bg-grey-1 mt-4 mb-7" />

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/office")}
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

export default OfficeForm;
