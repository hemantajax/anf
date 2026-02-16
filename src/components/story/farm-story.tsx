"use client";

import {
  BookOpen,
  Sprout,
  Droplets,
  Layers,
  Droplet,
  Trees,
  Heart,
  ShieldCheck,
  ShieldX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_FARM_STORY,
  CHEMICALS_NOT_USED,
  WHAT_WE_USE,
  FARMING_COMPARISONS,
} from "@/lib/story-data";

const ICON_MAP: Record<string, React.ReactNode> = {
  droplets: <Droplets className="size-5" />,
  sprout: <Sprout className="size-5" />,
  layers: <Layers className="size-5" />,
  droplet: <Droplet className="size-5" />,
  trees: <Trees className="size-5" />,
  heart: <Heart className="size-5" />,
};

const CERT_ICONS: Record<string, React.ReactNode> = {
  "soil-test": <Layers className="size-4" />,
  "water-test": <Droplets className="size-4" />,
  organic: <ShieldCheck className="size-4" />,
  other: <FileCheck2 className="size-4" />,
};

export function FarmStoryPage() {
  const story = DEFAULT_FARM_STORY;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="size-6" />
          Our Story
        </h1>
        <p className="text-muted-foreground mt-1">
          Why we farm the way we do — Palekar Zero Budget Natural Farming,
          explained honestly.
        </p>
      </div>

      {/* Origin Story */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">The Journey</CardTitle>
          <CardDescription>How and why this farm was born</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {story.originStory}
          </p>
          <Separator className="my-4" />
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-4">
            <h4 className="font-medium text-emerald-700 dark:text-emerald-400 text-sm mb-1">
              Our Vision
            </h4>
            <p className="text-sm text-muted-foreground">{story.vision}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="principles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="principles">ZBNF Principles</TabsTrigger>
          <TabsTrigger value="comparison">Chemical vs Natural</TabsTrigger>
          <TabsTrigger value="transparency">What We Use</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* ZBNF Principles */}
        <TabsContent value="principles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {story.principles.map((principle) => (
              <Card key={principle.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                      {ICON_MAP[principle.icon] || (
                        <Sprout className="size-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {principle.name}
                      </CardTitle>
                      {principle.hindiName && (
                        <CardDescription className="text-xs">
                          {principle.hindiName}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Side-by-side Comparison */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Chemical Farming vs Our Natural Farming
              </CardTitle>
              <CardDescription>
                A transparent comparison of what goes into your food
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                        Aspect
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-red-500">
                        Chemical Farming
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-emerald-500">
                        Our Natural Farming
                      </th>
                      <th className="text-left py-2 font-medium text-blue-500">
                        Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FARMING_COMPARISONS.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">{row.aspect}</td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          <span className="flex items-start gap-1.5">
                            <XCircle className="size-3.5 text-red-400 mt-0.5 shrink-0" />
                            {row.chemical}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          <span className="flex items-start gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            {row.natural}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {row.impact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* What We Use / Don't Use */}
        <TabsContent value="transparency" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-500">
                  <ShieldX className="size-5" />
                  What We NEVER Use
                </CardTitle>
                <CardDescription>
                  Zero tolerance — these never touch our soil, water, or produce
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {CHEMICALS_NOT_USED.map((chemical, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm p-2 rounded-lg bg-red-50 dark:bg-red-950/20"
                    >
                      <XCircle className="size-4 text-red-400 shrink-0" />
                      <span className="text-muted-foreground">{chemical}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-500">
                  <ShieldCheck className="size-5" />
                  What We Actually Use
                </CardTitle>
                <CardDescription>
                  Every single input on our farm — nothing hidden
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {WHAT_WE_USE.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20"
                    >
                      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certifications */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {story.certifications.map((cert) => (
              <Card key={cert.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                      {CERT_ICONS[cert.type] || (
                        <FileCheck2 className="size-4" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{cert.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {cert.issuer}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      Issued: {new Date(cert.date).toLocaleDateString("en-IN")}
                    </Badge>
                    {cert.validUntil && (
                      <Badge variant="outline" className="text-xs">
                        Valid until:{" "}
                        {new Date(cert.validUntil).toLocaleDateString("en-IN")}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <ArrowRight className="size-4 mt-0.5 shrink-0 text-emerald-500" />
                All certifications and lab reports are available for inspection
                at the farm. We encourage every customer to visit and verify. If
                you ever find any chemical on our farm, we will refund every
                rupee you have ever spent with us.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
