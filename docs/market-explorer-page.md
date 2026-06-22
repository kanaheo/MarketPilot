# Market Explorer Page

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## Branch

- `feature/market-explorer-page`
- Status: fixture-based UI implementation complete
- Route: `/[locale]/markets`
- Access: authenticated dashboard layout

## Implemented

- symbol and company search
- filters for country, asset class, market session, sector, exchange, market
  capitalization, price direction, volume, and AI-signal availability
- one shared filter state for the result count, AI discovery, market table, and
  market pulse
- AI discovery cards with probability, evidence, counter-risk, risk level,
  timestamp, fixture status, and an investment-advice disclaimer
- US, Korean, and Japanese instrument table
- localized prices for USD, KRW, and JPY
- price change, volume, sparkline, AI score, sorting, and watchlist interaction
- empty states for filtered instruments and AI signals
- market breadth by country
- strongest-sector and unusual-volume highlights
- AI market summary with evidence, counter-risk, source, and update metadata
- responsive desktop, tablet, and mobile layouts
- English, Korean, and Japanese messages

## Component structure

- `MarketsPage`: server component that validates the locale and loads messages
- `MarketExplorer`: client boundary that owns screen-local filter, sorting, and
  watchlist state
- `MarketFilters`: search and filter controls
- `AiDiscovery`: evidence-aware fixture signals
- `MarketTable`: filtered and sorted instrument list
- `MarketPulse`: metrics calculated from the current filtered universe

Global state was intentionally not added because the interaction state belongs
only to this page. Shared components such as `Panel`, `SectionHeader`,
`AssetMark`, `TrendValue`, and `EmptyState` are reused.

## Data and AI boundary

All prices, signals, scores, timestamps, and market summaries are fixtures.
The UI clearly identifies fixture analysis and does not represent the values as
live market data or personalized investment advice.

The current AI summary is deterministic UI logic based on breadth, average
price change, sector leadership, and volume. It is not an LLM or predictive
model result.

## Verification

- ESLint passed
- production build and TypeScript checks passed
- `/[locale]/markets` is protected by the authenticated dashboard layout

## Deferred work

- select delayed-data providers for the US, Korea, and Japan
- replace fixture instruments with server/API data
- record source and collection timestamps for every quote
- persist watchlists per authenticated user
- connect reviewed signal/model outputs
- add remote loading, error, stale-data, and retry states
- add filter, sorting, watchlist, and accessibility tests

---

<a id="한국어"></a>

## 한국어

### 브랜치

- `feature/market-explorer-page`
- 상태: fixture 기반 UI 구현 완료
- 라우트: `/[locale]/markets`
- 접근 권한: 로그인된 대시보드 레이아웃

### 구현 범위

- 티커 및 회사명 검색
- 국가, 자산군, 장 상태, 섹터, 거래소, 시가총액, 등락 방향, 거래량,
  AI 신호 필터
- 결과 개수, AI 종목 발견, 종목 표 및 시장 맥박이 하나의 필터 상태를 공유
- 확률, 판단 근거, 반대 위험, 위험 등급, 분석 시점, fixture 상태 및 투자
  조언 안내가 포함된 AI 종목 카드
- 미국, 한국 및 일본 종목 표
- USD, KRW 및 JPY 통화별 가격 표시
- 등락률, 거래량, 미니 차트, AI 점수, 정렬 및 관심 종목 기능
- 종목과 AI 신호 검색 결과 없음 상태
- 국가별 시장 확산도
- 강세 섹터 및 이상 거래량 요약
- 근거, 반대 위험, 출처 및 갱신 시점이 포함된 AI 시장 요약
- PC, 태블릿 및 모바일 반응형 레이아웃
- 영어, 한국어 및 일본어 메시지

### 컴포넌트 구조

- `MarketsPage`: locale을 검증하고 메시지를 준비하는 Server Component
- `MarketExplorer`: 화면 내부 필터, 정렬 및 관심 종목 상태를 관리하는 Client
  Component 경계
- `MarketFilters`: 검색 및 필터 UI
- `AiDiscovery`: 근거와 위험을 함께 표시하는 fixture 신호
- `MarketTable`: 필터링 및 정렬된 종목 목록
- `MarketPulse`: 현재 필터 결과에서 계산되는 시장 지표

