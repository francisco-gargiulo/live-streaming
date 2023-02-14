import React, { useEffect, useState } from "react";

export default function SignIn({ onSignIn }) {
  const [username, setUsername] = useState("francisco_gargiulo@hotmail.com");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("Francisco");
  const [error, setError] = useState();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!error) {
      return;
    }

    setError();
  }, [step]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const onClickPreviousStepButton = (e) => {
    e.preventDefault();

    previousStep();
  };

  const onClickNextStepButton = (e) => {
    e.preventDefault();

    nextStep();
  };

  const onSubmitUsername = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:3001/auth/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          username,
          nickname,
        }),
        credentials: "include",
      });

      nextStep();
    } catch ({ message }) {
      setError(message);
    }
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();

        const message =
          error.error_description || error.message || "Unknown error.";

        setError(message);

        return;
      }

      const token = await response.json();

      onSignIn(token);
    } catch ({ message }) {
      setError(message);
    }
  };

  return (
    <section className="sign-in">
      {step === 1 ? (
        <button onClick={onClickNextStepButton} className="primary">
          Sign In
        </button>
      ) : step === 2 ? (
        <>
          <h4>Sign In</h4>
          <p>Identify yourself to start sending messages.</p>
          {error ? (
            <p role="alert" className="alert error">
              {error}
            </p>
          ) : null}
          <form onSubmit={onSubmitUsername}>
            <label htmlFor="input-username">Username:</label>
            <input
              value={username}
              autoComplete="off"
              type="email"
              id="input-username"
              required
              maxLength={64}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <button type="submit" className="primary">
              Submit
            </button>
            <button onClick={onClickPreviousStepButton} className="secondary">
              Exit
            </button>
          </form>
        </>
      ) : step === 3 ? (
        <>
          <h4>Verify your email</h4>
          <p>Chek your email, you'll receive a one-time pasword.</p>
          {error ? (
            <p role="alert" className="alert error">
              {error}
            </p>
          ) : null}
          <form onSubmit={onSubmitPassword}>
            <label htmlFor="input-password">One-time password:</label>
            <input
              value={password}
              autoComplete="off"
              id="input-password"
              type="text"
              pattern="\d*"
              maxLength={6}
              required
              inputMode="numeric"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button type="submit" className="primary">
              Verify
            </button>
            <button onClick={onClickPreviousStepButton} className="secondary">
              Go Back
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}
