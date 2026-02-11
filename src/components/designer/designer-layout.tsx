"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Toolbar } from "./toolbar";
import { FarmCanvas } from "./farm-canvas";
import { LayersPanel } from "./layers-panel";
import { PropertiesPanel } from "./properties-panel";
import { StatusBar } from "./status-bar";

export function DesignerLayout() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const updateDimensions = useCallback(() => {
    if (canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }
    return () => observer.disconnect();
  }, [updateDimensions]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <Toolbar />

        {/* Canvas */}
        <div ref={canvasContainerRef} className="flex-1 overflow-hidden">
          <FarmCanvas
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
        </div>

        {/* Right panels */}
        <div className="flex">
          <LayersPanel />
          <PropertiesPanel />
        </div>
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  );
}
