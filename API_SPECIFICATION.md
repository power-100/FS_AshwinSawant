# API Specification - Student Commute Optimizer

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.studentcommute.app/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": object | array | null,
  "error": {
    "message": string,
    "code": string,
    "details": object
  } | null,
  "timestamp": string,
  "requestId": string
}
```

## Error Codes
- `AUTH_001`: Invalid or expired token
- `AUTH_002`: User not found
- `AUTH_003`: Invalid credentials
- `ROUTE_001`: Invalid location coordinates
- `ROUTE_002`: Route calculation failed
- `CHAT_001`: Chat room not found
- `USER_001`: Username already taken
- `VALIDATION_001`: Required field missing

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securePassword123",
  "studentId": "optional_student_id"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "email": "student@university.edu",
      "anonymousUsername": "SwiftEagle247",
      "verificationStatus": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "anonymousUsername": "SwiftEagle247",
      "verificationStatus": "verified",
      "lastActive": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/verify-email
Verify email address with verification code.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "verificationCode": "123456"
}
```

---

## User Management Endpoints

### GET /users/profile
Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "anonymousUsername": "SwiftEagle247",
    "verificationStatus": "verified",
    "createdAt": "2024-01-15T10:30:00Z",
    "activeRoute": {
      "id": "route_id_123",
      "startAddress": "123 Student St, University City",
      "endAddress": "University Campus, Main Building"
    }
  }
}
```

### PUT /users/profile
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "regenerateUsername": true
}
```

### POST /users/report
Report another user for inappropriate behavior.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reportedUserId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "reason": "inappropriate_messages",
  "description": "User sent inappropriate content in chat",
  "chatRoomId": "room_123_456"
}
```

---

## Route Management Endpoints

### POST /routes
Create a new route for the user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "startLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Student St, University City, NY 10001"
  },
  "endLocation": {
    "latitude": 40.7614,
    "longitude": -73.9776,
    "address": "University Campus, Main Building, NY 10025"
  },
  "schedule": {
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "departureTime": "08:30",
    "flexibility": 15
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "route": {
      "id": "route_id_123",
      "startLocation": {
        "coordinates": [-74.0060, 40.7128],
        "address": "123 Student St, University City, NY 10001"
      },
      "endLocation": {
        "coordinates": [-73.9776, 40.7614],
        "address": "University Campus, Main Building, NY 10025"
      },
      "routeGeometry": {
        "type": "LineString",
        "coordinates": [[-74.0060, 40.7128], [-74.0050, 40.7130], ...]
      },
      "schedule": {
        "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "departureTime": "08:30",
        "flexibility": 15
      },
      "distance": 12.5,
      "estimatedDuration": 25,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### GET /routes/my-routes
Get all routes belonging to the current user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "route_id_123",
        "startAddress": "123 Student St, University City",
        "endAddress": "University Campus, Main Building",
        "schedule": {
          "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
          "departureTime": "08:30"
        },
        "isActive": true,
        "matchCount": 3,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### PUT /routes/:routeId
Update an existing route.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST /routes

### DELETE /routes/:routeId
Delete a route.

**Headers:** `Authorization: Bearer <token>`

---

## Route Matching Endpoints

### GET /matches/find
Find potential carpool matches for user's active routes.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `routeId` (optional): Specific route to find matches for
- `limit` (optional): Maximum number of matches to return (default: 10)
- `minOverlap` (optional): Minimum overlap percentage (default: 30)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "matchId": "match_123_456",
        "user": {
          "anonymousUsername": "QuickRaven89",
          "verificationStatus": "verified"
        },
        "route": {
          "id": "route_456",
          "startAddress": "456 Campus Ave, University City",
          "endAddress": "University Campus, Science Building"
        },
        "compatibility": {
          "overlapPercentage": 75.5,
          "overlapDistance": 9.2,
          "scheduleMatch": true,
          "timeDifference": 10
        },
        "suggestedMeetPoints": [
          {
            "location": {
              "latitude": 40.7500,
              "longitude": -73.9850
            },
            "address": "Main St & University Ave",
            "walkingDistanceFromRoute": 0.2
          }
        ],
        "matchScore": 85.6
      }
    ]
  }
}
```

