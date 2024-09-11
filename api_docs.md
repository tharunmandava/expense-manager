# Expense-Manager API Documentation

Uses node-postgres under the hood to connect to the database.

## GROUPS

### Create a group 
`POST /api/groups/`

#### Request
```json
{
    "group_name": "Test Group 3",
    "group_currency": "INR",
    "group_description": "This is test group 3",
    "members": ["Elden jon", "ben dover"]
}
```

#### Response
```json
{
    "message": "Group created successfully",
    "id": "e9a3b6c4-b4d4-4e1f-a4c2-d0b2b1c3d4e5"
}
```
### Delete a group

`DELETE /api/groups/:id`

#### Request Body
```json
{
    id: "e9a3b6c4-b4d4-4e1f-a4c2-d0b2b1c3d4e5"
}

#### Response
```json
{
    "message": "group deleted successfully!"
}
```

### Get a group

`GET /api/groups/:id`

#### Request Body
```json
{
    id: "e9a3b6c4-b4d4-4e1f-a4c2-d0b2b1c3d4e5"
}
```

#### Response
```json
{
    "group_id": "e9a3b6c4-b4d4-4e1f-a4c2-d0b2b1c3d4e5",
    "group_name": "Test Group 3",
    "group_currency": "INR",
    "group_description": "This is test group 3",
    "last_accessed": "2023-04-01T00:00:00.000Z"
}
```

### Get members of a group
`GET /api/groups/users/:id`

#### Request Body
```json
{
    id: "e9a3b6c4-b4d4-4e1f-a4c2-d0b2b1c3d4e5"
}
```

#### Response
```json
[
    {
        "user_id": "9",
        "user_name": "John Doe"
    },
    {
        "user_id": "10",
        "user_name": "Jane Doe"
    }
]
```

## Expenses

### Create an expense with participants
`POST /api/expenses/`

#### Request Body

```json
{
    "amount": 100,
    "paid_by": 9,
    "group_id": "QJGyxeNxuql4mmaMCiSCbw",
    "participantAmounts": {
        "9": -100,
        "10": 100
    }
}
```

#### Response Body
```json
{
  "message": "Expense created successfully",
  "id": "9"
}
```

### Delete an expense
`DELETE /api/expenses/:id`

#### Request
```json
{
    "id": 1
}
```

#### Response
```json
{
    "message": "expense deleted successfully"
}
```

### List expense by id
`GET /api/expenses/:id`

#### Request Body
```json
{
    id: "15"
}
```
#### Response
```json
{
    "expense_id": "15",
    "paid_by": "10",
    "amount": "200.00",
    "expense_date": "2024-09-10T09:13:27.519Z",
    "group_id": "QJGyxeNxuql4mmaMCiSCbw",
    "description": null
}
```

### List expense by group
`GET /api/expenses/by-group/:id`

#### Request Body
```json
{
    id: "QJGyxeNxuql4mmaMCiSCbw"
}
```
#### Response
```json

[
  {
    "expense_id": "15",
    "paid_by": "10",
    "amount": "200.00",
    "expense_date": "2024-09-10T09:13:27.519Z",
    "group_id": "QJGyxeNxuql4mmaMCiSCbw",
    "description": null
  }
]

```
