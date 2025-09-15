export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  timestamp?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasMore: boolean;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: [number, number][]; // Array of [longitude, latitude]
}

export interface Schedule {
  days: string[]; // ['monday', 'tuesday', ...]
  departureTime: string; // '08:30'
  flexibility: number; // minutes
}

export interface RouteCompatibility {
  overlapPercentage: number;
  overlapDistance: number;
  scheduleMatch: boolean;
  timeDifference: number; // minutes
}

export interface SuggestedMeetPoint {
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  walkingDistanceFromRoute: number; // kilometers
}

export interface MatchData {
  matchId: string;
  user: {
    anonymousUsername: string;
    verificationStatus: string;
  };
  route: {
    id: string;
    startAddress: string;
    endAddress: string;
  };
  compatibility: RouteCompatibility;
  suggestedMeetPoints: SuggestedMeetPoint[];
  matchScore: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    anonymousUsername: string;
    isCurrentUser: boolean;
  };
  timestamp: string;
  edited: boolean;
}

export interface ChatRoom {
  id: string;
  participants: Array<{
    anonymousUsername: string;
    isCurrentUser: boolean;
    lastActive?: string;
  }>;
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: string;
  };
  unreadCount: number;
  createdAt: string;
}

export interface WebSocketEvents {
  // Incoming events (from client)
  'join_room': { roomId: string };
  'send_message': { roomId: string; content: string };
  'update_location': { latitude: number; longitude: number; accuracy: number };
  
  // Outgoing events (to client)
  'match_found': {
    matchId: string;
    user: { anonymousUsername: string };
    compatibility: { overlapPercentage: number; matchScore: number };
  };
  'message_received': {
    roomId: string;
    message: {
      id: string;
      content: string;
      sender: string;
      timestamp: string;
    };
  };
  'user_status_changed': {
    roomId: string;
    user: string;
    status: 'online' | 'offline';
    lastActive: string;
  };
}

// Request/Response interfaces for specific endpoints
export interface RegisterRequest {
  email: string;
  password: string;
  studentId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateRouteRequest {
  startLocation: Location;
  endLocation: Location;
  schedule: Schedule;
}

export interface UpdateRouteRequest extends Partial<CreateRouteRequest> {}

export interface FindMatchesQuery {
  routeId?: string;
  limit?: number;
  minOverlap?: number;
}

export interface ReportUserRequest {
  reportedUserId: string;
  reason: string;
  description: string;
  chatRoomId?: string;
}

export interface GeocodeRequest {
  address: string;
}

export interface ReverseGeocodeRequest {
  latitude: number;
  longitude: number;
}

export interface CalculateRouteRequest {
  start: Location;
  end: Location;
  mode: 'driving' | 'walking' | 'cycling';
}

export interface UserProfile {
  id: string;
  anonymousUsername: string;
  verificationStatus: 'pending' | 'verified' | 'suspended';
  createdAt: string;
  activeRoute?: {
    id: string;
    startAddress: string;
    endAddress: string;
  };
}

export interface RouteData {
  id: string;
  startLocation: {
    coordinates: [number, number];
    address: string;
  };
  endLocation: {
    coordinates: [number, number];
    address: string;
  };
  routeGeometry: GeoJSONLineString;
  schedule: Schedule;
  distance: number; // kilometers
  estimatedDuration: number; // minutes
  createdAt: string;
}

export interface RouteListItem {
  id: string;
  startAddress: string;
  endAddress: string;
  schedule: {
    days: string[];
    departureTime: string;
  };
  isActive: boolean;
  matchCount: number;
  createdAt: string;
}

export interface CalculatedRoute {
  geometry: GeoJSONLineString;
  distance: number; // kilometers
  duration: number; // minutes
  steps: Array<{
    instruction: string;
    distance: number; // kilometers
    duration: number; // minutes
    coordinates: [number, number];
  }>;
}

export interface GeocodeResult {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  formattedAddress: string;
  addressComponents: {
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}