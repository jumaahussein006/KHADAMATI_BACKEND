# Khadamati Backend - End-to-End Flows

Complete walkthrough of all user flows from registration to payment.

---

## 1. User Registration & Authentication

### Register as Customer
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "SecurePass123!",
  "first_name": "Ahmed",
  "last_name": "Ali",
  "phone": "70123456",
  "role": "customer"
}

✅ Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": 1,
      "email": "customer@example.com",
      "first_name": "Ahmed",
      "last_name": "Ali",
      "phone": "70123456",
      "role": "customer"
    },
    "customer_id": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**What happened:**
- User record created in `user` table
- Customer record created in `customer` table (auto-linked)
- JWT token generated (7-day expiration)

### Register as Provider
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "provider@example.com",
  "password": "SecurePass123!",
  "first_name": "Mohamed",
  "last_name": "Hassan",
  "phone": "70654321",
  "role": "provider"
}

✅ Response (201):
{
  "success": true,
  "data": {
    "user": { ... },
    "provider_id": 1,
    "token": "..."
  }
}
```

**What happened:**
- User record created
- Provider record created with `rating=0.00`, `total_reviews=0`, `is_verified=false`

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "SecurePass123!"
}

✅ Response (200):
{
  "success": true,
  "data": {
    "user": { user_id, email, role, ... },
    "token": "...",
    "customer_id": 1  // or provider_id/admin_id based on role
  }
}
```

### Using Auth Token
All subsequent requests to protected endpoints must include:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Provider Flow: Create Service + Upload Images

### Create Service
```bash
POST /api/v1/services
Authorization: Bearer {provider_token}
Content-Type: multipart/form-data

name_ar=تصليح سباكة
name_en=Plumbing Repair
description_ar=نوفر جميع خدمات السباكة
description_en=We provide all plumbing services
category_id=1
price=50.00
duration_minutes=60
images=@service1.jpg
images=@service2.jpg

✅ Response (201):
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "service_id": 1,
    "provider_id": 1,
    "category_id": 1,
    "name_ar": "تصليح سباكة",
    "name_en": "Plumbing Repair",
    "description_ar": "نوفر جميع خدمات السباكة",
    "description_en": "We provide all plumbing services",
    "price": "50.00",
    "duration_minutes": 60,
    "created_at": "2025-12-27T01:30:00.000Z",
    "images": [
      {
        "image_id": 1,
        "image": "/uploads/images-1703640000123.jpg",
        "caption": null
      },
      {
        "image_id": 2,
        "image": "/uploads/images-1703640000456.jpg",
        "caption": null
      }
    ]
  }
}
```

**What happened:**
- Service record created in `service` table
- Images saved to `/uploads` directory
- Image records created in `serviceimage` table
- Provider ID auto-filled from JWT token

### View My Services
```bash
GET /api/v1/services?provider_id=1
Authorization: Bearer {provider_token}

✅ Response (200):
{
  "success": true,
  "data": [ /* array of services */ ],
  "pagination": { page: 1, limit: 10, total_count: 5, ... }
}
```

---

## 3. Customer Flow: Browse & Request Service

### Browse Services (Public)
```bash
GET /api/v1/services?category_id=1&limit=10

✅ Response (200):
{
  "success": true,
  "data": [
    {
      "service_id": 1,
      "name_ar": "تصليح سباكة",
      "name_en": "Plumbing Repair",
      "price": "50.00",
      "provider": {
        "provider_id": 1,
        "rating": "0.00",
        "user": {
          "first_name": "Mohamed",
          "last_name": "Hassan",
          "phone": "70654321"
        }
      },
      "images": [ {...} ],
      "category": { "category_id": 1, "name_en": "Home Services" }
    }
  ],
  "pagination": { ... }
}
```

