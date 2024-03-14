import Layout from "@/components/Layout";
import { InputLogin, useLoginQuery } from "@/graphql/generated/schema";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Login() {
  const router = useRouter();
  const { loading, error, data, refetch } = useLoginQuery({
    variables: { data: { email: "", password: "" } },
    fetchPolicy: "no-cache",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as InputLogin;

    if (data.email && data.password) {
      refetch({ data: { email: data.email, password: data.password } })
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.error("Login error:", error);
        });
    }
  };

  return (
    <Layout title="Se connecter">
      <h1 className="text-center text-[#ffa41b] text-2xl pt-6">Connexion</h1>
      <form onSubmit={handleSubmit} className="p-16">
        <div className="flex justify-center">
          <input
            className="input input-bordered w-3/4 mb-3"
            data-testid="login-email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex justify-center">
          <input
            className="input input-bordered w-3/4"
            data-testid="login-password"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="button save-button text-white mt-12"
            disabled={loading}
          >
            Se connecter
          </button>
        </div>
        <div className="flex justify-center mt-3">
          {error && <p>Error: {error.message}</p>}
          {data && <p>{data.login.message}</p>}
        </div>
      </form>
    </Layout>
  );
}

export default Login;
