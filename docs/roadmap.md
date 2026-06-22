# Roadmap

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

The project advances only when the current phase produces a demonstrable,
tested result. Dates are intentionally omitted; progress is based on working
software rather than artificial deadlines.

## Phase 0 - Foundation

Status: Complete

- define goals, boundaries, requirements, and terminology
- choose the MVP market and data frequency
- design architecture and cost rules
- initialize the repository and working conventions

Exit: The scope is clear enough to build without repeatedly redesigning it.

## Phase 1 - Web app shell

- create the Next.js TypeScript app
- establish a restrained dashboard design system
- build responsive navigation and initial screens with fixture data
- add PWA manifest and install support
- add linting, type checks, and frontend tests

Exit: The dashboard works on desktop and mobile with mock data.

## Phase 2 - API and portfolio ledger

- create FastAPI and PostgreSQL services
- add migrations and typed API contracts
- implement portfolios, cash transactions, holdings, and orders
- correctly calculate balances after deposits and withdrawals
- test simple return, TWR, and XIRR behavior

Exit: A custom-balance portfolio can be changed through auditable cash events.

## Phase 3 - Daily market data pipeline

- select the first 20 to 50 stocks and benchmark
- ingest and validate daily OHLCV data
- store collection metadata and quality results
- calculate baseline technical features
- schedule local collection jobs

Exit: A repeatable daily pipeline populates trustworthy price data.

## Phase 4 - Backtesting

- implement an explainable momentum or moving-average baseline
- model fees, slippage, and execution timing
- add benchmark and portfolio metrics
- support custom initial capital and scheduled cash flows
- visualize equity curve, drawdown, trades, and comparison

Exit: A one-month or longer scenario is reproducible from the UI.

## Phase 5 - Paper trading

- connect a paper-trading provider or internal simulator
- implement manual paper orders first
- add position, order, and account reconciliation
- add risk policy, pause control, and kill switch
- schedule automated paper decisions

Exit: The system can safely run forward paper trading without real funds.

## Phase 6 - Macroeconomic and news data

- ingest rates, inflation, employment, FX, and selected global indicators
- collect licensed or permitted news metadata
- extract events such as war, policy changes, earnings, and rate decisions
- connect events to industries and symbols
- display evidence and counter-evidence

Exit: Signals can cite time-valid market, macro, and event inputs.

## Phase 7 - Machine learning

- define labels and time-based train/validation/test splits
- compare rules, logistic regression, tree models, and XGBoost
- calibrate probabilities and evaluate class imbalance
- add feature importance and model versioning
- monitor drift and forward performance

Exit: ML must beat or clarify the baseline on unseen periods before promotion.

## Phase 8 - AWS deployment

- create infrastructure with Terraform
- deploy scheduled collection and storage first
- add API, frontend, logs, alarms, and budgets
- document security and disaster-recovery decisions
- keep expensive services off by default

Exit: A reviewer can access a live demo and inspect the AWS design.

## Phase 9 - Portfolio presentation

- complete README, architecture diagram, ERD, and data lineage
- publish model and backtest reports
- document cost, incidents, trade-offs, and lessons learned
- add screenshots and a short demonstration
- prepare interview questions and project narrative

Exit: The repository clearly demonstrates full-stack, data, ML, and AWS skills.

## Immediate next milestone

Dashboard, portfolio, market-explorer, and strategy-simulation fixture screens
are complete. Finish the remaining Phase 1 foundation:

1. add the PWA manifest and install support
2. add frontend tests for critical interactions and accessibility
3. verify the complete authenticated flow on desktop and mobile

---

## 한국어

각 단계에서 시연할 수 있고 테스트를 통과한 결과물이 만들어졌을 때만 다음 단계로
진행합니다. 인위적인 마감일보다 작동하는 소프트웨어를 기준으로 진행하기 위해
날짜는 의도적으로 정하지 않습니다.

### 0단계 - 기반 설계

상태: 완료

- 목표, 경계, 요구사항 및 용어 정의
- MVP 대상 시장과 데이터 주기 결정
- 아키텍처 및 비용 규칙 설계
- 저장소 및 작업 규칙 초기화

완료 조건: 반복적인 재설계 없이 개발을 시작할 수 있을 정도로 범위가 명확하다.

### 1단계 - 웹앱 기본 구조

- Next.js TypeScript 앱 생성
- 절제된 대시보드 디자인 시스템 구성
- 예제 데이터로 반응형 내비게이션과 초기 화면 제작
- PWA 매니페스트 및 설치 기능 추가
- 린트, 타입 검사 및 프론트엔드 테스트 추가

