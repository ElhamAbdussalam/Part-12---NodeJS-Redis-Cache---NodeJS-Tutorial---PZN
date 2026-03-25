import { prismaClient } from "../application/database.js";

const findAll = async () => {
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
