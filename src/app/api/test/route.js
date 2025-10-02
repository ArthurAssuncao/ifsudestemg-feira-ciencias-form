export async function GET() {
  console.log("✅ API TEST GET funcionando!");
  return Response.json({
    message: "API TEST está funcionando no App Router!",
    timestamp: new Date().toISOString(),
    status: "OK",
  });
}
