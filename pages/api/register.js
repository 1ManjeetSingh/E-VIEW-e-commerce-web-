import { initMongoose } from '@/lib/mongoose';
import User from '@/model/User';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      await initMongoose();

      
      // Check if the user with the provided email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash the password before saving it
      const hashedPassword = await hash(password, 10); // Adjust the salt rounds as needed

      const newUser = new User({ name, email, password: hashedPassword,isAdmin:false });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error.message);
      res.status(500).json({ error: 'Error during registration' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
