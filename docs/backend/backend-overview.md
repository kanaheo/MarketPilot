# Backend

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## Direction

MarketPilot uses a modular FastAPI backend. PostgreSQL-backed portfolio,
market-data, backtest, and paper-trading features will be connected
incrementally while preserving reproducibility and auditability.

## Current foundation

- independent API package under `apps/api`
- Python 3.12 project requirement
- isolated local virtual environment
- typed environment configuration
- typed FastAPI application
- `GET /health` system endpoint
- SQLAlchemy database connection foundation
- database-aware `GET /readiness` endpoint
- SQLAlchemy declarative model foundation
- provider-neutral `users` table
- user-owned `portfolios` table
- immutable `cash_transactions` ledger table
- internal Auth.js user synchronization endpoint
- short-lived signed authentication for user APIs
- authenticated `POST /portfolios` endpoint
- authenticated `GET /portfolios` endpoint
- owner-only `GET /portfolios/{portfolio_id}` detail endpoint
- owner-only cash deposit and withdrawal endpoint
- paper `orders` table with audit fields
- owner-only paper order creation and history endpoints
- order execution endpoint with `FILLED` status updates
- execution records for filled orders
- cash ledger entries for BUY and SELL executions
- holdings, average cost, realized P/L, unrealized P/L, and return calculations
- reserved cash and reserved sell-quantity checks for pending orders
- fixture-backed market quote provider boundary
- `GET /market-data/quotes` endpoint
- fixture-backed FX rate provider boundary
- `GET /market-data/fx-rates` endpoint
- Alembic migration management
- passing endpoint test

Creating a portfolio writes the portfolio and its `INITIAL_DEPOSIT` ledger
entry in one database transaction. Listing portfolios is always filtered by
the authenticated database user and calculates current cash from the ledger.
Supported base currencies are USD, KRW, and JPY.

Portfolio detail includes current cash, recent cash ledger events, derived
holdings, recent orders, and portfolio valuation fields. Deposits and
withdrawals use the portfolio base currency, require a timezone-aware
occurrence time, and append immutable ledger events. Withdrawals lock the
portfolio row and reject amounts above the current cash balance.

Manual paper orders can be submitted, listed, updated, cancelled, deleted, and
executed per owned portfolio. Execution creates an immutable execution record,
marks the order as `FILLED`, writes the related cash ledger event, and updates
derived holdings through execution history. Pending SELL orders reserve
position quantity, pending LIMIT BUY orders reserve cash in the portfolio base
currency, and pending MARKET BUY orders reserve cash only when the quote
provider has a current price. When an instrument quote currency differs from
the portfolio base currency, cash checks and cash ledger entries use the FX
provider boundary to convert the order amount into the portfolio base currency.
New order creation still keeps the current base-currency flow until the
portfolio valuation response can expose quote currency and valuation currency
separately.

Market quotes are currently fixture-backed but are exposed through a provider
boundary and `GET /market-data/quotes`, so the implementation can later switch
to an external or cached provider without making the frontend call a third
party directly.

FX rates are also fixture-backed behind a provider boundary. The first API
surface returns a single pair rate for supported currencies. Order executions
store the execution-time FX rate snapshot, and cross-currency portfolio
valuation should use current FX rates in a later step.

---

<a id="한국어"></a>

## 한국어

### 방향

MarketPilot은 모듈형 FastAPI 백엔드를 사용합니다. PostgreSQL 기반 포트폴리오,
시장 데이터, 백테스트 및 모의매매 기능을 재현성과 감사 가능성을 유지하며 단계적으로
연결합니다.

### 현재 구성

