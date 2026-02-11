import AboutSection from "@/components/home/AboutSection/AboutSection";
import Banner from "@/components/home/banner/Banner";
import SuccessMetrics from "@/components/home/SuccessMetrics/SuccessMetrics";
import Testimonials from "@/components/home/Testimonials/Testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <div >
      <Banner></Banner>
      <AboutSection></AboutSection>
      <SuccessMetrics></SuccessMetrics>
      <Testimonials></Testimonials>
    </div>
  );
}
