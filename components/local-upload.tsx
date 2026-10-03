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
import { validateFile } from '@/lib/file-security'

interface LocalUploadProps {
  onUploadComplete: (url: string, name: string) => void
}

export function LocalUpload({ onUploadComplete }: LocalUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const selectFile = (selectedFile: File) => {
    const validation = validateFile(selectedFile)
    if (!validation.valid) {
      setFile(null)
      setFileError(validation.error ?? "Choose a valid PDF, DOC, or DOCX resume.")
      return
    }
    setFileError(null)
    setFile(selectedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      selectFile(e.target.files[0])
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

      if (!res.ok) {
        const message = await res.text()
        throw new Error(message || "Resume upload failed.")
      }

      const data = await res.json();
      onUploadComplete(data.url, data.name);
      toast.success("Resume uploaded")
      setFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Resume upload failed. Please try again.")
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
              if (e.dataTransfer.files[0]) selectFile(e.dataTransfer.files[0]);
            }}
            className={`
              relative group flex min-w-0 flex-col items-center justify-center p-5 sm:p-8 rounded-2xl
              border-2 border-dashed transition-colors
              ${
                isDragOver
                  ? "border-foreground bg-foreground/5"
                  : "border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/20"
              }
            `}
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-5 h-5 text-primary/50" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 text-primary">
              <Upload className="w-7 h-7" />
            </div>

            <div className="max-w-full text-center space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                Upload your resume
              </h3>
              <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                Drag and drop a PDF, DOC, or DOCX file, or click to browse.
              </p>
            </div>

            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              aria-label="Choose a resume file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass w-full min-w-0 p-4 sm:p-6 flex flex-col items-center gap-5 relative overflow-hidden rounded-2xl"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-foreground/5 rounded-full blur-2xl" />

            <div className="flex min-w-0 items-start sm:items-center gap-3 w-full">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate tracking-tight">
                  {file.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  <Badge
                    variant="outline"
                    className="text-[9px] font-semibold uppercase tracking-wide border-foreground/10"
                  >
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Ready to upload
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove selected resume"
                title="Remove selected resume"
                onClick={() => setFile(null)}
                className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full min-h-12 h-auto rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm group py-3"
            >
              {uploading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Uploading resume...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Upload resume
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {fileError && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {fileError}
        </p>
      )}
    </div>
  );
}