- `apps/api`의 독립적인 API 패키지
- Python 3.12 프로젝트 기준
- 독립된 로컬 가상환경
- 타입이 지정된 환경 설정
- 타입이 지정된 FastAPI 애플리케이션
- `GET /health` 시스템 endpoint
- SQLAlchemy 데이터베이스 연결 기반
- DB 상태를 확인하는 `GET /readiness` endpoint
- SQLAlchemy 선언형 모델 기반
- 인증 제공자에 종속되지 않는 `users` 테이블
- 사용자별 `portfolios` 테이블
- 변경하지 않고 계속 쌓는 `cash_transactions` 원장 테이블
- Auth.js 로그인 사용자를 저장하는 내부 동기화 endpoint
- 로그인 사용자 API를 위한 짧은 수명 서명 인증
- 인증이 필요한 `POST /portfolios` endpoint
- 인증이 필요한 `GET /portfolios` endpoint
- 소유자만 접근하는 `GET /portfolios/{portfolio_id}` 상세 endpoint
- 소유자만 사용하는 현금 입금·출금 endpoint
- 감사 정보를 포함하는 모의주문 `orders` 테이블
- 소유자만 사용하는 모의주문 생성·내역 endpoint
- 주문 체결 endpoint 및 `FILLED` 상태 변경
- 체결된 주문의 execution 기록
- BUY 및 SELL 체결에 대한 현금 원장 기록
- 보유 종목, 평균 매수가, 실현 손익, 미실현 손익 및 수익률 계산
- 대기 주문에 대한 예약 현금 및 예약 매도 수량 검사
- fixture 기반 시장 현재가 provider 경계
- `GET /market-data/quotes` endpoint
- fixture 기반 환율 provider 경계
- `GET /market-data/fx-rates` endpoint
- Alembic 마이그레이션 관리
- 통과하는 endpoint 테스트

포트폴리오를 생성하면 포트폴리오와 `INITIAL_DEPOSIT` 원장 기록을 하나의 DB
transaction으로 저장합니다. 포트폴리오 목록은 항상 인증된 DB 사용자로 필터링하고,
현재 현금은 원장을 합산해 계산합니다. 지원 기준 통화는 USD, KRW, JPY입니다.

포트폴리오 상세에는 현재 현금과 최근 현금 원장 20건이 포함됩니다. 보유 종목과
주문은 해당 백엔드 단계 전까지 빈 배열로 반환합니다. 입출금은 포트폴리오 기준
통화를 사용하고 timezone이 포함된 발생 시각을 요구하며 기존 기록을 수정하지 않고
원장에 추가합니다. 출금은 포트폴리오 row를 잠근 뒤 현재 현금보다 큰 금액을
거부합니다.

소유한 포트폴리오별로 수동 모의주문을 접수, 조회, 수정, 취소, 삭제 및 체결할 수
있습니다. 체결은 변경 불가능한 execution 기록을 만들고, 주문을 `FILLED`로 바꾸며,
관련 현금 원장 이벤트를 저장합니다. 보유 종목은 체결 이력을 기준으로 파생
계산합니다. 대기 SELL 주문은 보유 수량을 예약하고, 대기 LIMIT BUY 주문은 포트폴리오
기준 통화로 현금을 예약하며, 대기 MARKET BUY 주문은 현재가 provider에 가격이 있을
때만 현금을 예약합니다. 종목 현재가 통화와 포트폴리오 기준 통화가 다르면 현금 검증과
현금 원장 기록은 환율 provider 경계를 사용해 주문 금액을 포트폴리오 기준 통화로
변환합니다. 다만 신규 주문 생성은 포트폴리오 평가 응답이 현재가 통화와 평가 통화를
분리해서 내려줄 수 있을 때까지 기존 기준 통화 흐름을 유지합니다.

시장 현재가는 아직 fixture 기반이지만 provider 경계와 `GET /market-data/quotes`를
통해 노출됩니다. 따라서 이후 외부 또는 캐시 provider로 바꾸더라도 프론트엔드가
외부 API를 직접 호출하지 않아도 됩니다.

환율도 provider 경계 뒤에 fixture로 준비했습니다. 첫 API는 지원 통화 사이의 단일
환율을 반환합니다. 주문 체결 기록에는 체결 시점 환율 snapshot을 저장하고, 서로 다른
통화의 포트폴리오 평가는 이후 단계에서 현재 환율을 사용하도록 연결해야 합니다.

---

