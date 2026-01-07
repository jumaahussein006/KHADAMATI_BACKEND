# 10-Minute Stability Test Plan

**Objective:** Verify core backend functionality and stability  
**Duration:** 10 minutes  
**Prerequisites:** Server running on `http://localhost:5000`, MySQL database with schema imported

---

## Test Execution

### 1. Health Check (30 seconds)

```bash
curl -X GET http://localhost:5000/api/v1/health

✅ Success: 200 OK
{
  "success": true,
  "message": "Backend is running"
}
```

**What to verify:**
- Server responds
- JSON is valid
- `success: true`

---

### 2. Customer Registration (1 minute)

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcustomer@example.com",
    "password": "Test123!",
    "first_name": "Test",
    "last_name": "Customer",
    "phone": "70111111",
    "role": "customer"
  }'

✅ Success: 201 Created
{
  "success": true,
  "data": {
    "user": { "user_id": ..., "role": "customer", ... },
    "customer_id": 1,
    "token": "eyJhbGc..."
  }
}
```

**What to verify:**
- Status 201
- `customer_id` present
- `token` returned
- Copy token for next steps → `CUSTOMER_TOKEN`

---

### 3. Provider Registration (1 minute)

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testprovider@example.com",
    "password": "Test123!",
    "first_name": "Test",
    "last_name": "Provider",
    "phone": "70222222",
    "role": "provider"
  }'

✅ Success: 201 Created
{
  "success": true,
  "data": {
    "user": { "user_id": ..., "role": "provider", ... },
    "provider_id": 1,
    "token": "eyJhbGc..."
  }
}
```

**What to verify:**
- Status 201
- `provider_id` present
- Copy token → `PROVIDER_TOKEN`

---

### 4. Login Test (1 minute)

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcustomer@example.com",
    "password": "Test123!"
  }'

✅ Success: 200 OK
{
  "success": true,
  "data": {
    "user": { "user_id": ..., "email": "testcustomer@example.com" },
    "token": "...",
    "customer_id": 1
  }
}
```

**What to verify:**
- Status 200
- Token matches or is new
- Correct role data returned

---

### 5. Browse Categories (30 seconds)

```bash
curl -X GET http://localhost:5000/api/v1/categories

✅ Success: 200 OK
{
  "success": true,
  "data": [
    { "category_id": 1, "name_ar": "...", "name_en": "...", "icon": "..." }
  ]
}
```

**What to verify:**
- Public endpoint (no auth needed)
- Returns array
- Bilingual fields present

---

### 6. Create Service (1 minute)

```bash
curl -X POST http://localhost:5000/api/v1/services \
  -H "Authorization: Bearer {PROVIDER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name_ar": "خدمة تجريبية",
    "name_en": "Test Service",
    "description_ar": "وصف الخدمة",
    "description_en": "Service description",
    "category_id": 1,
    "price": 50.00,
    "duration_minutes": 60
  }'

✅ Success: 201 Created
{
  "success": true,
  "data": {
    "service_id": 1,
    "provider_id": 1,
    "name_en": "Test Service",
    "price": "50.00",
    ...
  }
}
```

**What to verify:**
- Status 201
- `service_id` returned
- Copy `service_id` → `SERVICE_ID`

---

### 7. Browse Services (30 seconds)

```bash
curl -X GET http://localhost:5000/api/v1/services?limit=5

✅ Success: 200 OK
{
  "success": true,
  "data": [ { "service_id": 1, "name_en": "Test Service", ... } ],
  "pagination": { "page": 1, "total_count": ..., ... }
}
```

**What to verify:**
- Public endpoint works
- Newly created service appears
- Pagination object present

---

### 8. Create Service Request (1 minute)

```bash
curl -X POST http://localhost:5000/api/v1/requests \
  -H "Authorization: Bearer {CUSTOMER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 1,
    "scheduled_date": "2025-12-28T10:00:00",
    "details": "Test service request"
  }'

✅ Success: 201 Created
{
  "success": true,
  "data": {
    "request_id": 1,
    "customer_id": 1,
    "provider_id": 1,
    "status": "pending",
    ...
  }
}
```

**What to verify:**
- Status 201
- `status: "pending"`
- Copy `request_id` → `REQUEST_ID`

---

### 9. Provider Views Requests (30 seconds)

```bash
curl -X GET http://localhost:5000/api/v1/requests/provider-requests \
  -H "Authorization: Bearer {PROVIDER_TOKEN}"

✅ Success: 200 OK
{
  "success": true,
  "data": [
    {
      "request_id": 1,
      "status": "pending",
      "customer": { "user": { "first_name": "Test" } },
      "service": { "name_en": "Test Service" }
    }
  ]
}
```

**What to verify:**
- Request appears in provider's list
- Customer info included
- Status is "pending"

---

### 10. Provider Accepts Request (1 minute)

```bash
curl -X PUT http://localhost:5000/api/v1/requests/1/status \
  -H "Authorization: Bearer {PROVIDER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{ "status": "accepted" }'

