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
python -m marketpilot_api.commands.collect_market_quotes --symbols AAPL NVDA --currency USD
python -m marketpilot_api.commands.collect_market_quotes --symbols AAPL NVDA --currency USD --interval-seconds 300 --max-runs 12
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD --skip-fresh-seconds 300
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD --skip-fresh-seconds 300 --dry-run
python -m marketpilot_api.commands.run_market_data_scheduler --from-holdings --currency USD --interval-policy market-hours --max-runs 12
curl -X POST "http://127.0.0.1:8000/market-data/quote-snapshots/collect?symbols=AAPL&skip_fresh_seconds=300" -H "X-MarketPilot-Internal-Token: $MARKETPILOT_INTERNAL_API_TOKEN"
curl "http://127.0.0.1:8000/market-data/quote-snapshots/freshness?symbols=AAPL&freshness_seconds=300"
curl "http://127.0.0.1:8000/market-data/scheduler-runs?limit=20"
curl "http://127.0.0.1:8000/market-data/scheduler-runs/status?limit=20"
```

Create `.env` only for server-only overrides such as the internal user-sync
token. Never commit it. See [Backend setup](../../docs/setup/backend-setup.md#english).

Password-auth email delivery is disabled by default. To send verification and
password reset emails through SMTP, set server-only values in `apps/api/.env`:

```dotenv
MARKETPILOT_EMAIL_PROVIDER=smtp
MARKETPILOT_EMAIL_FROM=no-reply@example.com
MARKETPILOT_AUTH_EMAIL_BASE_URL=http://localhost:3000/en
MARKETPILOT_SMTP_HOST=
MARKETPILOT_SMTP_PORT=587
MARKETPILOT_SMTP_USERNAME=
MARKETPILOT_SMTP_PASSWORD=
MARKETPILOT_SMTP_USE_TLS=true
```

AWS SES can use this path through SES SMTP credentials. Do not expose SMTP
secrets to the web app or any `NEXT_PUBLIC_` variable.

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
python -m marketpilot_api.commands.collect_market_quotes --symbols AAPL NVDA --currency USD
python -m marketpilot_api.commands.collect_market_quotes --symbols AAPL NVDA --currency USD --interval-seconds 300 --max-runs 12
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD --skip-fresh-seconds 300
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD --skip-fresh-seconds 300 --dry-run
python -m marketpilot_api.commands.run_market_data_scheduler --from-holdings --currency USD --interval-policy market-hours --max-runs 12
curl -X POST "http://127.0.0.1:8000/market-data/quote-snapshots/collect?symbols=AAPL&skip_fresh_seconds=300" -H "X-MarketPilot-Internal-Token: $MARKETPILOT_INTERNAL_API_TOKEN"
curl "http://127.0.0.1:8000/market-data/quote-snapshots/freshness?symbols=AAPL&freshness_seconds=300"
curl "http://127.0.0.1:8000/market-data/scheduler-runs?limit=20"
curl "http://127.0.0.1:8000/market-data/scheduler-runs/status?limit=20"
```

내부 사용자 동기화 비밀키처럼 서버 전용 값을 변경할 때만 `.env`를 만들며 커밋하지
않습니다. 자세한 순서는 [백엔드 설치 문서](../../docs/setup/backend-setup.md#한국어)를
참고합니다.

password auth 이메일 발송은 기본값이 꺼짐입니다. SMTP로 이메일 인증/비밀번호
재설정 메일을 보내려면 `apps/api/.env`에 서버 전용 값만 설정합니다.

```dotenv
MARKETPILOT_EMAIL_PROVIDER=smtp
MARKETPILOT_EMAIL_FROM=no-reply@example.com
MARKETPILOT_AUTH_EMAIL_BASE_URL=http://localhost:3000/en
MARKETPILOT_SMTP_HOST=
MARKETPILOT_SMTP_PORT=587
MARKETPILOT_SMTP_USERNAME=
MARKETPILOT_SMTP_PASSWORD=
MARKETPILOT_SMTP_USE_TLS=true
```

AWS SES도 SES SMTP 자격증명을 쓰면 이 흐름으로 연결할 수 있습니다. SMTP 비밀값은
web app이나 `NEXT_PUBLIC_` 변수에 절대 노출하지 않습니다.

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
python -m marketpilot_api.commands.collect_market_quotes --symbols AAPL NVDA --currency USD
python -m marketpilot_api.commands.collect_market_quotes --symbols AAPL NVDA --currency USD --interval-seconds 300 --max-runs 12
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD --skip-fresh-seconds 300
python -m marketpilot_api.commands.collect_market_quotes --from-holdings --currency USD --skip-fresh-seconds 300 --dry-run
python -m marketpilot_api.commands.run_market_data_scheduler --from-holdings --currency USD --interval-policy market-hours --max-runs 12
curl -X POST "http://127.0.0.1:8000/market-data/quote-snapshots/collect?symbols=AAPL&skip_fresh_seconds=300" -H "X-MarketPilot-Internal-Token: $MARKETPILOT_INTERNAL_API_TOKEN"
curl "http://127.0.0.1:8000/market-data/quote-snapshots/freshness?symbols=AAPL&freshness_seconds=300"
curl "http://127.0.0.1:8000/market-data/scheduler-runs?limit=20"
curl "http://127.0.0.1:8000/market-data/scheduler-runs/status?limit=20"
```

内部ユーザー同期トークンなどサーバー専用値を上書きする場合のみ`.env`を作成し、
コミットしません。詳細は[バックエンド設定](../../docs/setup/backend-setup.md#日本語)
を参照してください。

password authのメール送信はデフォルトで無効です。SMTPでメール確認と
パスワードリセットメールを送る場合は、`apps/api/.env`にサーバー専用値を設定します。

```dotenv
MARKETPILOT_EMAIL_PROVIDER=smtp
MARKETPILOT_EMAIL_FROM=no-reply@example.com
MARKETPILOT_AUTH_EMAIL_BASE_URL=http://localhost:3000/en
MARKETPILOT_SMTP_HOST=
MARKETPILOT_SMTP_PORT=587
MARKETPILOT_SMTP_USERNAME=
MARKETPILOT_SMTP_PASSWORD=
MARKETPILOT_SMTP_USE_TLS=true
```

AWS SESもSES SMTP認証情報を使えばこの流れで接続できます。SMTPシークレットは
web appや`NEXT_PUBLIC_`変数に公開しないでください。
