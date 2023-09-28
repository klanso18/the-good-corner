import Layout from "@/components/Layout";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Category } from "@/types";

export default function NewAd() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get<Category[]>("http://localhost:4000/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    formJSON.price = parseFloat(formJSON.price);
    axios
      .post("http://localhost:4000/ad", formJSON)
      .then(() => {
        alert("Merci !");
      })
      .catch(console.error);
  };

  return (
    <Layout title="Création d'une annonce">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Titre :
          <input type="text" name="title" id="name" required />
        </label>

        <label htmlFor="picture">Image :</label>
        <input type="text" name="picture" id="picture" required />

        <label htmlFor="location">Localisation :</label>
        <input type="text" name="location" id="location" required />

        <label htmlFor="owner">Auteur :</label>
        <input type="text" name="owner" id="owner" required />

        <label htmlFor="description">Description : </label>
        <textarea name="description" id="description" required></textarea>

        <label htmlFor="price">Prix :</label>
        <input type="number" name="price" id="price" min={0} />

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
