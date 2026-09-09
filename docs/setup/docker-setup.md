# Docker Setup

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

## English

This guide explains how to run MarketPilot locally with Docker.

Docker is used here before AWS because AWS ECS/Fargate runs containers. If the
application works locally as containers first, the later AWS deployment becomes
easier to understand and debug.

## What Docker Runs

`compose.yaml` starts three services:

| Service | Role | Local URL |
| --- | --- | --- |
| `postgres` | PostgreSQL database | `127.0.0.1:5432` |
| `api` | FastAPI backend | `http://127.0.0.1:8001` |
| `web` | Next.js frontend | `http://127.0.0.1:3001` |

The browser uses `127.0.0.1:3001` for the web app. The web container talks to
the API container through `http://api:8000` inside the Docker network.

## Why The Ports Are Different

The API container listens on port `8000`, but the host machine exposes it as
`8001`.

The web container listens on port `3000`, but the host machine exposes it as
`3001`.

This avoids conflicts with local development servers that may already use
`3000` or `8000`.

## Run

From the repository root:

```bash
docker compose up -d
```

This builds and starts the containers in the background.

## Verify

Check container status:

```bash
docker compose ps
```

Check the API process:

```bash
curl http://127.0.0.1:8001/health
```

Expected result:

```json
{"status":"ok","service":"marketpilot-api"}
```

Check the API and database connection:

```bash
curl http://127.0.0.1:8001/readiness
```

Expected result:

```json
{"status":"ready","database":"available"}
```

Check the web app:

```bash
curl -I http://127.0.0.1:3001
```

The root page redirects to `/ko`, so `307 Temporary Redirect` is expected.

## Database Migrations

The database container only creates an empty PostgreSQL database. Application
tables are created by Alembic migrations.

Run migrations after the containers are up:

```bash
docker compose exec api alembic upgrade head
```

This is important because a healthy database process does not automatically
mean the application tables exist.

## Stop

Stop the containers:

```bash
docker compose down
```

Stop the containers and remove the local database volume:

```bash
docker compose down -v
```

Use `-v` carefully because it deletes local PostgreSQL data.

## AWS Connection

This local Docker setup is the first step toward AWS:

1. Dockerfile builds the web and API images.
2. Docker Compose proves the images can run together locally.
3. Later, ECR stores these images in AWS.
4. ECS/Fargate runs the same kind of containers in AWS.

---

<a id="한국어"></a>

## 한국어

이 문서는 MarketPilot을 Docker로 로컬 실행하는 방법을 설명합니다.

AWS 전에 Docker를 먼저 쓰는 이유는 AWS ECS/Fargate가 container를 실행하는
서비스이기 때문입니다. 앱이 로컬에서 container로 먼저 잘 돌아가면, 나중에 AWS
배포를 이해하고 디버깅하기 쉬워집니다.

## Docker가 실행하는 것

`compose.yaml`은 세 가지 service를 실행합니다.

| Service | 역할 | 로컬 주소 |
| --- | --- | --- |
| `postgres` | PostgreSQL database | `127.0.0.1:5432` |
| `api` | FastAPI backend | `http://127.0.0.1:8001` |
| `web` | Next.js frontend | `http://127.0.0.1:3001` |

브라우저에서는 `127.0.0.1:3001`로 web app에 접속합니다. web container는 Docker
network 안에서 `http://api:8000`으로 API container에 요청합니다.

## 왜 포트가 다른가?

API container 내부 port는 `8000`이지만, 내 컴퓨터에서는 `8001`로 열어둡니다.

web container 내부 port는 `3000`이지만, 내 컴퓨터에서는 `3001`로 열어둡니다.

이렇게 하면 이미 로컬 개발 서버가 `3000`이나 `8000`을 쓰고 있어도 충돌을 피할
수 있습니다.

## 실행

Repository root에서 실행합니다.

```bash
docker compose up -d
```

이 명령은 container를 build하고 백그라운드에서 실행합니다.

## 확인

container 상태 확인:

```bash
docker compose ps
```

API process 확인:

```bash
curl http://127.0.0.1:8001/health
```

예상 결과:

```json
{"status":"ok","service":"marketpilot-api"}
```

API와 database 연결 확인:

