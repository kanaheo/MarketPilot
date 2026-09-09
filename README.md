# MarketPilot

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

MarketPilot is an installable paper-trading web app that combines market
prices, macroeconomic indicators, news events, and machine-learning signals.
It helps users explore investment ideas, test strategies, and operate a
virtual portfolio without using real money.

## Project goal

Build a portfolio-ready full-stack data product that demonstrates:

- responsive frontend and PWA development
- backend API and relational data modeling
- scheduled market-data pipelines
- explainable machine-learning signals
- backtesting and paper-trading workflows
- AWS architecture, observability, and cost control

MarketPilot does not promise returns or provide certain predictions. Every
signal must include uncertainty, supporting evidence, and risk factors.

## MVP

The first usable version will:

1. create a paper portfolio with a custom starting balance
2. record additional deposits and withdrawals
3. track cash, holdings, orders, and portfolio performance
4. collect daily prices for a small US stock universe
5. run an explainable baseline strategy
6. backtest the strategy with fees and slippage
7. show returns, drawdown, Sharpe ratio, and benchmark comparison
8. work on desktop and mobile and be installable as a PWA

News analysis, macroeconomic scoring, ML ranking, automated paper orders, and
AWS deployment will be added after the core accounting and backtest are
trustworthy.

## Demo flow

Run the frontend and backend locally, then review these screens:

1. `/{locale}/portfolio` - create or select a paper portfolio, review cash,
   holdings, valuation, current-price source metadata, FX badges, and paper
   order history.
2. `/{locale}/markets` - check the market data and quote-provider surface.
3. `/{locale}/backtests` - configure a fixture strategy, run a simulation, and
   review assumptions, selected allocation, risk diagnostics, charts, benchmark
   comparison, and fixture trades.

Screenshots are intentionally not committed yet. Add them after local secrets
have been rotated and no `.env` or admin-only screen is visible.

## Screenshots

Planned screenshot files:

- `docs/assets/demo/portfolio-overview.png`
- `docs/assets/demo/portfolio-mobile.png`
- `docs/assets/demo/markets-overview.png`
- `docs/assets/demo/backtest-results.png`
- `docs/assets/demo/backtest-mobile.png`

Use the [demo checklist](docs/demo-checklist.md) before capturing these images.
Each screenshot should show only paper-trading data and must avoid terminals,
environment files, provider dashboards, and personal account information.

## Current stack

- Frontend: Next.js, TypeScript, Tailwind CSS, Recharts
- Backend: Python, FastAPI, SQLAlchemy, Alembic
- Database: PostgreSQL
- Data and ML: Polars, scikit-learn, XGBoost
- Local environment: Docker Compose
- Testing: Pytest, Vitest, Playwright
- Infrastructure: AWS, Terraform, GitHub Actions

## Documentation

- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [AWS roadmap](docs/aws-roadmap.md)
- [Cost plan](docs/cost-plan.md)
- [Learning development plan](docs/learning-plan.md)
- [Frontend documentation](docs/frontend/README.md)
- [Backend documentation](docs/backend/README.md)
- [Developer setup](docs/setup/README.md)
- [Docker setup](docs/setup/docker-setup.md)
- [Demo checklist](docs/demo-checklist.md)

## Quality checks

GitHub Actions runs the [Web CI workflow](.github/workflows/web-ci.yml) for
pull requests and pushes targeting `develop` or `main`.

```text
npm ci -> npm run lint -> npm run build
```

This verifies reproducible dependency installation, ESLint rules, TypeScript,
and the Next.js production build. Requiring this check before merge will be
configured with a GitHub Ruleset after the workflow runs successfully.

## Current status

Core portfolio valuation, quote-source metadata, and fixture-based backtest
reporting are implemented. The project is still a paper-trading demo: several
market-data, strategy, and deployment paths remain fixture-based or local-only.

No real-money brokerage integration is included in the current scope.

---

## 한국어

MarketPilot은 시장 가격, 거시경제 지표, 뉴스 이벤트와 머신러닝 신호를 결합한
설치형 모의투자 웹앱입니다. 실제 돈을 사용하지 않고 투자 아이디어를 탐색하고,
전략을 검증하며, 가상 포트폴리오를 운용할 수 있습니다.

### 프로젝트 목표

다음 역량을 보여줄 수 있는 포트폴리오용 풀스택 데이터 제품을 만듭니다.

- 반응형 프론트엔드 및 PWA 개발
- 백엔드 API 및 관계형 데이터 모델링
- 정기적으로 실행되는 시장 데이터 파이프라인
- 설명 가능한 머신러닝 신호
- 백테스트 및 모의매매 워크플로
- AWS 아키텍처, 관측 가능성 및 비용 관리

