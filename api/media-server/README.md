# Node.js Static Content Server

This is a simple Node.js server that allows you to store and retrieve static content files on the server. It supports the PUT and GET methods for uploading and downloading files respectively.

## Getting Started

Install dependecies

```
npm install
```

## Usage

To run the server, use the following command:

```sh
node server.js
```

By default, the server will listen on port 3003. You can modify this by changing the app.listen line of the code.

## Endpoints

The server has two endpoints:

### PUT /static/:filename

This endpoint allows you to upload a static content file to the server. It requires authentication using the basic-auth middleware. The file should be sent as a raw body in the application/vnd.apple.mpegurl format.

```sh
curl -X PUT \
     -H 'Authorization: Basic dXNlcjpwYXNzd29yZA==' \
     -H 'Content-Type: application/vnd.apple.mpegurl' \
     --data-binary @/path/to/file \
     http://localhost:3003/static/myfile.txt
```

This is the content of my file.

Response

If the file is uploaded successfully, the server will respond with a 200 OK status.

### GET /static/:filename

This endpoint allows you to download a static content file from the server.

```sh
curl -OJ http://localhost:3003/static/myfile.txt
```

Response

If the file exists and is downloaded successfully, the server will respond with a 200 OK status and the content of the file in the response body. If the file does not exist, the server will respond with a 404 Not Found status.

## Error handling

If there is an error during file upload or download, the server will respond with a 500 Internal Server Error status.

## Security

To secure the server and prevent unauthorized access, the basic-auth middleware is used for authentication on the PUT endpoint. The middleware checks for a valid username and password combination before allowing the file to be uploaded.

## Limitations

The server only supports the application/vnd.apple.mpegurl content type for file uploads, and limits the size of the uploaded file to 50MB.

## Conclusion

This server provides a simple way to store and retrieve static content files on the server, with basic authentication for security. However, it is important to note that this is not a production-grade solution and is intended for development purposes only.