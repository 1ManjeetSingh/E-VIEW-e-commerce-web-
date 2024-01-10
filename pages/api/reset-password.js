import { initMongoose } from '@/lib/mongoose';
import User from '@/model/User';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      await initMongoose();
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found',email });
      }
      const hashedPassword = await hash(password, 10);
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
      res.status(201).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error during password update:', error.message);
      res.status(500).json({ error: 'Error during password update' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
