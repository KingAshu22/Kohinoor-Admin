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
      boxCount: z.preprocess((val) => Number(val), z.number().positive()),
      quantity: z.string(),
    })
  ),
});

interface BoxFormProps {
  initialData?: materialType | null; // Must have "?" to make it optional
}

const PackagingForm: React.FC<BoxFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes] = await Promise.all([fetch("/api/products")]);

        const productsData = await productsRes.json();

        setProductsList(productsData);
      } catch (err) {
        console.log("[fetchData]", err);
        toast.error("Failed to load products");
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
              boxCount: 0,
              quantity: "",
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
    console.log(values); // Log form values

    try {
      setLoading(true);

      const url = initialData ? `/api/box/${initialData._id}` : "/api/box";
      const res = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Box ${initialData ? "Updated" : "Created"}`);
        router.push("/box");
      } else {
        console.log(res);
        toast.error("Failed to create/update Box");
      }
    } catch (err) {
      console.log("[box_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Box Entry</p>
          <Delete id={initialData._id} item="raw material" />
        </div>
      ) : (
        <p className="text-heading2-bold">Add Box Entry</p>
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
                name={`products.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <br />
                    <FormControl>
                      <select
                        {...field}
                        className="border-gray border-2 w-32 h-10 rounded-lg"
                      >
                        <option value="">Select Quantity</option>
                        <option value="1 Gross">1 Gross</option>
                        <option value="2 Gross">2 Gross</option>
                        <option value="60">60</option>
                        <option value="90">90</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`products.${index}.boxCount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Box Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Box Count"
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
                boxCount: 0,
                quantity: "",
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
              onClick={() => router.push("/box")}
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

export default PackagingForm;
