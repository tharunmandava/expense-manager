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