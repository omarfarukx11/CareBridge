import React from 'react';

const Faq = () => {
  const faqData = [
    {
      question: "How do I know the caretakers are reliable?",
      answer: "Safety is our priority. Every caretaker on Care.xyz undergoes a rigorous background check, including NID verification and previous work reference checks."
    },
    {
      question: "What types of care services do you offer?",
      answer: "We currently provide specialized services for Baby Sitting, Elderly Care, and Sick People Support (nursing/assistance at home)."
    },
    {
      question: "How is the total cost calculated?",
      answer: "The cost is dynamically calculated based on the service type and the duration (hours or days) you select during the booking process."
    },
    {
      question: "Can I book a service for a specific location?",
      answer: "Yes! Our platform allows you to select your Division, District, City, and Area to ensure we find a caretaker available in your specific neighborhood."
    },
    {
      question: "Is there a minimum booking duration?",
      answer: "Typically, the minimum booking is 4 hours for hourly services or 1 day for full-day care, depending on the specific service category."
    },
    {
      question: "How can I track my booking status?",
      answer: "Once logged in, you can visit the 'My Bookings' page to see if your request is Pending, Confirmed, or Completed."
    },
    {
      question: "Can I cancel a booking after it is confirmed?",
      answer: "Yes, you can cancel from your dashboard. However, please note that cancellations made less than 24 hours before the start time may incur a small fee."
    },
    {
      question: "Do I need to pay upfront?",
      answer: "Currently, we support booking confirmation first. If you choose to use our Stripe integration (optional), you can pay securely online; otherwise, payment terms are handled per service agreement."
    },
    {
      question: "What should I do if a caretaker doesn't show up?",
      answer: "Please contact our 24/7 support line immediately. We will either arrange an instant replacement or provide a full refund if payment was made."
    },
    {
      question: "Will I receive an invoice for my booking?",
      answer: "Absolutely! Once your booking is confirmed/completed, an automated email invoice will be sent to your registered email address."
    }
  ];

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-base-content/70">Everything you need to know about our caregiving services.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className="collapse collapse-plus border border-base-300 rounded-xl"
            >
              <input type="checkbox" name="my-accordion-3" /> 
              <div className="collapse-title text-xl font-medium text-primary">
                {faq.question}
              </div>
              <div className="collapse-content"> 
                <p className="text-base-content/80 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;