완료 조건: 예제 데이터 기반 대시보드가 PC와 모바일에서 작동한다.

### 2단계 - API 및 포트폴리오 원장

- FastAPI 및 PostgreSQL 서비스 생성
- 마이그레이션과 타입이 지정된 API 규격 추가
- 포트폴리오, 현금 거래, 보유 종목 및 주문 구현
- 입출금 후 잔액을 정확히 계산
- 단순수익률, TWR 및 XIRR 테스트

완료 조건: 사용자 지정 잔액을 감사 가능한 현금 이벤트로 변경할 수 있다.

### 3단계 - 일별 시장 데이터 파이프라인

- 첫 번째 주식 20~50개와 벤치마크 선정
- 일별 OHLCV 데이터 수집 및 검증
- 수집 메타데이터와 품질 결과 저장
- 기준 기술 특징 계산
- 로컬 수집 작업 예약

완료 조건: 재실행 가능한 일별 파이프라인이 신뢰할 수 있는 가격 데이터를 축적한다.

### 4단계 - 백테스트

- 설명 가능한 모멘텀 또는 이동평균 기준 전략 구현
- 수수료, 슬리피지 및 체결 시점 모델링
- 벤치마크 및 포트폴리오 지표 추가
- 사용자 지정 초기자금 및 예정 현금 흐름 지원
- 자산 곡선, 낙폭, 거래 및 비교 결과 시각화

완료 조건: 한 달 이상의 시나리오를 UI에서 재현할 수 있다.

### 5단계 - 모의매매

- 모의매매 제공자 또는 내부 시뮬레이터 연동
- 수동 모의주문 우선 구현
- 포지션, 주문 및 계좌 대사 추가
- 위험 정책, 일시정지 및 비상정지 기능 추가
- 자동 모의판단 예약

완료 조건: 실제 자금 없이 안전하게 실시간 모의매매를 실행할 수 있다.

### 6단계 - 거시경제 및 뉴스 데이터

- 금리, 물가, 고용, 환율 및 주요 세계 경제지표 수집
- 라이선스가 허용하는 뉴스 메타데이터 수집
- 전쟁, 정책 변경, 실적 및 금리 결정 등의 이벤트 추출
- 이벤트를 산업 및 종목에 연결
- 판단 근거와 반대 근거 표시

완료 조건: 신호가 해당 시점에 유효했던 시장, 거시경제 및 이벤트 데이터를 제시한다.

### 7단계 - 머신러닝

- 라벨 및 시간 기반 학습, 검증, 테스트 구간 정의
- 규칙, 로지스틱 회귀, 트리 모델 및 XGBoost 비교
- 확률 보정 및 클래스 불균형 평가
- 특징 중요도 및 모델 버전 관리 추가
- 데이터 변화와 실시간 성능 감시

완료 조건: 학습하지 않은 기간에서 기준 전략을 개선하거나 더 명확하게 설명하는
경우에만 ML 모델을 채택한다.

### 8단계 - AWS 배포

- Terraform으로 인프라 생성
- 정기 수집 및 저장소부터 우선 배포
- API, 프론트엔드, 로그, 알람 및 예산 관리 추가
- 보안 및 재해 복구 결정 문서화
- 고비용 서비스는 기본적으로 중지

완료 조건: 검토자가 실제 데모에 접속하고 AWS 설계를 확인할 수 있다.

### 9단계 - 포트폴리오 완성

- README, 아키텍처 다이어그램, ERD 및 데이터 계보 완성
- 모델 및 백테스트 보고서 공개
- 비용, 장애, 기술적 선택과 학습 내용 문서화
- 스크린샷 및 짧은 시연 영상 추가
- 면접 예상 질문 및 프로젝트 설명 준비

완료 조건: 저장소에서 풀스택, 데이터, ML 및 AWS 역량이 명확하게 드러난다.

### 바로 다음 목표

대시보드, 포트폴리오, 시장 탐색 및 전략 시뮬레이션 fixture 화면을 완료했습니다.
남은 1단계 기반 작업을 마무리합니다.

1. PWA 매니페스트 및 설치 지원
2. 주요 상호작용과 접근성 프론트엔드 테스트
3. 전체 인증 흐름의 PC 및 모바일 검증

---

## 日本語

各フェーズでデモ可能かつテスト済みの成果物ができた場合にのみ、次へ進みます。
人為的な期限ではなく、動作するソフトウェアを基準に進捗を判断するため、
日付は意図的に設定していません。

