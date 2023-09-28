import Layout from "@/components/Layout";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Category } from "@/types";
import { Ad } from "@/types";

export default function UpdateAd() {
  const router = useRouter();
  const { adId } = router.query;

  const [categories, setCategories] = useState<Category[]>([]);
  const [ad, setAd] = useState<Ad>();

  useEffect(() => {
    if (router.isReady) {
      axios
      .get<Category[]>("http://localhost:4000/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
    axios
      .get<Ad>(`http://localhost:4000/ads/${adId}`)
      .then((res) => setAd(res.data))
      .catch(console.error);
    }
  }, [adId]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    formJSON.price = parseFloat(formJSON.price);
    axios
      .patch(`http://localhost:4000/ad/${adId}`, formJSON)
      .then(() => {
        alert("Annonce mise à jour !");
        router.push("/");
      })
      .catch(console.error);
  };

  return (
    <Layout title={`Annonce ${ad?.title}`}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Titre :
          <input type="text" name="title" id="name" defaultValue={ad?.title} required />
        </label>

        <label htmlFor="picture">Image :</label>
        <input type="text" name="picture" id="picture" defaultValue={ad?.picture} required />

        <label htmlFor="location">Localisation :</label>
        <input type="text" name="location" id="location" defaultValue={ad?.location} required />

        <label htmlFor="owner">Auteur :</label>
        <input type="text" name="owner" id="owner" defaultValue={ad?.owner} required />

        <label htmlFor="description">Description : </label>
        <textarea name="description" id="description" defaultValue={ad?.description} required></textarea>

        <label htmlFor="price">Prix :</label>
        <input type="number" name="price" id="price" min={0} defaultValue={ad?.price} />

        <label htmlFor="category">Catégorie :</label>
        <select name="category" id="category" required>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button>Envoyer</button>
      </form>
    </Layout>
  );
}