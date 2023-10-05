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
    <div className="pt-6">
      <h2 className="text-2xl mb-6">Annonces récentes</h2>
      <section className= "flex flex-wrap pb-24">
        {ads.map((ad) => (
          <AdCard
            key={ad.title}
            ad={ad}
            link={`/ads/${ad.id}`}
          />
        ))}
      </section>
    </div>
  )
}

export default RecentAds;