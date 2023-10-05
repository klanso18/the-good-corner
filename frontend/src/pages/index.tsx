import Layout from "@/components/Layout";
import RecentAds from "@/components/RecentAds";
import Categories from "@/components/Categories";

export default function Home() {
  return (
    <Layout title="TGC - Accueil">
      <RecentAds />
    </Layout>
  );
}
