import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { NoticeForm } from '../../components/NoticeForm';

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;
  
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) throw new Error('Failed to fetch notice');
        const data = await res.json();
        setInitialData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch notice');
        toast.error(err.message || 'Failed to fetch notice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const res = await fetch(`/api/notices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update notice');
      }

      toast.success('Notice updated successfully!');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update notice');
      setError(err.message || 'Failed to update notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>Edit Notice | Notice Board</title>
      </Head>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back to Dashboard</span>
            </Link>
            <div className="bg-blue-50 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Notice</h1>
          <p className="text-gray-500 mt-1">Update the details of this announcement.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="text-red-600 mt-0.5">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-pulse">
            <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 w-full bg-gray-200 rounded mb-6"></div>
            <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 w-full bg-gray-200 rounded mb-6"></div>
            <div className="flex gap-4">
              <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <NoticeForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </main>
    </div>
  );
}
