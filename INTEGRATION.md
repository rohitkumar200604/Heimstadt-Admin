# Heimstadt Admin Portal — Integration Guide

This document explains how to connect the **Heimstadt Admin Portal** (`admin.heimstadt.com`) with the **main website** (`www.heimstadt.com`). Both share the **same Supabase project**.

---

## 1. Prerequisites

Both projects must use the **same Supabase credentials**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kbtbzlkjfzczzzzaiyyr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> **Important**: The admin portal and main site read/write to the same database tables. This is what enables real-time sync.

---

## 2. Database Tables (Shared Schema)

Run this SQL in your Supabase SQL Editor to create all required tables:

```sql
-- User profiles with role management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'employee', 'user')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  user_name TEXT,
  user_email TEXT,
  subject TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
  assigned_to UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages (real-time)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('user', 'employee', 'admin')),
  sender_id UUID REFERENCES auth.users,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Document verification
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  booking_id UUID,
  document_type TEXT,
  file_path TEXT,
  context TEXT CHECK (context IN ('booking', 'profile')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  property_id TEXT,
  property_name TEXT,
  status TEXT DEFAULT 'pending',
  check_in DATE,
  check_out DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime on chat_messages and documents
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
```

---

## 3. Real-Time Chat Integration (Requirement 5)

### How it works:

1. **User on `heimstadt.com`** opens chat widget → creates a `conversations` row
2. **User sends a message** → inserts into `chat_messages` with `sender_type: 'user'`
3. **Admin Portal** subscribes to `chat_messages` via Supabase Realtime → employee sees message instantly
4. **Employee replies** → inserts into `chat_messages` with `sender_type: 'employee'`
5. **Main site** subscribes to same channel → user sees reply with zero delay

### Main site code (add to your chat widget):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create conversation when user opens chat
async function startChat(userId: string, subject: string) {
  const { data } = await supabase
    .from('conversations')
    .insert({ user_id: userId, subject, status: 'open' })
    .select()
    .single();
  return data;
}

// Send message
async function sendMessage(conversationId: string, userId: string, content: string) {
  await supabase.from('chat_messages').insert({
    conversation_id: conversationId,
    sender_type: 'user',
    sender_id: userId,
    content,
  });
}

// Subscribe to replies (real-time)
function subscribeToReplies(conversationId: string, onMessage: (msg: any) => void) {
  return supabase
    .channel(`chat:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => {
      if (payload.new.sender_type !== 'user') {
        onMessage(payload.new);
      }
    })
    .subscribe();
}
```

---

## 4. Document Verification Integration (Requirement 6)

### How it works:

1. **User uploads document** on main site → inserts into `documents` table with `status: 'pending'`
2. **Employee reviews** in Admin Portal → clicks Approve → updates `status: 'verified'`
3. **Main site queries** `documents.status` → shows ✅ tick when `verified`

### Main site code for uploading:

```typescript
// Upload document (at Bookings or Profile)
async function uploadDocument(
  userId: string,
  file: File,
  context: 'booking' | 'profile',
  documentType: string,
  bookingId?: string
) {
  // 1. Upload file to Supabase Storage
  const path = `documents/${userId}/${Date.now()}_${file.name}`;
  await supabase.storage.from('user-documents').upload(path, file);

  // 2. Create document record
  await supabase.from('documents').insert({
    user_id: userId,
    booking_id: bookingId || null,
    document_type: documentType,
    file_path: path,
    context,
    status: 'pending',
  });
}
```

### Main site code for showing verification status:

```typescript
// Check document verification status
async function getDocStatus(userId: string, context: 'booking' | 'profile') {
  const { data } = await supabase
    .from('documents')
    .select('id, document_type, status')
    .eq('user_id', userId)
    .eq('context', context);

  return data; // Each doc has status: 'pending' | 'verified' | 'rejected'
}

// Show ✅ or ⏳ based on status
// <span>{doc.status === 'verified' ? '✅ Verified' : '⏳ Pending review'}</span>
```

### Subscribe to status changes (real-time ✅ appearance):

```typescript
function subscribeToDocChanges(userId: string, onUpdate: (doc: any) => void) {
  return supabase
    .channel(`docs:${userId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'documents',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      onUpdate(payload.new);
    })
    .subscribe();
}
```

---

## 5. Supabase Project Configuration

### Required settings in Supabase Dashboard:

1. **Authentication → URL Configuration**
   - Site URL: `https://admin.heimstadt.com`
   - Redirect URLs: 
     - `https://admin.heimstadt.com/auth/reset-password`
     - `https://heimstadt.com/**`

2. **Realtime → Enabled**
   - Ensure `chat_messages`, `documents`, and `conversations` tables are added to the Realtime publication

3. **Storage → Buckets**
   - Create bucket: `user-documents` (private)
   - RLS policies: Users can upload to their own folder, admin/employees can read all

4. **Row Level Security (RLS)**
   - `profiles`: Users can read own, admin/employees can read all
   - `chat_messages`: Users can read/write own conversations, admin/employees can read/write all
   - `documents`: Users can read/write own, admin/employees can read/update all
   - `conversations`: Users can read/write own, admin/employees can read/write all

### CORS Configuration:
Add both domains to your Supabase project's allowed origins:
- `https://heimstadt.com`
- `https://admin.heimstadt.com`
- `http://localhost:3000` (development)

---

## 6. Deployment (Vercel)

### Admin Portal:
1. Connect the `Heimstadt-Admin` repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_MAIN_SITE_URL=https://heimstadt.com`
3. Deploy

### Custom Domain:
- Set `admin.heimstadt.com` as a custom domain on Vercel
- Update Supabase redirect URLs to include the production domain

---

## 7. Creating Admin & Employee Accounts

Since there is **no registration page**, accounts must be created manually:

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **Add user** → enter email + password
3. Then insert a row in the `profiles` table:

```sql
INSERT INTO profiles (id, full_name, role)
VALUES ('<user-uuid-from-auth>', 'Admin Name', 'admin');
```

Employees get `role: 'employee'`, admins get `role: 'admin'`.
