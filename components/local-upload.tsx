'use client'

import { useState } from 'react'
import {
  Upload,
  X,
  FileText,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface LocalUploadProps {
  onUploadComplete: (url: string, name: string) => void
}

export function LocalUpload({ onUploadComplete }: LocalUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUploadComplete(data.url, data.name);
      toast.success("Document ingested successfully");
      setFile(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Initialization failed. Check network status.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
            }}
            className={`
              relative group flex flex-col items-center justify-center p-16 rounded-[2.5rem] 
              border-2 border-dashed transition-all duration-500
              ${
                isDragOver
                  ? "border-foreground bg-foreground/5"
                  : "border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/20"
              }
            `}
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-6 h-6 text-foreground/20 animate-pulse" />
            </div>

            <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-10 h-10 text-foreground/40 group-hover:text-foreground transition-colors" />
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-2xl font-black tracking-tighter">
                Deploy Resume Portfolio
              </h3>
              <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                Drag and drop your professional identity (PDF/DOCX) or click to
                browse.
              </p>
            </div>

            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 flex flex-col items-center gap-8 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-foreground/5 rounded-full blur-2xl" />

            <div className="flex items-center gap-6 w-full">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-xl truncate tracking-tight">
                  {file.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-black uppercase tracking-widest border-foreground/10"
                  >
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Ready for Ingestion
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full h-16 rounded-2xl bg-foreground text-background font-black text-lg shadow-xl shadow-foreground/10 group"
            >
              {uploading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Ingesting Data...</span>
                </div>
              ) : (
                <span className="flex items-center gap-3">
                  Initialize Upload
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
