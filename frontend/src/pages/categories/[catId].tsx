import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Category } from "@/types";

export default function CatDetails() {
  const router = useRouter();
  const { catId } = router.query;

  const [cat, setCat] = useState<Category>();

  useEffect(() => {
    if (typeof cat === "undefined")
      axios
        .get<Category>(`http://localhost:4000/categories/${catId}`)
        .then((res) => setCat(res.data))
        .catch(console.error);
  }, [catId]);

  const handleDelete = () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?");

    if (confirmDelete) {
      axios
      .delete(`http://localhost:4000/categories/${catId}`)
      .then(() => {
        alert("Catégorie supprimée !");
        router.push("/");
      })
      .catch(console.error);
    }
  };


  return (
    <Layout title={`Catégorie ${catId}`}>
      {typeof cat === "undefined" ? (
        "Chargement..."
      ) : (
        <div>
          <h1>{cat.name}</h1>
          <button className="button" onClick={handleDelete}>Supprimer la catégorie</button>
        </div>
      )}
    </Layout>
  );
}