# Product Requirements

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## 1. Product statement

MarketPilot analyzes market prices, volume, macroeconomic indicators, and news
events to produce explainable stock signals and risk scores. Users manage a
custom virtual balance, run backtests, and perform paper trades through an
installable responsive web app.

## 2. Product principles

1. Paper trading only during the portfolio project.
2. Explain uncertainty instead of claiming to predict the future.
3. Correct portfolio accounting comes before AI features.
4. Prevent look-ahead bias and data leakage in every evaluation.
5. Prefer free services and scale-to-zero infrastructure.
6. Every automated decision must be reproducible and auditable.

## 3. Target user

A learner or retail investor who wants to:

- study relationships among markets, news, and macroeconomic events
- test an investment idea without risking real money
- understand why a stock was ranked or rejected
- measure strategy performance against a benchmark

## 4. MVP requirements

### Portfolio and cash

- `PORT-01`: A user can create multiple paper portfolios.
- `PORT-02`: Starting capital is custom, not fixed at KRW 10,000,000.
- `PORT-03`: A portfolio has a base currency such as KRW or USD.
- `PORT-04`: A user can deposit or withdraw virtual cash on any date.
- `PORT-05`: Deposits and withdrawals are stored as immutable ledger events.
- `PORT-06`: Cash flow is separated from investment profit.
- `PORT-07`: The app reports simple return, time-weighted return, and XIRR when
  sufficient cash-flow history exists.
- `PORT-08`: Currency conversion rates used in valuation are recorded.

### Market data

- `DATA-01`: The MVP tracks a curated universe of 20 to 50 US stocks and one
  benchmark ETF.
- `DATA-02`: Daily OHLCV prices are collected and validated.
- `DATA-03`: Raw records and transformed features are logically separated.
- `DATA-04`: Duplicate, missing, stale, and abnormal data is detectable.
- `DATA-05`: Every dataset records source and collection time.

### Backtesting

- `TEST-01`: A user can choose initial capital, dates, strategy, and risk rules.
- `TEST-02`: Fees and slippage are included.
- `TEST-03`: The engine prevents use of information unavailable at trade time.
- `TEST-04`: Results include total return, annualized return, maximum drawdown,
  Sharpe ratio, win rate, turnover, and benchmark comparison.
- `TEST-05`: Deposits and withdrawals can be scheduled in a simulation.

### Paper trading

- `TRADE-01`: Orders never reach a real-money account in the portfolio scope.
- `TRADE-02`: Manual paper orders are supported before automated orders.
- `TRADE-03`: Automated paper trading has an explicit enable/pause control.
- `TRADE-04`: Risk limits include maximum position size, cash reserve,
  stop-loss, take-profit, and maximum daily order count.
- `TRADE-05`: Every order stores the strategy version and decision evidence.

### Signals and risk

- `SIGNAL-01`: A baseline rules strategy is implemented before ML.
- `SIGNAL-02`: A signal includes horizon, probability or score, risk level,
  evidence, counter-evidence, and model version.
- `SIGNAL-03`: Sudden price and volume moves can be detected.
- `SIGNAL-04`: Later phases incorporate rates, inflation, employment, foreign
  exchange, war, policy, earnings, and industry news.
- `SIGNAL-05`: Model performance is evaluated on unseen time periods.

### User experience

- `UI-01`: The app is responsive on phone and desktop.
- `UI-02`: The app can be installed as a PWA.
- `UI-03`: The dashboard shows net worth, cash, holdings, return, drawdown,
  recent orders, and active signals.
- `UI-04`: Forecasts are displayed as ranges and probabilities, never
  guaranteed values.
- `UI-05`: Destructive portfolio actions require confirmation.

## 5. Initial screens

1. Dashboard
2. Portfolio creation and cash-flow management
3. Holdings and order history
4. Market scanner
5. Stock detail and signal explanation
6. Backtest setup and results
7. Strategy and risk settings
8. Data and model health

## 6. Out of scope for the MVP

- real-money brokerage accounts or live orders
- high-frequency or intraday trading
- options, futures, leverage, short selling, and crypto
- social trading and copying other users
- return guarantees or personalized financial advice
- fully autonomous LLM-generated trading rules

## 7. Future real-money readiness

Real trading may be considered only after the paper system has:

- reproducible backtests and forward paper-trading results
- idempotent order handling and reconciliation
- strict account, order, and loss limits
- kill switches, alerts, audit logs, and secret management
- legal, tax, brokerage, and market-data-license review

