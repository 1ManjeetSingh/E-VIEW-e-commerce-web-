import { initMongoose } from "@/lib/mongoose";
import User from "@/model/User";

export default async function handler(req,res) {
  if (req.method === "POST") {
    const { email,orderID } = req.body;
    
    try {
      await initMongoose();

      const user = await User.findOne({ email });

      if (user) {
        let i = 0;
        for (i; i < orderID.length; i++) {
          user.orders.push(orderID[i]);
        }
      
      user.save();
      res.status(200).json({ message: "Orders updated successfully" });
      }else{
        res.status(404).json({ error: "User not found" });
      }

    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
