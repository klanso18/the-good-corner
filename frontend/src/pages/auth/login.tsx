import { InputLogin, useLoginQuery } from "@/graphql/generated/schema";
import React, { useState } from "react";

function Login() {
  const { loading, error, data, refetch } = useLoginQuery({
    variables: { data: { email: "", password: "" } },
    fetchPolicy: "no-cache",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as InputLogin;

    if (data.email && data.password) {
      refetch({ data: { email: data.email, password: data.password } });
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && <p>Error: {error.message}</p>}
        {data && <p>{data.login.message}</p>}
      </form>
    </main>
  );
}

export default Login;
