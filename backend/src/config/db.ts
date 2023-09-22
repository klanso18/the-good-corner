import { DataSource } from "typeorm";

export default new DataSource({
  type: "sqlite",
  database: "good_corner.sqlite",
  entities: ["src/entities/*.ts"],
  synchronize: true,
  logging: true,
});
