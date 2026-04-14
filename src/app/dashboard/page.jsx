"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import MyBooking from './myBooking/page';
import ProfessionalWorkPage from '@/components/dashboardComponent/professionalWork/ProfessionalWorkPage';

const DashboardPage = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex justify-center py-24">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    const role = session?.user?.role || 'user';

    return (
        <div>
            {role === 'professional' ? <ProfessionalWorkPage /> : <MyBooking />}
        </div>
    );
};

export default DashboardPage;