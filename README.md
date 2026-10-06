# LMC Schedule

LMCアカウントと連携する日程調整アプリです。

公開先: https://erdaosataillang.github.io/lmc-schedule/

## 使い方

1. 「LMCでログイン」から既存のLMCアカウントを利用します。
2. 日程調整専用のプロジェクトを作成します。
3. 会議名と開始日・終了日を設定して作成します。管理者は日付の期間だけを指定します。
4. 回答リンクを共有します。参加者もLMCでログインし、その期間内の日付・開始時刻・終了時刻を自由に追加して登録します。複数の日付・時間帯に対応し、参加できる時間帯がない場合も明示して回答できます。
5. 主催者は登録された時間帯を見ながら開催日時を指定して確定します。

PCは週間カレンダー、スマートフォンは参加者別の登録一覧を初期表示します。すべての日時は日本時間です。同じLMCアカウントの回答は上書き更新されます。

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

期間外の日付や終了が開始以前の時刻は拒否します。同じ日の重複・連続する時間帯は保存時にまとめます。回答と確定はトランザクションで処理し、確定後は回答変更できません。既存のイベント・バンド・予約とは別のコレクションです。

## 確認

フロントエンドはTypeScript検査と本番ビルドを実行します。APIの認証・所有者チェック・回答更新・確定後の変更禁止・PKCEコードの再利用拒否・候補日時検証はLMC側の`functions/schedule-api.test.js`にあります。

既存の候補日時に○・△・×で回答する日程調整は互換性を維持しています。新規作成する日程調整は期間内の時間帯登録方式です。
