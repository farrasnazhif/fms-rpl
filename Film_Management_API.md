# Film Management API Documentation

> **Base URL:** `{{URL}}`  
> **API Version:** v1  
> **Content-Type:** `application/json` (unless noted otherwise)  
> **Authentication:** Bearer Token — include `Authorization: Bearer {{TOKEN}}` on protected endpoints.

---

## Table of Contents

1. [Health Check](#1-health-check)
2. [Auth](#2-auth)
   - [Register](#21-register)
   - [Login](#22-login)
   - [Get Me](#23-get-me)
3. [User](#3-user)
   - [Get Detail User](#31-get-detail-user)
4. [Genre](#4-genre)
   - [Create Genre](#41-create-genre)
   - [Get All Genre (Admin – Paginated)](#42-get-all-genre-admin--paginated)
   - [Get All Genre (Public)](#43-get-all-genre-public)
   - [Update Genre](#44-update-genre)
5. [Film](#5-film)
   - [Create New Film](#51-create-new-film)
   - [Get All Film](#52-get-all-film)
   - [Get Detail Film](#53-get-detail-film)
6. [Film List](#6-film-list)
   - [Create Film List](#61-create-film-list)
   - [Update Visibility](#62-update-visibility)
7. [Review](#7-review)
   - [Create Review](#71-create-review)
8. [Reaction](#8-reaction)
   - [Create Reaction](#81-create-reaction)
   - [Update Reaction](#82-update-reaction)

---

## 1. Health Check

### `GET /api/ping`

Check whether the API server is running.

**Authentication:** None

**Request**
```
GET {{URL}}/api/ping
```

**Response — 200 OK**
```json
{
    "message": "pong"
}
```

---

## 2. Auth

### 2.1 Register

**`POST /api/v1/auth/register`**

Create a new user account.

**Authentication:** None

**Request Body**
```json
{
    "username": "azka rizqullah",
    "email": "azkarizqullah125@gmail.com",
    "password": "Password.1",
    "display_name": "Azkuun",
    "bio": "Aku Sigma boy"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `username` | string | ✅ | Unique username |
| `email` | string | ✅ | Unique email address |
| `password` | string | ✅ | Account password |
| `display_name` | string | ✅ | Publicly shown name |
| `bio` | string | ❌ | Short user biography |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "failed register account",
    "data": {
        "id": "32a385b9-ba3e-46e1-aa38-bbf898aa9edc",
        "username": "azka rizqullah",
        "email": "azkarizqullah929@gmail.com",
        "display_name": "Azkuun",
        "bio": "Aku Sigma boy"
    }
}
```

**Response — 409 Conflict** *(email already registered)*
```json
{
    "code": 0,
    "success": false,
    "message": "failed register account",
    "error": "user with this email already exist"
}
```

---

### 2.2 Login

**`POST /api/v1/auth/login`**

Authenticate a user and receive a JWT token. The token is automatically stored in `{{TOKEN}}` via a Postman test script.

**Authentication:** None

**Request Body**
```json
{
    "email": "azkarizqullah127@gmail.com",
    "password": "Password.1"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | Registered email |
| `password` | string | ✅ | Account password |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success login",
    "data": {
        "token": "<JWT_TOKEN>",
        "role": "ADMIN"
    }
}
```

> **Note:** The `role` field will be either `"ADMIN"` or `"USER"`. The token must be passed in the `Authorization` header as `Bearer <token>` for all protected endpoints.

---

### 2.3 Get Me

**`GET /api/v1/auth/me`**

Retrieve the profile of the currently authenticated user.

**Authentication:** 🔒 Bearer Token required

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success get me",
    "data": {
        "personal_info": {
            "id": "a1a2b473-f398-4489-b7ef-6984b60e4f10",
            "username": "admint rpl",
            "email": "atmin@email.com",
            "display_name": "akuatmin",
            "bio": "aku adalah atmin sigma skibidi",
            "role": "ADMIN"
        }
    }
}
```

---

## 3. User

### 3.1 Get Detail User

**`GET /api/v1/users/:id`**

Retrieve public profile information for a specific user, including their film lists and reviews.

**Authentication:** None

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | string (UUID) | The user's unique ID |

**Request**
```
GET {{URL}}/api/v1/users/ae6f88a8-f9b7-45d2-9e2d-8e80fe87affe
```

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success get detail user",
    "data": {
        "id": "ae6f88a8-f9b7-45d2-9e2d-8e80fe87affe",
        "username": "azka rizqullah",
        "display_name": "Azkuun",
        "bio": "Aku Sigma boy",
        "film_lists": [
            {
                "film_title": "Tung Tung Sahur Memakan Sapi",
                "list_status": "watching"
            }
        ],
        "reviews": [
            {
                "film": "Tung Tung Sahur Memakan Sapi",
                "rating": 9,
                "comment": "bagus sekali tung tung sahurnya kelihatan realistik"
            }
        ]
    }
}
```

---

## 4. Genre

### 4.1 Create Genre

**`POST /api/v1/genres`**

Create a new film genre. Requires ADMIN role.

**Authentication:** 🔒 Bearer Token (ADMIN only)

**Request Body**
```json
{
    "name": "cartoon"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Name of the genre |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success create genre",
    "data": {
        "id": "c2470a1e-a26d-4571-b515-30afd2d8e02c",
        "name": "cartoon"
    }
}
```

**Response — 403 Forbidden** *(non-admin user)*
```json
{
    "success": false,
    "message": "user not authorized",
    "error": "role not allowed"
}
```

---

### 4.2 Get All Genre (Admin – Paginated)

**`GET /api/v1/genres/admin`**

Retrieve all genres with pagination. Requires ADMIN role.

**Authentication:** 🔒 Bearer Token (ADMIN only)

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `take` | integer | ✅ | Number of records per page |
| `page` | integer | ✅ | Page number (1-indexed) |

**Request**
```
GET {{URL}}/api/v1/genres/admin?take=10&page=1
```

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success get all genre",
    "data": [
        { "id": "1dbbe6c6-fa67-43e4-a89d-f9a7783df8d3", "name": "comedy" },
        { "id": "4c57d4b2-613d-4160-8175-2c98b1e4d44c", "name": "thriller" }
    ],
    "meta": [
        {
            "take": 10,
            "page": 1,
            "total_data": 9,
            "total_page": 1,
            "sort": "asc",
            "sort_by": "id"
        }
    ]
}
```

---

### 4.3 Get All Genre (Public)

**`GET /api/v1/genres`**

Retrieve all genres without pagination. Publicly accessible.

**Authentication:** None

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success get all genre",
    "data": [
        { "id": "b8aa12a7-0474-4044-ae17-d8875c9350b4", "name": "horror" },
        { "id": "4c57d4b2-613d-4160-8175-2c98b1e4d44c", "name": "thriller" },
        { "id": "1dbbe6c6-fa67-43e4-a89d-f9a7783df8d3", "name": "comedy" },
        { "id": "688bf268-029e-4e5e-a9ef-1a536b8af5ca", "name": "action" },
        { "id": "c2470a1e-a26d-4571-b515-30afd2d8e02c", "name": "cartoon" }
    ]
}
```

---

### 4.4 Update Genre

**`PUT /api/v1/genres/:id`**

Update an existing genre's name. Requires ADMIN role.

**Authentication:** 🔒 Bearer Token (ADMIN only)

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | string (UUID) | The genre's unique ID |

**Request Body**
```json
{
    "name": "funny"
}
```

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success update genre",
    "data": {
        "id": "b8aa12a7-0474-4044-ae17-d8875c9350b4",
        "name": "funny"
    }
}
```

---

## 5. Film

### 5.1 Create New Film

**`POST /api/v1/films`**

Create a new film entry. Requires ADMIN role. Uses `multipart/form-data` to support image uploads.

**Authentication:** 🔒 Bearer Token (ADMIN only)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data)**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | Film title |
| `synopsis` | string | ✅ | Film synopsis |
| `airing_status` | string | ✅ | One of: `airing`, `finished_airing`, `not_yet_aired` |
| `total_episodes` | integer | ✅ | Total number of episodes |
| `release_date` | string | ✅ | Date in `YYYY-MM-DD HH:MM:SS` format |
| `genres` | string | ✅ | Comma-separated genre UUIDs (e.g. `uuid1,uuid2`) |
| `images` | file(s) | ❌ | One or more image files for the film |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success create new film",
    "data": {
        "id": "2279d16a-2fd1-4b7c-beaf-35e535a287a9"
    }
}
```

---

### 5.2 Get All Film

**`GET /api/v1/films`**

Retrieve a paginated list of films with optional filtering.

**Authentication:** None

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `take` | integer | ✅ | Number of records per page |
| `page` | integer | ✅ | Page number (1-indexed) |
| `filter_by` | string | ❌ | Field to filter by (e.g. `title`) |
| `filter` | string | ❌ | Filter value/search keyword |

**Request**
```
GET {{URL}}/api/v1/films?take=10&page=1&filter_by=title&filter=tung tung
```

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success get list film",
    "data": [
        {
            "title": "Tung Tung Sahur Memakan Sapi",
            "airing_status": "airing",
            "total_episodes": 12,
            "release_date": "2024-01-02T15:04:00+07:00",
            "average_rating": 9
        },
        {
            "title": "Tung Tung Sahur Memakan Sapi",
            "airing_status": "not_yet_aired",
            "total_episodes": 12,
            "release_date": "2024-01-02T15:04:00+07:00",
            "average_rating": 0
        }
    ],
    "meta": [
        {
            "take": 10,
            "page": 1,
            "total_data": 2,
            "total_page": 1,
            "sort": "asc",
            "sort_by": "id",
            "filter": "tung tung",
            "filter_by": "title"
        }
    ]
}
```

---

### 5.3 Get Detail Film

**`GET /api/v1/films/:id`**

Retrieve full details for a single film, including genres and average rating.

**Authentication:** None

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | string (UUID) | The film's unique ID |

**Request**
```
GET {{URL}}/api/v1/films/2279d16a-2fd1-4b7c-beaf-35e535a287a9
```

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success get detail film",
    "data": {
        "id": "2279d16a-2fd1-4b7c-beaf-35e535a287a9",
        "title": "Tung Tung Sahur Memakan Sapi",
        "synopsis": "tung tugn gtugntugntugntugutgntugngtungutn",
        "airing_status": "airing",
        "total_episodes": 12,
        "release_date": "2024-01-02 15:04:00",
        "images": [
            "film-tung-tung-sahur-memakan-sapi-01JS9DR40HCP76EFTJTKJMMYPD.png",
            "film-tung-tung-sahur-memakan-sapi-01JS9DR40HCP76EFTJTKRN4PFF.png"
        ],
        "genres": [
            { "id": "b8aa12a7-0474-4044-ae17-d8875c9350b4", "name": "funny" },
            { "id": "4c57d4b2-613d-4160-8175-2c98b1e4d44c", "name": "thriller" }
        ],
        "average_rating": 8.67
    }
}
```

---

## 6. Film List

### 6.1 Create Film List

**`POST /api/v1/film-lists`**

Add a film to the authenticated user's personal film list.

**Authentication:** 🔒 Bearer Token required

**Request Body**
```json
{
    "film_id": "2279d16a-2fd1-4b7c-beaf-35e535a287a9",
    "list_status": "watching"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `film_id` | string (UUID) | ✅ | ID of the film to add |
| `list_status` | string | ✅ | Status of the film (e.g. `watching`, `completed`, `plan_to_watch`) |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success create film list"
}
```

**Response — 400 Bad Request** *(film has not aired yet)*
```json
{
    "success": false,
    "message": "failed create film list",
    "error": "film is not aired yet"
}
```

---

### 6.2 Update Visibility

**`PATCH /api/v1/film-lists/:id`**

Change the visibility of a film list entry.

**Authentication:** 🔒 Bearer Token required

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | string (UUID) | The film list entry ID |

**Request Body**
```json
{
    "visibility": "public"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `visibility` | string | ✅ | Either `"public"` or `"private"` |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success update film list"
}
```

---

## 7. Review

### 7.1 Create Review

**`POST /api/v1/reviews`**

Submit a review and rating for a film.

**Authentication:** 🔒 Bearer Token required

**Request Body**
```json
{
    "film_id": "2279d16a-2fd1-4b7c-beaf-35e535a287a9",
    "rating": 8,
    "comment": "bagus sekali tung tung sahurnya kelihatan realistik"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `film_id` | string (UUID) | ✅ | ID of the film being reviewed |
| `rating` | integer | ✅ | Rating score (numeric) |
| `comment` | string | ✅ | Written review comment |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success create review"
}
```

---

## 8. Reaction

### 8.1 Create Reaction

**`POST /api/v1/reactions`**

React to a review (like or dislike).

**Authentication:** 🔒 Bearer Token required

**Request Body**
```json
{
    "review_id": "b8d4cae2-5926-48a4-ac02-b331ef159d33",
    "status": "like"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `review_id` | string (UUID) | ✅ | ID of the review to react to |
| `status` | string | ✅ | Either `"like"` or `"dislike"` |

**Response — 200 OK**
```json
{
    "success": true,
    "message": "success create reaction"
}
```

---

### 8.2 Update Reaction

**`PUT /api/v1/reactions/:id`**

Update an existing reaction.

**Authentication:** 🔒 Bearer Token required

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | string (UUID) | The reaction's unique ID |

**Request Body**
```json
{
    "status": "like"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | ✅ | Updated reaction: `"like"` or `"dislike"` |

**Response:** *(no example saved — expected 200 OK with success message)*

---

## Error Response Format

All error responses follow this general structure:

```json
{
    "success": false,
    "message": "<human-readable message>",
    "error": "<error detail>"
}
```

| HTTP Code | Meaning |
|---|---|
| `200 OK` | Request succeeded |
| `400 Bad Request` | Invalid input or business rule violation |
| `403 Forbidden` | Insufficient role/permissions |
| `409 Conflict` | Resource already exists |

---

## Environment Variables

| Variable | Description |
|---|---|
| `{{URL}}` | Base URL of the API server (e.g. `http://localhost:8080`) |
| `{{TOKEN}}` | JWT bearer token, automatically set after a successful Login request |
