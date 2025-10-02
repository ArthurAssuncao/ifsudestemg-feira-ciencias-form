export async function POST(request: Request) {
  console.log("📨 API validate POST chamada");

  try {
    const { password } = await request.json();
    console.log("✅ Password recebida:", password);

    const correctPassword = process.env.NEXT_PUBLIC_PASS;
    console.log("✅ Senha correta?", correctPassword);

    if (
      correctPassword &&
      password.toUpperCase() === correctPassword.toUpperCase()
    ) {
      console.log("✅ Senha correta!");
      return Response.json({
        success: true,
        message: "Senha correta!",
      });
    } else {
      console.log("❌ Senha incorreta");
      return Response.json({
        success: false,
        error: "Senha incorreta",
      });
    }
  } catch (error) {
    console.log("💥 Erro na API:", error);
    return Response.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("📨 API validate GET chamada");
  return Response.json({
    message: "API validate está funcionando!",
    timestamp: new Date().toISOString(),
    route: "app/api/validate/route.ts",
    instructions: 'Use POST method with { "password": "1234" }',
  });
}
