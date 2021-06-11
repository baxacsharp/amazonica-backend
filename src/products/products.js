import express from "express";
import createError from "http-errors";
import { products, reviews, category } from "../db/db.js";
import sequelize from "../db/db.js";
// import ProductModel from "./schema.js"
// import q2m from "query-to-mongo"

const productRouter = express.Router();
productRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await products.findAll({ include: [reviews, category] });
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })

  .post(async (req, res, next) => {
    try {
      const data = await products.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });
productRouter.route("/sortByCategory").get(async (req, res, next) => {
  try {
    const product = await products.findAll({
      include: category,
      attributes: [
        "categoryId",
        [sequelize.fn("count", "id"), "total_products"],
      ],
      group: ["categoryId", "category.id"],
      order: [sequelize.col("total_products")],
    });
    res.send(product);
  } catch (error) {
    console.log(error);
    next(createError(500, "Oops something went wrong, please try again later"));
  }
});
productRouter.route("/:id/reviews").get(async (req, res, next) => {
  try {
    const data = await reviews.findAll({
      where: { productId: req.params.id },
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(createError(500, "Oops something went wrong, please try again later"));
  }
});

productRouter
  .route("/:id")

  .get(async (req, res, next) => {
    try {
      const data = await products.findByPk(req.params.id);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .put(async (req, res, next) => {
    try {
      const product = await products.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      });
      res.send(product);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .delete(async (req, res, next) => {
    try {
      const product = await products.destroy({ where: { id: req.params.id } });
      res.send("Deleted successfully");
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

//Get All Products
// productRouter.get("/", async (req, res, next) => {
//     try {
//         const query = q2m(req.query)
//         console.log(query)
//         const total = await ProductModel.countDocuments(query.criteria)
//         const limit = 25
//         const result = await ProductModel.find(query.criteria)
//             .sort(query.options.sort)
//             .skip(query.options.skip || 0)
//             .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)
//             .populate("reviews")
//         res.status(200).send({ links: query.links("/reviews", total), total, result })
//     } catch (error) {
//         next(error)
//     }
// })

// Get product with ID
// productRouter.get("/:id", async (req, res, next) => {
//     try {
//         const result = await ProductModel.findById(req.params.id).populate("reviews")
//         if (!result) createError(400, "id not found")
//         else res.status(200).send(result)
//     } catch (error) {
//         next(error)
//     }
// })

// // Post new product
// productRouter.post("/", async (req, res, next) => {
//     try {
//         const entry = req.body
//         const product = new ProductModel(entry)
//         const { _id } = await product.save()
//         res.status(201).send(_id)
//     } catch (error) {
//         next(error)
//     }
// })

// // Edit product with ID
// productRouter.put("/:id", async (req, res, next) => {
//     try {
//         const result = await ProductModel.findByIdAndUpdate(
//             req.params.id,
//             { ...req.body, updatedAt: new Date() },
//             { runValidators: true, new: true, useFindAndModify: false }
//         )
//         if (result) res.status(200).send(result)
//         else createError(400, "ID not found")
//     } catch (error) {
//         next(error)
//     }
// })

// // Delete product with ID
// productRouter.delete("/:id", async (req, res, next) => {
//     try {
//         const result = await ProductModel.findByIdAndRemove(req.params.id, { useFindAndModify: false })
//         if (result) res.status(200).send("Deleted")
//         else createError(400, "ID not found")
//     } catch (error) {
//         next(error)
//     }
// })

export default productRouter;