It must use a separately enabled adapter so paper and real orders cannot be
confused by configuration alone.

## 8. MVP acceptance criteria

The MVP is complete when a user can create a portfolio with any supported
starting amount, add KRW 5,000,000 later, run a one-month historical
simulation, and see performance that correctly excludes the deposit from
investment profit.

---

## 한국어

### 1. 제품 설명

MarketPilot은 시장 가격, 거래량, 거시경제 지표와 뉴스 이벤트를 분석하여 설명 가능한
주식 신호와 위험 점수를 생성합니다. 사용자는 설치 가능한 반응형 웹앱에서 원하는
가상자금을 관리하고 백테스트와 모의매매를 실행할 수 있습니다.

### 2. 제품 원칙

1. 포트폴리오 프로젝트 기간에는 모의매매만 지원한다.
2. 미래를 예측한다고 주장하지 않고 불확실성을 설명한다.
3. AI 기능보다 정확한 포트폴리오 회계를 먼저 구현한다.
4. 모든 평가에서 미래 정보 참조와 데이터 누출을 방지한다.
5. 무료 서비스와 유휴 비용이 없는 인프라를 우선한다.
6. 모든 자동 판단은 재현 및 감사할 수 있어야 한다.

### 3. 대상 사용자

다음 목적을 가진 학습자 또는 개인 투자자를 대상으로 합니다.

- 시장, 뉴스 및 거시경제 이벤트의 관계 학습
- 실제 돈을 잃을 위험 없이 투자 아이디어 검증
- 종목이 선택되거나 제외된 이유 확인
- 전략 성과와 벤치마크 비교

### 4. MVP 요구사항

#### 포트폴리오 및 현금

- `PORT-01`: 여러 개의 모의 포트폴리오를 생성할 수 있다.
- `PORT-02`: 초기자금은 1,000만 원으로 고정하지 않고 자유롭게 설정한다.
- `PORT-03`: 포트폴리오는 KRW 또는 USD 등의 기준 통화를 가진다.
- `PORT-04`: 원하는 날짜에 가상자금을 입금하거나 출금할 수 있다.
- `PORT-05`: 입출금은 변경 불가능한 원장 이벤트로 저장한다.
- `PORT-06`: 현금 흐름과 투자수익을 분리한다.
- `PORT-07`: 충분한 현금 흐름 기록이 있으면 단순수익률, 시간가중수익률 및 XIRR을 제공한다.
- `PORT-08`: 평가에 사용한 환율을 기록한다.

#### 시장 데이터

- `DATA-01`: MVP는 선별한 미국 주식 20~50개와 벤치마크 ETF 하나를 추적한다.
- `DATA-02`: 일별 OHLCV 가격을 수집하고 검증한다.
- `DATA-03`: 원본 데이터와 변환된 특징 데이터를 논리적으로 분리한다.
- `DATA-04`: 중복, 누락, 오래된 데이터와 이상치를 탐지한다.
- `DATA-05`: 모든 데이터셋에 출처와 수집 시각을 기록한다.

#### 백테스트

- `TEST-01`: 초기자금, 기간, 전략 및 위험 규칙을 선택할 수 있다.
- `TEST-02`: 수수료와 슬리피지를 반영한다.
- `TEST-03`: 거래 시점에 알 수 없었던 정보의 사용을 차단한다.
- `TEST-04`: 총수익률, 연환산 수익률, 최대 낙폭, 샤프 지수, 승률,
  회전율 및 벤치마크 비교를 제공한다.
- `TEST-05`: 시뮬레이션 중 입출금을 예약할 수 있다.

#### 모의매매

- `TRADE-01`: 포트폴리오 프로젝트 범위에서 주문은 실제 자금 계좌로 전송되지 않는다.
- `TRADE-02`: 자동 주문 전에 수동 모의주문을 지원한다.
- `TRADE-03`: 자동 모의매매에 명시적인 활성화 및 일시정지 기능을 제공한다.
- `TRADE-04`: 최대 종목 비중, 현금 보유 비율, 손절, 익절 및 일일 최대 주문 수를 제한한다.
- `TRADE-05`: 모든 주문에 전략 버전과 판단 근거를 저장한다.

#### 신호 및 위험

