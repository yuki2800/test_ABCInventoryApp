# ABC在庫管理システム 保守仕様書 (Architecture Specification)

本ドキュメントは「ABC在庫管理システム」のアーキテクチャ設計、ドメインモデル、およびシステムの全体構造について説明します。

## 1. システム構成・ディレクトリ構造 (Clean Architecture)

本システムはクリーンアーキテクチャの原則に従い、ドメインロジックを中心に依存の方向が単一（外部から内部へ）となるように設計されています。

```text
src/
├── app/                  # Framework & Driver層 (Next.js App Router / API / UI)
│   ├── api/              # バックエンドエンドポイント (Next.js Route Handlers)
│   ├── layout.tsx        # UI共通レイアウト
│   └── page.tsx          # フロントエンド（ダッシュボード・Reactコンポーネント）
├── lib/                  # 依存性注入 (DI) コンテナの設定
├── adapters/             # Interface Adapter層 (Controller / Repository実装)
│   ├── controllers/      # APIからの入出力をUse Caseへ伝達する
│   └── repositories/     # DB等の永続化実装 (今回はInMemoryDataStore)
├── usecases/             # Use Case層 (アプリケーション固有のビジネスルールの調整とフロー)
└── domain/               # Domain層 (エンティティと業務ルール・リポジトリインターフェース)
    ├── entities/         # Product, Warehouse, Inventory (DDDに基づく中心概念)
    └── repositories/     # 依存逆転のためのインターフェース定義
```

## 2. 各層の依存関係構成図 (Layer Dependency Diagram)

クリーンアーキテクチャにおける各層の依存関係（矢印の方向が依存の方向）を表します。
**「常に外側の層が内側の層に依存する」**というルールを守ることで、内側のドメイン層はフレームワークやデータベースなど外部の技術要素から完全に隔離されます。

```mermaid
graph TD
    subgraph Frameworks & Drivers
        UI[Frontend UI: React]
        API[API Routes: Next.js]
        DB[(In-Memory DB)]
    end

    subgraph Interface Adapters
        Ctrl[Controllers]
        Repo[Repository Implementations]
    end

    subgraph Application Use Cases
        UseCases[Use Cases]
    end

    subgraph Domain Entities
        Entities[Domain Entities / Value Objects]
        IRepo[Repository Interfaces]
    end

    UI --> API
    API --> Ctrl
    Ctrl --> UseCases
    UseCases --> Entities
    UseCases --> IRepo
    
    %% Dependency Inversion Principle (依存関係逆転の原則)
    Repo -.->|implements| IRepo
    Repo --> DB
```

## 3. クリーンアーキテクチャ全体クラス図 (Class-Level Dependencies Diagram)

各層の具体的なクラス構造と、クラス間の依存関係・インターフェースを通じた実装関係を表します。

```mermaid
classDiagram
    namespace FrameworkLayer {
        class NextJsRouteHandler {
            <<API Route>>
        }
    }
    
    namespace AdapterLayer {
        class InventoryController {
            +InventoryUseCases usecase
            +receiveInventory(body)
            +issueInventory(body)
        }
        class InventoryRepository {
            -InMemoryDataStore store
            +save(inventory)
            +findByProductAndWarehouse(...)
        }
    }

    namespace UseCaseLayer {
        class InventoryUseCases {
            -IInventoryRepository inventoryRepo
            -IProductRepository productRepo
            +receiveInventory(...)
            +issueInventory(...)
        }
    }

    namespace DomainLayer {
        class IInventoryRepository {
            <<Interface>>
            +save(inventory)*
            +findByProductAndWarehouse(...)*
        }
        class IProductRepository {
            <<Interface>>
        }
        class Product {
            +validateReceipt()*
            +validateIssue()*
        }
        class Inventory {
            +addQuantity()
            +removeQuantity()
        }
    }

    NextJsRouteHandler --> InventoryController : リクエスト処理
    InventoryController --> InventoryUseCases : ビジネスフロー実行依頼
    InventoryUseCases --> IInventoryRepository : データ保存・取得(抽象)
    InventoryUseCases --> IProductRepository : データ保存・取得(抽象)
    InventoryUseCases --> Product : ドメインへのビジネスルール移譲
    InventoryUseCases --> Inventory : 状態変更
    
    InventoryRepository ..|> IInventoryRepository : インターフェース実装 (依存性逆転)
```

