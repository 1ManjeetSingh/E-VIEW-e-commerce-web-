import { initMongoose } from "../../lib/mongoose";
import Product from "@/model/product";


export default async function handle(req, res) {
  if (req.method === "POST") {
    const { name, category, price, description, imagePath } = req.body;

    try {
      await initMongoose();

      const product = await Product.findOne({ name });

      if (product) {
        product.price = price;
        product.description = description;
        product.picture = imagePath;
        product.category = category;
        await product.save();

        return res.status(200).json({
          message: "Price Changed Successfully",
        });
      } else {
        const newProduct = new Product({
          name: name,
          category: category,
          price: price,
          description: description,
          picture: imagePath,
        });

        await newProduct.save();

        return res.status(200).json({
          message: "Product Added Successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error in Adding/Updating Item" });
    }
  } else {
    return res.status(500).json({ message: "Method Not Allowed" });
  }
}