- `SIGNAL-01`: ML보다 먼저 규칙 기반 기준 전략을 구현한다.
- `SIGNAL-02`: 신호에는 예측 기간, 확률 또는 점수, 위험 수준, 근거,
  반대 근거 및 모델 버전을 포함한다.
- `SIGNAL-03`: 가격과 거래량의 급격한 변화를 탐지할 수 있다.
- `SIGNAL-04`: 후속 단계에서 금리, 물가, 고용, 환율, 전쟁, 정책,
  실적 및 산업 뉴스를 반영한다.
- `SIGNAL-05`: 학습에 사용하지 않은 기간으로 모델 성능을 평가한다.

#### 사용자 경험

- `UI-01`: 휴대전화와 PC에서 반응형으로 동작한다.
- `UI-02`: PWA로 설치할 수 있다.
- `UI-03`: 대시보드에 순자산, 현금, 보유 종목, 수익률, 낙폭,
  최근 주문 및 활성 신호를 표시한다.
- `UI-04`: 예측을 보장값이 아닌 범위와 확률로 표시한다.
- `UI-05`: 포트폴리오에 중대한 영향을 주는 작업은 확인을 요청한다.

### 5. 초기 화면

1. 대시보드
2. 포트폴리오 생성 및 현금 흐름 관리
3. 보유 종목 및 주문 이력
4. 시장 스캐너
5. 종목 상세 및 신호 설명
6. 백테스트 설정 및 결과
7. 전략 및 위험 설정
8. 데이터 및 모델 상태

### 6. MVP 제외 범위

- 실제 자금 증권계좌 또는 실거래 주문
- 고빈도 또는 장중 단타매매
- 옵션, 선물, 레버리지, 공매도 및 암호화폐
- 소셜 트레이딩 및 다른 사용자 거래 복사
- 수익 보장 또는 개인화된 금융 조언
- LLM이 완전히 자율적으로 생성하는 거래 규칙

### 7. 향후 실거래 준비 조건

실거래는 모의 시스템이 다음 조건을 갖춘 후에만 검토합니다.

- 재현 가능한 백테스트와 실시간 모의매매 결과
- 멱등성이 보장된 주문 처리 및 대사
- 엄격한 계좌, 주문 및 손실 한도
- 비상정지, 알림, 감사 로그 및 비밀정보 관리
- 법률, 세금, 증권사 및 시장 데이터 라이선스 검토

설정 하나만으로 모의주문과 실제 주문이 혼동되지 않도록, 실거래는 별도로 활성화하는
전용 어댑터를 사용해야 합니다.

### 8. MVP 완료 기준

사용자가 지원되는 임의의 초기자금으로 포트폴리오를 생성하고, 나중에 500만 원을
추가 입금한 뒤, 한 달간의 과거 시뮬레이션을 실행하여 입금액을 투자수익에서 정확히
제외한 성과를 확인할 수 있으면 MVP가 완료된 것으로 봅니다.

---

## 日本語

### 1. プロダクト概要

MarketPilotは、市場価格、出来高、マクロ経済指標、ニュースイベントを分析し、
説明可能な株式シグナルとリスクスコアを生成します。ユーザーはインストール可能な
レスポンシブWebアプリを通じて、任意の仮想資金を管理し、バックテストと
ペーパートレードを実行できます。

### 2. プロダクト原則

1. ポートフォリオ制作期間中はペーパートレードのみを扱う。
2. 未来を予測できると主張せず、不確実性を説明する。
3. AI機能より先に、正確なポートフォリオ会計を実装する。
4. すべての評価で先読みバイアスとデータリーケージを防ぐ。
5. 無料サービスとゼロスケール可能なインフラを優先する。
6. すべての自動判断を再現可能かつ監査可能にする。

### 3. 対象ユーザー

次の目的を持つ学習者または個人投資家を対象とします。

- 市場、ニュース、マクロ経済イベントの関係を学ぶ
- 実際の資金を失うリスクなく投資アイデアを検証する
- 銘柄が選定または除外された理由を理解する
- 戦略の成績をベンチマークと比較する

### 4. MVP要件

#### ポートフォリオと現金

