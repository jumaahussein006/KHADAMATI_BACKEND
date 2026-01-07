# Backend API Test Suite
# Run with: powershell -File test_backend.ps1

Write-Host "=== KHADAMATI BACKEND TESTS ===" -ForegroundColor Cyan
$baseUrl = "http://localhost:5000/api/v1"

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✓ Health check passed" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Get Categories
Write-Host "`n2. Testing Get Categories..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET
    Write-Host "✓ Categories retrieved: $($categories.data.Count) found" -ForegroundColor Green
} catch {
    Write-Host "✗ Categories failed: $_" -ForegroundColor Red
}

# Test 3: Register Customer
Write-Host "`n3. Testing Customer Registration..." -ForegroundColor Yellow
$customerEmail = "testcustomer_$(Get-Random)@test.com"
$customerBody = @{
    email = $customerEmail
    password = "Test123!"
    first_name = "John"
    last_name = "Doe"
    phone = "70123456"
    role = "customer"
} | ConvertTo-Json

try {
    $customerReg = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $customerBody -ContentType "application/json"
    $customerToken = $customerReg.data.token
    Write-Host "✓ Customer registered successfully" -ForegroundColor Green
    Write-Host "  Token: $($customerToken.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Customer registration failed: $_" -ForegroundColor Red
}

# Test 4: Register Provider
Write-Host "`n4. Testing Provider Registration..." -ForegroundColor Yellow
$providerEmail = "testprovider_$(Get-Random)@test.com"
$providerBody = @{
    email = $providerEmail
    password = "Test123!"
    first_name = "Ahmad"
    last_name = "Hassan"
    phone = "70987654"
    role = "provider"
} | ConvertTo-Json

try {
    $providerReg = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $providerBody -ContentType "application/json"
    $providerToken = $providerReg.data.token
    $providerId = $providerReg.data.provider_id
    Write-Host "✓ Provider registered successfully" -ForegroundColor Green
    Write-Host "  Provider ID: $providerId" -ForegroundColor Gray
} catch {
    Write-Host "✗ Provider registration failed: $_" -ForegroundColor Red
}

# Test 5: Provider Create Service
Write-Host "`n5. Testing Service Creation (Provider)..." -ForegroundColor Yellow
$serviceBody = @{
    name_ar = "تصليح سباكة"
    name_en = "Plumbing Repair"
    description_ar = "خدمة ممتازة"
    description_en = "Excellent service"
    category_id = 1
    price = 50.00
    duration_minutes = 60
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $providerToken"
    "Content-Type" = "application/json"
}

try {
    $service = Invoke-RestMethod -Uri "$baseUrl/services" -Method POST -Body $serviceBody -Headers $headers
    $serviceId = $service.data.serviceId
    Write-Host "✓ Service created successfully" -ForegroundColor Green
    Write-Host "  Service ID: $serviceId" -ForegroundColor Gray
} catch {
    Write-Host "✗ Service creation failed: $_" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Customer Create Request
Write-Host "`n6. Testing Service Request Creation (Customer)..." -ForegroundColor Yellow
if ($serviceId) {
    $requestBody = @{
        service_id = $serviceId
        scheduled_date = "2025-12-30T10:00:00"
        details = "Need urgent help"
    } | ConvertTo-Json

    $customerHeaders = @{
        "Authorization" = "Bearer $customerToken"
        "Content-Type" = "application/json"
    }

    try {
        $request = Invoke-RestMethod -Uri "$baseUrl/requests" -Method POST -Body $requestBody -Headers $customerHeaders
        $requestId = $request.data.requestId
        Write-Host "✓ Service request created successfully" -ForegroundColor Green
        Write-Host "  Request ID: $requestId" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Service request creation failed: $_" -ForegroundColor Red
    }
}

# Test 7: Provider Accept Request
Write-Host "`n7. Testing Request Status Update (Provider)..." - ForegroundColor Yellow
if ($requestId) {
    $statusBody = @{
        status = "accepted"
    } | ConvertTo-Json

    try {
        $updated = Invoke-RestMethod -Uri "$baseUrl/requests/$requestId/status" -Method PUT -Body $statusBody -Headers $headers
        Write-Host "✓ Request status updated to accepted" -ForegroundColor Green
    } catch {
        Write-Host "✗ Status update failed: $_" -ForegroundColor Red
    }
}

# Test 8: Provider Complete Request with Payment
Write-Host "`n8. Testing Request Completion with Payment..." -ForegroundColor Yellow
if ($requestId) {
    $completeBody = @{
        final_price = 75.00
        payment_method = "cash"
    } | ConvertTo-Json

    try {
        $completed = Invoke-RestMethod -Uri "$baseUrl/requests/$requestId/complete" -Method PUT -Body $completeBody -Headers $headers
        Write-Host "✓ Request completed with payment created" -ForegroundColor Green
    } catch {
        Write-Host "✗ Request completion failed: $_" -ForegroundColor Red
    }
}

# Test 9: Get Notifications
Write-Host "`n9. Testing Notifications..." -ForegroundColor Yellow
try {
    $notifications = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method GET -Headers $customerHeaders
    Write-Host "✓ Notifications retrieved: $($notifications.data.Count) found" -ForegroundColor Green
} catch {
    Write-Host "✗ Notifications failed: $_" -ForegroundColor Red
}

Write-Host "`n=== BACKEND TESTS COMPLETE ===" -ForegroundColor Cyan
Write-Host "Backend is ready for frontend integration!" -ForegroundColor Green
