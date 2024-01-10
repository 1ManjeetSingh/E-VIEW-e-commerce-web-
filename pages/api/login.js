import { initMongoose } from '@/lib/mongoose';
import User from '@/model/User';
import { compare } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
  
    try {
      await initMongoose();

      // Find the user by email
      const user = await User.findOne({ email });

      // Check if the user exists
      if (user) {
        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await compare(password, user.password);

        if (passwordMatch) {
          // Passwords match, login successful
         return res.json({
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
              address: user.address,
              picture: user.picture,
              cart: user.cart,
              orders: user.orders,
          });
        } else {
          // Passwords do not match
          res.status(401).json({ error: 'Invalid email or password' });
        }
      } else {
        // User not found
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Error during login' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
