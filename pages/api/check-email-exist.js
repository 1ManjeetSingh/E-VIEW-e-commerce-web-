import { initMongoose } from '@/lib/mongoose';
import User from '@/model/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

      await initMongoose();

      const user = await User.findOne({ email });
      console.log(user);
      
      // Check if the user exists
      if (user) {
        res.status(200).json({ message: 'E-mail Exist.' });
      }else{
        alert('E-mail not exist!,Please sign in.');
      }
  }

}
