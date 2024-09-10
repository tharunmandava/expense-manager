# Expense-Manager API Documentation

Uses node-postgres under the hood to connect to the database.

## GROUPS

### Create a group 
`POST /api/groups/create-group`

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

### Delete a group
`DELETE /api/groups/:id`

#### Request
```json
{
    "id": "e9a3b6c4-b4d4-4e1f-a4c2-d0b2b1c3d4e5"
}
```

#### Response
```json
{
    "message": "group deleted successfully!"
}
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