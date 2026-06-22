# Strategy Simulation Page

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## Branch

- `feature/backtests-page`
- Route: `/[locale]/backtests`
- Access: authenticated dashboard layout
- Status: fixture-based UI complete

## Implemented

- date range, initial capital, base currency, and benchmark configuration
- momentum, moving-average, and buy-and-hold presets
- position, cash, stop-loss, rebalance, fee, slippage, and execution settings
- searchable US, Korean, and Japanese fixture asset universe
- asset addition, removal, custom weights, and equal-weight allocation
- React Hook Form and Zod validation
- deterministic fixture results based on the selected settings and assets
- total return, annualized return, drawdown, Sharpe ratio, and win rate
- equity curve, benchmark line, and drawdown chart
- benchmark comparison and fixture trade history
- responsive English, Korean, and Japanese UI

## Architecture

`BacktestsPage` remains a server component for locale validation and message
loading. `BacktestSetup` is the page-local client boundary for form and asset
selection state. Result generation is isolated in `lib/backtests.ts` as a pure,
deterministic fixture function so a real backtest API can replace it later
without restructuring the screen.

The current numbers are not historical market calculations. They are explicit
UI fixtures and must not be interpreted as investment advice or expected
returns.

## Deferred

- historical OHLCV data pipeline
- real strategy execution engine
- execution-calendar and corporate-action handling
- scheduled cash flows
- saved simulations and reproducible run identifiers
- unit tests for portfolio math and backtest calculations

---

<a id="한국어"></a>

## 한국어

### 브랜치

- `feature/backtests-page`
- 라우트: `/[locale]/backtests`
- 접근 권한: 로그인된 대시보드 레이아웃
- 상태: fixture 기반 UI 완료

### 구현 범위

- 기간, 초기자금, 기준 통화 및 벤치마크 설정
- 모멘텀, 이동평균 및 Buy & Hold 전략 프리셋
- 종목 비중, 현금, 손절, 리밸런싱, 수수료, 슬리피지 및 체결 조건
- 미국, 한국 및 일본 fixture 종목 검색
- 종목 추가·삭제, 직접 비중 입력 및 동일 비중 배분
- React Hook Form과 Zod 검증
- 선택한 설정과 종목에 따라 달라지는 결정적인 fixture 결과
- 총수익률, 연환산 수익률, 최대 낙폭, 샤프 지수 및 승률
- 자산 곡선, 벤치마크 및 낙폭 차트
- 벤치마크 비교와 fixture 거래 내역
- 한·영·일 번역 및 반응형

### 구조

`BacktestsPage`는 locale 검증과 메시지 로딩을 담당하는 Server Component입니다.
`BacktestSetup`만 폼과 종목 선택 상태를 관리하는 Client Component 경계로
사용합니다. 결과 생성은 `lib/backtests.ts`의 결정적인 순수 함수로 분리하여
나중에 실제 백테스트 API로 교체해도 화면 구조를 유지할 수 있습니다.

현재 수치는 과거 시장 데이터 계산 결과가 아닌 UI fixture입니다. 투자 조언이나
예상 수익률로 해석하지 않습니다.

### 후속 작업

- 과거 OHLCV 데이터 파이프라인
- 실제 전략 실행 엔진
- 거래일·기업 행동 처리
- 예정 현금 흐름
- 시뮬레이션 저장 및 재현 가능한 실행 ID
- 포트폴리오 및 백테스트 계산 단위 테스트

---

<a id="日本語"></a>

## 日本語

### ブランチ

- `feature/backtests-page`
- ルート: `/[locale]/backtests`
- アクセス: 認証済みダッシュボードレイアウト
- 状態: fixtureベースのUI完了

### 実装内容

- 期間、初期資金、基準通貨、ベンチマーク設定
- モメンタム、移動平均、Buy & Holdの戦略プリセット
- 銘柄比率、現金、損切り、リバランス、手数料、スリッページ、約定条件
- 米国、韓国、日本のfixture銘柄検索
- 銘柄の追加・削除、比率入力、均等配分
- React Hook FormとZodによる検証
- 選択条件に応じて変化する決定論的fixture結果
- 総収益率、年率換算収益率、最大ドローダウン、シャープレシオ、勝率
- 資産曲線、ベンチマーク、ドローダウンチャート
- ベンチマーク比較とfixture取引履歴
- 英語、韓国語、日本語およびレスポンシブ対応

### 構造

`BacktestsPage`はlocale検証とメッセージ取得を行うServer Componentです。
`BacktestSetup`のみをフォームと銘柄選択状態のClient Component境界とし、
結果生成は`lib/backtests.ts`の決定論的な純粋関数へ分離しています。

現在の数値は過去市場データの計算結果ではなくUI fixtureです。投資助言や
期待収益として扱いません。

### 今後の作業

- 過去OHLCVデータパイプライン
- 実際の戦略実行エンジン
- 取引日とコーポレートアクション処理
- 定期キャッシュフロー
- シミュレーション保存と再現可能な実行ID
- ポートフォリオ・バックテスト計算の単体テスト
