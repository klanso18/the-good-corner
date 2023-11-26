export type Ad = {
  title: string;
  description: string;
  owner: string;
  price: number;
  location: string;
  picture: string;
  createdAt: string;
  id: number;
  category?: Category;
}

export type Category = {
  name: string;
  id: number;
}

export type Tag = {
  name: string;
  id: number;
}