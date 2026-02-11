
import { GetSingleServices } from '@/action/server/services';
import ServiceDetailsPage from '@/components/services/ServiceDetailsPage';
import React from 'react';

const ServicesDetails = async ({ params }) => {
    const {id } = await params;
    const service = await GetSingleServices(id)   

    return ( 
        <div className='bg-red-700'>
            <ServiceDetailsPage service={service} ></ServiceDetailsPage>
        </div>
    );
};

export default ServicesDetails;