```bash
curl http://127.0.0.1:8001/readiness
```

예상 결과:

```json
{"status":"ready","database":"available"}
```

web app 확인:

```bash
curl -I http://127.0.0.1:3001
```

root page는 `/ko`로 이동하므로 `307 Temporary Redirect`가 나오면 정상입니다.

## Database Migration

database container는 비어 있는 PostgreSQL database만 만듭니다. 실제 application
table은 Alembic migration으로 만듭니다.

container가 실행된 뒤 migration을 실행합니다.

```bash
docker compose exec api alembic upgrade head
```

database process가 건강하다는 것과 application table이 있다는 것은 다릅니다.
그래서 migration 확인이 중요합니다.

## 종료

container 종료:

```bash
docker compose down
```

container를 종료하고 로컬 database volume까지 삭제:

```bash
docker compose down -v
```

`-v`는 로컬 PostgreSQL 데이터를 지우므로 조심해서 사용합니다.

## AWS와의 연결

이 로컬 Docker 설정은 AWS로 가기 위한 첫 단계입니다.

1. Dockerfile이 web과 API image를 만듭니다.
2. Docker Compose가 image들이 로컬에서 함께 실행되는지 검증합니다.
3. 나중에 ECR이 이 image들을 AWS에 저장합니다.
4. ECS/Fargate가 AWS에서 같은 종류의 container를 실행합니다.

---

<a id="日本語"></a>

## 日本語

このドキュメントは、MarketPilotをDockerでローカル実行する方法を説明します。

AWSの前にDockerを使う理由は、AWS ECS/Fargateがcontainerを実行するサービス
だからです。アプリがまずローカルでcontainerとして動けば、あとでAWSへ
deployするときに理解とdebugがしやすくなります。

## Dockerが実行するもの

`compose.yaml`は3つのserviceを起動します。

| Service | 役割 | ローカルURL |
| --- | --- | --- |
| `postgres` | PostgreSQL database | `127.0.0.1:5432` |
| `api` | FastAPI backend | `http://127.0.0.1:8001` |
| `web` | Next.js frontend | `http://127.0.0.1:3001` |

ブラウザでは`127.0.0.1:3001`でweb appにアクセスします。web containerは
Docker network内で`http://api:8000`を使ってAPI containerへrequestします。

## なぜportが違うのか？

API container内部のportは`8000`ですが、ローカルPCでは`8001`として公開します。

web container内部のportは`3000`ですが、ローカルPCでは`3001`として公開します。

こうすると、すでにローカル開発サーバーが`3000`や`8000`を使っていても衝突を
避けられます。

## 実行

Repository rootで実行します。

```bash
docker compose up -d
```

このcommandはcontainerをbuildし、backgroundで起動します。

## 確認

containerの状態を確認します。

```bash
docker compose ps
```

API processを確認します。

```bash
curl http://127.0.0.1:8001/health
```

期待する結果:

```json
{"status":"ok","service":"marketpilot-api"}
```

APIとdatabaseの接続を確認します。

```bash
curl http://127.0.0.1:8001/readiness
```

期待する結果:

```json
{"status":"ready","database":"available"}
```

web appを確認します。

```bash
curl -I http://127.0.0.1:3001
```

root pageは`/ko`へredirectするため、`307 Temporary Redirect`なら正常です。

## Database Migration

database containerは空のPostgreSQL databaseだけを作ります。実際のapplication
tableはAlembic migrationで作ります。

container起動後にmigrationを実行します。

```bash
docker compose exec api alembic upgrade head
```

database processがhealthyであることと、application tableが存在することは別です。
そのためmigration確認が重要です。

## 終了

containerを停止します。

```bash
docker compose down
```

containerを停止し、ローカルdatabase volumeも削除します。

```bash
docker compose down -v
```

`-v`はローカルPostgreSQL dataを削除するため、注意して使います。

## AWSとのつながり

このローカルDocker設定は、AWSへ進むための最初のstepです。

1. DockerfileがwebとAPI imageを作ります。
2. Docker Composeがimage同士をローカルで一緒に動かせるか検証します。
3. あとでECRがこれらのimageをAWSに保存します。
4. ECS/FargateがAWS上で同じ種類のcontainerを実行します。
