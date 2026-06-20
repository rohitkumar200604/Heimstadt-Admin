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

export interface Document {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  document_type: string | null;
  file_path: string | null;
  context: 'booking' | 'profile';
  status: 'pending' | 'verified' | 'rejected';
  verified_by: string | null;
  verified_at: string | null;
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

export interface TeamMember {
  id: string;
  full_name: string | null;
  role: UserRole;
  email: string;
  created_at: string;
  avatar_url?: string | null;
}
