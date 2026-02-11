"use server"
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const GetServices = async () => { 
    try {
        const collection = await dbConnect('services');
        const result = await collection.find().toArray();

        const services = result.map(service => {
            return {
                ...service,
                _id: service._id.toString(), 
            };
        });
        return services;
    } catch (error) {
        console.error("Database Fetch Error:", error);
        return [];
    }
};

export const GetSingleServices = async (id) => { 
    try {
        const collection = await dbConnect('services');
        const result = await collection.findOne({ _id: new ObjectId(id) });

        if (!result) return null;
        const service = {
            ...result,
            _id: result._id.toString(),
        }
        return service;
    } catch (error) {
        console.error("Database Fetch Error:", error);
        return null;
    }
};