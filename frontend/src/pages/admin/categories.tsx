import Categories from "@/components/Categories";
import AdminCategoryRow from "@/components/admin/AdminCategoryRow";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/graphql/generated/schema";
import { Category } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminCategories() {
  const { data: catData, refetch: refetchCategories } = useGetCategoriesQuery();
  const categories = catData?.categories || [];
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON = Object.fromEntries(formData.entries());

    createCategory({
      variables: {
        data: formJSON as any,
      },
    })
      .then(() => {
        refetchCategories();
        form.reset();
      })
      .catch(console.error);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Êtes-vous certain de vouloir supprimer cette catégorie ?"))
      deleteCategory({
        variables: {
          categoryId: id,
        },
      })
        .then(() => {
          refetchCategories();
        })
        .catch(console.error);
    // axios
    //   .delete(`http://localhost:4000/categories/${id}`)
    //   .then(() => {
    //     setCategories((existingCategories) =>
    //       existingCategories.filter((c) => c.id !== id)
    //     );
    //   })
    //   .catch(console.error);
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
