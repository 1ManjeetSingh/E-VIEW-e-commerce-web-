import { initMongoose } from "../../lib/mongoose";
import Product from "@/model/product";

export async function findAllProducts() {
  return Product.find().maxTimeMS(30000).exec();
}

export default async function handle(req, res) {
  await initMongoose();
  const { ids } = req.query;
  if (ids) {
    const idsArray = ids.split(',');
    res.json(
      await Product.find({
        '_id': { $in: idsArray }
      }).exec()
    );
  } else {
    res.json(await findAllProducts());
  }
}