상태가 이 페이지 안에서만 사용되므로 전역 상태는 추가하지 않았습니다.
`Panel`, `SectionHeader`, `AssetMark`, `TrendValue`, `EmptyState` 등의 기존
공통 컴포넌트를 재사용합니다.

### 데이터 및 AI 경계

현재 가격, 신호, 점수, 분석 시점 및 시장 요약은 모두 fixture입니다. UI에서
fixture 분석임을 명시하며 실시간 시장 데이터나 개인화된 투자 조언처럼 표현하지
않습니다.

현재 AI 시장 요약은 시장 확산도, 평균 등락률, 섹터 강도 및 거래량을 사용하는
결정적인 UI 로직입니다. LLM 또는 예측 모델 결과가 아닙니다.

### 검증

- ESLint 통과
- Production build 및 TypeScript 검사 통과
- `/[locale]/markets`는 로그인된 대시보드 레이아웃으로 보호

### 후속 작업

- 미국, 한국 및 일본 지연 시세 제공자 선정
- fixture 종목을 서버/API 데이터로 교체
- 모든 시세에 출처와 수집 시점 기록
- 로그인 사용자별 관심 종목 저장
- 검증된 신호 및 모델 결과 연결
- 원격 데이터용 loading, error, stale 및 retry 상태
- 필터, 정렬, 관심 종목 및 접근성 테스트

---

<a id="日本語"></a>

## 日本語

### ブランチ

- `feature/market-explorer-page`
- 状態: fixtureベースのUI実装完了
- ルート: `/[locale]/markets`
- アクセス: 認証済みダッシュボードレイアウト

### 実装内容

- ティッカーと会社名の検索
- 国、資産クラス、取引状態、セクター、取引所、時価総額、値動き、出来高、
  AIシグナルのフィルター
- 結果件数、AI銘柄発見、銘柄表、マーケットパルスで同じフィルター状態を共有
- 確率、根拠、反対リスク、リスク水準、分析時刻、fixture状態、投資助言の
  注意書きを含むAIカード
- 米国、韓国、日本の銘柄表
- USD、KRW、JPYの通貨別価格表示
- 騰落率、出来高、ミニチャート、AIスコア、並び替え、ウォッチリスト
- 銘柄とAIシグナルの空状態
- 国別の市場の広がり
- 強いセクターと異常出来高の要約
- 根拠、反対リスク、出典、更新時刻を含むAI市場要約
- PC、タブレット、モバイルのレスポンシブ対応
- 英語、韓国語、日本語メッセージ

### コンポーネント構造

- `MarketsPage`: locale検証とメッセージ取得を行うServer Component
- `MarketExplorer`: ページ内のフィルター、並び替え、ウォッチリスト状態を
  管理するClient Component境界
- `MarketFilters`: 検索とフィルターUI
- `AiDiscovery`: 根拠とリスクを表示するfixtureシグナル
- `MarketTable`: フィルター・並び替え済みの銘柄一覧
- `MarketPulse`: 現在の結果から算出する市場指標

状態はこのページ内だけで使うため、グローバル状態は追加していません。
既存の共通コンポーネントを再利用しています。

### データとAIの境界

現在の価格、シグナル、スコア、分析時刻、市場要約はすべてfixtureです。
リアルタイム市場データや個別投資助言として表示しません。

現在のAI市場要約は、市場の広がり、平均騰落率、セクター強度、出来高に基づく
決定的なUIロジックであり、LLMや予測モデルの結果ではありません。

### 検証

- ESLint成功
- Production buildとTypeScriptチェック成功
- `/[locale]/markets`は認証済みダッシュボードレイアウトで保護

### 今後の作業

- 米国、韓国、日本向け遅延市場データ提供者の選定
- fixtureをサーバー/APIデータへ置換
- 各価格に出典と収集時刻を記録
- ユーザー別ウォッチリストの永続化
- 検証済みシグナル・モデル出力の接続
- リモートデータ向けloading、error、stale、retry状態
- フィルター、並び替え、ウォッチリスト、アクセシビリティテスト
