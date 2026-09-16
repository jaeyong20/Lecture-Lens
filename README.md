# 📖 렉처렌즈 (LectureLens)
> **방대한 전공 서적과 영어 논문 PDF를 올리면 핵심 요약부터 개념 검증 퀴즈까지 10초 만에 생성해 주는 AI 학업 튜터**

---

## 📌 1. 프로젝트 개요 (Overview)
- **대상 사용자**: 영어 전공 원서 소화 및 학술 논문 리서치 시간 단축이 절실한 대학(원)생
- **해결 과제**:
  - 두꺼운 전공 원서와 복잡한 수식·도표 해석에 소모되는 과도한 시간
  - 기존 챗봇의 긴 문서 업로드 시 텍스트 잘림 현상 및 일방향 요약으로 인한 메타인지(이해도 점검) 부재
- **솔루션**: PDF 원본을 분석하여 **[3단계 핵심 요약 ➔ 인터랙티브 개념 검증 퀴즈 ➔ 원문 기반 맞춤형 튜터 챗]**으로 이어지는 완결된 액티브 리콜(Active Recall) 학습 루프 제공

---

## ✨ 2. 핵심 기능 (Key Features)

| 기능 | 설명 |
| :--- | :--- |
| **네이티브 PDF 분석 & 스마트 브리핑** | 논문 및 전공 원서의 수식/도표 맥락을 반영한 3단계(핵심 결론, 방법론, 주요 시사점) 구조화 요약 |
| **개념 검증 인터랙티브 퀴즈** | 본문 기반 4지선다 객관식 퀴즈 자동 출제 및 "원문 몇 페이지에서 출제되었는지" 근거 위치 표기 |
| **적응형 AI 튜터 챗** | "파인만 기법으로 학부 1학년 수준 설명", "면접관 시점 한계점 질문" 등 수준별 실시간 질의응답 |
| **원클릭 데모 프리셋** | 파일 업로드 없이도 대표 논문(예: *Attention Is All You Need*)을 1초 만에 테스트 가능한 샘플 체험 |

---

## 🛠️ 3. 기술 스택 및 아키텍처 (Tech Stack)

### Frontend & UI
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Shadcn/UI
- **Renderer**: KaTeX (수식 렌더링)

### Backend & AI Pipeline
- **AI Model**: Google Gemini API (`gemini-2.5-flash`, `gemini-1.5-pro`)
- **Document Processing**: Gemini File API (PDF 원본 바이너리 직접 분석)
- **Data Formatting**: Structured Outputs (엄격한 JSON Schema 적용)
- **Deployment**: Vercel

