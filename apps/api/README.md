# MarketPilot API

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

## English

FastAPI backend for MarketPilot.

### Current foundation

- typed health and database-readiness endpoints
- SQLAlchemy session and declarative models
- `users`, `portfolios`, and immutable `cash_transactions` ledger tables
- Alembic database migrations
- protected Auth.js user synchronization endpoint

### Commands

```bash
cd apps/api
source .venv/bin/activate
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
python -m pytest
```

Create `.env` only for server-only overrides such as the internal user-sync
token. Never commit it. See [Backend setup](../../docs/setup/backend-setup.md#english).

---

<a id="한국어"></a>

## 한국어

MarketPilot의 FastAPI 백엔드입니다.

### 현재 구성

- 타입이 지정된 API 및 DB 상태 확인 endpoint
- SQLAlchemy 세션과 선언형 모델
- `users`, `portfolios`, 변경 불가능한 `cash_transactions` 원장 테이블
- Alembic DB 마이그레이션
- 보호된 Auth.js 사용자 동기화 endpoint

### 명령어

```bash
cd apps/api
source .venv/bin/activate
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
python -m pytest
```

내부 사용자 동기화 비밀키처럼 서버 전용 값을 변경할 때만 `.env`를 만들며 커밋하지
않습니다. 자세한 순서는 [백엔드 설치 문서](../../docs/setup/backend-setup.md#한국어)를
참고합니다.

---

<a id="日本語"></a>

## 日本語

MarketPilotのFastAPIバックエンドです。

### 現在の構成

- 型付きAPIとDBヘルスチェックendpoint
- SQLAlchemyセッションと宣言型モデル
- `users`、`portfolios`、変更不可の`cash_transactions`元帳テーブル
- Alembic DBマイグレーション
- 保護されたAuth.jsユーザー同期endpoint

### コマンド

```bash
cd apps/api
source .venv/bin/activate
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
python -m pytest
```

内部ユーザー同期トークンなどサーバー専用値を上書きする場合のみ`.env`を作成し、
コミットしません。詳細は[バックエンド設定](../../docs/setup/backend-setup.md#日本語)
を参照してください。
