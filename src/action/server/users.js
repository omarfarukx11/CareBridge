
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

export async function getUserProfile(email) {
    try {
        const collection = await dbConnect("users");
        const user = await collection.findOne({ email });
        if (!user) {
            return { success: false, message: "User not found." };
        }

        return { success: true, data: { ...user, _id: user._id.toString() } };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return { success: false, message: "Failed to fetch profile." };
    }
}

export async function updateUserProfile(payload) {
    try {
        const session = await getServerSession();
        const userEmail = session?.user?.email;
        if (!userEmail) {
            return { success: false, message: "Not authenticated." };
        }

        const collection = await dbConnect("users");
        const professionalsCollection = await dbConnect("professionals");

        const user = await collection.findOne({ email: userEmail });
        if (!user) {
            return { success: false, message: "User not found." };
        }

        const updateFields = {
            name: payload.name,
            contact: payload.contact || user.contact || "",
            experience: payload.experience || user.experience || "",
            address: payload.address || user.address || "",
            image: payload.image || user.image || "",
        };

        if (user.role === "professional") {
            updateFields.division = payload.division || user.division || "";
            updateFields.district = payload.district || user.district || "";
            updateFields.area = payload.area || user.area || "";
        }

        await collection.updateOne({ email: userEmail }, { $set: updateFields });

        if (user.role === "professional") {
            const professional = await professionalsCollection.findOne({ user_id: user._id.toString() });
            const professionalUpdate = {
                name: updateFields.name,
                contact: updateFields.contact,
                experience: updateFields.experience,
                division: updateFields.division || "Dhaka",
                district: updateFields.district || "Dhaka",
                area: updateFields.area || "Dhaka",
            };

            if (professional) {
                await professionalsCollection.updateOne(
                    { user_id: user._id.toString() },
                    { $set: professionalUpdate }
                );
            } else {
                await professionalsCollection.insertOne({
                    user_id: user._id.toString(),
                    email: user.email,
                    name: updateFields.name,
                    contact: updateFields.contact,
                    experience: updateFields.experience,
                    rating: user.rating || 0,
                    division: professionalUpdate.division,
                    district: professionalUpdate.district,
                    area: professionalUpdate.area,
                    status: "available",
                    createdAt: new Date().toISOString(),
                });
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, message: "Failed to update profile." };
    }
}

export async function updateUserRole(targetUserId, newRole) {
    try {
        const session = await getServerSession();
        const collection = await dbConnect("users");
        const professionalsCollection = await dbConnect("professionals");
        
        const targetUser = await collection.findOne({ _id: new ObjectId(targetUserId) });
        if (!targetUser) {
            return { success: false, message: "User not found." };
        }

        if (targetUser.email === session?.user?.email) {
            return { 
                success: false, 
                message: "Safety Block: You cannot change your own role. Ask another Superadmin or use the Database." 
            };
        }

        const previousRole = targetUser.role || "user";

        if (newRole === "professional") {
            const existingProfessional = await professionalsCollection.findOne({ user_id: targetUserId });
            if (!existingProfessional) {
                await professionalsCollection.insertOne({
                    user_id: targetUserId,
                    name: targetUser.name,
                    email: targetUser.email,
                    contact: targetUser.contact || targetUser.phone || "",
                    experience: targetUser.experience || "0 years",
                    rating: typeof targetUser.rating === "number" ? targetUser.rating : 0,
                    division: "Dhaka",
                    district: "Dhaka",
                    area: "Dhaka",
                    status: "available",
                    createdAt: new Date().toISOString(),
                });
            }
        }

        if (previousRole === "professional" && newRole !== "professional") {
            await professionalsCollection.deleteOne({ user_id: targetUserId });
        }

        await collection.updateOne(
            { _id: new ObjectId(targetUserId) },
            { $set: { role: newRole } }
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, message: "Database Error" };
    }
}