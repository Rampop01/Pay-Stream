'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Shield, Flag, CheckCircle, XCircle, Eye, Trash2, AlertTriangle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
/** @description Administrative control panel and moderation tools */


interface Report {
  id: string;
  contentId: string;
  contentTitle: string;
  reporter: string;
  reason: string;
  timestamp: number;
  status: 'pending' | 'resolved' | 'dismissed';
}

export default function AdminPage() {
  const { address } = useWalletStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  // Hardcoded Admin Check for demo purposes
  const isAdmin = address === 'SP1BTBG1TW13NEV2FQM7HC1BZ9XZV7FZSGPMVV38M';

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [address]);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (reportId: string, action: 'resolve' | 'dismiss' | 'hide_content' | 'ban_creator') => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        toast.success(`Report ${action}d successfully`);
        fetchReports();
      }
    } catch (e) {
      toast.error("Action failed");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <Shield className="w-16 h-16 text-red-500 mb-6 opacity-20" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-white/40 text-center max-w-md">Only platform administrators can access the moderation dashboard.</p>
      </div>
    );
  }

  const filteredReports = reports.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-4">
              <Shield className="text-stacks-orange" />
              Moderation <span className="gradient-text-stacks">Hub</span>
            </h1>
            <p className="text-white/40">Review community reports and maintain platform integrity.</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-xl border border-white/10">
            {(['all', 'pending', 'resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-stacks-orange text-white shadow-lg shadow-stacks-orange/20' : 'text-white/40 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Bar */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-[10px] font-black text-white/30 uppercase mb-2">Total Reports</div>
              <div className="text-3xl font-black">{reports.length}</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-[10px] font-black text-yellow-500/50 uppercase mb-2">Pending</div>
              <div className="text-3xl font-black text-yellow-500">{reports.filter(r => r.status === 'pending').length}</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-[10px] font-black text-green-500/50 uppercase mb-2">Resolved</div>
              <div className="text-3xl font-black text-green-500">{reports.filter(r => r.status === 'resolved').length}</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-[10px] font-black text-stacks-orange/50 uppercase mb-2">Platform Health</div>
              <div className="text-3xl font-black text-stacks-orange">99.2%</div>
            </div>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-white/30 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Reported Content</th>
                    <th className="px-8 py-5">Reason</th>
                    <th className="px-8 py-5">Reporter</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReports.map((report) => (
                    <motion.tr 
                      layout
                      key={report.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold text-white mb-1">{report.contentTitle}</div>
                        <div className="text-[10px] text-white/20 font-mono">ID: {report.contentId}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-white/60">{report.reason}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs text-white/40 font-mono">{report.reporter.slice(0, 10)}...</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                          {report.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {report.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleAction(report.id, 'hide_content')}
                                title="Hide Content"
                                className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAction(report.id, 'ban_creator')}
                                title="Ban Creator"
                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleAction(report.id, 'dismiss')}
                                title="Dismiss Report"
                                className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-white/20 italic">
                          <CheckCircle className="w-12 h-12 opacity-10" />
                          <span>No reports to show</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// TODO: Add multi-select bulk actions for reports
