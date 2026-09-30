"use client";

import { useLocale } from "@/i18n/LocaleProvider";

interface Props {
  isError: boolean;
  isFetching: boolean;
  retry: () => void;
}

export default function InventoryRequestState({ isError, isFetching, retry }: Props) {
  const { ui } = useLocale();
  if (isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <p>{ui.loadError}</p>
        <button type="button" className="btn btn-outline-danger btn-sm" disabled={isFetching} onClick={retry}>
          {isFetching ? ui.loading : ui.retry}
        </button>
      </div>
    );
  }
  return <p role="status">{ui.loadingData}</p>;
}
