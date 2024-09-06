# Expense-Manager API Documentation

Uses node-postgres under the hood to connect to the database.

## Users

### List all users
`GET /api/users/`

#### Response
```json
[
    {
        "user_id": 1,
        "name": "John Doe"
    },
    {
        "user_id": 2,
        "name": "Jane Doe"
    }
]
```

### Get a specific user
`GET /api/users/:id`

#### Response
```json
{
    "user_id": 1,
    "name": "John Doe"
}
```

### Create a user
`POST /api/users/`

#### Request
```json
{
    "name": "John Doe"
}
```

#### Response
```json
{
    "message": "User created successfully",
    "id": 1
}
```

## Expenses

### List all expenses
`GET /api/expenses/`

#### Response
```json
[
    {
        "expense_id": 1,
        "amount": 100,
        "paid_by": 1,
        "group_id": 1,
        "expense_date": "2023-03-01T00:00:00.000Z"
    },
    {
        "expense_id": 2,
        "amount": 200,
        "paid_by": 2,
        "group_id": 2,
        "expense_date": "2023-03-02T00:00:00.000Z"
    }
]
```

### List all expenses paid by a user
`GET /api/expenses/list-by-user/:id`

#### Response
```json
[
    {
        "expense_id": 1,
        "amount": 100,
        "paid_by": 1,
        "group_id": 1,
        "expense_date": "2023-03-01T00:00:00.000Z"
    },
    {
        "expense_id": 2,
        "amount": 200,
        "paid_by": 2,
        "group_id": 2,
        "expense_date": "2023-03-02T00:00:00.000Z"
    }
]
```

### Get a specific expense
`GET /api/expenses/:id`

#### Response
```json
{
    "transaction": {
        "expense_id": 1,
        "amount": 100,
        "paid_by": 1,
        "group_id": 1,
        "expense_date": "2023-03-01T00:00:00.000Z"
    },
    "participants": [
        {
            "user_id": 1,
            "name": "John Doe"
        },
        {
            "user_id": 2,
            "name": "Jane Doe"
        }
    ]
}
```

### Create an expense
`POST /api/expenses/create-expense`

#### Request
```json
{
    "amount": 100,
    "paid_by": 1,
    "group_id": 1,
    "participants": [1,2,3]
}
```

#### Response
```json
{
    "message": "Expense created successfully",
    "id": 1
}
```

## Groups

### List all groups
`GET /api/groups/`

#### Response
```json
[
    {
        "group_id": 1,
        "group_name": "Group 1"
    },
    {
        "group_id": 2,
        "group_name": "Group 2"
    }
]
```

### Get a specific group
`GET /api/groups/:id`

#### Response
```json
{
    "group_id": 1,
    "group_name": "Group 1"
}
```

### Create a group
`POST /api/groups/create-group`

#### Request
```json
{
    "name": "Group 1",
    "members": [1,2,3]
}
```

#### Response
```json
{
    "message": "Group created successfully",
    "id": 1
}
```