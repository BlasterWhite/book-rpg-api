# Book RPG API

## Description

This is a simple API for a book RPG game. It's a RESTful API connected to a PostgreSQL database.

Table of contents:

- [Endpoints](#endpoints)
  - [Name of the endpoint](#name-of-the-endpoint)
  - [Name of the endpoint 2](#name-of-the-endpoint-2)

## Endpoints

| Method | Endpoint      | Description                                     |
| ------ | ------------- | ----------------------------------------------- |
| GET    | /api/endpoint | Return a list of all the items in the database. |

### Name of the endpoint

> GET /api/endpoint

Return a list of all the items in the database. \
example:

```json
{
  "items": [
    {
      "id": 1,
      "name": "item1",
      "description": "description of item1"
    },
    {
      "id": 2,
      "name": "item2",
      "description": "description of item2"
    }
  ]
}
```

---

### Name of the endpoint 2

...
