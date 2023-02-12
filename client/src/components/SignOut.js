import React from "react";

export default function SignIn({ onSignOut }) {
  const onClickSignOut = async (e) => {
    e.preventDefault();

    onSignOut();
  };

  return (
    <section className="sign-out">
      <button onClick={onClickSignOut} className="secondary">
        Sign Out
      </button>
    </section>
  );
}
