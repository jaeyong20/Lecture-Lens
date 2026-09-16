import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import mockData from "../../../public/samples/mock-data.json";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const isPreset = formData.get("isPreset") === "true";

    // 1초 체험 프리셋이거나 파일이 없는 경우 목업 데이터 즉시 반환
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
당신은 전공 서적 및 학술 논문 특화 AI 학업 튜터 '렉처렌즈'입니다.
제공된 PDF 문서를 정밀하게 분석하여, 반드시 아래 명시된 JSON 포맷으로만 응답하세요. (순수 JSON만 출력)

[분석 요구사항]
1. 3단계 핵심 요약:
   - key_conclusions (핵심 결론 2~3개)
   - methodology (연구 방법론 2~3개)
   - key_takeaways (주요 시사점 2~3개)
   - 각 요약 항목마다 반드시 본문 출처(예: 'Pg. 2, Ln. 10' 또는 'Pg. 3')를 location에 명시하세요.

2. 개념 검증 퀴즈 (총 6문항 필수 생성):
   - 난이도 '하', '중', '상' 각각에 대해 'multiple_choice'(4지선다 객관식) 1문항씩 (총 3문항)
   - 난이도 '하', '중', '상' 각각에 대해 'short_answer'(단답형 주관식) 1문항씩 (총 3문항)
   - 각 문제마다 상세 해설(explanation)과 출제 근거 페이지(source_page)를 명확히 작성하세요.

[응답 JSON 규격]:
{
  "document_title": "문서 제목",
  "summary": {
    "key_conclusions": [
      { "id": "c-1", "location": "Pg. 1", "text": "핵심 결론 내용" }
    ],
    "methodology": [
      { "id": "m-1", "location": "Pg. 2", "text": "연구 방법론 내용" }
    ],
    "key_takeaways": [
      { "id": "t-1", "location": "Pg. 3", "text": "주요 시사점 내용" }
    ]
  },
  "quizzes": [
    {
      "id": "q-1",
      "difficulty": "하",
      "type": "multiple_choice",
      "question": "기초 개념 객관식 질문",
      "options": ["보기 1", "보기 2", "보기 3", "보기 4"],
      "correct_answer": "보기 1",
      "explanation": "상세 해설",
      "source_page": "Pg. 1"
    },
    {
      "id": "q-2",
      "difficulty": "하",
      "type": "short_answer",
      "question": "기초 개념 단답형 질문",
      "correct_answer": "정답 단어",
      "explanation": "해설",
      "source_page": "Pg. 2"
    },
    {
      "id": "q-3",
      "difficulty": "중",
      "type": "multiple_choice",
      "question": "핵심 원리 객관식 질문",
      "options": ["보기 1", "보기 2", "보기 3", "보기 4"],
      "correct_answer": "보기 2",
      "explanation": "해설",
      "source_page": "Pg. 3"
    },
    {
      "id": "q-4",
      "difficulty": "중",
      "type": "short_answer",
      "question": "핵심 원리 주관식 질문",
      "correct_answer": "정답 용어",
      "explanation": "해설",
      "source_page": "Pg. 4"
    },
    {
      "id": "q-5",
      "difficulty": "상",
      "type": "multiple_choice",
      "question": "심층 응용 객관식 질문",
      "options": ["보기 1", "보기 2", "보기 3", "보기 4"],
      "correct_answer": "보기 3",
      "explanation": "해설",
      "source_page": "Pg. 5"
    },
    {
      "id": "q-6",
      "difficulty": "상",
      "type": "short_answer",
      "question": "심화 주관식 질문",
      "correct_answer": "정답 개념",
      "explanation": "해설",
      "source_page": "Pg. 5"
    }
  ]
}
`;

    // 최신 gemini-3.6-flash 모델 호출
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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

    let resultText = response.text || "{}";
    resultText = resultText.trim();
    if (resultText.startsWith("```json")) {
      resultText = resultText.slice(7);
    } else if (resultText.startsWith("```")) {
      resultText = resultText.slice(3);
    }
    if (resultText.endsWith("```")) {
      resultText = resultText.slice(0, -3);
    }

    const parsedData = JSON.parse(resultText.trim());
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("PDF Analysis Error:", error);
    return NextResponse.json(
      { error: "PDF 분석 중 오류가 발생했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
