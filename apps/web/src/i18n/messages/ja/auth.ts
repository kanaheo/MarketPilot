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
    forgotPassword: "パスワードをお忘れですか？",
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
  password: {
    label: "パスワード",
    placeholder: "12文字以上",
    invalid:
      "12文字以上で、英大文字、英小文字、数字、特殊文字をそれぞれ1文字以上含めてください。",
  },
  status: {
    connecting: "接続中...",
    errorTitle: "ログインを完了できませんでした",
    errorDescription:
      "しばらくしてから再度試すか、別の方法を選択してください。",
    cancelledTitle: "ログインがキャンセルされました",
    cancelledDescription: "情報は保存されていません。いつでも再開できます。",
    duplicateTitle: "このメールアドレスは登録済みです",
    duplicateDescription:
      "Googleで登録したメールの場合は、ログイン画面でGoogleログインを使用してください。",
    verificationTitle: "メール確認が必要です",
    verificationDescription:
      "アカウントは作成されました。メール確認後にログインできます。",
    devVerificationLink: "開発用確認リンクを開く",
    dismiss: "通知を閉じる",
  },
  verifyEmail: {
    successTitle: "メール確認が完了しました",
    successDescription: "メールアドレスとパスワードでログインできます。",
    errorTitle: "メール確認を完了できませんでした",
    errorDescription: "確認リンクが期限切れ、またはすでに使用済みの可能性があります。",
    loginAction: "ログインへ移動",
  },
  resetPassword: {
    requestTitle: "パスワード再設定",
    requestDescription: "登録メールアドレスを入力して再設定手順を準備します。",
    requestAction: "再設定リンクをリクエスト",
    requestSuccessTitle: "リクエストを受け付けました",
    requestSuccessDescription:
      "アカウントが存在する場合、パスワード再設定手順を確認できます。",
    devResetLink: "開発用再設定リンクを開く",
    completeTitle: "新しいパスワードを設定",
    completeDescription: "新しいパスワードでアカウントを保護しましょう。",
    completeAction: "パスワードを変更",
    completeSuccessTitle: "パスワードを変更しました",
    completeSuccessDescription: "新しいパスワードでログインできます。",
    invalidTokenTitle: "再設定リンクが無効です",
    invalidTokenDescription: "リンクが期限切れ、またはすでに使用済みの可能性があります。",
    loginAction: "ログインへ移動",
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
