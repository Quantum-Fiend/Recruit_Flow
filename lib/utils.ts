import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(d)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    APPLIED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    SHORTLISTED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    INTERVIEW: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    OFFER: 'bg-green-500/10 text-green-500 border-green-500/20',
    HIRED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    OPEN: 'bg-green-500/10 text-green-500 border-green-500/20',
    CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
}

export function getJobTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  }
  return labels[type] || type
}

export function getEmploymentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    OFFICE: 'Office',
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
  }
  return labels[type] || type
}
