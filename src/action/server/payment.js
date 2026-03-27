"use server";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (booking) => {
  let sessionUrl = "";

  try {
    const amount = Math.round(Number(booking.total_cost) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: booking.service_title,
              description: `Booking Date: ${booking.startDate}`, 
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        bookingId: booking._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/myBooking?success=true&bookingId=${booking._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/myBooking?canceled=true`,
    });

    sessionUrl = session.url;
  } catch (error) {
    console.error("Stripe Error:", error.message);
    return { error: error.message };
  }

  if (sessionUrl) {
    redirect(sessionUrl);
  }
};