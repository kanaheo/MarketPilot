# Cost Plan

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## 1. Goal

Keep the development and public portfolio version at or near zero cost. Any
service that can charge money must have an owner, budget, alert, and shutdown
path before it is enabled.

## 2. Development defaults

| Area | Initial choice | Expected project cost |
| --- | --- | ---: |
| Source control | GitHub free repository | 0 |
| Frontend development | Local Next.js | 0 |
| API development | Local FastAPI | 0 |
| Database | Local PostgreSQL in Docker | 0 |
| ML training | Local CPU | 0 |
| Charts | Open-source library | 0 |
| Paper trading | Free paper account or internal simulator | 0 |
| Economic data | Public official APIs | 0 |
| Domain | Provider subdomain initially | 0 |

Free plans and API terms can change, so they must be rechecked when a provider
is selected.

## 3. AWS cost rules

1. Create AWS Budgets alerts before deploying workloads.
2. Set low alerts such as USD 1, USD 5, and USD 10.
3. Add cost-allocation tags to every supported resource.
4. Prefer scheduled or request-based compute that scales to zero.
5. Define resources with Terraform so they can be destroyed predictably.
6. Keep raw data retention and log retention explicit.
7. Never leave experimental notebooks or endpoints running.
8. Review Cost Explorer after each infrastructure phase.

## 4. Services to treat carefully

These may incur ongoing or surprising cost and require explicit approval:

- NAT Gateway
- continuously running EC2 or ECS services
- RDS instances and backups
- SageMaker endpoints and notebook instances
- high-volume CloudWatch logs
- frequent third-party news or market-data APIs
- paid LLM calls
- large S3 data transfer or retention

## 5. AI cost controls

- use deterministic rules and classical ML for the primary signal pipeline
- run training locally before using managed ML
- analyze only new, relevant news
- cache extracted events and summaries
- batch LLM requests where appropriate
- set provider usage limits and billing alerts
- do not require an LLM for portfolio accounting or order risk checks

## 6. Deployment stages

### Stage A - Local only

Cost target: 0.

All application, database, pipelines, and ML experiments run locally.

### Stage B - Free public demo

Cost target: 0 or close to 0.

Use a free frontend host and a sleep-capable or serverless backend where the
terms fit a personal portfolio. Demo data may be refreshed periodically rather
than continuously.

### Stage C - AWS portfolio architecture

Cost target: single-digit USD per month, with hard alerts.

Deploy the smallest useful AWS slice, beginning with scheduled ingestion,
object storage, logs, and a read-only demo. Add services only when they prove a
specific skill or solve a measured need.

## 7. Paid approval record

Before enabling a paid dependency, record:

- service and purpose
- free allowance
- expected monthly cost
- worst reasonable monthly cost
- budget alert
- shutdown procedure
- whether the user explicitly approved it

---

## 한국어

### 1. 목표

개발 환경과 공개 포트폴리오 버전의 비용을 0원 또는 거의 0원으로 유지합니다.
비용이 발생할 수 있는 서비스는 활성화 전에 담당자, 예산, 알림 및 종료 방법을
정해야 합니다.

### 2. 개발 기본값

| 영역 | 초기 선택 | 예상 프로젝트 비용 |
| --- | --- | ---: |
| 소스 관리 | GitHub 무료 저장소 | 0 |
| 프론트엔드 개발 | 로컬 Next.js | 0 |
| API 개발 | 로컬 FastAPI | 0 |
| 데이터베이스 | Docker의 로컬 PostgreSQL | 0 |
| ML 학습 | 로컬 CPU | 0 |
| 차트 | 오픈소스 라이브러리 | 0 |
| 모의매매 | 무료 모의계좌 또는 내부 시뮬레이터 | 0 |
| 경제 데이터 | 공공기관 공개 API | 0 |
| 도메인 | 초기에는 서비스 제공 하위 도메인 | 0 |

무료 플랜과 API 이용 조건은 변경될 수 있으므로 제공자를 선택할 때 다시 확인합니다.

### 3. AWS 비용 규칙

1. 워크로드 배포 전에 AWS Budgets 알림을 생성한다.
2. 1 USD, 5 USD 및 10 USD처럼 낮은 금액의 알림을 설정한다.
3. 지원되는 모든 리소스에 비용 할당 태그를 추가한다.
4. 0까지 축소되는 예약형 또는 요청형 컴퓨팅을 우선한다.
5. Terraform으로 리소스를 정의하여 예측 가능하게 제거할 수 있게 한다.
6. 원본 데이터와 로그 보관 기간을 명시한다.
7. 실험용 노트북이나 엔드포인트를 실행 상태로 방치하지 않는다.
8. 각 인프라 단계 후 Cost Explorer를 확인한다.

### 4. 주의가 필요한 서비스

다음 서비스는 지속적이거나 예상 밖의 비용이 발생할 수 있어 명시적인 승인이 필요합니다.

- NAT Gateway
- 상시 실행 EC2 또는 ECS 서비스
- RDS 인스턴스 및 백업
- SageMaker 엔드포인트 및 노트북 인스턴스
- 대량의 CloudWatch 로그
- 빈번하게 호출하는 외부 뉴스 또는 시장 데이터 API
- 유료 LLM 호출
- 대규모 S3 데이터 전송 또는 장기 보관

### 5. AI 비용 관리

