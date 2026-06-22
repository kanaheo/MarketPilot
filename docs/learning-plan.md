# Learning Development Plan

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

## English

MarketPilot is developed in small learning units. Each unit should be easy to
review, explain, test, and commit independently.

### Working rule

1. Define one small goal.
2. Explain the concepts and commands before implementation.
3. Change only the files required for that goal.
4. Run and verify the result.
5. Review the code file by file.
6. Commit before starting the next unit.

### Phase 1 - Frontend foundation

| Step | Scope | Result |
| --- | --- | --- |
| 1-01 | Install nvm and Node.js 22 | Reproducible Node environment |
| 1-02 | Create Next.js with TypeScript | Default Next.js page runs |
| 1-03 | Learn the generated structure | Understand core files |
| 1-04 | Build the app layout | Empty sidebar and top bar |
| 1-05 | Build the dashboard heading | Greeting and primary actions |
| 1-06 | Build one summary card | Learn reusable components and props |
| 1-07 | Expand the summary cards | Portfolio summary section |
| 1-08 | Build the watchlist | Favorite stocks with fixture prices |
| 1-09 | Build the performance chart | Portfolio and benchmark comparison |
| 1-10 | Build AI signals | Probability, evidence, and risk |
| 1-11 | Build holdings and activity | Tables and reusable lists |
| 1-12 | Add responsive behavior | Desktop and mobile layouts |
| 1-13 | Add PWA support | Installable web app |

Current scope: **1-01 and 1-02 only.**

### Phase 2 - Backend connection

Phase 2 connects the Phase 1 screens to FastAPI and PostgreSQL one feature at
a time. For example, the virtual deposit feature will be completed through
the UI, API, database, recalculation, and tests before another feature begins.

The current backend foundation is summarized in
[`backend-development-plan.md`](backend-development-plan.md).

### Continuous integration

The repository uses GitHub Actions to verify changes before they are
integrated into `develop` or `main`.

1. A pull request or push triggers `Web CI`.
2. GitHub prepares Node.js from the root `.nvmrc`.
3. `npm ci` installs the exact versions in `package-lock.json`.
4. `npm run lint` checks ESLint rules.
5. `npm run build` checks TypeScript and the production build.

The workflow file is `.github/workflows/web-ci.yml`. After its first successful
run, a GitHub Ruleset will make `Web CI / Lint and build` a required check.

---

## 한국어

MarketPilot은 작은 학습 단위로 개발합니다. 각 단위는 독립적으로 검토하고,
설명하고, 테스트하고, 커밋할 수 있어야 합니다.

### 작업 규칙

1. 작은 목표 하나를 정한다.
2. 구현 전에 개념과 명령어를 설명한다.
3. 해당 목표에 필요한 파일만 수정한다.
4. 실행하고 결과를 확인한다.
5. 변경된 코드를 파일별로 검토한다.
6. 다음 작업 전에 커밋한다.

### Phase 1 - 프론트엔드 기반

| 단계 | 범위 | 결과 |
| --- | --- | --- |
| 1-01 | nvm 및 Node.js 22 설치 | 재현 가능한 Node 환경 |
| 1-02 | TypeScript 기반 Next.js 생성 | Next.js 기본 화면 실행 |
| 1-03 | 생성된 구조 학습 | 핵심 파일 역할 이해 |
| 1-04 | 앱 레이아웃 제작 | 빈 사이드바와 상단 바 |
| 1-05 | 대시보드 제목 영역 제작 | 인사말과 주요 버튼 |
| 1-06 | 요약 카드 하나 제작 | 컴포넌트와 props 학습 |
| 1-07 | 요약 카드 확장 | 포트폴리오 요약 영역 |
| 1-08 | 관심 종목 제작 | 예제 시세 기반 즐겨찾기 |
| 1-09 | 성과 차트 제작 | 포트폴리오와 벤치마크 비교 |
| 1-10 | AI 신호 제작 | 확률, 근거 및 위험도 |
| 1-11 | 보유 종목과 활동 제작 | 테이블과 재사용 목록 |
| 1-12 | 반응형 적용 | PC 및 모바일 레이아웃 |
| 1-13 | PWA 적용 | 설치 가능한 웹앱 |

