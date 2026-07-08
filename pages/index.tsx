import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { PlusCircle, Bell, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { NoticeCard, Notice } from '../components/NoticeCard';
import { DeleteModal } from '../components/DeleteModal';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      // NOTE: As per instruction "lekin connect mt karna abhi tum"
      // We will attempt to fetch from backend, but fallback to mock data if it fails (e.g. no DB connected)
      const res = await fetch('/api/notices');
      if (!res.ok) throw new Error('Failed to fetch notices');
      const data = await res.json();
      setNotices(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch notices. Please ensure the database is connected.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDeleteClick = (notice: Notice) => {
    setNoticeToDelete(notice);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;
    
    try {
      const res = await fetch(`/api/notices/${noticeToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete notice');
      
      setNotices(notices.filter(n => n.id !== noticeToDelete.id));
      toast.success('Notice deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete notice. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
      setNoticeToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>Notice Board | Dashboard</title>
        <meta name="description" content="Manage your notices with ease" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">NoticeBoard</span>
            </div>
            <div className="flex items-center">
              <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100/50 shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Notices</h1>
            <p className="text-slate-500 text-lg">Manage all announcements, events, and exams.</p>
            {error && <p className="text-rose-600 text-sm mt-3 bg-rose-50 inline-block px-3 py-1.5 rounded-md border border-rose-100 font-medium shadow-sm">{error}</p>}
          </div>
          <Link 
            href="/notice/new" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            Create Notice
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-64 animate-pulse flex flex-col">
                <div className="flex justify-between mb-4">
                  <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                <div className="mt-auto flex justify-end gap-2 pt-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-slate-200">
              <Bell className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No notices yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm text-center">Get started by creating your first notice. It will appear here for everyone to see.</p>
            <Link 
              href="/notice/new" 
              className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow"
            >
              <PlusCircle className="w-4 h-4" />
              Create your first notice
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onDeleteClick={handleDeleteClick} />
            ))}
          </div>
        )}
      </main>

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete}
        title={noticeToDelete?.title}
      />
    </div>
  );
}
