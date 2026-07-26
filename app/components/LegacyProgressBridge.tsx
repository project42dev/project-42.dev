"use client";

import { useEffect, useState } from "react";

const learnOrigin = "https://learn.project-42.dev";
const storageKey = "project42.progress.v1";
const transferRequest = "project42-progress-transfer-request-v1";
const transferResponse = "project42-progress-transfer-response-v1";

export function LegacyProgressBridge() {
  const [status, setStatus] = useState("Waiting for Project 42 Learn.");

  useEffect(() => {
    function respond(event: MessageEvent) {
      if (
        event.origin !== learnOrigin ||
        event.source !== window.parent ||
        event.data?.type !== transferRequest
      ) {
        return;
      }
      let payload: string | null = null;
      try {
        payload = window.localStorage.getItem(storageKey);
      } catch {
        setStatus("This browser did not allow access to the previous progress record.");
      }
      window.parent.postMessage({ type: transferResponse, payload }, learnOrigin);
      setStatus(
        payload
          ? "Your previous browser record is ready for you to review in Learn."
          : "No previous Project 42 progress was found in this browser.",
      );
    }
    window.addEventListener("message", respond);
    return () => window.removeEventListener("message", respond);
  }, []);

  return <p role="status">{status}</p>;
}
