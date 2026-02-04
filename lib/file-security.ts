// File Upload Security and Validation

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateFileSize(size: number): FileValidationResult {
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }
  return { valid: true }
}

export function validateFileType(type: string): FileValidationResult {
  if (!ALLOWED_FILE_TYPES.includes(type as typeof ALLOWED_FILE_TYPES[number])) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: PDF, DOC, DOCX`,
    }
  }
  return { valid: true }
}

export function validateFileName(name: string): FileValidationResult {
  // Check for valid extension
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => name.toLowerCase().endsWith(ext))
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }
  }

  // Check for malicious patterns
  const dangerousPatterns = [
    /\.\./,  // Path traversal
    /[<>:"|?*]/,  // Invalid filename characters
    /^\./, // Hidden files
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(name)) {
      return {
        valid: false,
        error: 'Invalid filename detected',
      }
    }
  }

  return { valid: true }
}

export function sanitizeFileName(name: string): string {
  // Remove any path components
  const baseName = name.split(/[/\\]/).pop() || name
  
  // Remove or replace dangerous characters
  return baseName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255) // Limit length
}

export function validateFile(file: { name: string; size: number; type: string }): FileValidationResult {
  // Validate size
  const sizeValidation = validateFileSize(file.size)
  if (!sizeValidation.valid) return sizeValidation

  // Validate type
  const typeValidation = validateFileType(file.type)
  if (!typeValidation.valid) return typeValidation

  // Validate filename
  const nameValidation = validateFileName(file.name)
  if (!nameValidation.valid) return nameValidation

  return { valid: true }
}

// Generate safe file key for storage
export function generateFileKey(userId: string, originalName: string): string {
  const timestamp = Date.now()
  const sanitized = sanitizeFileName(originalName)
  const extension = sanitized.split('.').pop()
  const randomString = Math.random().toString(36).substring(2, 10)
  
  return `resumes/${userId}/${timestamp}-${randomString}.${extension}`
}
