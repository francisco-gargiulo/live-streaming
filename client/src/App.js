import React from "react";

import useLocalStorage from "./hooks/useLocalStorage";

import Video from "./components/Video";
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";

const URL_STREAM =
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8";

function App() {
  const [token, setToken] = useLocalStorage("token", undefined);

  function onSignIn(token) {
    setToken(token);
  }

  function onSignOut() {
    setToken();
  }

  return (
    <main>
      <header>
        <h1>Live Streaming</h1>
      </header>
      <article>
        <Video src={URL_STREAM} />
      </article>
      <aside>
        <Chat token={token} />
        {token ? (
          <SignOut onSignOut={onSignOut} />
        ) : (
          <SignIn onSignIn={onSignIn} />
        )}
      </aside>
      <footer>
        <p>2022</p>
      </footer>
    </main>
  );
}

export default App;
