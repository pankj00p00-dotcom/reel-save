import { NextResponse } from "next/server";

const WORKER_URL = process.env.WORKER_URL?.replace(/\/+$/, "");
const WORKER_API_KEY = process.env.WORKER_API_KEY;

function isInstagramReel(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    return (hostname === "instagram.com" || hostname === "instagr.am") && /^\/(reel|reels)\//.test(parsed.pathname);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!WORKER_URL || !WORKER_API_KEY) {
    return NextResponse.json({ error: "Downloader service is not configured yet." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { url?: string };
    const url = body.url?.trim() ?? "";

    if (!isInstagramReel(url)) {
      return NextResponse.json({ error: "Please provide a valid Instagram Reel URL." }, { status: 400 });
    }

    const workerResponse = await fetch(`${WORKER_URL}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": WORKER_API_KEY },
      body: JSON.stringify({ platform: "instagram", url }),
      cache: "no-store",
    });
    const workerData = (await workerResponse.json().catch(() => null)) as { success?: boolean; jobId?: string; detail?: string; error?: string } | null;

    if (!workerResponse.ok || !workerData?.success || !workerData.jobId) {
      return NextResponse.json({ error: workerData?.detail || workerData?.error || "The Reel could not be processed." }, { status: workerResponse.status || 502 });
    }

    return NextResponse.json({ success: true, jobId: workerData.jobId });
  } catch {
    return NextResponse.json({ error: "Unable to reach the download service. Please try again." }, { status: 503 });
  }
}
