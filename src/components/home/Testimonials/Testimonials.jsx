const Testimonials = () => {
  const reviews = [
    { name: "Rahim Ahmed", text: "Care.xyz found me a nurse in 2 hours for my father. Highly recommended!", rating: 5 },
    { name: "Sara Khan", text: "Safe and secure babysitting service. I feel at peace at work.", rating: 5 }
  ];

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">What Families Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-md italic">
              <div className="rating rating-sm mb-4">
                {[...Array(5)].map((_, j) => <input key={j} type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />)}
              </div>
              <p className="text-lg text-gray-700">"{rev.text}"</p>
              <h4 className="mt-4 font-bold not-italic text-primary">- {rev.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;