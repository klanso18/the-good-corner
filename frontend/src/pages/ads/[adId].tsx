import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Ad } from "@/types";

export default function AdDetails() {
  const router = useRouter();
  const { adId } = router.query;

  const [ad, setAd] = useState<Ad>();

  useEffect(() => {
    if (typeof ad === "undefined")
      axios
        .get<Ad>(`http://localhost:4000/ads/${adId}`)
        .then((res) => setAd(res.data))
        .catch(console.error);
  }, [adId]);

  const handleDelete = () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?");

    if (confirmDelete) {
      axios
      .delete(`http://localhost:4000/ad/${adId}`)
      .then(() => {
        alert("Annonce supprimée !");
        router.push("/");
      })
      .catch(console.error);
    }
  };


  return (
    <Layout title={`Annonce ${adId}`}>
      {typeof ad === "undefined" ? (
        "Chargement..."
      ) : (
        <div>
          <h1>{ad.title}</h1>
          <p>postée par {ad.owner}</p>
          <p>lieu : {ad.location}</p>
          <img src={ad.picture} alt={ad.title} />
          <p>{ad.description}</p>
          <button className="btn" onClick={handleDelete}>Supprimer l'annonce</button>
        </div>
      )}
    </Layout>
  );
}
