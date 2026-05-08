/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TxnModal } from "@/pages/ledger/TxnModal";

// 회귀 가드: TxnModal Quick/Detailed 흐름은 저장 시 onSave를 호출해야 한다.
// 과거에 onClose만 호출하고 onSave 누락된 적이 있어 영구 검증 추가.

describe("TxnModal — quick & detailed save", () => {
  it("Quick: '저장' 버튼 클릭 시 onSave가 도메인 형태로 호출된다", () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<TxnModal onClose={onClose} onSave={onSave} />);

    const input = screen.getByPlaceholderText(/예:/);
    fireEvent.change(input, { target: { value: "점심 8000 식비" } });

    const saveBtn = screen.getByRole("button", { name: /저장 \(Enter\)/ });
    fireEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledTimes(1);
    const arg = onSave.mock.calls[0][0];
    expect(arg.type).toBe("out");
    expect(arg.amount).toBe(-8000);
    expect(arg.cat).toBe("식비");
    expect(typeof arg.date).toBe("string");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Quick: Enter 키로도 onSave가 호출된다", () => {
    const onSave = vi.fn();
    render(<TxnModal onClose={() => {}} onSave={onSave} />);

    const input = screen.getByPlaceholderText(/예:/);
    fireEvent.change(input, { target: { value: "커피 4500" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0].amount).toBe(-4500);
  });

  it("Detailed 3-step: 저장하기 버튼이 onSave를 호출한다", () => {
    const onSave = vi.fn();
    render(<TxnModal onClose={() => {}} onSave={onSave} />);

    // step 0 (quick) → '상세 입력' 버튼으로 detailed 진입
    fireEvent.click(screen.getByRole("button", { name: /상세 입력/ }));

    // detailed step 0: numpad로 5000 입력
    fireEvent.click(screen.getByRole("button", { name: "5" }));
    fireEvent.click(screen.getByRole("button", { name: "000" }));
    fireEvent.click(screen.getByRole("button", { name: /다음/ }));

    // step 1: 카테고리 선택 (식비)
    fireEvent.click(screen.getByRole("button", { name: "식비" }));
    fireEvent.click(screen.getByRole("button", { name: /다음/ }));

    // step 2: 메모 입력 후 저장하기
    const memo = screen.getByPlaceholderText(/김밥/);
    fireEvent.change(memo, { target: { value: "점심" } });
    fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const arg = onSave.mock.calls[0][0];
    expect(arg.amount).toBe(-5000);
    expect(arg.cat).toBe("식비");
    expect(arg.label).toBe("점심");
  });
});
