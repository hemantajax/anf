"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { Toolbar } from "./toolbar";
import { FarmCanvas } from "./farm-canvas";
import { LayersPanel } from "./layers-panel";
import { PropertiesPanel } from "./properties-panel";
import { StatusBar } from "./status-bar";
import { LegendPanel } from "./legend-panel";

export function DesignerLayout() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showPanels, setShowPanels] = useState(false);

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

        {/* Canvas + Legend overlay */}
        <div ref={canvasContainerRef} className="flex-1 overflow-hidden relative">
          <FarmCanvas
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
          />
          <LegendPanel />

          {/* Toggle button for right panels */}
          <button
            onClick={() => setShowPanels((p) => !p)}
            className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1.5 rounded-md bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800/90 transition-colors backdrop-blur-sm"
            title={showPanels ? "Hide panels" : "Show panels"}
          >
            {showPanels ? (
              <PanelRightClose className="h-3.5 w-3.5" />
            ) : (
              <PanelRightOpen className="h-3.5 w-3.5" />
            )}
            <span>{showPanels ? "Hide" : "Panels"}</span>
          </button>
        </div>

        {/* Right panels — collapsible */}
        {showPanels && (
          <div className="flex animate-in slide-in-from-right-2 duration-150">
            <LayersPanel />
            <PropertiesPanel />
          </div>
        )}
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  );
}
