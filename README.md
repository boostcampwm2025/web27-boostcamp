# web27-boostcamp

![banner3](https://github.com/user-attachments/assets/a1d7d818-8d00-42ab-8812-2e7e0a5b7db1)


> **"광고가 정보가 되는 경험"**  
> 개발자 기술 블로그의 **맥락(Context)** + **학습 의도(Intent)** 를 기반으로, 크리에이터가 **입찰(RTB)** 해 노출되는 투명한 광고·추천 플랫폼  
> **Google Ads/Meta 같은 메인 광고 플랫폼을 대체하기보다**, 메인 채널이 놓치기 쉬운 **고의도·콘텐츠 맥락 구간**을 위한 *추가 채널*을 지향합니다.
<br/>
<br/>

## 🧐 문제 인식 (Why)

1. **맥락 없는 광고 노출**
   - “React 글”을 읽는데 “자동차 보험” 같은 무관한 광고가 뜨는 경험
   - 사용자의 쿠키 데이터를 기반으로 하는 광고로 인해 내 프라이버시가 노출되고 있나? 하는 불안감
2. **광고주 접근성 장벽**
   - 대형 플랫폼은 세팅이 복잡하고(옵션/용어/구조), 결과가 불투명해서 소규모 광고주가 운영하기 어려움
3. **너무 넓은 타겟팅 → 예산 낭비**
   - 노출(PV) 중심 최적화로 “진짜로 배우는 사람”을 선별하기 어려움

<br/>
<br/>




## ✅ 우리가 제안하는 해결 (What)

저희 프로젝트는 아래 3가지를 한 번에 만족하는 것을 목표로 합니다.

1. **콘텐츠 맥락 기반 매칭**
   - 과거 행동(쿠키)보다 **현재 읽는 글의 주제/태그**를 우선으로 독자의 읽는 경험을 해치지 않으면서 알맞은 광고를 매칭합니다.
2. **학습 행동(고의도) 기반 노출**
   - 예: **스크롤 깊이, 체류 시간, 코드 블록 복사** 등 “진짜 학습 중인 순간”을 신호로 활용
3. **입찰 로그의 투명성**
   - “왜 노출이 안 되었는지 / 얼마 차이로 졌는지”를 광고주가 이해할 수 있도록 로그를 보여줍니다.
   - 광고주 대시보드에서 제공되는 정보를 바탕으로 광고주 자신이 수익을 최대화할 수 있는 전략을 짤 수 있습니다.

<br/>
<br/>




## 🧑‍💻 포지셔닝 

저희 서비스는 Google Ads/Meta 같은 **메인 광고 플랫폼과 직접 경쟁(대체)** 하기보다, 메인 채널이 놓치기 쉬운 **고의도·콘텐츠 맥락 구간**을 위한 *추가 채널*을 지향합니다.

- Google Ads 같은 메인 채널: 대규모 도달/브로드 타겟팅 중심
- BoostAD: “지금 이 글을 진짜로 학습 중인 순간”에만 집중하는 마이크로 지면/경매
- 예산 운용: 메인 채널에 예산의 대부분을 집행하고(예: 80–90%), BoostAD에는 일부(예: 10–20%)를 배분해 **추가 전환/유입(초과 효율)**을 검증하는 보완 채널

예시)

- “NestJS 입문” 글을 **80% 이상 읽고 코드 블록을 복사**한 독자에게 → NestJS 강의 캠페인을 입찰로 노출

<br/>
<br/>




## 👥 주요 사용자

- **Publisher (퍼블리셔)**: 개발자 블로그/뉴스레터 운영자
- **Advertiser (광고주)**: 개발 강의 제작자, 개발 유튜버, 교육 서비스 운영자
- **Reader (독자)**: 기술 글을 읽고 따라 해보거나 더 깊이 공부해보고 싶은 개발자/학습자


<br/>
<br/>



## 🛠️ 핵심 기능

### 1) 퍼블리셔 경험

- 블로그에 SDK 스크립트 삽입으로 빠른 연동
- 글 맥락/태그 기반으로 관련 광고 카드 노출
- 대시보드에서 **노출/클릭/수익** 지표 확인

### 2) 광고주 경험

- 캠페인 등록 최소화(링크/태그/예산/입찰가 중심)
- 단순 노출 수치를 넘어, **학습 의지가 높은 유저**에게 닿는 효율적인 광고 채널
- Google Ads/Meta와 **직접 경쟁(대체)** 하기보다, 메인 채널이 커버하기 어려운 **고의도·맥락 슬롯**에 집중하는 보완 채널
- 대시보드에서 **성과 지표 + 입찰 로그** 확인 및 튜닝

