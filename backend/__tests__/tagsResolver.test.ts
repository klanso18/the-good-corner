import { execute } from "../jest.setup";
import { Tag } from "../src/entities/tag";
import getTags from "./operations/getTags";

describe("TagsResolver", () => {
  it("can read tags", async () => {
    await Tag.create({ name: "tag1" }).save();
    await Tag.create({ name: "tag3" }).save();
    expect(await execute(getTags)).toMatchInlineSnapshot(`
{
  "data": {
    "tags": [
      {
        "id": 2,
        "name": "tag3",
      },
      {
        "id": 1,
        "name": "tag1",
      },
    ],
  },
}
`);
  });
});
