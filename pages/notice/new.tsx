import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { NoticeForm } from '../../components/NoticeForm';

export default function NewNotice() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create notice');
      }

      toast.success('Notice created successfully!');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to create notice');
      setError(err.message || 'Failed to create notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Head>
        <title>Create Notice | Notice Board</title>
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Notice</h1>
          <p className="text-gray-500 mt-1">Publish a new announcement to the board.</p>
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

        <NoticeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </div>
  );
}
