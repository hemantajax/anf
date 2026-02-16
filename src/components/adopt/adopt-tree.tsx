"use client";

import { useState } from "react";
import {
  TreeDeciduous,
  MapPin,
  Calendar,
  IndianRupee,
  Heart,
  CheckCircle2,
  Gift,
  Leaf,
  Award,
  Users,
  Smartphone,
  User,
  PartyPopper,
  Sprout,
  Droplets,
  Wind,
  Bug,
  ShoppingBasket,
  Percent,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerStore } from "@/stores/customer-store";
import { formatPrice } from "@/lib/pricing-utils";
import type { AdoptableTree } from "@/types/customer";

/* ---------- Adoption Dialog ---------- */

function AdoptionDialog({
  tree,
  open,
  onOpenChange,
}: {
  tree: AdoptableTree | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { adoptTree, addCustomer, customers } = useCustomerStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");

  if (!tree) return null;

  const handleAdopt = () => {
    if (!name.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    const adoptionId = `adopt-${Date.now()}`;
    const refCode =
      name.trim().split(" ")[0].toUpperCase() +
      Math.floor(Math.random() * 100);

    adoptTree(tree.id, {
      id: adoptionId,
      treeId: tree.id,
      customerName: name.trim(),
      customerPhone: phone.trim() || undefined,
      adoptionDate: now,
      adoptionFee: tree.adoptionFee,
      vegetableCreditsUsed: 0,
      vegetableCreditsRemaining: tree.vegetableCredits,
      status: "active",
    });

    if (!customers.find((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
      addCustomer({
        id: `cust-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim() || undefined,
        joinDate: now,
        adoptions: [adoptionId],
        totalSpent: tree.adoptionFee,
        chemicalsAvoided: 0,
        referralCode: refCode,
      });
    }
    setStep("success");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setName(""); setPhone(""); setStep("form"); }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="size-5 text-pink-500" />
                Adopt: {tree.species}{tree.variety ? ` (${tree.variety})` : ""}
              </DialogTitle>
              <DialogDescription>
                One-time {formatPrice(tree.adoptionFee)} — you get the same
                amount back in seasonal vegetables immediately.
              </DialogDescription>
            </DialogHeader>

            {/* What you get */}
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 p-3 space-y-1.5 text-xs text-muted-foreground">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                What you get
              </p>
              <p className="flex items-start gap-1.5">
                <ShoppingBasket className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                {formatPrice(tree.vegetableCredits)} worth of seasonal vegetables — redeem anytime
              </p>
              <p className="flex items-start gap-1.5">
                <Award className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                Your name tag on the tree + photo shared
              </p>
              <p className="flex items-start gap-1.5">
                <Camera className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                Quarterly growth updates with photos
              </p>
              <p className="flex items-start gap-1.5">
                <Gift className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                One-time gift of {tree.produceGift.oneTimeGift} {tree.species.toLowerCase()} at first harvest (Year {tree.produceGift.firstHarvestYear})
              </p>
              <p className="flex items-start gap-1.5">
                <Percent className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                {tree.produceGift.memberDiscountPercent}% member discount on all future produce purchases
              </p>
              <p className="flex items-start gap-1.5">
                <Wind className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                {tree.carbonImpact.co2AbsorbedKgPerYear} kg CO2 offset per year — your contribution to the planet
              </p>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="adopter-name" className="text-xs">
                  <User className="size-3" /> Your Name *
                </Label>
                <Input id="adopter-name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adopter-phone" className="text-xs">
                  <Smartphone className="size-3" /> Phone / WhatsApp (optional)
                </Label>
                <Input id="adopter-phone" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-3">
              <p className="text-xs text-muted-foreground">
                <strong className="text-amber-700 dark:text-amber-400">Payment:</strong>{" "}
                {formatPrice(tree.adoptionFee)} one-time via UPI, bank transfer, or cash on visit. We will contact you to arrange.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAdopt} disabled={!name.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Heart className="size-4 mr-1.5" />
                Adopt — {formatPrice(tree.adoptionFee)}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="text-center py-4 space-y-4">
              <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto">
                <PartyPopper className="size-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Welcome to the Farm Family!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Thank you, <strong>{name}</strong>! Your <strong>{tree.species}{tree.variety ? ` (${tree.variety})` : ""}</strong> in {tree.zone} is now yours.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2 text-sm">
                <h4 className="font-medium text-center mb-2">What happens next</h4>
                {[
                  `${formatPrice(tree.vegetableCredits)} vegetable credits ready — pick up from the farm anytime`,
                  "Name tag placed on your tree within 7 days of payment (photo shared)",
                  "Quarterly growth updates with photos",
                  `One-time gift of ${tree.produceGift.oneTimeGift} ${tree.species.toLowerCase()} when tree first fruits (Year ${tree.produceGift.firstHarvestYear})`,
                  `${tree.produceGift.memberDiscountPercent}% discount on all produce purchases — forever`,
                  `Your tree absorbs ${tree.carbonImpact.co2AbsorbedKgPerYear} kg CO2 every year`,
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Carbon Impact Mini Card ---------- */

function CarbonImpactCard({ tree }: { tree: AdoptableTree }) {
  return (
    <div className="rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 p-2.5 space-y-1.5">
      <h5 className="text-[10px] font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
        Your Environmental Impact
      </h5>
      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Wind className="size-3 text-sky-500 shrink-0" />
          {tree.carbonImpact.co2AbsorbedKgPerYear} kg CO2/year
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Droplets className="size-3 text-sky-500 shrink-0" />
          {(tree.carbonImpact.waterSavedLitresPerYear / 1000).toFixed(0)}K L water saved
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Sprout className="size-3 text-sky-500 shrink-0" />
          {tree.carbonImpact.soilProtectedSqFt} sq.ft soil protected
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Bug className="size-3 text-sky-500 shrink-0" />
          {tree.carbonImpact.biodiversityScore.split("—")[0].trim()}
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export function AdoptTree() {
  const { trees, adoptions } = useCustomerStore();
  const [selectedTree, setSelectedTree] = useState<AdoptableTree | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const availableTrees = trees.filter((t) => t.status === "available");
  const adoptedTrees = trees.filter((t) => t.status === "adopted");
  const activeAdoptions = adoptions.filter((a) => a.status === "active");
  const totalFunds = activeAdoptions.reduce((s, a) => s + a.adoptionFee, 0);
  const totalCO2 = adoptedTrees.reduce((s, t) => s + t.carbonImpact.co2AbsorbedKgPerYear, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <AdoptionDialog tree={selectedTree} open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TreeDeciduous className="size-6" />
          Adopt a Tree
        </h1>
        <p className="text-muted-foreground mt-1">
          One-time ₹500-₹1,000. Get your money back in vegetables, a produce gift at first harvest, and 10% member discount forever.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <TreeDeciduous className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{availableTrees.length}</p>
              <p className="text-xs text-muted-foreground">Trees available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center">
              <Heart className="size-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeAdoptions.length}</p>
              <p className="text-xs text-muted-foreground">Trees adopted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <IndianRupee className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(totalFunds)}</p>
              <p className="text-xs text-muted-foreground">Funds raised</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center">
              <Wind className="size-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCO2} kg</p>
              <p className="text-xs text-muted-foreground">CO2 offset/year</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it works — simple 4 steps */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How It Works — Simple and Honest</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", title: "Pay Once", desc: "₹500-₹1,000 one-time. No yearly fees. No hidden charges." },
              { n: "2", title: "Get Veggies Back", desc: "100% of your fee returned as seasonal vegetable credits. Your money isn't gone." },
              { n: "3", title: "First Harvest Gift", desc: "When the tree first fruits, you get a one-time produce gift (2-5 kg)." },
              { n: "4", title: "10% Discount Forever", desc: "All future produce purchases at 10% member discount. Name tag, updates, farm visits." },
            ].map((item) => (
              <div key={item.n} className="rounded-lg border p-3 space-y-1.5">
                <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {item.n}
                </div>
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tree listings */}
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available ({availableTrees.length})</TabsTrigger>
          <TabsTrigger value="adopted">Adopted ({adoptedTrees.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableTrees.map((tree) => (
              <Card key={tree.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TreeDeciduous className="size-4 text-emerald-600" />
                        {tree.species}
                      </CardTitle>
                      {tree.variety && <CardDescription className="text-xs mt-0.5">Variety: {tree.variety}</CardDescription>}
                    </div>
                    <Badge variant="secondary" className="text-xs">{tree.zone}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {/* Price */}
                  <div className="text-center rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-3">
                    <p className="text-2xl font-bold text-emerald-600">{formatPrice(tree.adoptionFee)}</p>
                    <p className="text-[10px] text-muted-foreground">one-time · get {formatPrice(tree.vegetableCredits)} veggies back</p>
                  </div>

                  {/* What you get */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ShoppingBasket className="size-3 text-emerald-500 shrink-0" />
                      {formatPrice(tree.vegetableCredits)} vegetables — redeem anytime
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Gift className="size-3 text-emerald-500 shrink-0" />
                      {tree.produceGift.oneTimeGift} free at first harvest (Year {tree.produceGift.firstHarvestYear})
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Percent className="size-3 text-emerald-500 shrink-0" />
                      {tree.produceGift.memberDiscountPercent}% discount on all purchases after
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Award className="size-3 text-emerald-500 shrink-0" />
                      Name tag + quarterly updates + farm visits
                    </div>
                  </div>

                  <CarbonImpactCard tree={tree} />
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" size="sm" onClick={() => { setSelectedTree(tree); setDialogOpen(true); }}>
                    <Heart className="size-4 mr-1.5" />
                    Adopt for {formatPrice(tree.adoptionFee)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="adopted" className="space-y-4">
          {adoptedTrees.length === 0 ? (
            <Card className="py-12"><CardContent className="text-center text-muted-foreground">No trees adopted yet.</CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {adoptedTrees.map((tree) => {
                const adoption = adoptions.find((a) => a.treeId === tree.id);
                return (
                  <Card key={tree.id} className="flex flex-col border-emerald-200 dark:border-emerald-900">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <TreeDeciduous className="size-4 text-emerald-600" />
                            {tree.species}
                          </CardTitle>
                          {tree.variety && <CardDescription className="text-xs mt-0.5">{tree.variety}</CardDescription>}
                        </div>
                        <Badge className="text-xs bg-emerald-500"><CheckCircle2 className="size-3 mr-0.5" />Adopted</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Adopted by</span>
                        <span className="font-medium">{tree.adoptedBy}</span>
                      </div>
                      {adoption && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Since</span>
                            <span className="font-medium text-xs">
                              {new Date(adoption.adoptionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Paid</span>
                            <span className="font-medium text-emerald-600">{formatPrice(adoption.adoptionFee)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Veg credits left</span>
                            <span className="font-medium">{formatPrice(adoption.vegetableCreditsRemaining)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">First harvest gift</span>
                        <span className="font-medium text-xs">{tree.produceGift.oneTimeGift} (Year {tree.produceGift.firstHarvestYear})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Member discount</span>
                        <span className="font-medium">{tree.produceGift.memberDiscountPercent}% off</span>
                      </div>
                      <CarbonImpactCard tree={tree} />
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-2.5 text-center">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                          <Award className="size-3" />
                          Thank you, {tree.adoptedBy}!
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Plan table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Adoption Plan by Tree</CardTitle>
          <CardDescription>Simple, honest, no ongoing obligations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Tree</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Fee</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Veggies Back</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">1st Harvest Gift</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">After That</th>
                </tr>
              </thead>
              <tbody>
                {trees.filter((t, i, a) => a.findIndex((x) => x.species === t.species) === i).map((tree) => (
                  <tr key={tree.id} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{tree.species}</td>
                    <td className="py-2.5 pr-4 text-emerald-600 font-medium">{formatPrice(tree.adoptionFee)}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{formatPrice(tree.vegetableCredits)}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant="secondary" className="text-xs">
                        {tree.produceGift.oneTimeGift} free (Year {tree.produceGift.firstHarvestYear})
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant="outline" className="text-xs">
                        {tree.produceGift.memberDiscountPercent}% discount on purchases
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
