import express, { Request, Response } from "express";
import { Ad } from './types';
const app = express();

app.use(express.json());

const port = 3000;

let ads: Ad[] = [
  {
    id: 1,
    title: "Bike to sell",
    description:
      "My bike is blue, working fine. I'm selling it because I've got a new one",
    owner: "bike.seller@gmail.com",
    price: 100,
    picture:
      "https://images.lecho.be/view?iid=dc:113129565&context=ONLINE&ratio=16/9&width=640&u=1508242455000",
    location: "Paris",
    createdAt: "2023-09-05T10:13:14.755Z",
  },
  {
    id: 2,
    title: "Car to sell",
    description:
      "My car is blue, working fine. I'm selling it because I've got a new one",
    owner: "car.seller@gmail.com",
    price: 10000,
    picture:
      "https://www.automobile-magazine.fr/asset/cms/34973/config/28294/apres-plusieurs-prototypes-la-bollore-bluecar-a-fini-par-devoiler-sa-version-definitive.jpg",
    location: "Paris",
    createdAt: "2023-10-05T10:14:15.922Z",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/ads", (req: Request, res: Response) => {
  res.send(ads);
})

app.post("/ad", (req: Request, res: Response) => {
  const id = ads.length + 1;
  const newAd = {
    ...req.body, 
    id,
    createdAt: new Date().toISOString(),
  };

  ads.push(newAd);
  res.send("Request received, check the backend terminal");
});

app.delete("/ad/:id", (req: Request, res: Response) => {
  const objectId = parseInt(req.params.id, 10);
  ads = ads.filter((ad) => ad.id !== objectId);
  res.send("The ad was deleted");
})

app.put("/ad/:id", (req: Request, res: Response) => {
  const objectId = parseInt(req.params.id);
  const updatedObject = req.body;
  ads = ads.map(ad => {
    if (ad.id === objectId) {
      return { ...ad, ...updatedObject };
    }
    return ad;
  });
  return res.status(200).json({ message: 'Objet mis à jour avec succès' });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