### フェーズ0 - 基盤設計

ステータス: 完了

- 目標、境界、要件、用語を定義
- MVPの対象市場とデータ頻度を決定
- アーキテクチャとコストルールを設計
- リポジトリと作業ルールを初期化

完了条件: 設計を繰り返しやり直さずに開発できる程度までスコープが明確である。

### フェーズ1 - Webアプリの基本構成

- Next.js TypeScriptアプリを作成
- 落ち着いたダッシュボード用デザインシステムを構築
- フィクスチャーデータを使用してレスポンシブナビゲーションと初期画面を作成
- PWAマニフェストとインストール機能を追加
- Lint、型チェック、フロントエンドテストを追加

完了条件: モックデータを使ったダッシュボードがPCとモバイルで動作する。

### フェーズ2 - APIとポートフォリオ台帳

- FastAPIとPostgreSQLサービスを作成
- マイグレーションと型付きAPI契約を追加
- ポートフォリオ、現金取引、保有銘柄、注文を実装
- 入出金後の残高を正しく計算
- 単純収益率、TWR、XIRRの動作をテスト

完了条件: 任意残高のポートフォリオを監査可能な現金イベントで変更できる。

### フェーズ3 - 日次市場データパイプライン

- 最初の20〜50銘柄とベンチマークを選定
- 日次OHLCVデータを取り込み、検証
- 収集メタデータと品質結果を保存
- ベースラインとなるテクニカル特徴量を計算
- ローカル収集ジョブをスケジュール

完了条件: 再実行可能な日次パイプラインが信頼できる価格データを蓄積する。

### フェーズ4 - バックテスト

- 説明可能なモメンタムまたは移動平均ベースラインを実装
- 手数料、スリッページ、約定タイミングをモデル化
- ベンチマークとポートフォリオ指標を追加
- 任意の初期資金と定期的なキャッシュフローに対応
- 資産曲線、ドローダウン、取引、比較結果を可視化

完了条件: 1か月以上のシナリオをUIから再現できる。

### フェーズ5 - ペーパートレード

- ペーパートレードプロバイダーまたは内部シミュレーターと連携
- 最初に手動ペーパー注文を実装
- ポジション、注文、口座の照合を追加
- リスクポリシー、一時停止、キルスイッチを追加
- 自動ペーパー判断をスケジュール

完了条件: 実資金を使わず、安全にフォワードペーパートレードを実行できる。

### フェーズ6 - マクロ経済・ニュースデータ

- 金利、インフレ、雇用、為替、選定した世界経済指標を取り込む
- ライセンス上許可されたニュースメタデータを収集
- 戦争、政策変更、決算、金利決定などのイベントを抽出
- イベントを業界および銘柄に関連付ける
- 判断根拠と反対根拠を表示

完了条件: シグナルが、その時点で利用可能だった市場、マクロ、イベント情報を示せる。

### フェーズ7 - 機械学習

- ラベルと時系列ベースの学習・検証・テスト分割を定義
- ルール、ロジスティック回帰、木モデル、XGBoostを比較
- 確率を較正し、クラス不均衡を評価
- 特徴量重要度とモデルバージョニングを追加
- ドリフトとフォワード性能を監視

完了条件: 未知期間でベースラインを上回る、またはベースラインを明確に改善した
場合にのみMLモデルを採用する。

### フェーズ8 - AWSデプロイ

- Terraformでインフラを作成
- 定期収集とストレージから先にデプロイ
- API、フロントエンド、ログ、アラーム、予算管理を追加
- セキュリティと災害復旧の判断を文書化
- 高コストサービスはデフォルトで停止

完了条件: レビュアーがライブデモへアクセスし、AWS設計を確認できる。

### フェーズ9 - ポートフォリオ仕上げ

- README、アーキテクチャ図、ERD、データリネージを完成
- モデルおよびバックテストレポートを公開
- コスト、障害、トレードオフ、学びを文書化
- スクリーンショットと短いデモ動画を追加
- 面接想定質問とプロジェクト説明を準備

完了条件: リポジトリからフルスタック、データ、ML、AWSのスキルが明確に伝わる。

### 直近のマイルストーン

ダッシュボード、ポートフォリオ、市場検索、戦略シミュレーションのfixture画面が
完了しました。残りのフェーズ1基盤作業を仕上げます。

1. PWAマニフェストとインストール対応
2. 主要操作とアクセシビリティのフロントエンドテスト
3. 認証フロー全体のPC・モバイル検証
