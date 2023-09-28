import Layout from "@/components/Layout";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Category } from "@/types";
import { Ad } from "@/types";

export default function UpdateAd() {
  const router = useRouter();
  const { catId } = router.query;

  const [cat, setCat] = useState<Category>();

  useEffect(() => {
    if (router.isReady) {
    axios
      .get<Category>(`http://localhost:4000/categories/${catId}`)
      .then((res) => setCat(res.data))
      .catch(console.error);
    }
  }, [catId]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    axios
      .patch(`http://localhost:4000/categories/${catId}`, formJSON)
      .then(() => {
        alert("Catégorie mise à jour !");
        router.push("/");
      })
      .catch(console.error);
  };

  return (
    <Layout title={`Catégorie ${cat?.name}`}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Titre :
          <input type="text" name="name" id="name" defaultValue={cat?.name} required />
        </label>
        <button>Envoyer</button>
      </form>
    </Layout>
  );
}