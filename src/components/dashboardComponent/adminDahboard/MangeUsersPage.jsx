"use client";
import React, { useEffect, useState, Suspense } from "react";
import { FaUserShield, FaSearch, FaChevronLeft, FaChevronRight, FaUserCircle, FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { getAllUsers, updateUserRole } from "@/action/server/users";

const ManageUsersContent = () => {
    const { data: session } = useSession();
    const currentUserEmail = session?.user?.email;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await getAllUsers({ page, limit: 10, searchTerm });
        if (res.success) {
            setUsers(res.data);
            setTotalPages(res.totalPages);
        }
        setLoading(false);
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [page, searchTerm]);

    const handleRoleChange = async (userId, userName, currentRole, newRole) => {
        if (currentRole === newRole) return;

        Swal.fire({
            title: "Update Permission?",
            text: `Confirm changing ${userName}'s role from ${currentRole} to ${newRole}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, Update Role",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    const res = await updateUserRole(userId, newRole);
                    if (!res.success) throw new Error(res.message || "Failed to update");
                    return res;
                } catch (error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Success!",
                    text: "User role has been updated effectively.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchUsers();
            }
        });
    };

    return (
        <div className="w-full font-poppins">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                        <FaUserShield className="text-primary" /> User Management
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Control system access and administrative privileges.</p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="input input-bordered w-full pl-12 rounded-lg outline-none bg-white dark:bg-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="mb-6 flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-sm">
                <FaInfoCircle className="shrink-0" />
                <span>Note: You cannot modify your own role to prevent accidental lockout from the Superadmin panel.</span>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm">
                <table className="table w-full border-collapse">
                    <thead className="bg-slate-50/80 text-slate-500">
                        <tr className="border-b border-slate-100">
                            <th className="py-6 pl-8 font-bold text-[11px] uppercase tracking-widest text-left">Profile</th>
                            <th className="font-bold text-[11px] uppercase tracking-widest text-center">Status / Role</th>
                            <th className="font-bold text-[11px] uppercase tracking-widest text-right pr-8">Management</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {loading ? (
                            <tr><td colSpan="3" className="py-24 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></td></tr>
                        ) : users.length > 0 ? (
                            users.map((user) => {
                                const isMe = user.email === currentUserEmail;
                                return (
                                    <tr key={user._id} className="border-b last:border-none hover:bg-slate-50/40 transition-colors group">
                                        <td className="py-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="avatar placeholder">
                                                    <div className="bg-slate-100 text-slate-400 rounded-2xl w-12 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <FaUserCircle className="text-3xl" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                                        {user.name} 
                                                        {isMe && <span className="badge badge-primary badge-sm font-black text-[9px] uppercase tracking-tighter h-5">You</span>}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                                                user.role === 'superadmin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                                user.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="text-right pr-8">
                                            <div className="flex justify-end">
                                                <select 
                                                    disabled={isMe}
                                                    className={`select select-sm select-bordered outline-none rounded-lg text-xs font-bold border-slate-200 transition-all ${
                                                        isMe ? 'bg-slate-100 cursor-not-allowed opacity-40' : 'bg-slate-50 hover:border-primary'
                                                    }`}
                                                    value={user.role || 'user'}
                                                    onChange={(e) => handleRoleChange(user._id, user.name, user.role, e.target.value)}
                                                >
                                                    <option value="user">User </option>
                                                    <option value="professional">Professional</option>
                                                    <option value="admin">Admin </option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="3" className="py-20 text-center text-slate-400 font-medium italic">No matches found for "{searchTerm}"</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-8 px-4 pb-12">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Showing Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="btn btn-sm btn-square rounded-xl bg-white text-black border-slate-200 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                    >
                        <FaChevronLeft />
                    </button>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="btn btn-sm btn-square rounded-xl bg-white text-black border-slate-200 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ManageUsersPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center p-32"><span className="loading loading-bars loading-lg text-primary"></span></div>}>
            <ManageUsersContent />
        </Suspense>
    );
}