// MobileApp이 setOpenTxn을 등록하면 외부 어디서든 openTxnDetail(txn) 호출 가능.
type TxnHandler = (txn: unknown) => void;

let _openTxnRef: TxnHandler | null = null;

export const setOpenTxnRef = (fn: TxnHandler | null) => {
  _openTxnRef = fn;
};

export const openTxnDetail = (txn: unknown) => {
  if (_openTxnRef) _openTxnRef(txn);
};
