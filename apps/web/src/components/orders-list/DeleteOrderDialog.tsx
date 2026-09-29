"use client";

import { useEffect, useRef } from "react";
import type { Order } from "@/types/inventory";

interface DeleteOrderDialogProps {
  order: Order;
  productCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  error: string | null;
}

export default function DeleteOrderDialog({ order, productCount, onCancel, onConfirm, isDeleting, error }: DeleteOrderDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  function cancel() {
    if (isDeleting) return;
    dialogRef.current?.close();
    onCancel();
  }

  function confirm() {
    if (isDeleting) return;
    onConfirm();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    cancelRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="delete-order-dialog" aria-labelledby="delete-order-title" aria-describedby="delete-order-description"
      onCancel={(event) => { event.preventDefault(); cancel(); }}>
      <div className="p-4 d-flex align-items-start gap-3">
        <h2 id="delete-order-title" className="h4 mb-0 flex-grow-1">Вы уверены, что хотите удалить этот приход?</h2>
        <button type="button" className="btn-close flex-shrink-0" aria-label="Закрыть окно удаления" onClick={cancel} disabled={isDeleting} />
      </div>
      <div className="delete-order-dialog__summary px-4 py-3">
        <p className="fw-semibold mb-2">{order.title}</p>
        <p id="delete-order-description" className="mb-0 text-secondary">
          {productCount > 0 ? `Вместе с приходом будут удалены связанные товары: ${productCount}.` : "В этом приходе нет товаров."}
        </p>
      </div>
      {error && <p className="alert alert-danger mx-4 mt-3" role="alert">{error}</p>}
      <div className="delete-order-dialog__footer d-flex justify-content-end flex-wrap gap-3 p-4" aria-busy={isDeleting}>
        <button ref={cancelRef} type="button" className="btn btn-outline-dark rounded-pill px-4" onClick={cancel} disabled={isDeleting}>Отменить</button>
        <button type="button" className="btn btn-light text-danger rounded-pill px-4" onClick={confirm} disabled={isDeleting}>{isDeleting ? "Удаление…" : "Удалить"}</button>
      </div>
    </dialog>
  );
}
