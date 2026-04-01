// action/server/adminStats.js
"use server";
import { dbConnect } from "@/lib/dbConnect";

export async function getAdminDashboardStats() {
    try {
        const collection = await dbConnect("bookings");
        const usersCol = await dbConnect("users");

        const allBookings = await collection.find({}).toArray();
        const totalUsers = await usersCol.countDocuments();

        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const calculateRevenue = (bookings) => 
            bookings.filter(b => b.payment_status === "Paid")
                    .reduce((sum, b) => sum + (Number(b.total_cost) || 0), 0);

        // 1. Time-based Revenue
        const stats = {
            today: calculateRevenue(allBookings.filter(b => new Date(b.order_date) >= startOfToday)),
            week: calculateRevenue(allBookings.filter(b => new Date(b.order_date) >= startOfWeek)),
            month: calculateRevenue(allBookings.filter(b => new Date(b.order_date) >= startOfMonth)),
            year: calculateRevenue(allBookings.filter(b => new Date(b.order_date) >= startOfYear)),
            totalBookings: allBookings.length,
            totalUsers
        };

        // 2. Service Demand Ranking
        const serviceMap = {};
        allBookings.forEach(b => {
            const title = b.service_title || "Unknown Service";
            serviceMap[title] = (serviceMap[title] || 0) + 1;
        });

        const demandingServices = Object.entries(serviceMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        // 3. Chart Data (Keep previous logic)
        const chartData = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayBookings = allBookings.filter(b => b.order_date?.startsWith(dateStr));
            return {
                name: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
                bookings: dayBookings.length,
            };
        }).reverse();

        return { success: true, stats, demandingServices, chartData };
    } catch (error) {
        return { success: false };
    }
}