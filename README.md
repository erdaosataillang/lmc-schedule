# LMC Schedule

LMCアカウントと連携する日程調整アプリです。

公開先: https://erdaosataillang.github.io/lmc-schedule/

## 使い方

1. 「LMCでログイン」から既存のLMCアカウントを利用します。
2. 日程調整専用のプロジェクトを作成します。
3. 会議名と候補日・開始時刻・終了時刻を設定して作成します。
4. 回答リンクを共有します。参加者もLMCでログインし、○・△・×で回答します。
5. 主催者は候補を選択して確定します。確定日時はAppleやGoogleカレンダーに取り込めるICS形式で保存できます。

PCは週間カレンダー、スマートフォンは候補一覧を初期表示します。すべての日時は日本時間です。同じLMCアカウントの回答は上書き更新されます。

## 開発・公開

Node.js 24を利用します。

```sh
npm ci
npm run dev
npm run build
```

`main`へのpushでGitHub Actionsがビルドし、GitHub Pagesに公開します。Viteのbaseは`/lmc-schedule/`です。

## LMCとの接続

画面はGitHub Pages、認証とデータ保存は既存のLMC Firebaseプロジェクト`urakata-app`を利用します。

- 認証入口: `https://lmc-mobile.sorairosystem.com/schedule-authorize.html`
- API: `https://asia-northeast1-urakata-app.cloudfunctions.net/lmcScheduleApi`
- LMC側ソース: `https://github.com/erdaosataillang/lmc-app`

LMCで検証したLINEアカウントから、60秒有効・一度のみ使用可能なPKCE S256認証コードを発行します。日程調整アプリはコードを交換し、Firebase Authへログインします。ログインの戻り先・接続元は許可されたURLに限定され、停止中・未登録のユーザーは拒否されます。

日程調整データは`scheduleProjects`、`schedulePolls`とその`answers`サブコレクションに保存します。ブラウザは専用API経由で操作し、Firestoreへの直接アクセスは既存ルールで許可されません。プロジェクトの作成者だけが候補を作成でき、日程の確定は主催者に限定されます。リンクを持つ登録済みLMCユーザーは候補と回答一覧を確認できます。

回答と確定はトランザクションで処理し、確定後は回答変更できません。既存のイベント・バンド・予約とは別のコレクションです。

## 確認

フロントエンドはTypeScript検査と本番ビルドを実行します。APIの認証・所有者チェック・回答更新・確定後の変更禁止・PKCEコードの再利用拒否・候補日時検証はLMC側の`functions/schedule-api.test.js`にあります。
