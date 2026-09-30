"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import { useLocale } from "@/i18n/LocaleProvider";
import "leaflet/dist/leaflet.css";

const initialBounds: [[number, number], [number, number]] = [[44.2, 22.1], [52.4, 40.2]];

export default function MapView() {
  const { ui } = useLocale();
  const hintId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tilesRef = useRef<TileLayer | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [tileError, setTileError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | undefined;
    let observer: ResizeObserver | undefined;
    setStatus("loading");
    setTileError(false);
    // Leaflet обращается к window: импортируем только после открытия карты в браузере.
    void import("leaflet").then(L => {
      if (cancelled || !containerRef.current) return;
      map = L.map(containerRef.current, { zoomControl: false, minZoom: 2, maxZoom: 19, scrollWheelZoom: false });
      mapRef.current = map;
      map.fitBounds(initialBounds, { padding: [12, 12], animate: false });
      setZoom(map.getZoom());
      map.on("zoomend", () => { if (map) setZoom(map.getZoom()); });
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
      tiles.on("tileerror", () => setTileError(true));
      tiles.addTo(map);
      tilesRef.current = tiles;
      observer = new ResizeObserver(() => map?.invalidateSize({ pan: false }));
      observer.observe(containerRef.current);
      setStatus("ready");
    }).catch(() => { if (!cancelled) setStatus("error"); });
    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
      mapRef.current = null;
      tilesRef.current = null;
    };
  }, [attempt]);

  return <div className="mt-3">
    <p id={hintId} className="small text-secondary">{ui.mapHint}</p>
    <div className="d-flex flex-wrap gap-2 mb-3">
      <button type="button" className="btn btn-outline-secondary btn-sm" disabled={status !== "ready" || zoom >= 19}
        aria-label={ui.mapZoomIn} title={ui.mapZoomIn} onClick={() => mapRef.current?.zoomIn()}>+</button>
      <button type="button" className="btn btn-outline-secondary btn-sm" disabled={status !== "ready" || zoom <= 2}
        aria-label={ui.mapZoomOut} title={ui.mapZoomOut} onClick={() => mapRef.current?.zoomOut()}>−</button>
      <button type="button" className="btn btn-outline-secondary btn-sm" disabled={status !== "ready"}
        onClick={() => mapRef.current?.fitBounds(initialBounds, { padding: [12, 12], animate: false })}>{ui.mapReset}</button>
    </div>
    {status === "loading" && <p role="status">{ui.mapLoading}</p>}
    {(status === "error" || tileError) && <div className="alert alert-warning" role="alert">
      <p>{ui.mapError}</p>
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
        if (status === "error") setAttempt(value => value + 1);
        else { setTileError(false); tilesRef.current?.redraw(); }
      }}>{ui.retry}</button>
    </div>}
    <div ref={containerRef} className="inventory-map__canvas" role="region" aria-label={ui.mapTitle}
      aria-describedby={hintId} tabIndex={0} />
  </div>;
}