✅ Success: 200 OK
{
  "success": true,
  "data": {
    "request_id": 1,
    "status": "accepted",
    ...
  }
}
```

**What to verify:**
- Status 200
- `status: "accepted"`

---

### 11. Provider Completes Request (30 seconds)

```bash
curl -X PUT http://localhost:5000/api/v1/requests/1/status \
  -H "Authorization: Bearer {PROVIDER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{ "status": "completed" }'

✅ Success: 200 OK
{
  "success": true,
  "data": { "status": "completed", ... }
}
```

**What to verify:**
- Status transitions work
- StatusHistory records created (check DB)

---

### 12. Provider Creates Payment (1 minute)

```bash
curl -X POST http://localhost:5000/api/v1/payments \
  -H "Authorization: Bearer {PROVIDER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": 1,
    "amount": 75.00,
    "method": "cash",
    "status": "completed"
  }'

✅ Success: 201 Created
{
  "success": true,
  "data": {
    "payment_id": 1,
    "request_id": 1,
    "amount": "75.00",
    ...
  }
}
```

**What to verify:**
- Payment created
- Linked to request

---

### 13. Customer Views Payments (30 seconds)

```bash
curl -X GET http://localhost:5000/api/v1/payments/my-payments \
  -H "Authorization: Bearer {CUSTOMER_TOKEN}"

✅ Success: 200 OK
{
  "success": true,
  "data": [
    {
      "payment_id": 1,
      "amount": "75.00",
      "request": { "service": { "name_en": "Test Service" } }
    }
  ]
}
```

**What to verify:**
- Payment appears
- Request details included

---

### 14. Notifications Test (30 seconds)

```bash
curl -X GET http://localhost:5000/api/v1/notifications \
  -H "Authorization: Bearer {CUSTOMER_TOKEN}"

✅ Success: 200 OK
{
  "success": true,
  "data": []  // or array if notifications exist
}
```

**What to verify:**
- Endpoint accessible
- Returns array (empty or with data)

---

## Success Criteria

### All Tests Pass ✅
- [x] Health check responds
- [x] Customer registration works
- [x] Provider registration works
- [x] Login works
- [x] Categories browseable
- [x] Service creation works
- [x] Service listing works
- [x] Request creation works
- [x] Provider sees requests
- [x] Status update works (pending → accepted → completed)
- [x] Payment creation works
- [x] Customer sees payments
- [x] Notifications endpoint accessible

### Database Verification
After tests, check MySQL:

```sql
-- Verify users created
SELECT * FROM user WHERE email LIKE 'test%';

-- Verify customer/provider records
SELECT * FROM customer WHERE user_id IN (SELECT user_id FROM user WHERE email LIKE 'test%');
SELECT * FROM provider WHERE user_id IN (SELECT user_id FROM user WHERE email LIKE 'test%');

-- Verify service created
SELECT * FROM service WHERE provider_id = 1;

-- Verify request created
SELECT * FROM servicerequest WHERE customer_id = 1;

-- Verify status history
SELECT * FROM status_history WHERE request_id = 1 ORDER BY changed_at;

-- Verify payment
SELECT * FROM payment WHERE request_id = 1;
```

Expected: All records exist and match API responses

---

## What Success Looks Like

1. **No Server Crashes:** Server stays running throughout all tests
2. **Consistent Responses:** All responses follow standard format (`success`, `message`, `data`)
3. **Data Persistence:** All operations save to database correctly
4. **Authentication Works:** JWT tokens validate correctly
5. **Role-Based Access:** Customer can't access provider endpoints and vice versa
6. **Status Transitions:** Request moves through lifecycle (pending → accepted → completed)
7. **Associations Work:** Responses include related data (customer, provider, service)

---

## Failure Scenarios to Watch For

### ❌ Server Crashes
- Check console for stack traces
- Review error.middleware.js
- Check model associations in models/index.js

### ❌ "Unknown column" Errors
- Model doesn't match database schema
- Check model field definitions vs. actual MySQL columns

### ❌ 401 Unauthorized
- Token malformed or expired
- Check JWT_SECRET matches
- Verify Authorization header format

### ❌ 403 Forbidden
- Role mismatch (customer trying provider endpoint)
- Check role.middleware.js

### ❌ 404 Not Found
- Route not loaded
- Check routes/index.js for try/catch errors
- Verify route files exist

### ❌ 500 Internal Server Error
- Sequelize association error
- Check server console logs
- Review error.middleware.js output

---

## Quick Troubleshooting

**If health check fails:**
- Server not running: `npm run dev`
- Wrong port: Check `.env` PORT value

**If registration fails:**
- Database connection: Check `.env` DB credentials
- Table missing: Import `khadamati-complete.sql`

**If token auth fails:**
- JWT_SECRET mismatch: Check `.env`
- Token format: Must be `Bearer {token}`

**If "Unknown column" error:**
- Model/DB mismatch: Review BACKEND_STATUS_REPORT.md fixes
- Check specific model mentioned in error

---

**Test Duration:** ~10 minutes  
**Total API Calls:** 14 endpoints  
**Coverage:** Authentication, Services, Requests, Payments, Notifications  
**Result:** Pass/Fail for production readiness
