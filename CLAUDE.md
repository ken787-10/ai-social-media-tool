# CLAUDE.md - AI開発アシスタント向け情報

## プロジェクト概要
LINE Style Tweet Bot - LINEメッセージを様々なスタイルに変換するAIボット

## 重要な運用情報

### デプロイメント確認手順
1. **コード変更後の手順**:
   ```bash
   git add -A
   git commit -m "変更内容の説明"
   git push origin main
   ```

2. **デプロイ確認**:
   - Vercelダッシュボード（https://vercel.com/dashboard）にアクセス
   - Deploymentsタブで新しいデプロイが開始されているか確認
   - ステータスが「Building」→「Ready」になることを確認

3. **デプロイが開始されない場合**:
   - Project Settings → Git → Deploy Hooksを確認
   - 必要に応じて新しいDeploy Hookを作成
   - 手動デプロイ: Vercelダッシュボードの「Redeploy」ボタンを使用

### トラブルシューティング

#### 自動デプロイが動作しない
- **原因**: Deploy Hookが設定されていない
- **解決**: Project Settings → Deploy Hooksで新規作成

#### TypeScriptエラーでビルド失敗
- **原因**: 型定義の不整合
- **解決**: 
  - ローカルで`npm run build`を実行してエラーを確認
  - 必要に応じて`any`型を使用（一時的な対処）

#### 環境変数が反映されない
- **原因**: Vercelの環境変数が未設定
- **解決**: Project Settings → Environment Variablesで設定

### 品質チェック項目
- [ ] Temperature設定: 0.7（安定した出力のため）
- [ ] デフォルトスタイル: kuwata（桑田風）
- [ ] プロンプトの多様性指示が含まれているか
- [ ] ポジティブ表現の指示が含まれているか

### 開発時の注意事項
1. **プロンプト変更時**:
   - 本番環境では環境変数を使用（PROMPT_ASKA, PROMPT_KUWATA等）
   - 管理画面での変更は一時的（Vercel環境）

2. **新機能追加時**:
   - vercel.jsonにエンドポイントを追加
   - TypeScriptの型定義を正確に行う
   - エラーハンドリングを適切に実装

3. **テスト手順**:
   - ローカルで`npm run dev`で動作確認
   - LINEボットで実際にメッセージを送信して確認
   - 各スタイルが正しく動作するか確認

### 重要なファイルパス
- `/src/services/openaiService.ts` - OpenAI API連携（temperature設定）
- `/src/services/promptStorage.ts` - スタイル別プロンプト管理
- `/src/utils/styleDetector.ts` - スタイル検出ロジック
- `/src/handlers/lineHandlers.ts` - LINE Webhook処理
- `/api/health.ts` - ヘルスチェック・デバッグ用
- `/public/admin.html` - 管理画面UI

### コマンド一覧
```bash
# 開発サーバー起動
npm run dev

# ビルド確認
npm run build

# TypeScriptチェック
npm run typecheck

# Lint実行
npm run lint
```

### デバッグ用URL
- ヘルスチェック: `https://line-style-tweet-bot.vercel.app/api/health`
- プロンプト確認: `https://line-style-tweet-bot.vercel.app/api/health?checkPrompt=kuwata`
- 管理画面: `https://line-style-tweet-bot.vercel.app/admin`

---
最終更新: 2024年6月22日