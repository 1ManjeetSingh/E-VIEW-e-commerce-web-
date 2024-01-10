import { initMongoose } from "@/lib/mongoose";
import Product from "@/model/product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    await initMongoose();

    if (req.method !== 'POST') {
      res.status(400).json({ error: 'Invalid request method' });
      return;
    }

    const { email } = req.query;
    const productsIds = req.body.products.split(',');
    const uniqueIds = [...new Set(productsIds)];
    const products = await Product.find({ _id: { $in: uniqueIds } }).exec();
    let line_items = [];

    const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

    for (let productId of uniqueIds) {
      const quantity = productsIds.filter(id => id === productId).length;
      const product = products.find(p => p._id.toString() === productId);

      if (product) {
        line_items.push({
          quantity,
          price_data: {
            currency: 'INR',
            product_data: { name: product.name },
            unit_amount: product.price * 100,
          },
        });
      }
    }

    const stringyProductsIds = JSON.stringify(productsIds)

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      customer_email: email,
      currency: "INR",
      shipping_address_collection: {
        allowed_countries: ['IN', 'US'],
      },
      success_url: `${req.headers.origin}/homepage?success=${true}`,
      cancel_url: `${req.headers.origin}/homepage?cancelled=${true}`,
      metadata: {orderId:stringyProductsIds,Date:formattedDate},
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Error during API call:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
