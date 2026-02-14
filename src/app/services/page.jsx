import { GetServices } from '@/action/server/services';
import ServicesPage from '@/components/services/ServicesPage';
import React from 'react';

const Services = async () => {
    const services = await GetServices()
    
    return (
        <div>
           <ServicesPage services={services}></ServicesPage>
        </div>
    );
};

export default Services;