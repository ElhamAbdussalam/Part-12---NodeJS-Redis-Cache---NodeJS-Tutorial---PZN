import categoryService from "../service/category-service.js";

const findAll = async (req, res, next) => {
  try {
    const result = await categoryService.findAll();

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  findAll,
};
