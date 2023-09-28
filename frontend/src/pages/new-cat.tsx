import Layout from "@/components/Layout";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Category } from "@/types";

export default function NewCat() {

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    axios
      .post("http://localhost:4000/category", formJSON)
      .then(() => {
        alert("Nouvelle catégorie créée !");
      })
      .catch(console.error);
  };


  return (
    <Layout title="Création d'une catégorie">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Nom :
          <input type="text" name="name" id="name" required />
        </label>
        <button>Créer</button>
      </form>
    </Layout>
  );
}
