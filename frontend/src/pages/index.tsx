import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import RecentAds from "@/components/RecentAds";
import Categories from "@/components/Categories";

export default function Home() {
  return (
    <Layout title="TGC - Accueil">
      <RecentAds />
      <Categories />
    </Layout>
  );
}
