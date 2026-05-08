/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventModal } from "@/screens/calendar/EventModal";

// 회귀 가드: EventModal Quick/Detailed 흐름은 저장 시 onSave를 호출해야 한다.

describe("EventModal — quick & detailed save", () => {
  it("Quick: 자연어 입력 후 저장 시 onSave가 호출된다", () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<EventModal onClose={onClose} onSave={onSave} />);

    const input = screen.getByPlaceholderText(/예:.*미팅/);
    fireEvent.change(input, { target: { value: "내일 오후 3시 팀 미팅" } });
    fireEvent.click(screen.getByRole("button", { name: /저장 \(Enter\)/ }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const arg = onSave.mock.calls[0][0];
    expect(arg.title).toContain("팀 미팅");
    expect(arg.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(arg.startTime).toMatch(/^\d{2}:\d{2}$/);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Quick: Enter 키로도 onSave가 호출된다", () => {
    const onSave = vi.fn();
    render(<EventModal onClose={() => {}} onSave={onSave} />);

    const input = screen.getByPlaceholderText(/예:.*미팅/);
    fireEvent.change(input, { target: { value: "월요일 10시 디자인 리뷰" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("Detailed: 저장하기 버튼이 onSave를 호출한다", () => {
    const onSave = vi.fn();
    render(<EventModal onClose={() => {}} onSave={onSave} />);

    fireEvent.click(screen.getByRole("button", { name: /상세 입력/ }));

    // step 0: 제목 입력 후 다음
    const titleInput = screen.getByPlaceholderText(/예:.*스탠드업/);
    fireEvent.change(titleInput, { target: { value: "팀 회의" } });
    fireEvent.click(screen.getByRole("button", { name: /다음/ }));

    // step 1: 카테고리 → 다음
    fireEvent.click(screen.getByRole("button", { name: "업무" }));
    fireEvent.click(screen.getByRole("button", { name: /다음/ }));

    // step 2: 저장하기
    fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const arg = onSave.mock.calls[0][0];
    expect(arg.title).toBe("팀 회의");
    expect(arg.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(arg.startTime).toMatch(/^\d{2}:\d{2}$/);
    expect(arg.endTime).toMatch(/^\d{2}:\d{2}$/);
  });
});
