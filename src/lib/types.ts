export type UserRole = 'admin' | 'employee';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

// Raw row from the shared `messages` table (sender_id -> recipient_id),
// used by the main website's "chat with us" widget and this admin inbox.
export interface SupportMessage {
  id: string;
  sender_id: string | null;
  recipient_id: string;
  body: string;
  sent_at: string;
  is_read: boolean;
}

// A synthesized conversation thread: all messages with one other person,
// grouped client-side since the live schema has no `conversations` table.
export interface SupportThread {
  otherId: string;
  otherName: string;
  otherEmail: string;
  messages: SupportMessage[];
  unreadCount: number;
}

// Raw row from the shared `verification_documents` table — KYC-style
// uploads (passport, visa, enrollment, income proof) tied to a user,
// not to a specific booking.
export interface Document {
  id: string;
  user_id: string;
  doc_type: 'passport' | 'visa' | 'enrollment' | 'income';
  s3_key: string;
  file_name: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
}

export interface Booking {
  id: string;
  user_id: string | null;
  property_id: string | null;
  property_name: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  check_in: string | null;
  check_out: string | null;
  created_at: string;
  // Joined
  user_name?: string;
  user_email?: string;
  pending_docs?: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  status: 'available' | 'reserved' | 'occupied';
  price_per_month: number;
  size_sqm: number;
  image_url?: string;
}

export const DOC_TYPE_LABELS: Record<Document['doc_type'], string> = {
  passport: 'Passport',
  visa: 'Visa',
  enrollment: 'Enrollment Proof',
  income: 'Income Proof',
};

export interface TeamMember {
  id: string;
  full_name: string | null;
  role: UserRole;
  email: string;
  created_at: string;
  avatar_url?: string | null;
}
