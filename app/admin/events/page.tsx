'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, X, Image as ImageIcon, Calendar, UploadCloud } from 'lucide-react';
import Image from 'next/image';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface GalleryLog {
  id: string;
  title: string;
  event_date: string;
  description: string;
  image_url: string;
}

export default function AdminGallery() {
  const [logs, setLogs] = useState<GalleryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Fetch Gallery Logs
  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Handle Submit (Upload Image + Save to DB)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Generate a unique file name to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload image to the 'event-images' bucket
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 4. Save the record to the 'gallery' table
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ 
          title, 
          event_date: eventDate, 
          description, 
          image_url: imageUrl 
        }]);

      if (dbError) throw dbError;

      // Success! Reset form and refresh data
      setIsModalOpen(false);
      setTitle('');
      setEventDate('');
      setDescription('');
      setFile(null);
      fetchLogs();

    } catch (error: any) {
      console.error("Error saving gallery log:", error);
      alert(error.message || "Failed to upload image and save log.");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Log
  const deleteLog = async (id: string, imageUrl: string) => {
    if (!window.confirm('Delete this log? This action is permanent.')) return;
    
    // Optional: Extract filename from URL to delete from storage bucket too
    // const fileName = imageUrl.split('/').pop();
    // if (fileName) await supabase.storage.from('event-images').remove([fileName]);

    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (!error) fetchLogs();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-['JetBrains_Mono'] selection:bg-[#00ff88] selection:text-black">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black font-['Orbitron'] mb-2">System <span className="text-[#00ff88]">Logs Admin</span></h1>
          <p className="text-zinc-500 text-sm">Upload images and records of past club operations.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/80 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] text-sm"
        >
          <UploadCloud size={18} /> Upload New Log
        </button>
      </div>

      {/* Logs Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="text-[#00ff88] animate-pulse">Fetching system logs...</div>
        ) : logs.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl text-zinc-600">
            No gallery logs found in the database.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="relative bg-zinc-950/50 border border-white/10 rounded-xl overflow-hidden hover:border-[#00ff88]/30 transition-all duration-300 flex flex-col group">
              
              <div className="relative h-48 w-full border-b border-white/10">
                <Image 
                  src={log.image_url} 
                  alt={log.title}
                  fill
                  className="object-cover"
                />
                <button 
                  onClick={() => deleteLog(log.id, log.image_url)} 
                  className="absolute top-3 right-3 p-2 rounded-md bg-black/60 text-red-500 hover:bg-red-500 hover:text-white backdrop-blur-md transition-colors" 
                  title="Delete Log"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-[#00ff88] mb-2">
                  <Calendar size={12} /> {log.event_date}
                </div>
                <h3 className="text-lg font-bold font-['Orbitron'] mb-2">{log.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-3">{log.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold font-['Orbitron'] text-white">Inject System Log</h2>
              <button onClick={() => !isUploading && setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Image Upload Area */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase tracking-wider">Image Payload (Required)</label>
                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-black/50 hover:border-[#00ff88]/50 transition-colors">
                  <input 
                    required 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon size={32} className={file ? "text-[#00ff88] mb-2" : "text-zinc-600 mb-2"} />
                  <span className="text-sm font-bold">{file ? file.name : "Click or drag image to upload"}</span>
                  <span className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP up to 5MB</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase tracking-wider">Event Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00ff88] focus:outline-none text-white" placeholder="e.g. Open Source Sprint 2026" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase tracking-wider">Date</label>
                <input required type="text" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00ff88] focus:outline-none text-white" placeholder="e.g. OCT 24, 2026" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase tracking-wider">Description</label>
                <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00ff88] focus:outline-none text-white resize-none" placeholder="What happened at the event?"></textarea>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isUploading} className="px-5 py-2 text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-6 py-2 text-sm bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/80 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isUploading ? <span className="animate-pulse">Uploading...</span> : 'Upload Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}