현재 작업 범위: **1-01과 1-02만 진행한다.**

### Phase 2 - 백엔드 연결

Phase 2에서는 Phase 1 화면을 FastAPI와 PostgreSQL에 기능 하나씩 연결합니다.
예를 들어 가상자금 입금 기능의 UI, API, DB 저장, 잔액 재계산 및 테스트를 모두
완료한 후에 다음 기능을 시작합니다.

현재 백엔드 기반 구성은
[`backend-development-plan.md`](backend-development-plan.md)에 요약합니다.

### 지속적 통합(CI)

저장소는 변경사항을 `develop` 또는 `main`에 통합하기 전에 GitHub Actions로
자동 검증합니다.

1. Pull Request 또는 push가 `Web CI`를 실행한다.
2. GitHub가 루트 `.nvmrc`를 읽어 Node.js를 준비한다.
3. `npm ci`가 `package-lock.json`에 기록된 정확한 버전을 설치한다.
4. `npm run lint`가 ESLint 규칙을 검사한다.
5. `npm run build`가 TypeScript와 프로덕션 빌드를 검사한다.

워크플로 파일은 `.github/workflows/web-ci.yml`입니다. 최초 성공 실행을 확인한 뒤
GitHub Ruleset에서 `Web CI / Lint and build`를 필수 검사로 지정합니다.

---

## 日本語

MarketPilotは小さな学習単位で開発します。各単位は独立してレビュー、説明、
テスト、コミットできる状態にします。

### 作業ルール

1. 小さな目標を一つ決める。
2. 実装前に概念とコマンドを説明する。
3. その目標に必要なファイルだけを変更する。
4. 実行して結果を確認する。
5. 変更したコードをファイルごとに確認する。
6. 次の作業を始める前にコミットする。

### Phase 1 - フロントエンド基盤

| ステップ | 範囲 | 結果 |
| --- | --- | --- |
| 1-01 | nvmとNode.js 22をインストール | 再現可能なNode環境 |
| 1-02 | TypeScriptでNext.jsを作成 | Next.jsの初期画面を実行 |
| 1-03 | 生成された構成を学習 | 主要ファイルの役割を理解 |
| 1-04 | アプリレイアウトを作成 | 空のサイドバーとトップバー |
| 1-05 | ダッシュボード見出しを作成 | 挨拶と主要ボタン |
| 1-06 | サマリーカードを一つ作成 | コンポーネントとpropsを学習 |
| 1-07 | サマリーカードを拡張 | ポートフォリオ概要 |
| 1-08 | ウォッチリストを作成 | サンプル価格によるお気に入り銘柄 |
| 1-09 | パフォーマンスチャートを作成 | ポートフォリオと指標の比較 |
| 1-10 | AIシグナルを作成 | 確率、根拠、リスク |
| 1-11 | 保有銘柄と履歴を作成 | テーブルと再利用可能なリスト |
| 1-12 | レスポンシブ対応 | PCとモバイルのレイアウト |
| 1-13 | PWA対応 | インストール可能なWebアプリ |

現在の作業範囲: **1-01と1-02のみ。**

### Phase 2 - バックエンド接続

Phase 2では、Phase 1の画面をFastAPIとPostgreSQLへ機能単位で接続します。
例えば仮想資金の入金機能について、UI、API、DB保存、残高再計算、テストを
完了してから次の機能へ進みます。

現在のバックエンド基盤は
[`backend-development-plan.md`](backend-development-plan.md)に要約します。

### 継続的インテグレーション（CI）

変更を`develop`または`main`へ統合する前に、GitHub Actionsで自動検証します。

1. Pull Requestまたはpushによって`Web CI`を実行する。
2. GitHubがルートの`.nvmrc`を読み、Node.jsを準備する。
3. `npm ci`が`package-lock.json`に記録された正確なバージョンをインストールする。
4. `npm run lint`がESLintルールを検証する。
5. `npm run build`がTypeScriptと本番ビルドを検証する。

ワークフローファイルは`.github/workflows/web-ci.yml`です。初回の成功を確認後、
GitHub Rulesetで`Web CI / Lint and build`を必須チェックに設定します。
