// 결제 webhook 공용 서명 검증.
// Toss / LemonSqueezy 두 라우트가 동일한 HMAC-SHA256 + 상수시간 비교 패턴을
// 반복하므로 공용화(단발 유틸 아님 — 실 재사용 2곳).
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * rawBody 를 secret 으로 HMAC-SHA256 서명한 값과 provided 서명을 상수시간 비교한다.
 * - 타이밍 어택 방어: timingSafeEqual (early-return 문자열 비교 금지).
 * - 길이 불일치 시 즉시 false (timingSafeEqual 는 동일 길이 버퍼만 허용).
 * - secret/provided 빈 값이면 false.
 *
 * @param encoding provided 서명의 인코딩. LemonSqueezy=hex, Toss=hex(기본).
 */
export function verifyHmacSha256(
  rawBody: string,
  secret: string,
  provided: string,
  encoding: "hex" | "base64" = "hex",
): boolean {
  if (!secret || !provided) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest();
  let providedBuf: Buffer;
  try {
    providedBuf = Buffer.from(provided, encoding);
  } catch {
    return false;
  }
  if (providedBuf.length !== expected.length) return false;
  return timingSafeEqual(expected, providedBuf);
}
