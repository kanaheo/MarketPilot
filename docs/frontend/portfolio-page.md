# Portfolio Page

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## Branch

- `feature/portfolio-positions`
- Status: portfolio, cash, order, execution, holdings, and P/L API integration mostly complete
- Route: `/[locale]/portfolio`
- Data source: authenticated MarketPilot API

## Implemented

- authenticated portfolio route under the existing dashboard layout
- localized title and description
- create and select portfolios from the API
- cash deposits and withdrawals through the API
- summary cards for total value, available cash, total return, and realized
  profit/loss
- portfolio value chart with an S&P 500 comparison line
- asset-allocation donut chart
- holdings table with quantity, average price, current price, market value, and
  unrealized profit/loss
- quote-currency display for average/current prices and base-currency display
  for valuation fields
- animated value-change highlights for holdings after fills
- cash-activity list backed by ledger events
- BUY and SELL paper orders
- MARKET and LIMIT paper orders
- order history, editing, cancellation, deletion, and execution
- recent-order pagination
- executed MARKET orders display the actual execution price
- diversification, concentration, and volatility risk overview
- responsive desktop, tablet, and mobile layouts
- English, Korean, and Japanese messages

## Shared structure

The page reuses `Panel`, `SectionHeader`, `SummaryCard`, `PeriodTabs`,
`AssetMark`, `TrendValue`, and common number/date formatters. Client
components are used for interactive order forms, cash forms, pagination, and
short-lived value-change highlights. Server components and server actions keep
API calls and authentication-sensitive logic off the browser.

The authenticated dashboard layout performs the session check and redirects an
unauthenticated request to `/{locale}/login`.

## Portfolio accounting status

- cash is derived from immutable ledger events
- BUY execution reduces cash and creates or increases a position
- SELL execution increases cash and reduces a position
- realized profit/loss is calculated from sell execution price versus average
  cost
- unrealized profit/loss and return rate use the current price when available
- pending SELL orders reserve position quantity
- pending LIMIT BUY orders reserve cash
- pending MARKET BUY orders reserve cash only when a current price is available
- insufficient cash or position returns a conflict response

## Verification

- ESLint passed
- production build and TypeScript checks passed
- API order and portfolio tests passed in the current phase
- `git diff --check` passed

## Deferred work

- connect an external or cached market-data provider
- design and implement FX handling for base currency versus instrument currency
- make the period tabs change the chart dataset
- add loading, empty, and error states for remote data
- add portfolio calculation and UI tests

---

<a id="한국어"></a>

## 한국어

### 브랜치

- `feature/portfolio-positions`
- 상태: 포트폴리오, 현금, 주문, 체결, 보유 종목, 손익 API 연동 대부분 완료
- 라우트: `/[locale]/portfolio`
- 데이터 소스: 로그인된 MarketPilot API

### 구현 범위

- 기존 대시보드 인증 레이아웃 내부에 포트폴리오 라우트 추가
- 다국어 제목과 설명
- API 기반 포트폴리오 생성 및 선택
- API 기반 현금 입금 및 출금
- 총 평가금액, 사용 가능 현금, 총 수익률, 실현 손익 요약 카드
- S&P 500 비교선이 포함된 포트폴리오 가치 차트
- 자산 배분 도넛 차트
- 수량, 평균 매수가, 현재가, 평가금액, 미실현 손익을 표시하는 보유 종목 표
- 체결 후 보유 종목 값 변화 하이라이트
- 원장 이벤트 기반 현금 활동 목록
- BUY 및 SELL 모의주문
- MARKET 및 LIMIT 모의주문
- 주문 목록, 수정, 취소, 삭제 및 체결
- 최근 주문 페이지네이션
- 체결된 MARKET 주문의 실제 체결가 표시
- 분산 투자, 집중도, 변동성 위험 요약
- PC, 태블릿 및 모바일 반응형 레이아웃
- 영어, 한국어 및 일본어 메시지

### 공통 구조

`Panel`, `SectionHeader`, `SummaryCard`, `PeriodTabs`, `AssetMark`,
`TrendValue`와 공통 금액·날짜 formatter를 재사용했습니다. 주문 폼, 현금 폼,
페이지네이션, 짧은 값 변화 하이라이트처럼 상호작용이 필요한 부분만 Client
Component로 두고, API 호출과 인증에 민감한 처리는 Server Component와 server
action에 둡니다.

로그인 검사는 기존 대시보드 레이아웃에서 수행하며, 비로그인 요청은
`/{locale}/login`으로 이동합니다.

