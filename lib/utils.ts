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
    APPLIED: 'bg-info/10 text-info border-info/20',
    SHORTLISTED: 'bg-primary/10 text-primary border-primary/20',
    INTERVIEW: 'bg-warning/10 text-warning border-warning/20',
    OFFER: 'bg-success/10 text-success border-success/20',
    HIRED: 'bg-success-strong/10 text-success-strong border-success-strong/20',
    REJECTED: 'bg-error/10 text-error border-error/20',
    OPEN: 'bg-success/10 text-success border-success/20',
    CLOSED: 'bg-muted text-muted-foreground border-border',
  }
  return colors[status] || 'bg-muted text-muted-foreground border-border'
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
