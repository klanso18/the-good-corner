import db from "./db";
import { Ad } from "./entities/ad";
import { Category } from "./entities/category";
import { Tag } from "./entities/tag";

async function clearDB() {
  const runner = db.createQueryRunner();
  await runner.query("SET session_replication_role = 'replica'");
  await Promise.all(
    db.entityMetadatas.map(async (entity) =>
      runner.query(`ALTER TABLE ${entity.tableName} DISABLE TRIGGER ALL`)
    )
  );
  await Promise.all(
    db.entityMetadatas.map(async (entity) =>
      runner.query(`DROP TABLE IF EXISTS ${entity.tableName} CASCADE`)
    )
  );
  await runner.query("SET session_replication_role = 'origin'");
  await db.synchronize();
}


async function main() {
  await db.initialize();
  await clearDB();

  const ad1 = Ad.create({
    title: "Macbook pro M2",
    description: "Description of the computer...",
    owner: "Kevin",
    price: 1500,
    picture:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-config-20220606?wid=820&hei=498&fmt=jpeg&qlt=90&.v=1654122880566",
    location: "Bordeaux",
  });

  const ad2 = Ad.create({
    title: "Nintendo Switch",
    description: "Description of the Nintendo...",
    owner: "Paul",
    price: 150,
    picture:
      "https://m.media-amazon.com/images/I/51TJ3ERPBwL._AC_UF1000,1000_QL80_.jpg",
    location: "Lyon",
  });

  const ad3 = Ad.create({
    title: "Renault twingo",
    description: "Description of the car...",
    owner: "Mike",
    price: 2000,
    picture:
      "https://i.gaw.to/content/photos/42/03/420392-essai-du-grenier-renault-twingo-2001.jpg?1024x640",
    location: "Marseille",
  });

  const cat1 = Category.create({ name: "multimédia" });
  const cat2 = Category.create({ name: "voitures" });

  const tag1 = Tag.create({ name: "#gaming" });
  const tag2 = Tag.create({ name: "#voiture" });
  const tag3 = Tag.create({ name: "#console" });


  ad1.category = cat1;
  ad2.category = cat1;
  ad3.category = cat2;
  ad1.tags = [tag1];
  ad2.tags = [tag1, tag3];
  ad3.tags = [tag2];
  
  await ad1.save();
  await ad2.save();
  await ad3.save();
}

main();