### 포트폴리오 회계 상태

- 현금은 수정 불가능한 원장 이벤트를 합산해 계산
- BUY 체결 시 현금 감소 및 포지션 생성 또는 증가
- SELL 체결 시 현금 증가 및 포지션 감소
- 실현 손익은 매도 체결가와 평균 매수가 차이로 계산
- 미실현 손익과 수익률은 사용 가능한 현재가를 기준으로 계산
- 평균가와 현재가는 현재가 통화로 표시하고, 평가금액과 미실현 손익은 포트폴리오
  기준 통화로 표시
- 대기 SELL 주문은 보유 수량을 예약
- 대기 LIMIT BUY 주문은 현금을 예약
- 대기 MARKET BUY 주문은 현재가가 있을 때만 현금을 예약
- 현금 또는 보유 수량 부족 시 conflict 응답 반환

### 검증

- ESLint 통과
- Production build 및 TypeScript 검사 통과
- 현재 페이즈의 API 주문 및 포트폴리오 테스트 통과
- `git diff --check` 통과

### 후속 작업

- 외부 또는 캐시 기반 시장 현재가 provider 연결
- 포트폴리오 기준 통화와 종목 통화가 다를 때의 환율 처리 설계 및 구현
- 기간 탭에 실제 차트 데이터 전환 기능 추가
- 원격 데이터용 loading, empty 및 error 상태 추가
- 포트폴리오 계산 및 UI 테스트 추가

---

<a id="日本語"></a>

## 日本語

### ブランチ

- `feature/portfolio-positions`
- 状態: ポートフォリオ、現金、注文、約定、保有銘柄、損益のAPI連携がほぼ完了
- ルート: `/[locale]/portfolio`
- データソース: 認証済みMarketPilot API

### 実装内容

- 既存の認証済みダッシュボードレイアウト内にポートフォリオルートを追加
- 多言語対応のタイトルと説明
- APIによるポートフォリオ作成と選択
- APIによる現金入金と出金
- 総評価額、利用可能現金、総収益率、実現損益の概要カード
- S&P 500比較線を含むポートフォリオ価値チャート
- 資産配分ドーナツチャート
- 数量、平均取得価格、現在値、評価額、未実現損益を表示する保有銘柄表
- 約定後の保有銘柄値の変化ハイライト
- 元帳イベントに基づく現金アクティビティ
- BUY/SELLペーパー注文
- MARKET/LIMITペーパー注文
- 注文一覧、編集、取消、削除、約定
- 最近の注文のページネーション
- 約定済みMARKET注文の実際の約定価格表示
- 分散投資、集中度、ボラティリティのリスク概要
- PC、タブレット、モバイルのレスポンシブ対応
- 英語、韓国語、日本語のメッセージ

### 共通構造

`Panel`、`SectionHeader`、`SummaryCard`、`PeriodTabs`、`AssetMark`、
`TrendValue`と共通formatterを再利用しています。注文フォーム、現金フォーム、
ページネーション、短時間の値変化ハイライトなど対話が必要な部分だけをClient
Componentとし、API呼び出しや認証に関わる処理はServer Componentとserver actionに
置いています。

認証は既存のダッシュボードレイアウトで確認し、未認証のリクエストは
`/{locale}/login`へ移動します。

### ポートフォリオ会計の状態

- 現金は変更不可の元帳イベントから算出
- BUY約定で現金を減らし、ポジションを作成または増加
- SELL約定で現金を増やし、ポジションを減少
- 実現損益は売却約定価格と平均取得価格の差で計算
- 未実現損益と収益率は利用可能な現在値を基準に計算
- 平均価格と現在値は価格通貨で表示し、評価額と未実現損益はポートフォリオ
  基準通貨で表示
- 待機中SELL注文は保有数量を予約
- 待機中LIMIT BUY注文は現金を予約
- 待機中MARKET BUY注文は現在値がある場合のみ現金を予約
- 現金または保有数量不足時はconflict応答を返す

### 検証

- ESLint成功
- Production buildとTypeScriptチェック成功
- 現フェーズのAPI注文・ポートフォリオテスト成功
- `git diff --check`成功

### 今後の作業

- 外部またはキャッシュ型の市場価格providerを接続
- ポートフォリオ基準通貨と銘柄通貨が異なる場合のFX処理を設計・実装
- 期間タブによるチャートデータ切り替え
- リモートデータ向けloading、empty、error状態
- ポートフォリオ計算とUIテスト
