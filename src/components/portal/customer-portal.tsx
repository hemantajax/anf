"use client";

import {
  Users,
  ShoppingBag,
  TreeDeciduous,
  ShieldCheck,
  Share2,
  TrendingUp,
  Leaf,
  Heart,
  IndianRupee,
  CheckCircle2,
  Clock,
  Package,
  Copy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerStore } from "@/stores/customer-store";
import { formatPrice } from "@/lib/pricing-utils";

const ORDER_STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock className="size-3.5 text-amber-500" />,
  confirmed: <CheckCircle2 className="size-3.5 text-blue-500" />,
  delivered: <Package className="size-3.5 text-emerald-500" />,
};

export function CustomerPortal() {
  const { customers, orders, adoptions, trees } = useCustomerStore();

  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalChemicalsAvoided = customers.reduce(
    (sum, c) => sum + c.chemicalsAvoided,
    0
  );
  const activeAdoptions = adoptions.filter((a) => a.status === "active").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="size-6" />
          Customer Portal
        </h1>
        <p className="text-muted-foreground mt-1">
          Your community of conscious consumers. Track orders, adoptions,
          impact, and referrals.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCustomers}</p>
              <p className="text-xs text-muted-foreground">Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <ShoppingBag className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <IndianRupee className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center">
              <TreeDeciduous className="size-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeAdoptions}</p>
              <p className="text-xs text-muted-foreground">Tree adoptions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <ShieldCheck className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {(totalChemicalsAvoided / 1000).toFixed(1)}kg
              </p>
              <p className="text-xs text-muted-foreground">Chemicals avoided</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="impact">Impact Dashboard</TabsTrigger>
        </TabsList>

        {/* Customers */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => {
              const customerOrders = orders.filter(
                (o) => o.customerId === customer.id
              );
              const customerAdoptions = adoptions.filter((a) =>
                customer.adoptions.includes(a.id)
              );
              return (
                <Card key={customer.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {customer.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Joined{" "}
                          {new Date(customer.joinDate).toLocaleDateString(
                            "en-IN",
                            { month: "short", year: "numeric" }
                          )}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {formatPrice(customer.totalSpent)} spent
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-lg font-bold">
                          {customerOrders.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Orders
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-lg font-bold">
                          {customerAdoptions.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Trees
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-lg font-bold">
                          {customer.chemicalsAvoided}g
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Saved
                        </p>
                      </div>
                    </div>

                    {/* Referral code */}
                    <div className="flex items-center justify-between p-2 rounded-lg border border-dashed text-xs">
                      <span className="text-muted-foreground">
                        Referral Code:
                      </span>
                      <span className="font-mono font-medium flex items-center gap-1">
                        {customer.referralCode}
                        <Copy className="size-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                      </span>
                    </div>

                    {customer.referredBy && (
                      <p className="text-[10px] text-muted-foreground">
                        Referred by: {customer.referredBy}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <CardDescription>
                All customer orders for natural produce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.map((order) => {
                  const customer = customers.find(
                    (c) => c.id === order.customerId
                  );
                  return (
                    <div
                      key={order.id}
                      className="flex items-start justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">
                            {customer?.name ?? "Unknown"}
                          </h4>
                          <span className="flex items-center gap-1 text-xs capitalize">
                            {ORDER_STATUS_ICON[order.status]}
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {order.items.map((item, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {item.commodity} ({item.quantity} {item.unit})
                            </Badge>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="font-semibold text-sm">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Dashboard */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Chemicals Avoided
                </CardTitle>
                <CardDescription>
                  By choosing our natural produce, our customers collectively avoided
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-5xl font-bold text-emerald-600">
                    {(totalChemicalsAvoided / 1000).toFixed(1)}
                  </p>
                  <p className="text-lg text-muted-foreground mt-1">
                    kilograms of chemical residue
                  </p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">This includes:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Pesticide residue",
                      "Chemical fertilizer traces",
                      "Growth hormone residue",
                      "Artificial ripening agents",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <CheckCircle2 className="size-3 text-emerald-500" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Leaf className="size-4 text-emerald-600" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>
                  What our community has helped achieve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <TreeDeciduous className="size-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{activeAdoptions}</p>
                      <p className="text-xs text-muted-foreground">
                        Trees protected from chemicals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <TrendingUp className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12 acres</p>
                      <p className="text-xs text-muted-foreground">
                        Chemical-free farmland maintained
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <Heart className="size-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalCustomers}</p>
                      <p className="text-xs text-muted-foreground">
                        Families eating chemical-free food
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral program */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="size-4" />
                Referral Program
              </CardTitle>
              <CardDescription>
                Spread the word, grow the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {customers.filter((c) => c.referredBy).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Successful referrals
                  </p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {customers.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active referral codes
                  </p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">10%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Referral discount offered
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Every customer gets a unique referral code. When a friend orders
                using their code, both get 10% off their next order. Growing the
                natural food community, one family at a time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
