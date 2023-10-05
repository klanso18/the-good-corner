import Categories from "@/components/Categories";
import AdminCategoryRow from "@/components/admin/AdminCategoryRow";
import AdminLayout from "@/components/admin/AdminLayout";
import { Category } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get<Category[]>("http://localhost:4000/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const json = Object.fromEntries(data.entries());

    axios
      .post("http://localhost:4000/categories", json)
      .then((res) => {
        setCategories((existingCategories) => [
          res.data,
          ...existingCategories,
        ]);
        form.reset();
      })
      .catch(console.error);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Êtes-vous certain de vouloir supprimer cette catégorie ?"))
      axios
        .delete(`http://localhost:4000/categories/${id}`)
        .then(() => {
          setCategories((existingCategories) =>
            existingCategories.filter((c) => c.id !== id)
          );
        })
        .catch(console.error);
  };

  return (
    <AdminLayout title="Gestion des catégories">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Nouvelle catégorie :
          <input type="text" name="name" id="name" className="input" required />
        </label>
        <button className="btn">Enregistrer</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <AdminCategoryRow
              category={cat}
              key={cat.id}
              handleDeleteCategory={handleDeleteCategory}
            />
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
