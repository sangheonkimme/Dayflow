/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// MobileApp이 setOpenTxn을 등록하면 외부 어디서든 openTxnDetail(txn) 호출 가능.
let _openTxnRef = null;

export const setOpenTxnRef = (fn) => {
  _openTxnRef = fn;
};

export const openTxnDetail = (txn) => {
  if (_openTxnRef) _openTxnRef(txn);
};
