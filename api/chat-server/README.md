# Socket.io Chat App Server

This is a server for a chat app using Socket.io, JWT and dotenv. The server allows users to connect and send messages through sockets. 

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Install the dependencies: `npm install`
3. Create a `.env` file with the following variables: `JWT_SECRET`
4. Run the server: `npm start`

### Usage

Once the server is running, you can connect to it using Socket.io on the client side. 

The server listens for `connection` events and sends the `messages` array to the client. 

When a client sends a `message` event, the server validates and sanitizes the message using the `validateAndSanitizeMessage` function from the `services` folder. 

If the message is valid, the server adds it to the `messages` array with the email and nickname of the user who sent it, and emits the updated `messages` array to all clients using the `load` event.

If the message is invalid, the server emits an `error` event to the client.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