MarketPilot은 수익을 보장하거나 확정적인 예측을 제공하지 않습니다. 모든 신호에는
불확실성, 판단 근거와 위험 요인을 함께 표시합니다.

### MVP

첫 번째 사용 가능 버전은 다음 기능을 제공합니다.

1. 사용자가 지정한 초기자금으로 모의 포트폴리오 생성
2. 추가 입금과 출금 기록
3. 현금, 보유 종목, 주문 및 포트폴리오 성과 추적
4. 소규모 미국 주식군의 일별 가격 수집
5. 설명 가능한 기준 전략 실행
6. 수수료와 슬리피지를 반영한 백테스트
7. 수익률, 낙폭, 샤프 지수 및 벤치마크 비교 표시
8. PC와 모바일 지원 및 PWA 설치

뉴스 분석, 거시경제 점수, ML 종목 순위, 자동 모의주문과 AWS 배포는 핵심 회계와
백테스트의 신뢰성을 확보한 뒤 추가합니다.

### 데모 확인 흐름

프론트엔드와 백엔드를 로컬에서 실행한 뒤 아래 화면을 확인합니다.

1. `/{locale}/portfolio` - 모의 포트폴리오 생성 또는 선택, 현금, 보유 종목,
   평가금액, 현재가 출처, FX 배지, 모의주문 내역을 확인합니다.
2. `/{locale}/markets` - 시장 데이터와 quote provider 표시 흐름을 확인합니다.
3. `/{locale}/backtests` - fixture 전략을 설정하고 시뮬레이션을 실행한 뒤 사용
   가정, 선택 종목 비중, 리스크 진단, 차트, 벤치마크 비교와 거래 내역을
   확인합니다.

스크린샷은 아직 커밋하지 않습니다. 로컬 비밀값을 교체하고 `.env`나 관리자용
화면이 보이지 않는 것을 확인한 뒤 추가합니다.

### 스크린샷

예정된 스크린샷 파일은 다음과 같습니다.

- `docs/assets/demo/portfolio-overview.png`
- `docs/assets/demo/portfolio-mobile.png`
- `docs/assets/demo/markets-overview.png`
- `docs/assets/demo/backtest-results.png`
- `docs/assets/demo/backtest-mobile.png`

