# Working Agreements

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

> English version

## Product safety

- Keep all trading behavior paper-only unless the user starts a separate,
  explicit real-money phase.
- Never describe forecasts as guaranteed returns.
- Keep portfolio accounting and risk controls deterministic and testable.
- Do not allow LLM output to place orders directly.

## Engineering

- Work one roadmap phase at a time.
- Prefer the simplest implementation that satisfies the current phase.
- Add tests for portfolio math, cash flows, backtests, and order handling.
- Preserve timestamps, sources, and model or strategy versions for decisions.
- Keep secrets in ignored environment files and provide example templates.

## Cost control

- Default to free and local services.
- Ask before enabling a resource expected to charge money.
- Avoid always-on cloud resources until their need is demonstrated.
- Add budgets and alerts before AWS workload deployment.

## Verification

- Run formatting, linting, type checks, and relevant tests before completion.
- Verify frontend work at desktop and mobile viewport sizes.
- Document commands needed to reproduce data and model results.

---

## 한국어

### 제품 안전

- 사용자가 별도의 실제 자금 단계를 명시적으로 시작하기 전까지 모든 거래 기능을
  모의매매로 제한한다.
- 예측을 수익 보장처럼 표현하지 않는다.
- 포트폴리오 회계와 위험 관리는 결정적이고 테스트 가능하게 구현한다.
- LLM 출력이 직접 주문을 실행하도록 허용하지 않는다.

### 엔지니어링

- 로드맵의 한 단계를 완료한 뒤 다음 단계로 진행한다.
- 현재 단계의 요구사항을 충족하는 가장 단순한 구현을 우선한다.
- 포트폴리오 계산, 현금 흐름, 백테스트와 주문 처리에 테스트를 추가한다.
- 판단 시점, 출처, 모델 또는 전략 버전을 보존한다.
- 비밀정보는 Git에서 제외된 환경 파일에 저장하고 예제 템플릿을 제공한다.

### 비용 관리

- 무료 서비스와 로컬 환경을 기본값으로 사용한다.
- 비용이 발생할 수 있는 리소스를 활성화하기 전에 사용자에게 확인한다.
- 필요성이 입증되기 전까지 상시 실행되는 클라우드 리소스를 피한다.
- AWS 워크로드 배포 전에 예산과 알림을 설정한다.

### 검증

- 완료 전에 포맷, 린트, 타입 검사와 관련 테스트를 실행한다.
- 프론트엔드를 PC와 모바일 화면 크기에서 확인한다.
- 데이터와 모델 결과를 재현하는 데 필요한 명령어를 문서화한다.

---

## 日本語

### プロダクトの安全性

- ユーザーが実資金フェーズを別途明示的に開始しない限り、すべての取引機能を
  ペーパートレードに限定する。
- 予測を利益保証として表現しない。
- ポートフォリオ会計とリスク管理は、決定論的かつテスト可能にする。
- LLMの出力から注文を直接発注させない。

### エンジニアリング

- ロードマップのフェーズを一つずつ進める。
- 現在のフェーズを満たす最もシンプルな実装を優先する。
- ポートフォリオ計算、キャッシュフロー、バックテスト、注文処理にテストを追加する。
- 判断に使用した時刻、情報源、モデルまたは戦略のバージョンを保持する。
- シークレットはGit管理外の環境ファイルに保存し、サンプルテンプレートを用意する。

### コスト管理

- 無料サービスとローカル環境をデフォルトにする。
- 課金が見込まれるリソースを有効化する前に確認する。
- 必要性が実証されるまで、常時稼働するクラウドリソースを避ける。
- AWSワークロードをデプロイする前に予算とアラートを設定する。

### 検証

- 完了前にフォーマット、Lint、型チェック、関連テストを実行する。
- フロントエンドはPCとモバイルの両方のビューポートで確認する。
- データおよびモデルの結果を再現するためのコマンドを文書化する。