- 주요 신호 파이프라인에는 결정적 규칙과 전통적인 ML을 사용한다.
- 관리형 ML을 사용하기 전에 로컬에서 학습한다.
- 새롭고 관련 있는 뉴스만 분석한다.
- 추출한 이벤트와 요약 결과를 캐시한다.
- 적합한 경우 LLM 요청을 일괄 처리한다.
- 제공자 사용 한도와 결제 알림을 설정한다.
- 포트폴리오 회계 또는 주문 위험 검사에 LLM을 필수로 사용하지 않는다.

### 6. 배포 단계

#### A단계 - 로컬 전용

비용 목표: 0.

애플리케이션, 데이터베이스, 파이프라인 및 ML 실험을 모두 로컬에서 실행합니다.

#### B단계 - 무료 공개 데모

비용 목표: 0 또는 거의 0.

개인 포트폴리오에 적합한 이용 조건을 가진 무료 프론트엔드 호스팅과 휴면 또는
서버리스 백엔드를 사용합니다. 데모 데이터는 실시간이 아닌 주기적으로 갱신할 수 있습니다.

#### C단계 - AWS 포트폴리오 아키텍처

비용 목표: 월 한 자릿수 USD 및 엄격한 알림 설정.

정기 데이터 수집, 객체 저장소, 로그 및 읽기 전용 데모부터 가장 작은 AWS 구성을
배포합니다. 특정 역량을 보여주거나 측정된 문제를 해결하는 서비스만 추가합니다.

### 7. 유료 서비스 승인 기록

유료 의존성을 활성화하기 전에 다음 항목을 기록합니다.

- 서비스 및 목적
- 무료 이용 한도
- 예상 월 비용
- 합리적으로 예상되는 최대 월 비용
- 예산 알림
- 종료 절차
- 사용자의 명시적 승인 여부

---

## 日本語

### 1. 目標

開発環境と公開ポートフォリオ版の費用を、ゼロまたはほぼゼロに維持します。
課金の可能性があるサービスは、有効化前に責任者、予算、アラート、
停止手順を明確にします。

### 2. 開発時のデフォルト

| 領域 | 初期選択 | 想定プロジェクト費用 |
| --- | --- | ---: |
| ソース管理 | GitHub無料リポジトリ | 0 |
| フロントエンド開発 | ローカルNext.js | 0 |
| API開発 | ローカルFastAPI | 0 |
| データベース | Docker上のローカルPostgreSQL | 0 |
| ML学習 | ローカルCPU | 0 |
| チャート | オープンソースライブラリ | 0 |
| ペーパートレード | 無料ペーパー口座または内部シミュレーター | 0 |
| 経済データ | 公的機関の公開API | 0 |
| ドメイン | 当初はサービス提供のサブドメイン | 0 |

無料プランやAPI利用条件は変更される可能性があるため、プロバイダー選定時に
改めて確認します。

### 3. AWSコストルール

1. ワークロードをデプロイする前にAWS Budgetsアラートを作成する。
2. 1 USD、5 USD、10 USDなど低額のアラートを設定する。
3. 対応するすべてのリソースにコスト配分タグを付与する。
4. ゼロまでスケールできるスケジュール型またはリクエスト型コンピューティングを優先する。
5. リソースをTerraformで定義し、予測可能な方法で削除できるようにする。
6. 生データとログの保持期間を明示する。
7. 実験用ノートブックやエンドポイントを起動したままにしない。
8. 各インフラフェーズの後にCost Explorerを確認する。

### 4. 注意が必要なサービス

次のサービスは継続的または予想外の費用が発生する可能性があるため、
明示的な承認を必要とします。

- NAT Gateway
- 常時稼働するEC2またはECSサービス
- RDSインスタンスとバックアップ
- SageMakerエンドポイントとノートブックインスタンス
- 大量のCloudWatchログ
- 高頻度で利用する外部ニュースまたは市場データAPI
- 有料LLM呼び出し
- 大量のS3データ転送または長期保存

### 5. AIコスト管理

- 主要シグナルパイプラインには決定論的ルールと従来型MLを使用する
- マネージドMLを使う前にローカルで学習する
- 新規かつ関連性の高いニュースだけを分析する
- 抽出したイベントと要約をキャッシュする
- 必要に応じてLLMリクエストをバッチ処理する
- プロバイダーの利用上限と課金アラートを設定する
- ポートフォリオ会計や注文リスクチェックにLLMを必須としない

### 6. デプロイ段階

#### ステージA - ローカルのみ

コスト目標: 0。

アプリ、データベース、パイプライン、ML実験をすべてローカルで実行します。

#### ステージB - 無料の公開デモ

コスト目標: 0またはほぼ0。

個人ポートフォリオに適した利用条件のもと、無料フロントエンドホストと、
休止可能またはサーバーレスなバックエンドを使用します。デモデータは
常時更新ではなく、定期的に更新する場合があります。

#### ステージC - AWSポートフォリオアーキテクチャ

コスト目標: 月額1桁USD、厳格なアラート付き。

定期データ取り込み、オブジェクトストレージ、ログ、読み取り専用デモから始め、
必要最小限のAWS構成をデプロイします。特定のスキルを示す、または計測済みの
課題を解決するサービスだけを追加します。

### 7. 有料サービス承認記録

有料依存サービスを有効化する前に、次の項目を記録します。

- サービス名と目的
- 無料利用枠
- 想定月額費用
- 合理的に想定される最大月額費用
- 予算アラート
- 停止手順
- ユーザーが明示的に承認したか
