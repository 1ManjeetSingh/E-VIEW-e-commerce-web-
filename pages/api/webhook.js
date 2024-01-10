import { initMongoose } from "@/lib/mongoose";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import {buffer} from 'micro';
import User from "@/model/User";

// localhost:3000/api/webhook

export default async function handler(req, res){
    await initMongoose();
    const signingSecret = 'whsec_44dd094754060f9884ae4415a105a778a5114911fd234c0dfa782e7214d66bba';
    const payload = await buffer(req);
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(payload, signature, signingSecret);

    if(event?.type === 'checkout.session.completed'){
        console.log(event);
        const paymentStatus = event.data?.object?.payment_status;
        const email = event.data?.object?.customer_email;
        const metadata = event.data?.object?.metadata;
        if(metadata?.orderId && paymentStatus==='paid'){
            const parsedOrders = JSON.parse(metadata.orderId);
            // const parsedDate = JSON.parse(metadata.Date);
            const user = await User.findOne({email});
            if (user) {
                let i = 0;
                for (i; i < parsedOrders.length; i++) {
                  user.orders.push(parsedOrders[i]);
                //   user.orders.push([parsedOrders[i],parsedDate]);
                }
            if(JSON.stringify(user.cart) === JSON.stringify(parsedOrders)){
                user.cart = [];
            }
              user.save();
              res.status(200).json({ message: "Orders updated successfully" });
              }else{
                res.status(404).json({ error: "User not found" });
              }
        }
        else{
            res.status(500).json({error : "payment failed!"});
        }
    }
}


export const config = {
    api: {
        bodyParser: false,
    }
}