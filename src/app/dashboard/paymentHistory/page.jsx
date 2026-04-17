"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { FaHistory, FaCheckCircle, FaReceipt, FaUser, FaEnvelope } from "react-icons/fa";
import { getPaymentHistory } from "@/action/server/pamentHistory";

const PaymentHistory = () => {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (session?.user?.email) {
        const data = await getPaymentHistory(session.user.email);
        setHistory(data || []);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <FaHistory size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Payment History</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">View and manage all your successful transactions</p>
      </div>

      {history.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* Table Head */}
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="py-5 px-6 font-bold text-[11px] uppercase tracking-wider">Service & Transaction</th>
                  <th className="font-bold text-[11px] uppercase tracking-wider text-center">Amount</th>
                  <th className="font-bold text-[11px] uppercase tracking-wider text-center">Date</th>
                  <th className="font-bold text-[11px] uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="text-slate-700">
                {history.map((item) => (
                  <tr key={item._id} className="border-b last:border-none hover:bg-slate-50/30 transition-colors">
                    <td className="py-6 px-6">
                      <div className="font-bold text-slate-800 text-sm mb-1">{item.service_title}</div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-100 w-fit px-2 py-0.5 rounded-md">
                        <FaReceipt size={10} /> {item.transactionId}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="font-black text-slate-900 text-lg">৳{item.amount}</div>
                    </td>
                    <td className="text-center text-sm font-medium text-slate-500">
                      {new Date(item.payment_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="text-right px-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        <FaCheckCircle /> {item.status || "Successful"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-100 p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <FaReceipt className="text-slate-200" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Transactions Yet</h3>
          <p className="text-slate-400 mt-2 max-w-xs">Once you make a payment for a service, it will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;