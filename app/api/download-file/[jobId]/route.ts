import { NextResponse } from "next/server";

const WORKER_URL = process.env.WORKER_URL?.replace(/\/+$/, "");
const WORKER_API_KEY = process.env.WORKER_API_KEY;

export async function GET(_request: Request, { params }: RouteContext<"/api/download-file/[jobId]">) {
  if (!WORKER_URL || !WORKER_API_KEY) {
    return NextResponse.json({ error: "Downloader service is not configured yet." }, { status: 503 });
  }

  try {
    const { jobId } = await params;
    const response = await fetch(`${WORKER_URL}/download-file/${encodeURIComponent(jobId)}`, {
      headers: { "x-api-key": WORKER_API_KEY },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "The prepared file is no longer available." }, { status: response.status });
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": response.headers.get("content-disposition") || 'attachment; filename="instagram-reel.mp4"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to retrieve the file. Please try again." }, { status: 503 });
  }
}
