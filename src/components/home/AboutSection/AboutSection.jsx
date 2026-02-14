import { FaCheckCircle } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section className="py-20 bg-white  max-w-360 mx-auto">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1000" alt="Caregiving" className="rounded-2xl shadow-2xl" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Trusted Partner in Care</h2>
          <p className="text-gray-600 mb-6">
            At Care.xyz, we believe that finding a reliable caregiver should't be stressful. 
            Our platform connects families with verified professionals who prioritize safety and empathy.
          </p>
          <ul className="space-y-3">
            {['Verified Caregivers', 'Easy Online Booking', '24/7 Support', 'Affordable Pricing'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 font-medium">
                <FaCheckCircle className="text-primary" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;