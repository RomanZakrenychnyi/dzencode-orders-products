"use client";

import { useId, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import MapView from "./MapView";
import "./map.scss";

export default function MapSection() {
  const { ui } = useLocale();
  const [open, setOpen] = useState(false);
  const id = useId();
  return <section className="inventory-map mt-4 p-3 p-md-4" aria-labelledby={`${id}-title`}>
    <div className="d-flex align-items-center justify-content-between gap-3">
      <h2 id={`${id}-title`} className="h5 mb-0">{ui.mapTitle}</h2>
      <button type="button" className="btn btn-outline-secondary btn-sm" aria-expanded={open}
        aria-controls={id} onClick={() => setOpen(value => !value)}>{open ? ui.mapHide : ui.mapShow}</button>
    </div>
    <div id={id}>{open && <MapView />}</div>
  </section>;
}
