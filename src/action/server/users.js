
"use server"
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export async function getAllUsers({ page = 1, limit = 10, searchTerm = "" }) {
    try {
        const collection = await dbConnect("users");
        const skip = (page - 1) * limit;

        let query = {};
        if (searchTerm) {
            query = {
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } }
                ]
            };
        }

        const users = await collection
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalUsers = await collection.countDocuments(query);

        return {
            success: true,
            data: users.map(user => ({ ...user, _id: user._id.toString() })),
            totalPages: Math.ceil(totalUsers / limit),
        };
    } catch (error) {
        return { success: false, data: [], totalPages: 0 };
    }
}

export async function updateUserRole(targetUserId, newRole) {
    try {
        const session = await getServerSession();
        const collection = await dbConnect("users");
        
        const targetUser = await collection.findOne({ _id: new ObjectId(targetUserId) });

    
        if (targetUser.email === session?.user?.email) {
            return { 
                success: false, 
                message: "Safety Block: You cannot change your own role. Ask another Superadmin or use the Database." 
            };
        }

        await collection.updateOne(
            { _id: new ObjectId(targetUserId) },
            { $set: { role: newRole } }
        );
        return { success: true };
    } catch (error) {
        return { success: false, message: "Database Error" };
    }
}