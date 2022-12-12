import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "http://localhost:3000",
    });
    if (res.error) return;

    if (res.url) {
      router.push(res.url);
    }
  };

  return (
    <section
      className="h-full min-h-screen flex justify-center items-center"
      onSubmit={handleSubmit}
    >
      <form className="border shadow p-8 rounded-md flex flex-col gap-4">
        <input type="email" className="form-input px-4 py-3 rounded-full" />
        <input type="password" className="form-input px-4 py-3 rounded-full" />
        <button type="submit" className="px-4 py-3 rounded-full bg-slate-300">
          Sign In
        </button>
      </form>
    </section>
  );
};

export default SignIn;
