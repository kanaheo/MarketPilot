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
- Alembic migration management
- passing endpoint test

The health endpoint currently confirms API process and routing availability.

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
- Alembic 마이그레이션 관리
- 통과하는 endpoint 테스트

현재 health endpoint는 API 프로세스와 라우팅 동작을 확인합니다.

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
- Alembicマイグレーション管理
- 成功するendpointテスト

現在のhealth endpointはAPIプロセスとルーティングの動作を確認します。