- `PORT-01`: ユーザーは複数のペーパーポートフォリオを作成できる。
- `PORT-02`: 初期資金は1,000万KRW固定ではなく、任意に設定できる。
- `PORT-03`: ポートフォリオはKRWやUSDなどの基準通貨を持つ。
- `PORT-04`: 任意の日付に仮想資金を入金または出金できる。
- `PORT-05`: 入出金は変更不可の台帳イベントとして保存する。
- `PORT-06`: キャッシュフローと投資利益を分離する。
- `PORT-07`: 十分な履歴がある場合、単純収益率、時間加重収益率、XIRRを表示する。
- `PORT-08`: 評価に使用した為替レートを記録する。

#### 市場データ

- `DATA-01`: MVPでは選定した米国株20〜50銘柄とベンチマークETFを追跡する。
- `DATA-02`: 日次OHLCVデータを収集して検証する。
- `DATA-03`: 生データと変換済み特徴量を論理的に分離する。
- `DATA-04`: 重複、欠損、古いデータ、異常値を検出できる。
- `DATA-05`: すべてのデータセットに情報源と収集時刻を記録する。

#### バックテスト

- `TEST-01`: 初期資金、期間、戦略、リスクルールを選択できる。
- `TEST-02`: 手数料とスリッページを含める。
- `TEST-03`: 取引時点で取得できなかった情報の使用を防ぐ。
- `TEST-04`: 総収益率、年率収益率、最大ドローダウン、シャープレシオ、
  勝率、売買回転率、ベンチマーク比較を表示する。
- `TEST-05`: シミュレーション中の入出金をスケジュールできる。

#### ペーパートレード

- `TRADE-01`: ポートフォリオ制作の範囲では、注文を実資金口座へ送信しない。
- `TRADE-02`: 自動注文より先に手動ペーパー注文を実装する。
- `TRADE-03`: 自動ペーパートレードに明示的な有効化・一時停止機能を設ける。
- `TRADE-04`: 最大ポジション比率、現金保有率、損切り、利益確定、
  1日の最大注文数をリスク制限として設定する。
- `TRADE-05`: すべての注文に戦略バージョンと判断根拠を保存する。

#### シグナルとリスク

- `SIGNAL-01`: MLより先にルールベースのベースライン戦略を実装する。
- `SIGNAL-02`: シグナルには予測期間、確率またはスコア、リスクレベル、
  根拠、反対根拠、モデルバージョンを含める。
- `SIGNAL-03`: 価格と出来高の急激な変化を検出できる。
- `SIGNAL-04`: 後続フェーズで金利、インフレ、雇用、為替、戦争、政策、
  決算、業界ニュースを取り込む。
- `SIGNAL-05`: 未知の期間データでモデル性能を評価する。

#### ユーザー体験

- `UI-01`: スマートフォンとPCの両方でレスポンシブに動作する。
- `UI-02`: PWAとしてインストールできる。
- `UI-03`: ダッシュボードに純資産、現金、保有銘柄、収益率、
  ドローダウン、最近の注文、有効なシグナルを表示する。
- `UI-04`: 予測は保証値ではなく、範囲と確率で表示する。
- `UI-05`: ポートフォリオを破壊する操作には確認を求める。

### 5. 初期画面

1. ダッシュボード
2. ポートフォリオ作成とキャッシュフロー管理
3. 保有銘柄と注文履歴
4. マーケットスキャナー
5. 銘柄詳細とシグナルの説明
6. バックテスト設定と結果
7. 戦略とリスク設定
8. データおよびモデルの稼働状況

### 6. MVPの対象外

- 実資金の証券口座またはライブ注文
- 高頻度取引またはデイトレード
- オプション、先物、レバレッジ、空売り、暗号資産
- ソーシャルトレードや他ユーザーの取引コピー
- 利益保証または個別化された金融アドバイス
- LLMが完全自律で生成する取引ルール

### 7. 将来の実取引に向けた条件

実取引は、ペーパーシステムが次の条件を満たした後にのみ検討します。

- 再現可能なバックテストとフォワードペーパートレードの結果
- 冪等な注文処理と照合
- 厳格な口座、注文、損失の上限
- キルスイッチ、アラート、監査ログ、シークレット管理
- 法務、税務、証券会社、市場データライセンスの確認

ペーパー注文と実注文が設定変更だけで混同されないよう、実取引には個別に有効化する
専用アダプターを使用します。

### 8. MVP受け入れ基準

ユーザーが任意の初期資金でポートフォリオを作成し、後から500万KRWを追加入金し、
1か月分の過去シミュレーションを実行して、その入金分を投資利益から正しく除外した
運用成績を確認できればMVP完成とします。
