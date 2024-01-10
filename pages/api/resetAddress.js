import { initMongoose } from "@/lib/mongoose";
import User from "@/model/User";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, address } = req.body;

    try {
      await initMongoose();
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.address = address;
      await user.save();

      res.status(201).json({ message: 'Address updated successfully' });
    } catch (error) {
      console.error('Error during Address update:', error.message);
      res.status(500).json({ error: 'Error during Address update' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
