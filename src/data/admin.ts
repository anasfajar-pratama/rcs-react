export interface AdminUser {
  id: number
  username: string
  name?: string
  email?: string
  is_active: boolean
  roles: Role[]
  last_login_at?: string
  last_login_ip?: string
  created_at: string
}

export interface Role {
  id: number
  name: string
  slug: string
  description?: string
  permissions: Permission[]
  pivot?: { admin_id: number; role_id: number }
}

export interface Permission {
  id: number
  name: string
  slug: string
  group: string
  pivot?: { role_id: number; permission_id: number }
}

export interface ActivityLog {
  id: number
  admin_id: number | null
  admin?: { id: number; username: string; name?: string } | null
  action: string
  subject_type?: string
  subject_id?: number
  description?: string
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface ContactMessage {
  id: number
  name: string
  phone: string
  email: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
  is_active: boolean
}

export interface Setting {
  id: number
  key: string
  value: string
  type: 'string' | 'text' | 'boolean' | 'json' | 'image'
  group: string
  description?: string
  created_at: string
  updated_at: string
}
