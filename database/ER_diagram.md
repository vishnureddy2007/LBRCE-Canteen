# LBRCE Canteen Management System — ER Diagram

Below is a Mermaid diagram of the database schema. View it on GitHub or in any Markdown preview that supports Mermaid.

```mermaid
erDiagram
    ADMINS {
        BIGINT id PK
        VARCHAR username UK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR full_name
        VARCHAR phone
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    STUDENTS {
        BIGINT id PK
        VARCHAR roll_number UK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR full_name
        VARCHAR phone
        VARCHAR department
        INT year_of_study
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    STAFF {
        BIGINT id PK
        VARCHAR employee_id UK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR full_name
        VARCHAR phone
        VARCHAR shift
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    CATEGORIES {
        BIGINT id PK
        VARCHAR name UK
        INT display_order
        BOOLEAN active
    }

    FOOD_ITEMS {
        BIGINT id PK
        VARCHAR name
        TEXT description
        DECIMAL price
        BIGINT category_id FK
        BOOLEAN available
        DECIMAL rating_avg
        INT rating_count
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    FOOD_IMAGES {
        BIGINT id PK
        BIGINT food_item_id FK
        VARCHAR image_url
        BOOLEAN is_primary
    }

    ORDERS {
        BIGINT id PK
        VARCHAR order_number UK
        BIGINT student_id FK
        ENUM status
        DECIMAL total_amount
        ENUM payment_method
        ENUM payment_status
        VARCHAR notes
        TIMESTAMP placed_at
        TIMESTAMP accepted_at
        TIMESTAMP prepared_at
        TIMESTAMP ready_at
        TIMESTAMP delivered_at
        TIMESTAMP cancelled_at
    }

    ORDER_ITEMS {
        BIGINT id PK
        BIGINT order_id FK
        BIGINT food_item_id FK
        VARCHAR food_name
        INT quantity
        DECIMAL unit_price
        DECIMAL subtotal
    }

    PAYMENTS {
        BIGINT id PK
        BIGINT order_id FK,UK
        ENUM method
        DECIMAL amount
        ENUM status
        VARCHAR transaction_ref
        TIMESTAMP paid_at
    }

    FEEDBACK {
        BIGINT id PK
        BIGINT student_id FK
        BIGINT order_id FK
        BIGINT food_item_id FK
        TINYINT rating
        TEXT comment
        TIMESTAMP created_at
    }

    ANNOUNCEMENTS {
        BIGINT id PK
        VARCHAR title
        TEXT body
        BOOLEAN active
        TIMESTAMP starts_at
        TIMESTAMP ends_at
        BIGINT created_by FK
    }

    OFFERS {
        BIGINT id PK
        VARCHAR title
        TEXT description
        DECIMAL discount_percent
        BOOLEAN active
        TIMESTAMP valid_from
        TIMESTAMP valid_to
    }

    CATEGORIES ||--o{ FOOD_ITEMS : "has many"
    FOOD_ITEMS ||--o{ FOOD_IMAGES : "has many"
    FOOD_ITEMS ||--o{ ORDER_ITEMS : "appears in"
    FOOD_ITEMS ||--o{ FEEDBACK : "rated by"
    STUDENTS   ||--o{ ORDERS     : "places"
    STUDENTS   ||--o{ FEEDBACK   : "writes"
    ORDERS     ||--|{ ORDER_ITEMS : "contains"
    ORDERS     ||--|| PAYMENTS    : "settled by"
    ORDERS     ||--o{ FEEDBACK    : "about"
    ADMINS     ||--o{ ANNOUNCEMENTS : "publishes"
```

## Cardinality summary

| Relationship | Cardinality |
|---|---|
| Categories → FoodItems | 1 : N |
| FoodItems → FoodImages | 1 : N |
| Students → Orders | 1 : N |
| Orders → OrderItems | 1 : N (cascade delete) |
| Orders → Payments | 1 : 1 (one payment per order) |
| Students → Feedback | 1 : N |
| Orders → Feedback | 1 : N (optional) |
| FoodItems → Feedback | 1 : N (optional) |
| Admins → Announcements | 1 : N (optional) |