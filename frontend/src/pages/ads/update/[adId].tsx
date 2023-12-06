import Layout from "@/components/Layout";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import {
  useUpdateAdMutation,
  useGetCategoriesQuery,
  useGetAdByIdQuery,
} from "@/graphql/generated/schema";
import UploadFile from "@/components/UploadFile";

export default function UpdateAd() {
  const router = useRouter();
  const [updateAd] = useUpdateAdMutation();
  const { adId } = router.query;

  const { data: adData } = useGetAdByIdQuery({
    variables: { adId: typeof adId === "string" ? parseInt(adId, 10) : 0 },
    skip: !router.isReady,
  });
  const ad = adData?.getAdById;

  const { data: catData } = useGetCategoriesQuery();
  const categories = catData?.categories || [];
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    ad?.picture || ""
  );
  const [error, setError] = useState<string>("");
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    formJSON.price = parseFloat(formJSON.price);
    formJSON.category = { id: parseInt(formJSON.category, 10) };
    updateAd({
      variables: {
        adId: typeof adId === "string" ? parseInt(adId, 10) : 0,
        data: formJSON as any,
      },
    })
      .then((res) => router.push(`/ads/${res.data?.updateAd.id}`))
      .catch(console.error);
  };

  const handleImageUrlChange = (url: string) => {
    setImagePreviewUrl(url);
    setError("");
    setIsValidUrl(true);
  };

  const handleImageError = () => {
    setError("Invalid image URL");
    setIsValidUrl(false);
  };

  return (
    <Layout title={ad?.title ? ad.title + " - TGC" : "The Good Corner"}>
      <h1 className="pt-6 pb-6 text-2xl">Editer une annonce</h1>
      {ad && (
        <form onSubmit={handleSubmit} className="pb-12">
          <div className="flex flex-wrap gap-6 mb-3">
            <div className="form-control w-full max-w-sm">
              <label className="label" htmlFor="title">
                <span className="label-text">Titre</span>
              </label>
              <input
                defaultValue={ad?.title}
                required
                type="text"
                name="title"
                id="title"
                placeholder="Zelda : Occarina of time"
                className="input input-bordered w-full max-w-sm"
              />
            </div>
            <div className="form-control w-full max-w-sm">
              <label className="label" htmlFor="picture">
                <span className="label-text">Image</span>
              </label>
              <UploadFile
                imageUrl={imagePreviewUrl}
                onChange={handleImageUrlChange}
                onImageError={handleImageError}
              />
            </div>
            <div className="w-full">
              {error && <div className="error-message">{error}</div>}
              {isValidUrl && !error && imagePreviewUrl && (
                <div className="image-preview">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    onError={handleImageError}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-3">
            <div className="form-control w-full max-w-sm">
              <label className="label" htmlFor="location">
                <span className="label-text">Localisation</span>
              </label>
              <input
                defaultValue={ad?.location}
                type="text"
                name="location"
                id="location"
                required
                placeholder="Paris"
                className="input input-bordered w-full max-w-sm"
              />
            </div>

            <div className="form-control w-full max-w-sm">
              <label className="label" htmlFor="owner">
                <span className="label-text">Auteur</span>
              </label>
              <input
                type="text"
                name="owner"
                defaultValue={ad?.owner}
                id="owner"
                required
                placeholder="Link"
                className="input input-bordered w-full max-w-sm"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <textarea
              rows={5}
              defaultValue={ad.description}
              className="textarea textarea-bordered"
              placeholder="The Legend of Zelda: Ocarina of Time est un jeu vidéo d'action-aventure développé par Nintendo EAD et édité par Nintendo sur Nintendo 64. Ocarina of Time raconte l'histoire de Link, un jeune garçon vivant dans un village perdu dans la forêt, qui parcourt le royaume d'Hyrule pour empêcher Ganondorf d'obtenir la Triforce, une relique sacrée partagée en trois : le courage (Link), la sagesse (Zelda) et la force (Ganondorf)."
              name="description"
              id="description"
              required
            ></textarea>
          </div>

          <div className="flex flex-wrap gap-6 mb-3 mt-6">
            <div className="form-control w-full max-w-sm">
              <label className="label" htmlFor="price">
                <span className="label-text">Prix</span>
              </label>
              <input
                required
                type="number"
                name="price"
                id="price"
                defaultValue={ad.price}
                min={0}
                placeholder="30"
                className="input input-bordered w-full max-w-sm"
              />
            </div>

            <div className="form-control w-full max-w-sm">
              <label className="label" htmlFor="category">
                <span className="label-text">Catégorie</span>
              </label>
              <select
                className="select select-bordered"
                id="category"
                name="category"
                required
                defaultValue={ad.category?.id}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="btn-block">
            <button className="button save-button text-white mt-12">
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
}
