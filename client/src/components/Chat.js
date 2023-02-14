import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const parseTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Chat({ token }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState();

  const [socket, setSocket] = useState({});

  useEffect(() => {
    const socket = io("http://localhost:3002", {
      auth: token,
      forceNew: true,
    });

    socket.on("load", (data) => {
      setMessages(data);
    });

    socket.on("ERR_JWT_EXPIRED", () => {
      setUser();
    });

    setSocket(socket);

    if (token) {
      const [, body] = token.id_token.split(".");

      setUser(JSON.parse(atob(body)));
    } else if (user) {
      setUser();
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [token]);

  useEffect(() => {
    if (socket.connected) {
      scrollToBottom();
    }
  }, [socket]);

  useEffect(() => {
    shouldScrollToBottom();
  }, [messages]);

  const onSubmitMessage = (e) => {
    e.preventDefault();

    if (!message) {
      return;
    }

    if (!socket.connected) {
      return;
    }

    socket.emit("message", message, (err) => {
      if (err) {
        console.log("Error:", err);
      }
    });

    setMessage("");
  };

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (!messagesContainerRef.current) {
      return;
    }

    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  };

  const shouldScrollToBottom = () => {
    if (!messagesContainerRef.current) {
      return;
    }

    const { scrollHeight, clientHeight, scrollTop } =
      messagesContainerRef.current;

    // prevent to scroll to bottom if it's already on bottom
    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
      return;
    }

    // if it's point is near to the bottom, then scroll
    if (scrollHeight - Math.abs(clientHeight + scrollTop) < clientHeight) {
      scrollToBottom();
    }
  };

  return (
    <section className="chatroom">
      <h3>Chat</h3>
      <div ref={messagesContainerRef} className="messages">
        {messages.map((data, i) => {
          switch (data.type) {
            case "user":
              if (user && data.nickname === user.nickname) {
                return (
                  <span key={i} className="right">
                    <p className="timestamp">
                      {parseTimestamp(data.timestamp)}
                    </p>
                    <p className="message me">{data.message}</p>
                  </span>
                );
              }

              return (
                <span key={i} className="left">
                  <p className="timestamp">{parseTimestamp(data.timestamp)}</p>
                  <p className="autor">{data.email}:</p>
                  <p className="message others">{data.message}</p>
                </span>
              );
            case "system":
              return (
                <span key={i} className="center">
                  <p className="message system">{data.message}</p>
                </span>
              );
          }
        })}
      </div>
      {user ? (
        <form onSubmit={onSubmitMessage}>
          <label htmlFor="input-message">Type your message:</label>
          <input
            value={message}
            autoComplete="off"
            id="input-message"
            maxLength={64}
            required
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button type="submit" disabled={!socket.connected}>
            Send
          </button>
        </form>
      ) : null}
    </section>
  );
}
