# CLAUDE.md

このファイルは、Claude Code がこのリポジトリで作業する際に参照するプロジェクトガイドです。

## プロジェクト概要

**大森歯科クリニック（OOMORI DENTAL CLINIC）** のコーポレートサイト（コーポレート／クリニックサイト）。
JR大森駅より徒歩3分の歯科医院の公式ホームページで、ビルド不要の静的HTML/CSS/JSサイトとして実装されている。

- サイトはすべて `site/` ディレクトリ配下にある。
- フレームワーク・ビルドツールなし（React/Vue/バンドラー等は一切使用しない）。素のHTML・CSS・JSのみ。
- 各ページは独立した `.html` ファイル。共通ヘッダー／フッターは `partials/` を `fetch` で読み込む簡易インクルード方式。

## ディレクトリ構成

```
site/
├── index.html              # トップページ
├── clinic.html              # クリニック紹介
├── staff.html                # 院長・スタッフ紹介
├── whitening.html            # ホワイトニング（ホワイトエッセンス）詳細
├── faq.html                  # よくあるご質問
├── access.html                # アクセス・診療時間
├── contact.html               # お問い合わせ
├── privacy.html               # プライバシーポリシー（法務レビュー前のドラフト、要確認）
├── 404.html                   # 404エラーページ（ホスティング環境側の紐付け設定は別途必要）
├── robots.txt / sitemap.xml   # クローラー向け（sitemap.xmlのURLは本番ドメイン確定後に要確認）
├── site.webmanifest           # PWA向けマニフェスト
├── favicon.ico / favicon-*.png / apple-touch-icon.png  # 仮生成のプレースホルダー（本番用デザインに要差し替え）
├── news/
│   ├── kouku-scanner.html     # お知らせ記事
│   ├── summer-closure.html    # お知らせ記事
│   └── saturday-slots.html    # お知らせ記事（記事ページは news/ 配下に追加していく）
├── partials/
│   ├── header.html            # 共通ヘッダー（ロゴ・電話・WEB予約・グローバルナビ＋Dentist構造化データ）
│   └── footer.html            # 共通フッター＋予約／アクセスセクション（reserve）
├── css/
│   └── style.css              # サイト全体のスタイル（単一CSSファイル、BEM風命名）
├── js/
│   ├── include.js             # data-include 属性を使ったパーシャル読み込み・アクティブナビ判定
│   └── contact-form.js        # お問い合わせフォームの挙動（Formspree未設定時はmailtoにフォールバック）
└── assets/img/                # 画像（.webp中心、hero.pngのみPNG、ogp-image.pngはOGP共有用の仮生成画像）
```

### SEO/メタ情報の実装状況
- 全ページの `<head>` に `canonical` / `og:*` / `twitter:*` / favicon各種 / `theme-color` を実装済み。本番ドメインは仮で `https://www.oomori-dc.com/` を採用（クリーンな `.html` パス構成）。実際のホスティング環境が異なるURL構成になる場合は、各ページの `canonical` / `og:url` と `robots.txt` の `Sitemap:` 行、`sitemap.xml` 内の全URLを一括置換すること。
- 構造化データ（JSON-LD）: `Dentist`（医院情報・診療時間）は `partials/header.html` に1箇所実装し、全ページに自動適用される。`BreadcrumbList` は各ページ個別に `<head>` 内へ実装。
- OGP画像・favicon一式は本セッションで生成したプレースホルダー（ブランドカラー＋簡易アイコン）。本番公開前に正式なデザイン素材に差し替えることを推奨。

### パーシャル（共通部品）の仕組み
- 各ページの `<body>` に `<div data-include="partials/header.html"></div>` のように配置する。
- `js/include.js` が `fetch` でHTMLを取得し `outerHTML` を差し替える。ビルドステップは無い＝ローカルでは `file://` 直開きだと `fetch` がCORSでブロックされるため、必ず簡易HTTPサーバー経由で確認すること（例: `python3 -m http.server` を `site/` 内で実行）。
- 新規ページを追加する際は、`<script src="js/include.js"></script>` を `</body>` 直前に必ず入れ、`partials/header.html` と `partials/footer.html` の読み込みタグを既存ページと同じ位置に配置する。
- ナビの現在地ハイライトは `include.js` の `highlightActiveNav()` が `pathname` と `href` の完全一致で判定するため、内部リンクは絶対パス（`/clinic.html` 等）で統一する。

## デザインシステム（実装済みトークン）

