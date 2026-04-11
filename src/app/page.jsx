import { GetServices } from "@/action/server/services";
import AboutSection from "@/components/home/AboutSection/AboutSection";
import Banner from "@/components/home/banner/Banner";
import Faq from "@/components/home/faq/Faq";
import SuccessMetrics from "@/components/home/SuccessMetrics/SuccessMetrics";
import Testimonials from "@/components/home/Testimonials/Testimonials";
import TopServicesPage from "@/components/home/topServices/TopServicesPage";
import WhyChooseUs from "@/components/home/whyChoseUs/WhyChoseUs";


export default async function Home() {
  
  const services = await GetServices()

  return (
    <div >
      <Banner></Banner>
      <AboutSection></AboutSection>
      <TopServicesPage services={services}></TopServicesPage>
      <SuccessMetrics></SuccessMetrics>
      <WhyChooseUs></WhyChooseUs>
      <Testimonials></Testimonials>
      <Faq></Faq>
    </div>
  );
}
