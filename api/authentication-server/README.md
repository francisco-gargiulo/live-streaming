# Node.js OTP Authentication API

This Node.js API provides a simple OTP authentication flow with two endpoints:

1. `/start`: Sends an OTP to a given email address
2. `/verify`: Verifies the OTP and returns an access token

## Getting started

To get started with this project, you'll need to follow these steps:

1. Install the dependencies using `npm install`
2. Create a .env file with the following variables:

```
SMTP_USERNAME=your-user
SMTP_PASSWORD=your-password
SMTP_HOST=host
SMTP_PORT=537
SESSION_SECRET=s3cr3t
JWT_SECRET=s3cr3t
```

## Run the application

```sh
npm start
```

## API Endpoints

Make requests to the endpoints using an HTTP client like Postman or cURL

### POST /start

To send an OTP to a given email address, run the following command:

```sh
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"username": "user@example.com", "nickname": "user"}' \
  http://localhost:3001/start
```

Response

If the request is successful, you should receive a 200 OK response with the following JSON object in the response body:

```json
{
  "message": "OK"
}
```

### POST /verify

To verify the OTP and get an access token, run the following command:

```sh
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"username": "user@example.com", "password": "123"}' \
  http://localhost:3000/verify
```

Response

If the OTP is valid and the request is successful, you should receive a 200 OK response with the following JSON object in the response body:

``` json
  {
    "access_token": "abc",
    "token_type": "Bearer",
    "expires_in": 3600,
    "id_token": "ey.."
  }
```

If the OTP is invalid, you should receive a 401 Unauthorized response with the following JSON object in the response body:

```json
{
  "error": "Invalid OTP code"
}
```

If the maximum number of OTP verification attempts has been reached, you should receive a 403 Forbidden response with the following JSON object in the response body:

```json
{
  "error": "Maximum number of OTP verification attempts exceeded"
}
```