このプロジェクトは `docs/DESIGN_TEMPLATE.md`（汎用デザインルール）をベースに、**歯科クリニックのブランドに合わせて配色・書体をカスタマイズ**して構築されている。新規UIを作る際は、テンプレートの汎用値（インディゴ／エメラルド等）ではなく、以下の**実装済みトークン**に従うこと。

### カラーパレット（`site/css/style.css` 実値）
| 役割 | カラーコード | 用途 |
| --- | --- | --- |
| Primary（ブランドブラウン） | `#7A5D49` | ボタン・リンク・アクセント |
| Primary Dark（ホバー／見出しルール） | `#634532` | ホバー時・院名・区切り線 |
| Text Main | `#1A1A1A` | 本文・見出し |
| Text Muted | `#746D69` | 補助テキスト・ラベル |
| Border / 薄ベージュ | `#DED5CE` | 罫線・カード境界 |
| Background 淡色 | `#F9F5F0` / `#EDE6E0` / `#F4EFEA` 等 | セクション背景の淡いベージュ系 |
| Accent Sub（アイコン等） | `#B39784`, `#3A2E28`, `#5C534D` | 装飾・濃淡バリエーション |
| Accent Blue（英字ロゴ等、限定使用） | `#243EB3` | `.site-header__en` など英字ブランド表記のみ |
| Alert（要確認時のみ） | `#B4453A` | エラー・警告表示 |
| White | `#fff` | 背景・ボタン内テキスト |

汎用デザインテンプレートのようなCSS変数（`--color-primary` 等）は定義されておらず、**カラーコードを直接指定**するスタイル。新しいスタイルを追加する場合も既存の指定方法（直接hex値）に合わせる。トークンを増やす場合は、まずこのパレット内の値の再利用を検討し、新色が必要な場合はブラウン／ベージュ系の色相に統一すること（テンプレートのインディゴ／エメラルドは使用しない）。

### タイポグラフィ
- **見出し（和文・格式）**: `"Shippori Mincho", serif`（明朝体、`letter-spacing: .08em〜.14em` 程度で余裕を持たせる）
- **本文（和文）**: `"Noto Sans JP", sans-serif`
- **英数字ブランド表記**: `"Montserrat", sans-serif`（電話番号・"OOMORI DENTAL CLINIC"等）
- **英字装飾見出し**: `"Cormorant Garamond", serif`（一部の欧文アクセント）
- Google Fonts は各ページの `<head>` で `preconnect` ＋ `<link>` により個別読み込み（共通の `<head>` テンプレートは無いため、新規ページ作成時は既存ページの `<head>` をコピーする）。

### コンポーネント
- **ボタン**: `border-radius: 6px`（一部 `8px`）、ブランドブラウン背景＋白文字が基本。
- **カード（menu-card等）**: 白背景、画像＋タイトル＋説明のシンプル構成。
- **セクション**: `.section { max-width: 1200px; margin: 0 auto; padding: 96px 48px 0; }` が基本の型。幅広セクションは `.section--wide`（`max-width: 1520px`）。
- **見出し（section-heading）**: 明朝体タイトル＋下に細いルール線（`#634532`, 幅60px）＋リード文の3点セット。

### レスポンシブ
- ブレイクポイントは実測で `max-width: 1199px`（タブレット〜小型デスクトップ）と `max-width: 767px`（スマホ）の2段階。`DESIGN_TEMPLATE.md` の640px基準とは異なるので、このサイトでは上記2値に合わせること。
- レイアウトは CSS Grid 中心（`menu-grid`, `reserve__inner`, `site-footer__inner` 等）。

### アクセシビリティ
- 画像には `alt` 属性を必ず付与（装飾目的でテキストと重複する場合のみ `alt=""` を許容、実例: `hero.png`）。
- 遅延読み込み対象の画像には `loading="lazy"` を付与するのが既存の慣習。

## コンテンツ管理方針

`docs/CONTENTS_TEMPLATE.md` は新規ページ・セクションを追記する際の構成ひな形（グローバルナビ／HERO／ABOUT／SERVICES／メディア／お問い合わせ／フッター等のセクション定義）。実際のサイトはこのひな形を歯科クリニック向けに具体化したもので、対応関係はおおよそ以下の通り：

