export async function GET() {
  const response = Response.json({ success: true });

  setTimeout(() => {
    console.log("Triggering cron job...");  
    fetch(`${process.env.BACKEND_URL}/cron`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ run: true }),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
    //   console.log("Cron job triggered successfully");
    })
    .catch((err) => {
      console.error("Render API failed:", err);
    });
  }, 0);

  return response;
}
