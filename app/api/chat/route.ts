import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "API 키가 등록되지 않았습니다. .env.local을 확인해 주세요."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
당신은 전공 서적 및 학술 논문을 친절하고 명쾌하게 가르쳐주는 AI 학업 튜터 '렉처렌즈'입니다.
학습자 수준에 맞추어 직관적이고 쉬운 비유(파인만 기법)를 사용해 명쾌하게 2~4문장으로 답변해 주세요.

[학습 중인 논문/문맥]: ${context || "Attention Is All You Need (Transformer)"}
[학습자 질문]: ${message}
`;

    // 안내받은 최신 gemini-3.6-flash 모델 호출
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const replyText = response.text || "답변을 생성하지 못했습니다. 다시 시도해 주세요.";
    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({
      reply: "튜터 서버와 통신하는 중 문제가 발생했습니다: " + (error.message || "잠시 후 다시 질문해 주세요.")
    });
  }
}