### Create Service Request
```bash
POST /api/v1/requests
Authorization: Bearer {customer_token}
Content-Type: application/json

{
  "service_id": 1,
  "scheduled_date": "2025-12-28T10:00:00",
  "details": "Need urgent plumbing repair in kitchen"
}

✅ Response (201):
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "request_id": 1,
    "customer_id": 1,
    "provider_id": 1,
    "service_id": 1,
    "scheduled_date": "2025-12-28T10:00:00.000Z",
    "details": "Need urgent plumbing repair in kitchen",
    "price": "50.00",
    "status": "pending",
    "request_date": "2025-12-27T01:35:00.000Z"
  }
}
```

**What happened:**
- ServiceRequest record created with `status="pending"`
- StatusHistory record created (status: pending, changed_by: customer_id)
- Provider ID auto-filled from service
- Price copied from service

### View My Requests (Customer)
```bash
GET /api/v1/requests/my-requests
Authorization: Bearer {customer_token}

✅ Response (200):
{
  "success": true,
  "data": [
    {
      "request_id": 1,
      "status": "pending",
      "scheduled_date": "2025-12-28T10:00:00.000Z",
      "service": { "name_en": "Plumbing Repair", ... },
      "provider": {
        "user": { "first_name": "Mohamed", "phone": "70654321" }
      }
    }
  ]
}
```

---

## 4. Provider: Accept/Reject & Status Lifecycle

### Provider Views Requests
```bash
GET /api/v1/requests/provider-requests
Authorization: Bearer {provider_token}

✅ Response (200):
{
  "success": true,
  "data": [
    {
      "request_id": 1,
      "status": "pending",
      "customer": {
        "user": { "first_name": "Ahmed", "phone": "70123456" }
      },
      "service": { "name_en": "Plumbing Repair" }
    }
  ]
}
```

### Accept Request
```bash
PUT /api/v1/requests/1/status
Authorization: Bearer {provider_token}
Content-Type: application/json

{
  "status": "accepted"
}

✅ Response (200):
{
  "success": true,
  "message": "Request status updated successfully",
  "data": {
    "request_id": 1,
    "status": "accepted",
    ...
  }
}
```

**What happened:**
- ServiceRequest status → `"accepted"`
- StatusHistory record created (status: accepted, changed_by: provider_id)
- (TODO: Notification sent to customer)

### Status Lifecycle
Valid status transitions:
1. **pending** (initial)
2. **accepted** (provider accepts) or **rejected** (provider rejects)
3. **in_progress** (work started)
4. **completed** (work finished)
5. **cancelled** (customer cancels)

```bash
# Update to in_progress
PUT /api/v1/requests/1/status
{ "status": "in_progress" }

# Update to completed
PUT /api/v1/requests/1/status
{ "status": "completed" }
```

Each status change creates a `StatusHistory` record.

### Reject Request
```bash
PUT /api/v1/requests/1/status
{ "status": "rejected" }

✅ Response (200): Request marked as rejected
```

---

## 5. Payments: Creation & Retrieval

### Provider Creates Payment (After Completion)
```bash
POST /api/v1/payments
Authorization: Bearer {provider_token}
Content-Type: application/json

{
  "request_id": 1,
  "amount": 75.00,
  "method": "cash",
  "status": "completed"
}

✅ Response (201):
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": 1,
    "request_id": 1,
    "amount": "75.00",
    "method": "cash",
    "status": "completed",
    "created_at": "2025-12-27T02:00:00.000Z"
  }
}
```

**What happened:**
- Payment record created in `payment` table
- (TODO: Notification sent to customer about payment)

**Note:** Only the provider who owns the request can create payments.

### Customer Views Payments
```bash
GET /api/v1/payments/my-payments
Authorization: Bearer {customer_token}

✅ Response (200):
{
  "success": true,
  "data": [
    {
      "payment_id": 1,
      "amount": "75.00",
      "method": "cash",
      "status": "completed",
      "request": {
        "request_id": 1,
        "service": { "name_en": "Plumbing Repair" },
        "provider": { "user": { "first_name": "Mohamed" } }
      }
    }
  ]
}
```

### Provider Views Payments
```bash
GET /api/v1/payments/provider-payments
Authorization: Bearer {provider_token}

✅ Response (200): List of payments for provider's requests
```

---

