'use server'
import { dbConnect } from "@/lib/dbConnect";

export async function getPaymentHistory(email) {
  try {
    const collection = await dbConnect("paymentHistory");
    const history = await collection
      .find({ userEmail: email }) 
      .sort({ payment_date: -1 })
      .toArray();

    return history.map(item => ({
      ...item,
      _id: item._id.toString(),
    }));
  } catch (error) {
    console.error("Get Payment History Error:", error);
    return [];
  }
}