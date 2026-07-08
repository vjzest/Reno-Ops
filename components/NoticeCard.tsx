import React from 'react';
import { format } from 'date-fns';
import { Badge } from './Badge';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export interface Notice {
  id: number;
  title: string;
  body: string;
  category: 'Exam' | 'Event' | 'General';
  priority: 'Normal' | 'Urgent';
  publishDate: string;
  image?: string;
  createdAt: string;
}

interface NoticeCardProps {
  notice: Notice;
  onDeleteClick: (notice: Notice) => void;
}

export function NoticeCard({ notice, onDeleteClick }: NoticeCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-slate-200/60 hover:-translate-y-1 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {notice.image && (
        <div className="w-full h-52 overflow-hidden border-b border-slate-100">
          <img src={notice.image} alt={notice.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      
      <div className="p-6 flex-grow flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 flex-wrap">
            {notice.priority === 'Urgent' && (
              <Badge variant="urgent">URGENT</Badge>
            )}
            <Badge variant="category">{notice.category}</Badge>
          </div>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100/80 px-2.5 py-1 rounded-md shadow-sm border border-slate-200/50">
            {format(new Date(notice.publishDate), 'MMM dd, yyyy')}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">{notice.title}</h3>
        <p className="text-slate-600 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">{notice.body}</p>
        
        <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-slate-100">
          <Link href={`/notice/${notice.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200">
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => onDeleteClick(notice)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