### 3) 독자 경험

- “광고”가 아니라 “다음 단계 학습 추천 카드”처럼 자연스럽게 노출
- 프라이버시 부담이 큰 쿠키 추적 중심이 아닌, **현재 페이지 맥락/행동 신호** 중심

<br/>
<br/>




## 동작 흐름 (How)

```mermaid
sequenceDiagram
  autonumber
  participant R as Reader Browser
  participant P as Publisher Page
  participant S as BoostAD SDK (JS)
  participant B as BoostAD Backend API
  participant E as RTB Engine (Matching/Scoring/Select)

  R->>P: 글 페이지 방문
  P->>S: sdk.js 로드 (data-blog-key 포함)
  S->>S: 태그/맥락 추출
  S->>B: POST /api/sdk/decision (tags, postUrl, behaviorScore, isHighIntent)
  activate B
  B->>E: Run auction (match → score → select)
  E-->>B: winner + explain + candidates
  B-->>S: winner 캠페인 + auctionId (+ 후보군/스코어)
  deactivate B
  S->>P: 광고/추천 카드 렌더링
  S->>B: POST /api/sdk/campaign-view (노출 로그)
  R->>S: 카드 클릭
  S->>B: POST /api/sdk/campaign-click (클릭 로그)
  S->>R: 광고주 랜딩 URL 오픈
```
---
## ERD
<img width="1233" height="1286" alt="boostad_erd" src="https://github.com/user-attachments/assets/99481ab9-88b3-4f23-bb1b-61f0c76db22c" />

<br/>
<br/>


___
## 아키텍처 (초안)

<img width="981" height="741" alt="Curent_architecture drawio (2)" src="https://github.com/user-attachments/assets/522e35b1-1c05-4e79-b818-008192db2e5e" />



<br/>
<br/>



---
## CI/CD 파이프라인
https://github.com/boostcampwm2025/web27-BoostAD/wiki/CICD-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8

<br/>
<br/>

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | ![React](https://img.shields.io/badge/React-000000?logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-000000?logo=vite&logoColor=646CFF) ![TypeScript](https://img.shields.io/badge/TypeScript-000000?logo=typescript&logoColor=3178C6) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-000000?logo=tailwindcss&logoColor=06B6D4) ![React Router](https://img.shields.io/badge/React_Router-000000?logo=reactrouter&logoColor=CA4245) ![Zustand](https://img.shields.io/badge/Zustand-000000?logo=zustand&logoColor=FFFFFF) |
| Backend | ![NestJS](https://img.shields.io/badge/NestJS-000000?logo=nestjs&logoColor=E0234E) ![TypeORM](https://img.shields.io/badge/TypeORM-000000?logo=typeorm&logoColor=FE0902) ![MySQL](https://img.shields.io/badge/MySQL-000000?logo=mysql&logoColor=4479A1) |
| SDK | ![TypeScript](https://img.shields.io/badge/TypeScript-000000?logo=typescript&logoColor=3178C6) ![Vite](https://img.shields.io/badge/Vite_Bundling-000000?logo=vite&logoColor=646CFF) ![IIFE](https://img.shields.io/badge/IIFE-000000?logo=javascript&logoColor=F7DF1E) ![DOM](https://img.shields.io/badge/DOM_Tracking-000000?logo=html5&logoColor=E34F26) |
| Infra/Deploy | ![Docker](https://img.shields.io/badge/Docker-000000?logo=docker&logoColor=2496ED) ![Nginx](https://img.shields.io/badge/Nginx-000000?logo=nginx&logoColor=009639) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-000000?logo=githubactions&logoColor=2088FF) ![Naver Cloud](https://img.shields.io/badge/Naver_Cloud_Platform-000000?logo=naver&logoColor=03C75A) |
| Matching (실험) | ![Transformers](https://img.shields.io/badge/Transformers-000000?logo=huggingface&logoColor=FFD21E) ![Embeddings](https://img.shields.io/badge/Embeddings-000000?logo=openai&logoColor=FFFFFF) ![Similarity](https://img.shields.io/badge/Similarity-000000?logo=databricks&logoColor=FFFFFF) |

<br/>
<br/>

## BoostAD와 협업 중인 다른 프로젝트도 살펴보세요!
- WEB01 BoostUS: https://boostus.site
- WEB04 우리 모두 다빈치: https://we-are-all-davinci.netlify.app/
- WEB11 말만해: https://malmanhae.com/