### POST /matches/:matchId/connect
Initiate connection with a matched user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "chatRoomId": "room_123_456",
    "message": "Connection initiated. You can now chat with QuickRaven89."
  }
}
```

---

## Chat System Endpoints

### GET /chat/rooms
Get all chat rooms for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "chatRooms": [
      {
        "id": "room_123_456",
        "participants": [
          {
            "anonymousUsername": "SwiftEagle247",
            "isCurrentUser": true
          },
          {
            "anonymousUsername": "QuickRaven89",
            "isCurrentUser": false,
            "lastActive": "2024-01-15T09:45:00Z"
          }
        ],
        "lastMessage": {
          "content": "Hey, are you available for carpooling tomorrow?",
          "timestamp": "2024-01-15T09:45:00Z",
          "sender": "QuickRaven89"
        },
        "unreadCount": 2,
        "createdAt": "2024-01-15T09:30:00Z"
      }
    ]
  }
}
```

### GET /chat/rooms/:roomId/messages
Get chat messages for a specific room.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Messages per page (default: 50)
- `before` (optional): Get messages before this timestamp

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "content": "Hey, are you available for carpooling tomorrow?",
        "sender": {
          "anonymousUsername": "QuickRaven89",
          "isCurrentUser": false
        },
        "timestamp": "2024-01-15T09:45:00Z",
        "edited": false
      },
      {
        "id": "msg_124",
        "content": "Yes, I can leave at 8:30 AM. Works for you?",
        "sender": {
          "anonymousUsername": "SwiftEagle247",
          "isCurrentUser": true
        },
        "timestamp": "2024-01-15T09:47:00Z",
        "edited": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalMessages": 2,
      "hasMore": false
    }
  }
}
```

---

## Location Services Endpoints

### POST /locations/geocode
Convert address to coordinates.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "address": "123 Student St, University City, NY"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "formattedAddress": "123 Student St, University City, NY 10001, USA",
    "addressComponents": {
      "streetNumber": "123",
      "streetName": "Student St",
      "city": "University City",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }
}
```

### POST /locations/reverse-geocode
Convert coordinates to address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### POST /locations/calculate-route
Calculate route between two points.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "start": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "end": {
    "latitude": 40.7614,
    "longitude": -73.9776
  },
  "mode": "driving"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "route": {
      "geometry": {
        "type": "LineString",
        "coordinates": [[-74.0060, 40.7128], [-74.0050, 40.7130], ...]
      },
      "distance": 12.5,
      "duration": 25,
      "steps": [
        {
          "instruction": "Head north on Student St",
          "distance": 0.5,
          "duration": 2,
          "coordinates": [-74.0060, 40.7128]
        }
      ]
    }
  }
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('ws://localhost:5000', {
  auth: {
    token: 'your_jwt_token_here'
  }
});
```

### Events to Listen

**`match_found`** - New match discovered
```json
{
  "matchId": "match_123_456",
  "user": {
    "anonymousUsername": "QuickRaven89"
  },
  "compatibility": {
    "overlapPercentage": 75.5,
    "matchScore": 85.6
  }
}
```

**`message_received`** - New chat message
```json
{
  "roomId": "room_123_456",
  "message": {
    "id": "msg_125",
    "content": "Perfect! See you tomorrow at 8:30",
    "sender": "QuickRaven89",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**`user_status_changed`** - User online/offline status
```json
{
  "roomId": "room_123_456",
  "user": "QuickRaven89",
  "status": "online",
  "lastActive": "2024-01-15T10:00:00Z"
}
```

### Events to Emit

**`join_room`** - Join a chat room
```json
{
  "roomId": "room_123_456"
}
```

**`send_message`** - Send a message
```json
{
  "roomId": "room_123_456",
  "content": "Hey, ready to go?"
}
```

**`update_location`** - Update real-time location (optional feature)
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10
}
```

---

## Rate Limiting

### Default Limits (per user, per hour)
- Authentication endpoints: 10 requests
- Route management: 50 requests
- Match finding: 100 requests
- Chat messages: 500 requests
- Location services: 200 requests

### Headers
Response includes rate limiting information:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642251600
```

---

## Error Examples

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_001",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "message": "Authentication required",
    "code": "AUTH_001",
    "details": {
      "reason": "Token expired"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

This API specification provides comprehensive documentation for integrating with the Student Commute Optimizer backend services.