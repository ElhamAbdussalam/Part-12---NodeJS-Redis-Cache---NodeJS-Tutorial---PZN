import Redis from "ioredis";
import { prismaClient } from "../application/database.js";

const redis = new Redis({
  host: "localhost",
  port: 6379,
  db: 0,
});

const findAll = async () => {
  // apakah ada di redis atau tidak?
  const json = await redis.get("categories");

  // kalo ada, kita kembalikan langsung yang di redis
  if (json) return JSON.parse(json);

  // kalo gak ada, kita query ke database, lalu simpan di redis
  // query semua parent
  const parents = await prismaClient.category.findMany({
    where: {
      parent_id: null,
    },
    select: {
      id: true,
      name: true,
      children: true,
    },
  });

  // simpan ke redis
  await redis.setex("categories", 60 * 60, JSON.stringify(parents));

  // iterasi semua parent, tambahkan children
  // for (let parent of parents) {
  //   parent.children = await prismaClient.category.findMany({
  //     where: {
  //       parent_id: parent.id,
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //   });
  // }

  return parents;
};

export default {
  findAll,
};
