# API仕様書

## エンドポイント一覧

### 1. LINE Webhook
**POST** `/api/webhook`

LINE Messaging APIからのWebhookを受信します。

#### Headers
- `x-line-signature`: LINE署名（必須）

#### Request Body
```json
{
  "events": [
    {
      "type": "message",
      "replyToken": "replyToken",
      "source": {
        "userId": "U1234567890abcdef"
      },
      "message": {
        "type": "text",
        "text": "ASKA風で今日の天気について"
      }
    }
  ]
}
```

#### Response
- 200 OK: 正常処理
- 401 Unauthorized: 署名検証失敗
- 500 Internal Server Error: 処理エラー

---

### 2. 管理画面
**GET** `/api/admin`

管理画面のHTMLを返します。

#### Response
- Content-Type: text/html
- 管理画面のHTML

---

### 3. 管理者ログイン
**POST** `/api/admin/login`

管理者認証を行います。

#### Request Body
```json
{
  "password": "your-admin-password"
}
```

#### Response
```json
{
  "token": "jwt-token-string"
}
```

---

### 4. プロンプト一覧取得
**GET** `/api/admin/prompts`

すべてのスタイルのプロンプトを取得します。

#### Headers
- `Authorization`: Bearer {token}

#### Response
```json
[
  {
    "style": "aska",
    "prompt": "あなたはCHAGE and ASKAのASKAです...",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "style": "kuwata",
    "prompt": "あなたはサザンオールスターズの桑田佳祐です...",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### 5. プロンプト更新
**PUT** `/api/admin/prompts/{style}`

特定スタイルのプロンプトを更新します。

#### Parameters
- `style`: スタイル名（aska, kuwata, influencer, omae, instagram）

#### Headers
- `Authorization`: Bearer {token}

#### Request Body
```json
{
  "prompt": "新しいプロンプト内容"
}
```

#### Response
```json
{
  "success": true
}
```

---

### 6. プロンプトリセット
**POST** `/api/admin/prompts/{style}/reset`

特定スタイルのプロンプトをデフォルトに戻します。

#### Parameters
- `style`: スタイル名

#### Headers
- `Authorization`: Bearer {token}

#### Response
```json
{
  "success": true
}
```

---

### 7. 全プロンプトリセット
**POST** `/api/admin/prompts/reset-all`

すべてのプロンプトをデフォルトに戻します。

#### Headers
- `Authorization`: Bearer {token}

#### Response
```json
{
  "success": true
}
```

---

### 8. 使用統計
**GET** `/api/admin/stats`

使用統計情報を取得します。

#### Headers
- `Authorization`: Bearer {token}

#### Query Parameters
- `userId` (optional): 特定ユーザーの統計

#### Response
```json
{
  "userId": "U1234567890abcdef",
  "usage": {
    "currentMonth": "2024-01",
    "tokensUsed": 5420,
    "imagesProcessed": 12
  },
  "limits": {
    "tokens": 100000,
    "images": 50
  },
  "percentages": {
    "tokens": 5,
    "images": 24
  }
}
```

---

### 9. ヘルスチェック
**GET** `/api/health`

システムの稼働状況を確認します。

#### Response
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "production",
  "services": {
    "line": true,
    "openai": true,
    "admin": true
  }
}
```

---

### 10. トップページ
**GET** `/`

サービスの説明ページを表示します。

#### Response
- Content-Type: text/html
- ランディングページのHTML

---

## エラーレスポンス

すべてのAPIは以下の形式でエラーを返します：

```json
{
  "error": "エラーメッセージ"
}
```

## 認証

管理API（`/api/admin/*`）へのアクセスには、JWTトークンが必要です。

1. `/api/admin/login` でパスワード認証
2. 返されたトークンを `Authorization: Bearer {token}` ヘッダーに設定
3. トークンの有効期限は24時間

## レート制限

- 一般API: 15分間に50リクエストまで
- 画像処理: 1時間に10回まで
- 制限を超えた場合は適切なエラーメッセージが返されます