<a id="日本語"></a>

## 日本語

### 方針

MarketPilotはモジュール化されたFastAPIバックエンドを使用します。
PostgreSQLベースのポートフォリオ、市場データ、バックテスト、
ペーパートレード機能を再現性と監査可能性を維持しながら段階的に接続します。

### 現在の構成

- `apps/api`の独立したAPIパッケージ
- Python 3.12のプロジェクト要件
- 分離されたローカル仮想環境
- 型付き環境設定
- 型付きFastAPIアプリケーション
- `GET /health`システムendpoint
- SQLAlchemyデータベース接続基盤
- DB状態を確認する`GET /readiness` endpoint
- SQLAlchemy宣言型モデル基盤
- 認証プロバイダーに依存しない`users`テーブル
- ユーザー別の`portfolios`テーブル
- 変更せず積み上げる`cash_transactions`元帳テーブル
- Auth.jsログインユーザーを保存する内部同期endpoint
- ログインユーザーAPI向けの短命署名認証
- 認証が必要な`POST /portfolios` endpoint
- 認証が必要な`GET /portfolios` endpoint
- 所有者のみアクセスできる`GET /portfolios/{portfolio_id}`詳細endpoint
- 所有者専用の現金入金・出金endpoint
- 監査情報を含むペーパー注文`orders`テーブル
- 所有者専用のペーパー注文作成・履歴endpoint
- 注文約定endpointと`FILLED`状態更新
- 約定済み注文のexecution記録
- BUY/SELL約定に対する現金元帳記録
- 保有銘柄、平均取得価格、実現損益、未実現損益、収益率の計算
- 待機注文に対する予約現金と予約売却数量の検査
- fixtureベースの市場価格provider境界
- `GET /market-data/quotes` endpoint
- fixtureベースのFXレートprovider境界
- `GET /market-data/fx-rates` endpoint
- Alembicマイグレーション管理
- 成功するendpointテスト

ポートフォリオ作成時は、ポートフォリオと`INITIAL_DEPOSIT`元帳記録を一つの
DB transactionで保存します。ポートフォリオ一覧は常に認証済みDBユーザーで
絞り込み、現在の現金は元帳の合計から計算します。対応基準通貨はUSD、KRW、
JPYです。

ポートフォリオ詳細には現在の現金と直近20件の現金元帳イベントを含みます。
保有銘柄と注文は該当バックエンドフェーズまで空配列を返します。入出金は
ポートフォリオの基準通貨を使用し、timezone付きの発生時刻を必須とし、既存記録を
変更せず元帳へ追加します。出金時はポートフォリオrowをロックし、現在の現金を
超える金額を拒否します。

所有するポートフォリオごとに手動ペーパー注文を登録、取得、編集、取消、削除、
約定できます。約定は変更不可のexecution記録を作成し、注文を`FILLED`に変更し、
関連する現金元帳イベントを保存します。保有銘柄は約定履歴から派生計算します。
待機中SELL注文は保有数量を予約し、待機中LIMIT BUY注文はポートフォリオ基準通貨で
現金を予約します。待機中MARKET BUY注文は、価格providerに現在値がある場合のみ
現金を予約します。銘柄価格の通貨とポートフォリオ基準通貨が異なる場合、現金検証と
現金元帳記録はFX provider境界で注文金額をポートフォリオ基準通貨へ変換します。
ただし、新規注文作成はポートフォリオ評価レスポンスが価格通貨と評価通貨を分離して
返せるようになるまで、既存の基準通貨フローを維持します。

市場価格はまだfixtureベースですが、provider境界と`GET /market-data/quotes`を通じて
公開しています。そのため後で外部またはキャッシュ型providerへ切り替えても、
フロントエンドが外部APIを直接呼ぶ必要はありません。

FXレートもprovider境界の背後にfixtureとして用意しています。最初のAPIは対応通貨
間の単一レートを返します。注文約定記録には約定時点のFXレートsnapshotを保存し、
通貨が異なるポートフォリオ評価は後続ステップで現在のFXレートへ接続します。
