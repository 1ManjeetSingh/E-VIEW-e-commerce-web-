import { initMongoose } from "@/lib/mongoose";
import User from "@/model/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, _id, sign } = req.body;

    try {
      await initMongoose();

      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (user) {
        if (sign === "-") {
          const indexToRemove = user.cart.indexOf(_id);
          user.cart.splice(indexToRemove, 1);
          await user.save();
        } else {
          // Add the _id to the cart
          user.cart.push(_id);
          await user.save();
        }
      } else {
        // If the user doesn't exist, create a new cart for them
        const newCart = [{ _id }];
        const newCartInstance = new Cart({ email, cart: newCart });
        await newCartInstance.save();
      }

      res.status(200).json( user.cart );
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
