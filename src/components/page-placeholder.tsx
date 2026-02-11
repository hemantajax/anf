"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PagePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
  features: string[];
}

export function PagePlaceholder({
  icon: Icon,
  title,
  description,
  phase,
  features,
}: PagePlaceholderProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center text-center pt-8 pb-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              {description}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {phase}
          </Badge>
          <div className="w-full pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Planned features:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {features.map((f) => (
                <Badge key={f} variant="secondary" className="text-xs">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
