interface Props {
  isError: boolean;
  isFetching: boolean;
  retry: () => void;
}

export default function InventoryRequestState({ isError, isFetching, retry }: Props) {
  if (isError) {
    return (
      <div className="alert alert-danger" role="alert">
        <p>Не удалось загрузить данные. Попробуйте ещё раз.</p>
        <button type="button" className="btn btn-outline-danger btn-sm" disabled={isFetching} onClick={retry}>
          {isFetching ? "Загрузка…" : "Повторить"}
        </button>
      </div>
    );
  }
  return <p role="status">Загрузка данных…</p>;
}
