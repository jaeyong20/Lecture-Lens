import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `
      당신은 친절하고 명쾌한 대학 전공 튜터 '렉처렌즈'입니다.
      학습자가 문서 요약이나 퀴즈를 풀면서 이해가 안 가는 개념을 질문하면,
      수식과 어려운 용어를 직관적이고 쉬운 비유(파인만 기법)를 활용하여 눈높이에 맞게 설명해 주세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `[문맥 정보]: ${context || "전공 문서 학습 중"}\n\n[질문]: ${message}` },
          ],
        },
      ],
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { error: "튜터 응답 중 오류가 발생했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
