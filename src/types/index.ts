export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Devotional {
  id: string;
  title: string;
  content: string;
  author: string | null;
  scriptureRef: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface Testimony {
  id: string;
  authorName: string;
  authorAge: number | null;
  content: string;
  imageUrl: string | null;
  approved: boolean;
  createdAt: string;
}

export interface Pubmat {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  eventId: string | null;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  meetingSchedule: string | null;
  leader: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  content: string | null;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  userName?: string;
  action: string;
  targetTable: string | null;
  targetId: string | null;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface VisitorLog {
  id: string;
  sessionId: string | null;
  path: string | null;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
