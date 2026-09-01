import type { JSX } from "react";
import type { Metadata } from "next";

import { getSession } from "@/server/helpers/get_session.helper";

import Link from "@/components/Link/Link";
import LogoutButton from "@/components/LogoutButton/LogoutButton";

import "@/app/home.css";

export const metadata: Metadata = { title: "Home" };

async function HomePage(): Promise<JSX.Element> {
  const session = await getSession();
  const isLoggedIn = session !== null;

  return (
    <main className="home-page">
      <h1 className="title">Next.js 16 MongoDB Boilerplate</h1>
      {isLoggedIn ? (
        <>
          <nav className="links">
            <Link href="/about">About</Link>
            <Link href="/users">Users</Link>
            <Link href="/products">Products</Link>
            <Link href="/context-demo">Context Demo</Link>
          </nav>
          <div className="auth-actions">
            <LogoutButton />
          </div>
        </>
      ) : (
        <>
          <nav className="links">
            <span className="nav-link-disabled">About</span>
            <span className="nav-link-disabled">Users</span>
            <span className="nav-link-disabled">Products</span>
            <span className="nav-link-disabled">Context Demo</span>
          </nav>
          <div className="auth-actions">
            <Link href="/login">Login to access</Link>
          </div>
        </>
      )}
    </main>
  );
}

export default HomePage;