| テンプレートのセクション | 実装箇所 |
| --- | --- |
| グローバルナビ | `partials/header.html` の `.site-header__nav`（クリニック紹介／院長・スタッフ紹介／よくあるご質問／アクセス・診療時間／お問い合わせ） |
| HERO | `index.html` の `.hero`（メインコピー「一生使う歯のために、説明を惜しまない歯科医院」） |
| ABOUT | `index.html` の `#about`（media-block、"わからないまま治療が進む不安をなくす"） |
| SERVICES | `index.html` の `#menu`（診療案内カード6種：一般歯科・審美歯科・ホワイトニング・インプラント・矯正歯科・小児歯科） |
| メディア | 未実装（news一覧・お知らせバーが近い役割） |
| お問い合わせ | `contact.html` ＋ 全ページ共通の `partials/footer.html` 内 `.reserve` セクション |
| フッター | `partials/footer.html` の `.site-footer`（運営情報・診療内容リンク・法務リンク） |

新しいページ・セクションを追加する際は、`docs/CONTENTS_TEMPLATE.md` の記入ルール（`{{ }}` は必ず実データに置き換える、画像は「パス（alt: 代替テキスト）」表記、リンクは「画像パス → URL」表記）に準拠してテキスト構成を先に固め、それから実装に落とし込むこと。

## 重要な実データ・定数（コード変更時に誤って書き換えないこと）

- **医院名**: 大森歯科クリニック（英字: OOMORI DENTAL CLINIC）
- **電話番号**: `03-5753-8173`（`tel:0357538173` として利用）
- **住所**: 〒143-0016 東京都大田区大森北1丁目10−12 ガーデンホーム大森 1F・2F（JR大森駅 北口より徒歩3分）
- **診療時間**: 月・水・木・金・土・日・祝　午前 10:00-13:00／午後 平日15:00-19:00・土日祝14:30-18:00。**休診日: 火曜**
- **WEB予約URL**: `https://ssl.haisha-yoyaku.jp/s2266232/login/serviceAppoint/index?SITE_CODE=hp`（外部予約システム、`target="_blank" rel="noopener"` を必ず付与）
- **問い合わせ先メール**: `oomoridc@gmail.com`（`js/contact-form.js` のフォールバック先）

## 未対応・要確認のTODO（サイト内コメントより）

以下は各HTMLファイル内に `<!-- TODO: ... -->` として残っている未対応項目。関連ページを触る際は状況を確認すること。
- `staff.html` / `faq.html` / `contact.html` / `whitening.html` / `access.html` / `news/kouku-scanner.html`: 各ページのヒーロー画像（21:9）が仮のまま、差し替え待ち。
- `whitening.html`: ホワイトエッセンス公式の施術写真は掲載許諾取得後に差し替え予定。
- `access.html`: 決済ブランドの公式ロゴ画像が未挿入。
- `js/contact-form.js`: `CONTACT_FORM_ENDPOINT` が `YOUR_FORM_ID` のプレースホルダーのまま。Formspree等の実エンドポイントに差し替えるまでは、送信時に `mailto:` へのフォールバックで動作する仕様（意図的な暫定実装）。
- `staff.html`（経歴・所属学会）と `access.html`（道順の説明文）に `〇〇` のプレースホルダーが残っている。実際の大学名・所属学会名・研修名・目印となる店舗名など、クリニックからの実データ提供待ち。
- GA4／Search Console／OGP画像・favicon（正式デザイン）／本番ドメインなど、クライアント支給が必要な情報は未反映。詳細はリリース前チェックリストの確認結果を参照。
- 各ページに残る `style="..."` インライン属性（一箇所限りのレイアウト調整）は外部化されていない。`<style>` タグ自体は排除済みだが、インライン属性の全面クラス化は未着手（規模が大きいため別途対応を検討）。

## ローカル確認方法

ビルドコマンドは無い。`fetch` によるパーシャル読み込みがあるため、`site/` ディレクトリで簡易サーバーを立てて確認する。

```bash
cd site
python3 -m http.server 8000
# http://localhost:8000/ にアクセス
```

## 作業時の注意

- 既存ページのHTML構造・クラス命名（BEM風: `.block__element--modifier`）を踏襲すること。
- 色・フォントは上記「デザインシステム」節の実装済みトークンに従い、`docs/DESIGN_TEMPLATE.md` の汎用色見本（インディゴ／エメラルド）をそのまま使わないこと。
- 内部リンクは絶対パス（`/clinic.html` など）で統一する（`include.js` のアクティブナビ判定に影響するため）。
- 診療時間・電話番号・住所などの実データは、上記「重要な実データ・定数」を正としてページ間で不整合が出ないようにする。
