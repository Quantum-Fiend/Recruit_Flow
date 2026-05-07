'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface LocalUploadProps {
  onUploadComplete: (res: { url: string; name: string }) => void
}

export function LocalUpload({ onUploadComplete }: LocalUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Basic validation
    if (selectedFile.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB")
      return
    }

    setFile(selectedFile)
    setUploading(true)
    
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onUploadComplete(data)
      toast.success("Resume processed successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload file")
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
      />
      
      <div 
        className={cn(
          "relative group overflow-hidden border-2 border-dashed rounded-[2rem] p-12 transition-all duration-500 flex flex-col items-center justify-center text-center cursor-pointer",
          file ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/50 bg-accent/20 hover:border-primary/50 hover:bg-primary/5"
        )}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {/* Decorative background sparks */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-500 animate-bounce" />
            </div>
            <div className="space-y-2">
               <p className="text-xl font-bold">Analyzing your resume...</p>
               <p className="text-sm text-muted-foreground">Preparing your application for review</p>
            </div>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
               <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
               <p className="text-xl font-bold text-foreground">{file.name}</p>
               <p className="text-sm text-emerald-500 font-medium">Ready for submission</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
               Change File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
               <Upload className="w-10 h-10" />
            </div>
            <div className="space-y-2">
               <p className="text-2xl font-bold tracking-tight">Drop your resume here</p>
               <p className="text-muted-foreground font-medium max-w-[240px] mx-auto">
                 Or click to browse from your files. Support for PDF and Word documents.
               </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
               <Badge variant="outline" className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest opacity-60">PDF</Badge>
               <Badge variant="outline" className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest opacity-60">DOCX</Badge>
               <Badge variant="outline" className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest opacity-60">MAX 4MB</Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
