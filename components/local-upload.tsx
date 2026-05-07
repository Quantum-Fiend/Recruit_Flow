'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface LocalUploadProps {
  onUploadComplete: (res: { url: string; name: string }) => void
}

export function LocalUpload({ onUploadComplete }: LocalUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onUploadComplete(data)
      toast.success("File uploaded successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload file")
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
        className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-colors hover:border-white/20 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Uploading your resume...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Click to upload resume</p>
              <p className="text-sm text-muted-foreground mt-1">PDF, DOC, DOCX up to 4MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
