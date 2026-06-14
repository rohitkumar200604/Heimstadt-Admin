export type UserRole = 'admin' | 'employee';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  subject: string | null;
  status: 'open' | 'closed' | 'archived';
  assigned_to: string | null;
  created_at: string;
  last_message?: string;
  unread_count?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'employee' | 'admin';
  sender_id: string | null;
  content: string;
  created_at: string;
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
