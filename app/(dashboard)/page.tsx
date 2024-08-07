import { Separator } from "@/components/ui/separator";
import { getProductGrossData } from "@/lib/actions/actions";

export default async function Home() {
  const productGrossData = await getProductGrossData();

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-grey-1 my-5" />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-grey-2">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-grey-2">Product</th>
              <th className="py-2 px-4 border border-grey-2">Raw Weight</th>
              <th className="py-2 px-4 border border-grey-2">Polish Weight</th>
              <th className="py-2 px-4 border border-grey-2">Color Weight</th>
              <th className="py-2 px-4 border border-grey-2">
                Packaging Weight
              </th>
              <th className="py-2 px-4 border border-grey-2">Box Count</th>
            </tr>
          </thead>
          <tbody>
            {productGrossData.map((data, index) => (
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