## 6. Notifications: Bilingual AR/EN

### List Notifications
```bash
GET /api/v1/notifications
Authorization: Bearer {token}

✅ Response (200):
{
  "success": true,
  "data": [
    {
      "notification_id": 1,
      "type": "request_created",
      "title_ar": "طلب جديد",
      "title_en": "New Request",
      "message_ar": "لديك طلب جديد من أحمد",
      "message_en": "You have a new request from Ahmed",
      "related_id": 1,
      "is_read": false,
      "created_at": "2025-12-27T01:35:00.000Z"
    }
  ]
}
```

### Create Notification
```bash
POST /api/v1/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id": 2,
  "type": "custom",
  "title_ar": "رسالة خاصة",
  "title_en": "Private Message",
  "message_ar": "مرحباً بك",
  "message_en": "Welcome",
  "related_id": null
}

✅ Response (201): Notification created
```

**Bilingual Requirement:** All notifications MUST have:
- `title_ar` + `title_en`
- `message_ar` + `message_en`

Single-language fields are rejected.

### Mark as Read
```bash
POST /api/v1/notifications/mark-read
Authorization: Bearer {token}
Content-Type: application/json

{
  "notification_ids": [1, 2, 3]
}

✅ Response (200):
{
  "success": true,
  "message": "Notifications marked as read"
}
```

### Mark All as Read
```bash
POST /api/v1/notifications/mark-all-read
Authorization: Bearer {token}

✅ Response (200): All user notifications marked as read
```

### Delete Notification
```bash
DELETE /api/v1/notifications/1
Authorization: Bearer {token}

✅ Response (200):
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## 7. Address Management

### Create Address
```bash
POST /api/v1/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "city": "Beirut",
  "street": "Hamra Street",
  "building": "Building 5",
  "floor": "3rd Floor",
  "country": "Lebanon"
}

✅ Response (201): Address created and linked to user
```

### List My Addresses
```bash
GET /api/v1/addresses
Authorization: Bearer {token}

✅ Response (200): Array of user addresses
```

### Search Cities (Autocomplete)
```bash
GET /api/v1/addresses/search-cities?query=Bei

✅ Response (200):
{
  "success": true,
  "data": ["Beirut", "Beit Mery"]
}
```

---

## 8. Name Change Requests (If Implemented)

### Submit Name Change
```bash
POST /api/v1/name-changes
Authorization: Bearer {token}
Content-Type: application/json

{
  "new_first_name": "Ahmed",
  "new_last_name": "Mohamed"
}

✅ Response (201): Request submitted, admin notified
```

### Admin Approves/Rejects
```bash
PUT /api/v1/name-changes/1
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"  // or "rejected"
}

✅ Response (200): Name updated (if approved), user notified
```

---

## 9. Reports (If Implemented)

### Submit Report
```bash
POST /api/v1/reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "reported_id": 5,
  "request_id": 1,
  "reason": "Unprofessional behavior",
  "description": "Provider was late and rude"
}

✅ Response (201): Report submitted to admin
```

### Admin Views Reports
```bash
GET /api/v1/admin/reports
Authorization: Bearer {admin_token}

✅ Response (200): All reports with details
```

---

## Complete Flow Summary

```
1. Customer registers → gets token
2. Provider registers → gets token
3. Provider creates service with images
4. Customer browses services (no auth needed)
5. Customer creates request → status: pending
6. Provider views requests → sees new request
7. Provider accepts → status: accepted
8. Provider updates → status: in_progress
9. Provider completes → status: completed
10. Provider creates payment (final amount)
11. Customer views payment
12. Both receive notifications (AR/EN)
```

Each step persists to database and creates necessary records (User, Customer/Provider, Service, ServiceRequest, StatusHistory, Payment, Notification).

---

## Response Format Reference

**All endpoints return:**
```json
{
  "success": true/false,
  "message": "Human-readable message",
  "data": { ... } // or array
}
```

**Errors include:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

**Pagination adds:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_count": 50,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

---

**End of Walkthrough** - All flows documented based on implemented endpoints.