## 4. ユースケース図

以下の図は、システムがユーザーに対して提供する機能（振る舞い）を表します。

```mermaid
usecaseDiagram
    actor User as "ユーザー(担当者)"
    
    package "在庫管理システム" {
        usecase "在庫の検索・一覧表示" as UC1
        usecase "在庫の受入 (入庫)" as UC2
        usecase "在庫の払出 (出庫)" as UC3
        usecase "マスタデータ参照(製品・倉庫)" as UC4
    }

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
```

## 5. ドメインモデル図

ドメイン駆動設計 (DDD) の観点から、システム内で扱う重要な業務概念の静的な関係性を示します。
特に「製品カテゴリ」によるルールの違いをポリモーフィズムによって実現している点が特徴です。

```mermaid
classDiagram
    class Inventory {
        +String id
        +String productId
        +String warehouseId
        +Number quantity
        +String expirationDate
        +addQuantity(amount)
        +removeQuantity(amount)
    }

    class Warehouse {
        +String id
        +String name
        +Number maxCapacity
    }

    class Product {
        <<abstract>>
        +String id
        +String name
        +ProductCategory category
        +Number price
        +validateReceipt(quantity, additionalInfo)*
        +validateIssue(quantity, stock, additionalInfo)*
    }

    class StandardProduct {
        +validateReceipt()
        +validateIssue()
    }
    
    class PerishableProduct {
        +validateReceipt() // 消費期限のチェック必須
        +validateIssue()
    }
    
    class HazardousProduct {
        +validateReceipt()
        +validateIssue() // 安全承認フラグの必須チェック
    }

    Product <|-- StandardProduct
    Product <|-- PerishableProduct
    Product <|-- HazardousProduct

    Inventory --> "1" Product : 参照
    Inventory --> "1" Warehouse : 保管先
```

## 6. シーケンス図 (在庫受入フロー)

「フロントエンドから、指定した生鮮食品を受入(入庫)する」際の一連の流れを表します。DDDとクリーンアーキテクチャにおける処理の移譲（UI -> API -> Controller -> UseCase -> Entity -> DB）を可視化しています。

```mermaid
sequenceDiagram
    actor Client as "React (ブラウザ)"
    participant API as "Next.js Route (/api/inventory)"
    participant Ctrl as "InventoryController"
    participant UC as "InventoryUseCases"
    participant Entity as "PerishableProduct (Entity)"
    participant Repo as "InventoryRepository"
    participant DB as "InMemoryStore"

    Client->>API: POST /api/inventory (productId, qty, expDate)
    API->>Ctrl: receiveInventory(body)
    Ctrl->>UC: receiveInventory(productId, warehouseId, qty, info)
    
    UC->>Repo: findProductById(productId)
    Repo-->>UC: Productオブジェクトを返す
    
    Note over UC,Entity: DDDの強み: 業務ルールの実行をEntityに委譲
    UC->>Entity: validateReceipt(qty, {expirationDate})
    
    alt 消費期限が過去
        Entity-->>UC: Error("消費期限が過ぎています")
        UC-->>Ctrl: Error
        Ctrl-->>API: 400 Bad Request
        API-->>Client: エラーメッセージ表示
    else 正常
        Entity-->>UC: (検証通過)
        
        UC->>Repo: findByProductAndWarehouse(...)
        Repo-->>UC: Inventoryオブジェクト / null
        
        alt 在庫が存在
            UC->>Inventory: addQuantity(qty)
        else 新規入庫
            UC->>Inventory: new Inventory(...)
        end
        
        UC->>Repo: save(inventory)
        Repo->>DB: 更新 (メモリ内変数)
        Repo-->>UC: 保存完了
        
        UC-->>Ctrl: inventoryオブジェクト
        Ctrl-->>API: 200 OK (data)
        API-->>Client: サクセス (ダッシュボードへ反映)
    end
```
