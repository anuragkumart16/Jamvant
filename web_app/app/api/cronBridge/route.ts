export async function GET() {
  // 1. Respond immediately so cron-job.org never times out
  const response = Response.json({ success: true });

  // 2. Fire-and-forget logic after response
  setTimeout(() => {
    console.log("Triggering backend cron...");

    fetch(`${process.env.BACKEND_URL}/cron`, {
      // GET is default method → no need to specify
      signal: AbortSignal.timeout(5000), // auto timeout after 5 sec
    })
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        console.log("Backend responded:", data);
      })
      .catch((err) => {
        console.error("Render API failed:", err);
      });
  }, 0);

  return response;
}
