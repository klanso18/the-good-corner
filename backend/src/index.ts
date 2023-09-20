import express, { Request, Response } from "express";
import sqlite3 from 'sqlite3';
import { Ad } from './types';
const app = express();

app.use(express.json());

const port = 3000;

const db = new sqlite3.Database('good_corner.sqlite');

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
  db.all("SELECT * FROM ad", (err, rows) => {
    if (!err) return res.send(rows);
    console.log(err);
    res.sendStatus(500);
  });
});

app.post("/ad", (req: Request, res: Response) => {
  //WITHOUT DB :
  // const id = ads.length + 1;
  // const newAd = {
  //   ...req.body, 
  //   id,
  //   createdAt: new Date().toISOString(),
  // };
  // ads.push(newAd);

  //WITH DB :
  const newAd = {
    ...req.body, 
    createdAt: new Date().toISOString(),
  };
  db.run("INSERT INTO ad (title, owner, price, location) VALUES ($title, $owner, $price, $location)", 
    {
      $title: req.body.title,
      $owner: req.body.owner,
      $price: req.body.price,
      $location: req.body.location
    },
    function (this: any, err: any) {
      if (!err)
        return res.send({
          ...newAd,
          id: this.lastID,
        }
      );
    }
  );

  res.send(newAd);
});

app.delete("/ad/:id", (req: Request, res: Response) => {
  //WITHOUT DB :
  //const objectId = parseInt(req.params.id, 10);
  //ads = ads.filter((ad) => ad.id !== objectId);
  // res.send("The ad was deleted");

  //WITH DB :
  db.get("SELECT * FROM ad WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (!row) return res.sendStatus(404);
    db.run("DELETE FROM ad WHERE id = ?", [req.params.id], (err: any) => {
      if (!err) return res.sendStatus(204);
      console.log(err);
      res.sendStatus(500);
    })
  })
})

app.patch("/ad/:id", (req: Request, res: Response) => {
  //WITHOUT DB :
  // const objectId = parseInt(req.params.id);
  // const updatedObject = req.body;
  // ads = ads.map(ad => {
  //   if (ad.id === objectId) {
  //     return { ...ad, ...updatedObject };
  //   }
  //   return ad;
  // });
  // return res.status(200).json({ message: 'Objet mis à jour avec succès' });

  //WITH DB :
  db.get("SELECT * FROM ad WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (!row) return res.sendStatus(404);

    // creates a string with this shape : "title = $title, description = $description, ..."
    const setProps = Object.keys(req.body)
      .reduce<string[]>((acc, prop) => [...acc, `${prop} = $${prop}`], [])
      .join(", ");
    
    // creates an object with this shape : {$title: "title sent by client", "$description: " description sent by client", ...}
    const propsToUpdate = Object.keys(req.body).reduce(
      (acc, prop) => ({...acc, [`$${prop}`]: req.body[prop] }),
      {}
    );

    db.run(
      `UPDATE ad SET ${setProps} WHERE id = $id`, { 
        ...propsToUpdate, 
        $id: req.params.id 
      },
      (err: any) => {
        if (!err) return res.send({...row, ...req.body });
        console.log(err);
        res.sendStatus(500);
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
