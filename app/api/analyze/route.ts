import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import mockData from "../../../public/samples/mock-data.json";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const isPreset = formData.get("isPreset") === "true";

    // 1초 체험 프리셋이거나 파일이 없는 경우 사전 가공된 목업 데이터 즉시 반환
    if (isPreset || !file) {
      return NextResponse.json(mockData);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      당신은 전공 서적 및 학술 논문 특화 AI 학습 튜터 '렉처렌즈'입니다.
      제공된 문서를 꼼꼼히 분석하여 다음 조건에 맞는 JSON 형식으로만 응답하세요.
      
      1. 핵심 요약 (3개 영역):
         - 핵심 결론 (key_conclusions): 연구의 궁극적 목표와 성과
         - 연구 방법론 (methodology): 데이터, 아키텍처, 증명 방식
         - 주요 내용 (key_takeaways): 시사점 및 한계점
         - 각 요약 항목마다 반드시 본문의 위치 정보(예: 'Pg. 3, Ln. 12')를 표기하세요.
      
      2. 개념 검증 퀴즈 (3문항 이상):
         - 난이도별(하, 중, 상) 및 유형별(객관식, 주관식)로 구성하세요.
         - 각 문제는 위의 요약 항목(linked_summary_id)과 연계되어야 합니다.
         - 상세 해설과 출제 근거 페이지를 명확히 작성하세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: buffer.toString("base64"),
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: "문서 분석 중 오류가 발생했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
