import Head from "next/head";
import { ReactNode } from "react";
import AdminHeader from "./AdminHeader";

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-[100vh]">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
}
