import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "./AdCard";
import { Ad } from "@/types";

const RecentAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    axios
      .get<Ad[]>("http://localhost:4000/ads")
      .then((res) => {
        setAds(res.data);
      })
      .catch(console.error);
  }, []);

  const [total, setTotal] = useState(0);
  
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
    <h2>Annonces récentes</h2>
    <p>Prix total : {total} €</p>
    <button className="button" onClick={() => setTotal(0)}>Reset</button>
    <section className= "recent-ads">
      {ads.map((ad) => (
        <AdCard
          onAddPrice={(price) => setTotal((oldTotal) => oldTotal + price)}
          key={ad.title}
          ad={ad}
          link={`/ads/${ad.id}`}
        />
      ))}
    </section>
    </>
  )
}

export default RecentAds;