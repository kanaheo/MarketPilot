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
- Alembic migration management
- passing endpoint test

Creating a portfolio writes the portfolio and its `INITIAL_DEPOSIT` ledger
entry in one database transaction. Listing portfolios is always filtered by
the authenticated database user and calculates current cash from the ledger.
Supported base currencies are USD, KRW, and JPY.

Portfolio detail includes current cash and the 20 most recent cash ledger
events. Holdings and orders remain empty until their backend phases. Deposits
and withdrawals use the portfolio base currency, require a timezone-aware
occurrence time, and append immutable ledger events. Withdrawals lock the
portfolio row and reject amounts above the current cash balance.

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
