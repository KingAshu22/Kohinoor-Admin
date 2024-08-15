import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductPiecesData } from "@/lib/actions/actions";
import Link from "next/link";

export default async function Home() {
  const productPiecesData = await getProductPiecesData();

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Dashboard - Pieces</p>
      <div className="flex space-x-4 my-5">
        <Link href="/" passHref>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Gross
          </Button>
        </Link>
        <Link href="/weight" passHref>
          <Button className="bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Weight
          </Button>
        </Link>
        <Link href="/pieces" passHref>
          <Button className="bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            Pieces
          </Button>
        </Link>
      </div>
      <Separator className="bg-grey-1 my-5" />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-grey-2">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-grey-2">Product</th>
              <th className="py-2 px-4 border border-grey-2">Raw Pieces</th>
              <th className="py-2 px-4 border border-grey-2">Polish Pieces</th>
              <th className="py-2 px-4 border border-grey-2">Color Pieces</th>
              <th className="py-2 px-4 border border-grey-2">
                Packaging Pieces
              </th>
              <th className="py-2 px-4 border border-grey-2">Box Count</th>
            </tr>
          </thead>
          <tbody>
            {productPiecesData.map((data, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border border-grey-2">
                  {data.product}
                </td>
                <td className="py-2 px-4 border border-grey-2">
                  {data.rawGross.toLocaleString("en-in")}
                </td>
                <td className="py-2 px-4 border border-grey-2">
                  {data.polishGross.toLocaleString("en-in")}
                </td>
                <td className="py-2 px-4 border border-grey-2">
                  {data.colorGross.toLocaleString("en-in")}
                </td>
                <td className="py-2 px-4 border border-grey-2">
                  {data.packagingGross.toLocaleString("en-in")}
                </td>
                <td className="py-2 px-4 border border-grey-2">
                  {data.boxCount.toLocaleString("en-in")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
