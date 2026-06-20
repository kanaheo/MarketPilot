import type { Messages } from "@/types/i18n";

export const auth = {
  languageLabel: "言語を選択",
  story: {
    ariaLabel: "MarketPilotについて",
    eyebrow: "落ち着いて投資を練習する",
    title: "市場を読み、\n根拠を残し、\nリスクを確認する。",
    description:
      "実資金を使わずにポートフォリオを運用し、戦略と判断をデータで検証できるペーパートレード環境です。",
    previewLabel: "今月のポートフォリオ",
    benefits: [
      "仮想資金で安全に投資を練習",
      "収益率と最大ドローダウンを確認",
      "AIシグナルの根拠とリスクを検討",
    ],
    note: "MarketPilotは実取引や収益保証を提供しません。",
  },
  login: {
    title: "おかえりなさい",
    description: "ポートフォリオと市場の動きを引き続き確認しましょう。",
    emailAction: "メールで続ける",
    switchPrompt: "アカウントをお持ちでないですか？",
    switchAction: "無料で始める",
    termsPrefix: "続行すると",
    termsSuffix: "に同意したものとみなされます。",
  },
  signup: {
    title: "自分だけの投資記録を始めましょう",
    description:
      "アカウントを作成し、安全なペーパーポートフォリオを始める準備をします。",
    emailAction: "無料アカウントを作成",
    switchPrompt: "すでにアカウントをお持ちですか？",
    switchAction: "ログイン",
    termsPrefix: "アカウントを作成すると",
    termsSuffix: "に同意したものとみなされます。",
  },
  providers: {
    google: {
      login: "Googleでログイン",
      signup: "Googleで登録",
    },
  },
  email: {
    label: "メールアドレス",
    placeholder: "name@example.com",
    invalid: "有効なメールアドレスを入力してください。",
  },
  status: {
    connecting: "接続中...",
    errorTitle: "ログインを完了できませんでした",
    errorDescription:
      "しばらくしてから再度試すか、別の方法を選択してください。",
    cancelledTitle: "ログインがキャンセルされました",
    cancelledDescription: "情報は保存されていません。いつでも再開できます。",
    dismiss: "通知を閉じる",
  },
  or: "または",
  terms: "利用規約",
  privacy: "プライバシーポリシー",
  termsSeparator: "および",
  trust: {
    secure: "安全な認証フロー",
    paperOnly: "ペーパートレード専用",
  },
} as const satisfies Messages["auth"];
