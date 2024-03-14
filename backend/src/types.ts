import express from "express";
import { User } from "./entities/user";

export type Ad = {
  id: number;
  title: string;
  description: string;
  owner: string;
  price: number;
  picture: string;
  location: string;
  createdAt: string;
};

export interface ContextType {
  req: express.Request;
  res: express.Response;
  currentUser?: User;
}
