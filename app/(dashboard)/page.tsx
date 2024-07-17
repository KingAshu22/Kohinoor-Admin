import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getTotalRaw,
  getSalesPerMonth,
  getTotalPolish,
  getTotalColor,
} from "@/lib/actions/actions";
import { IndianRupee, ShoppingBag, UserRound } from "lucide-react";

export default async function Home() {
  const totalRawGross = await getTotalRaw();
  const totalPolishGross = await getTotalPolish();
  const totalColorGross = await getTotalColor();

  const graphData = await getSalesPerMonth();

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-grey-1 my-5" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Raw Material</CardTitle>
            <IndianRupee className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">Gross: {totalRawGross}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Polish Gross</CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalPolishGross}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Color Gross</CardTitle>
            <UserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalColorGross}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Sales Chart (₹)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
