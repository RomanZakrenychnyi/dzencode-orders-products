"use client";

import { Component, Suspense, lazy, type ReactNode, type ComponentProps } from "react";
import { useLocale } from "@/i18n/LocaleProvider";

const DeleteOrderDialog = lazy(() => import("./DeleteOrderDialog"));
type Props = ComponentProps<typeof DeleteOrderDialog>;

class LoadBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function LazyDeleteOrderDialog(props: Props) {
  const { ui } = useLocale();
  return <LoadBoundary fallback={
    <div className="alert alert-danger mt-3" role="alert">
      <p>{ui.dialogLoadError}</p>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-secondary btn-sm" onClick={props.onCancel}>{ui.cancel}</button>
        <button className="btn btn-outline-danger btn-sm" onClick={() => window.location.reload()}>{ui.reloadPage}</button>
      </div>
    </div>
  }>
    <Suspense fallback={
      <div className="alert alert-light border mt-3 d-flex align-items-center gap-3">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
        <span role="status">{ui.dialogLoading}</span>
        <button className="btn btn-outline-secondary btn-sm ms-auto" onClick={props.onCancel}>{ui.cancel}</button>
      </div>
    }>
      <DeleteOrderDialog {...props} />
    </Suspense>
  </LoadBoundary>;
}