이미지를 찍기 전 [데모 체크리스트](docs/demo-checklist.md#한국어)를 확인합니다.
모든 스크린샷에는 모의투자 데이터만 보여야 하며, 터미널, 환경변수 파일,
provider dashboard, 개인 계정 정보는 보이지 않게 합니다.

### 현재 기술 스택

- 프론트엔드: Next.js, TypeScript, Tailwind CSS, Recharts
- 백엔드: Python, FastAPI, SQLAlchemy, Alembic
- 데이터베이스: PostgreSQL
- 데이터 및 ML: Polars, scikit-learn, XGBoost
- 로컬 환경: Docker Compose
- 테스트: Pytest, Vitest, Playwright
- 인프라: AWS, Terraform, GitHub Actions

### 문서

- [요구사항](docs/requirements.md#한국어)
- [아키텍처](docs/architecture.md#한국어)
- [로드맵](docs/roadmap.md#한국어)
- [AWS 로드맵](docs/aws-roadmap.md#한국어)
- [비용 계획](docs/cost-plan.md#한국어)
- [학습 중심 개발 일정](docs/learning-plan.md#한국어)
- [프론트엔드 문서](docs/frontend/README.md)
- [백엔드 문서](docs/backend/README.md)
- [개발 환경 설치](docs/setup/README.md)
- [Docker 설치 및 실행](docs/setup/docker-setup.md#한국어)
- [데모 체크리스트](docs/demo-checklist.md#한국어)

### 품질 검사

`develop` 또는 `main`을 대상으로 하는 Pull Request와 push에서는 GitHub
Actions의 [Web CI 워크플로](.github/workflows/web-ci.yml)가 자동으로 실행됩니다.

```text
npm ci -> npm run lint -> npm run build
```

이를 통해 동일한 의존성 설치, ESLint 규칙, TypeScript 및 Next.js 프로덕션 빌드를
검증합니다. 워크플로가 정상 실행된 후 GitHub Ruleset을 설정하여 병합 전 필수
검사로 지정할 예정입니다.

### 현재 상태

포트폴리오 평가, 현재가 출처 메타데이터, fixture 기반 백테스트 리포트 흐름이
구현되어 있습니다. 아직 모의투자 데모 단계이며, 일부 시장 데이터, 전략 실행과
배포 흐름은 fixture 또는 로컬 개발 범위에 남아 있습니다.

현재 범위에는 실제 자금을 사용하는 증권사 연동이 포함되지 않습니다.

---

## 日本語

MarketPilotは、市場価格、マクロ経済指標、ニュースイベント、機械学習による
シグナルを組み合わせた、インストール可能なペーパートレード用Webアプリです。
実際の資金を使わずに、投資アイデアの検討、戦略の検証、仮想ポートフォリオの
運用を行えます。

### プロジェクト目標

次のスキルを実証できる、ポートフォリオ向けのフルスタックデータプロダクトを
構築します。

- レスポンシブなフロントエンドとPWA開発
- バックエンドAPIとリレーショナルデータモデリング
- スケジュール実行される市場データパイプライン
- 説明可能な機械学習シグナル
- バックテストとペーパートレードのワークフロー
- AWSアーキテクチャ、可観測性、コスト管理

MarketPilotは、利益を保証したり、確実な予測を提供したりするものではありません。
すべてのシグナルに、不確実性、判断根拠、リスク要因を含めます。

### MVP

最初の実用バージョンでは、次の機能を提供します。

1. 任意の初期資金でペーパーポートフォリオを作成
2. 追加の入金と出金を記録
3. 現金、保有銘柄、注文、ポートフォリオの運用成績を追跡
4. 少数の米国株を対象に日次価格を収集
5. 説明可能なベースライン戦略を実行
6. 手数料とスリッページを含めてバックテスト
7. リターン、ドローダウン、シャープレシオ、ベンチマーク比較を表示
8. PCとモバイルに対応し、PWAとしてインストール可能

ニュース分析、マクロ経済スコア、MLランキング、自動ペーパー注文、AWSへの
デプロイは、会計処理とバックテストの信頼性を確立した後に追加します。

### デモ確認フロー

フロントエンドとバックエンドをローカルで起動してから、次の画面を確認します。

1. `/{locale}/portfolio` - ペーパーポートフォリオの作成または選択、現金、
   保有銘柄、評価額、現在値の出所、FXバッジ、ペーパー注文履歴を確認します。
2. `/{locale}/markets` - 市場データとquote providerの表示フローを確認します。
3. `/{locale}/backtests` - fixture戦略を設定してシミュレーションを実行し、
   使用した前提、選択銘柄の比率、リスク診断、チャート、ベンチマーク比較、
   取引履歴を確認します。

スクリーンショットはまだコミットしません。ローカルの秘密情報を更新し、
`.env`や管理者向け画面が写っていないことを確認してから追加します。

### スクリーンショット

予定しているスクリーンショットファイルは次の通りです。

- `docs/assets/demo/portfolio-overview.png`
- `docs/assets/demo/portfolio-mobile.png`
- `docs/assets/demo/markets-overview.png`
- `docs/assets/demo/backtest-results.png`
- `docs/assets/demo/backtest-mobile.png`

撮影前に[デモチェックリスト](docs/demo-checklist.md)を確認します。すべての
スクリーンショットにはペーパートレードデータのみを表示し、ターミナル、環境
変数ファイル、provider dashboard、個人アカウント情報は写さないようにします。

### 現在の技術スタック

- フロントエンド: Next.js、TypeScript、Tailwind CSS、Recharts
- バックエンド: Python、FastAPI、SQLAlchemy、Alembic
- データベース: PostgreSQL
- データ処理・ML: Polars、scikit-learn、XGBoost
- ローカル環境: Docker Compose
- テスト: Pytest、Vitest、Playwright
- インフラ: AWS、Terraform、GitHub Actions

### ドキュメント

- [要件定義](docs/requirements.md#日本語)
- [アーキテクチャ](docs/architecture.md#日本語)
- [ロードマップ](docs/roadmap.md#日本語)
- [AWSロードマップ](docs/aws-roadmap.md#日本語)
- [コスト計画](docs/cost-plan.md#日本語)
- [学習中心の開発計画](docs/learning-plan.md#日本語)
- [フロントエンド文書](docs/frontend/README.md)
- [バックエンド文書](docs/backend/README.md)
- [開発環境セットアップ](docs/setup/README.md)
- [Docker設定と実行](docs/setup/docker-setup.md#日本語)
- [デモチェックリスト](docs/demo-checklist.md)

### 品質チェック

`develop`または`main`を対象とするPull Requestとpushでは、GitHub Actionsの
[Web CIワークフロー](.github/workflows/web-ci.yml)が自動的に実行されます。

```text
npm ci -> npm run lint -> npm run build
```

これにより、再現可能な依存関係のインストール、ESLintルール、TypeScript、
Next.jsの本番ビルドを検証します。ワークフローの正常動作を確認した後、
GitHub Rulesetでマージ前の必須チェックとして設定する予定です。

### 現在の状況

ポートフォリオ評価、現在値の出所メタデータ、fixtureベースのバックテスト
レポートフローは実装済みです。まだペーパートレードのデモ段階であり、一部の
市場データ、戦略実行、デプロイの流れはfixtureまたはローカル開発範囲に残っています。

現在のスコープには、実資金を扱う証券口座との連携は含まれていません。
