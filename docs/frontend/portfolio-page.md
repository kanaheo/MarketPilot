# Portfolio Page

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## Branch

- `feature/portfolio-page`
- Status: UI implementation complete
- Route: `/[locale]/portfolio`
- Data source: local fixture data only

## Implemented

- authenticated portfolio route under the existing dashboard layout
- localized title and description
- summary cards for total value, available cash, total return, and maximum
  drawdown
- portfolio value chart with an S&P 500 comparison line
- asset-allocation donut chart
- holdings table with quantity, average price, current price, market value, and
  return
- cash-activity list
- diversification, concentration, and volatility risk overview
- responsive desktop, tablet, and mobile layouts
- English, Korean, and Japanese messages

## Shared structure

The page reuses `Panel`, `SectionHeader`, `SummaryCard`, `PeriodTabs`,
`AssetMark`, `TrendValue`, and common number/date formatters. Recharts-only
components remain client components; the route and the other portfolio
sections remain server components.

The authenticated dashboard layout performs the session check and redirects an
unauthenticated request to `/{locale}/login`.

## Fixture consistency

- holdings are the source for stock and ETF allocation values
- cash is shared by the summary, allocation, and latest cash activity
- total value is derived from holdings plus available cash
- the latest portfolio-chart value uses the derived total value

## Verification

- ESLint passed
- production build and TypeScript checks passed
- `/[locale]/portfolio` was included in the production route output

## Deferred work

- connect a free delayed market-data provider for US, Korean, and Japanese
  instruments
- replace fixtures with API and portfolio-ledger data
- make the period tabs change the chart dataset
- add loading, empty, and error states for remote data
- add portfolio calculation and UI tests

---

<a id="한국어"></a>

## 한국어

### 브랜치

- `feature/portfolio-page`
- 상태: UI 구현 완료
- 라우트: `/[locale]/portfolio`
- 데이터 소스: 로컬 fixture 데이터만 사용

### 구현 범위

- 기존 대시보드 인증 레이아웃 내부에 포트폴리오 라우트 추가
- 다국어 제목과 설명
- 총 평가금액, 사용 가능 현금, 총 수익률, 최대 낙폭 요약 카드
- S&P 500 비교선이 포함된 포트폴리오 가치 차트
- 자산 배분 도넛 차트
- 수량, 평균 매수가, 현재가, 평가금액, 수익률을 표시하는 보유 종목 표
- 현금 활동 목록
- 분산 투자, 집중도, 변동성 위험 요약
- PC, 태블릿 및 모바일 반응형 레이아웃
- 영어, 한국어 및 일본어 메시지

### 공통 구조

`Panel`, `SectionHeader`, `SummaryCard`, `PeriodTabs`, `AssetMark`,
`TrendValue`와 공통 금액·날짜 formatter를 재사용했습니다. Recharts가 필요한
컴포넌트만 Client Component로 두고, 라우트와 나머지 포트폴리오 영역은 Server
Component를 유지했습니다.

로그인 검사는 기존 대시보드 레이아웃에서 수행하며, 비로그인 요청은
`/{locale}/login`으로 이동합니다.

### Fixture 일관성

- 보유 종목을 주식 및 ETF 자산 배분 금액의 기준으로 사용
- 요약 카드, 자산 배분 및 최신 현금 활동이 동일한 현금 값을 사용
- 총 평가금액은 보유 종목 평가금액과 사용 가능 현금의 합으로 계산
- 가치 차트의 최신 포트폴리오 값은 계산된 총 평가금액을 사용

### 검증

- ESLint 통과
- Production build 및 TypeScript 검사 통과
- Production 라우트 결과에서 `/[locale]/portfolio` 확인

### 후속 작업

- 미국, 한국 및 일본 종목을 지원하는 무료 지연 시세 제공자 연결
- fixture를 API 및 포트폴리오 원장 데이터로 교체
- 기간 탭에 실제 차트 데이터 전환 기능 추가
- 원격 데이터용 loading, empty 및 error 상태 추가
- 포트폴리오 계산 및 UI 테스트 추가

---

<a id="日本語"></a>

## 日本語

### ブランチ

- `feature/portfolio-page`
- 状態: UI実装完了
- ルート: `/[locale]/portfolio`
- データソース: ローカルのfixtureデータのみ

### 実装内容

- 既存の認証済みダッシュボードレイアウト内にポートフォリオルートを追加
- 多言語対応のタイトルと説明
- 総評価額、利用可能現金、総収益率、最大ドローダウンの概要カード
- S&P 500比較線を含むポートフォリオ価値チャート
- 資産配分ドーナツチャート
- 数量、平均取得価格、現在値、評価額、収益率を表示する保有銘柄表
- 現金アクティビティ
- 分散投資、集中度、ボラティリティのリスク概要
- PC、タブレット、モバイルのレスポンシブ対応
- 英語、韓国語、日本語のメッセージ

### 共通構造

`Panel`、`SectionHeader`、`SummaryCard`、`PeriodTabs`、`AssetMark`、
`TrendValue`と共通formatterを再利用しています。Rechartsが必要な部分だけを
Client Componentとし、ルートとその他の領域はServer Componentを維持しています。

認証は既存のダッシュボードレイアウトで確認し、未認証のリクエストは
`/{locale}/login`へ移動します。

### Fixtureの整合性

- 保有銘柄を株式とETFの資産配分額の基準として使用
- 概要、資産配分、最新の現金履歴で同じ現金値を使用
- 総評価額は保有銘柄評価額と利用可能現金の合計から算出
- 価値チャートの最新値は算出済みの総評価額を使用

### 検証

- ESLint成功
- Production buildとTypeScriptチェック成功
- Productionルート出力で`/[locale]/portfolio`を確認

### 今後の作業

- 米国、韓国、日本に対応する無料の遅延市場データを接続
- fixtureをAPIとポートフォリオ台帳データへ置換
- 期間タブによるチャートデータ切り替え
- リモートデータ向けloading、empty、error状態
- ポートフォリオ計算とUIテスト
