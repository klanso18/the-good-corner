import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Ad } from "@/types";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  useGetAdByIdQuery,
  useDeleteAdMutation,
} from "@/graphql/generated/schema";
import Image from "next/image";

export type AdDetail = {
  id: number;
  title: string;
  price: number;
  picture: string;
};

export default function AdDetails() {
  const router = useRouter();
  const [deleteAd] = useDeleteAdMutation();
  const { adId } = router.query;

  const { data } = useGetAdByIdQuery({
    variables: { adId: typeof adId === "string" ? parseInt(adId, 10) : 0 },
    skip: typeof adId === "undefined",
  });

  // useEffect(() => {
  //   refetch();
  // }, []);

  const ad = data?.getAdById;

  // const [ad, setAd] = useState<Ad>();

  // useEffect(() => {
  //   if (typeof ad === "undefined")
  //     axios
  //       .get<Ad>(`http://localhost:4000/ads/${adId}`)
  //       .then((res) => setAd(res.data))
  //       .catch(console.error);
  // }, [adId]);

  // const handleDelete = () => {
  //   const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?");

  //   if (confirmDelete) {
  //     axios
  //     .delete(`http://localhost:4000/ad/${adId}`)
  //     .then(() => {
  //       alert("Annonce supprimée !");
  //       router.push("/");
  //     })
  //     .catch(console.error);
  //   }
  // };

  return (
    <Layout title={ad?.title ? ad.title + " - TGC" : "The Good Corner"}>
      <div className="pt-12 pb-12">
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          {typeof ad === "undefined" ? (
            "Chargement..."
          ) : (
            <div className="">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl">{ad.title}</h1>
                <p className="text-2xl">{ad.price} €</p>
              </div>

              <Image src={ad.picture} alt={ad.title} className="mt-6 mb-6" />
              <p className="mt-6 mb-6">{ad.description}</p>
              <div className="flex justify-between mb-6">
                <div className="flex items-center mt-3">
                  <UserCircleIcon width={24} height={24} className="mr-2" />{" "}
                  {ad.owner}
                </div>

                <div className="flex items-center mt-2 ">
                  <MapPinIcon width={24} height={24} className="mr-2" />{" "}
                  {ad.location}
                </div>
              </div>

              <div className="flex justify-between border-t pt-2 items-center ">
                <Link
                  href={`/ads/update/${ad.id}`}
                  className="flex items-center mt-3 cursor-pointer"
                >
                  <PencilSquareIcon width={24} height={24} className="mr-2" />
                  Editer l&apos;annonce
                </Link>

                <div
                  className="flex items-center mt-3 cursor-pointer"
                  onClick={() => {
                    if (
                      confirm(
                        "Etes-vous certain.e de vouloir supprimer cette annonce ?"
                      )
                    )
                      deleteAd({ variables: { adId: ad.id } })
                        .then(() => {
                          router.push("/");
                        })
                        .catch(console.error);
                  }}
                >
                  <TrashIcon width={24} height={24} className="mr-2" />
                  Supprimer l&apos;annonce
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
