import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "./AdCard";
import { Category } from "@/types";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get<Category[]>("http://localhost:4000/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch(console.error);
  }, []);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await axios.get("http://localhost:4000/ads");
  //       console.log(result);
  //     } catch (err) {
  //       console.log("error", err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
    <h2>Catégories</h2>
    <section className= "recent-ads">
      {categories.map((cat) => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </section>
    </>
  )
}

export default Categories;