// Next 16 instrumentation 훅. 서버/edge 런타임별 Sentry 초기화 config 를 로드하고,
// RSC·route·proxy 에서 발생한 서버 에러를 캡처(onRequestError)한다.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
