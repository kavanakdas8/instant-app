"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Instant {
  id: string;
  url: string;
  type: 'image' | 'video';
  timestamp: string;
  caption?: string;
  author: string;
  authorUsername: string;
  authorAvatar: string;
  likes: number;
  likedByCurrentUser?: boolean;
  comments: Comment[];
  audience: 'Public' | 'Friends' | string; // public, friends, or groupId
  destination?: string;
  hasOpenGroup?: boolean;
  groupId?: string;
  region?: string;
  country?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  authorUsername: string;
  text: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  instant?: Instant; // shared instant in chat
  replyToId?: string;
}

export interface ItineraryStop {
  id: string;
  name: string;
  votes: number;
  votedBy: string[]; // usernames
}

export interface TravelGroup {
  id: string;
  name: string;
  destination: string;
  vibe: string;
  description: string;
  avatar: string;
  membersCount: number;
  members: string[]; // usernames
  recentInstants: string[]; // Instant URLs
  messages: ChatMessage[];
  pinnedMessages: string[];
  adminUsername: string;
  travelDates?: string;
  itinerary?: ItineraryStop[];
}

export interface JoinRequest {
  id: string;
  groupId: string;
  username: string; // applicant username
  status: 'pending' | 'approved' | 'declined';
  applicantName: string;
  applicantAvatar: string;
  applicantBio: string;
  applicantInstants: Instant[]; // past instants history to verify vibe
  applicantMessage?: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: string;
  status?: string;
}

export interface PassportStamp {
  id: string;
  name: string;
  icon: string;
}

export interface TravelerReview {
  id: string;
  text: string;
  author: string;
  authorUsername: string;
  authorAvatar: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  instants: Instant[];
  isLocationShared?: boolean;
  currentLocation?: LocationData;
  stats?: {
    tripsCompleted: number;
    destinationsVisited: number;
    reputationScore: string;
  };
  stamps?: PassportStamp[];
  reviews?: TravelerReview[];
}

export interface PersonalChat {
  id: string; // e.g. "alice_adventures-emma_in_europe"
  usernames: string[]; // participant usernames
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type: 'reaction' | 'system';
  senderUsername?: string;
  senderName?: string;
  senderAvatar?: string;
  emoji?: string;
  postId?: string;
  postUrl?: string;
  message?: string;
  timestamp: string;
  read: boolean;
  recipientUsername: string; // The user who receives this notification
}

interface AppContextType {
  currentUser: UserProfile | null;
  isInitialized: boolean;
  feed: Instant[];
  groups: TravelGroup[];
  joinRequests: JoinRequest[];
  personalChats: PersonalChat[];
  allUsers: UserProfile[];
  notifications: AppNotification[];
  globalTheme: 'light' | 'dark' | 'system';
  setGlobalTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrentUser: (user: UserProfile | null) => void;
  login: (username: string) => boolean;
  signup: (name: string, username: string, bio: string, avatarUrl?: string) => boolean;
  logout: () => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  requestToJoinGroup: (groupId: string, message?: string) => void;
  approveJoinRequest: (requestId: string) => void;
  declineJoinRequest: (requestId: string) => void;
  sendGroupMessage: (groupId: string, text: string, attachedInstant?: Instant, replyToId?: string) => void;
  pinGroupMessage: (groupId: string, messageId: string) => void;
  unpinGroupMessage: (groupId: string, messageId: string) => void;
  sendPersonalMessage: (recipientUsername: string, text: string, attachedInstant?: Instant, replyToId?: string) => void;
  addNotification: (recipientUsername: string, emoji?: string, postId?: string, postUrl?: string, type?: 'reaction' | 'system', message?: string) => void;
  markNotificationsAsRead: () => void;
  captureInstant: (mediaUrl: string, type: 'image' | 'video', caption: string, audience: string, destination?: string, region?: string, country?: string, hasOpenGroup?: boolean, groupId?: string) => void;
  deleteInstant: (instantId: string) => void;
  playShutterSound: () => void;
  addItineraryStop: (groupId: string, name: string) => void;
  voteItineraryStop: (groupId: string, stopId: string) => void;
  toggleLocationSharing: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// High-quality vertical media from Unsplash & Mixkit (free standard URLs)
const MOCK_FEED: Instant[] = [
  {
    id: 'f1',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop', // beautiful beach sunset
    type: 'image',
    timestamp: '2 hours ago',
    caption: 'Waking up to these coastlines is something else 🌊🇮🇹',
    author: 'Emma Watson',
    authorUsername: 'emma_in_europe',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    likes: 342,
    likedByCurrentUser: false,
    audience: 'Public',
    destination: 'Amalfi Coast',
    region: 'Europe',
    country: 'Italy',
    hasOpenGroup: true,
    groupId: 'backpackers-europe',
    comments: [
      {
        id: 'c1',
        author: 'Kento Sato',
        authorUsername: 'kento_tokyo',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'This is absolute paradise! Added to my checklist.',
        timestamp: '1 hour ago'
      },
      {
        id: 'c2',
        author: 'Bob Vance',
        authorUsername: 'bob_travels',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        text: 'Are you staying in Positano or Amalfi town?',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'f2',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-urban-tokyo-street-with-neon-lights-at-night-42247-large.mp4', // vertical layout preview
    type: 'video',
    timestamp: '5 hours ago',
    caption: 'Neon rain hits different 🌧️🏙️🇯🇵',
    author: 'Kento Sato',
    authorUsername: 'kento_tokyo',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    likes: 856,
    likedByCurrentUser: true,
    audience: 'Public',
    destination: 'Tokyo',
    region: 'Asia',
    country: 'Japan',
    hasOpenGroup: true,
    groupId: 'wanderlust-photographers',
    comments: [
      {
        id: 'c3',
        author: 'Emma Watson',
        authorUsername: 'emma_in_europe',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Wow, the colors in this video are incredible!',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'f3',
    url: 'https://images.unsplash.com/photo-1527838832700-50592524df75?q=80&w=600&auto=format&fit=crop', // Cappadocia hot air balloons
    type: 'image',
    timestamp: '1 day ago',
    caption: 'Sunrises here are magical. Truly felt like another planet. 🎈✨',
    author: 'Alice Cooper',
    authorUsername: 'alice_adventures',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    likes: 1205,
    likedByCurrentUser: false,
    audience: 'Public',
    destination: 'Cappadocia',
    region: 'Europe',
    country: 'Turkey',
    hasOpenGroup: true,
    groupId: 'wanderlust-photographers',
    comments: []
  },
  {
    id: 'f4',
    url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    timestamp: '1 day ago',
    caption: 'Opera House vibes! 🇦🇺',
    author: 'Bob Vance',
    authorUsername: 'bob_travels',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    likes: 145,
    likedByCurrentUser: false,
    audience: 'Public',
    destination: 'Sydney',
    region: 'Oceania',
    country: 'Australia',
    hasOpenGroup: true,
    groupId: 'backpackers-europe', // Not Europe, but keeps it simple
    comments: []
  },
  {
    id: 'f5',
    url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600&auto=format&fit=crop', // Positano Italy
    type: 'image',
    timestamp: '2 days ago',
    caption: 'Breathtaking views. 🍝',
    author: 'Emma Watson',
    authorUsername: 'emma_in_europe',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    likes: 543,
    likedByCurrentUser: true,
    audience: 'Public',
    destination: 'Cinque Terre',
    region: 'Europe',
    country: 'Italy',
    hasOpenGroup: false,
    comments: []
  },
  {
    id: 'f6',
    url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&auto=format&fit=crop', // Dubai Desert
    type: 'image',
    timestamp: '3 days ago',
    caption: 'Desert safari! 🐪',
    author: 'Alice Cooper',
    authorUsername: 'alice_adventures',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    likes: 890,
    likedByCurrentUser: false,
    audience: 'Public',
    destination: 'Dubai',
    region: 'Middle East',
    country: 'UAE',
    hasOpenGroup: true,
    groupId: 'wanderlust-photographers',
    comments: []
  },
  {
    id: 'f7',
    url: 'https://images.unsplash.com/photo-1500835595397-b0db40478b03?q=80&w=600&auto=format&fit=crop', // Swiss Alps
    type: 'image',
    timestamp: '3 days ago',
    caption: 'The mountains are calling. 🏔️',
    author: 'Kento Sato',
    authorUsername: 'kento_tokyo',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    likes: 432,
    likedByCurrentUser: false,
    audience: 'Public',
    destination: 'Swiss Alps',
    region: 'Europe',
    country: 'Switzerland',
    hasOpenGroup: false,
    comments: []
  },
  {
    id: 'f8',
    url: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&auto=format&fit=crop', // Kyoto Fushimi Inari
    type: 'image',
    timestamp: '4 days ago',
    caption: 'Inari gates. Magic. ⛩️',
    author: 'Kento Sato',
    authorUsername: 'kento_tokyo',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    likes: 955,
    likedByCurrentUser: true,
    audience: 'Public',
    destination: 'Kyoto',
    region: 'Asia',
    country: 'Japan',
    hasOpenGroup: true,
    groupId: 'wanderlust-photographers',
    comments: []
  },
  {
    id: 'f9',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80', // Arizona road trip
    type: 'image',
    timestamp: '5 days ago',
    caption: 'Roadtrip vibes! 🚐',
    author: 'Bob Vance',
    authorUsername: 'bob_travels',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    likes: 120,
    likedByCurrentUser: false,
    audience: 'Public',
    destination: 'Monument Valley',
    region: 'North America',
    country: 'USA',
    hasOpenGroup: true,
    groupId: 'bali-digital-nomads', // Uses existing mock group
    comments: []
  },
  {
    id: 'f10',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80', // Santorini sunset
    type: 'image',
    timestamp: '1 week ago',
    caption: 'Sunset over the Aegean. Unreal. 🌅',
    author: 'Bob Vance',
    authorUsername: 'bob_travels',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    likes: 243,
    likedByCurrentUser: false,
    audience: 'Public',
    destination: 'Santorini',
    region: 'Europe',
    country: 'Greece',
    hasOpenGroup: false,
    comments: []
  }
];

const MOCK_GROUPS: TravelGroup[] = [
  {
    id: 'backpackers-europe',
    name: 'Backpackers Europe',
    destination: 'Europe',
    vibe: 'Budget Backpacking & Hostels',
    description: 'A community for budget travelers, hostel-hoppers, and train riders exploring Europe. Share hidden alleyways, cheap eats, and Eurail hacks!',
    avatar: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=200&q=80',
    membersCount: 1280,
    members: ['emma_in_europe', 'alice_adventures', 'bob_travels'],
    recentInstants: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=300&auto=format&fit=crop', // Eiffel Tower
    ],
    adminUsername: 'emma_in_europe',
    travelDates: 'Sep 10 - Sep 25',
    itinerary: [
      { id: 'it1', name: 'Eiffel Tower Picnic', votes: 12, votedBy: ['emma_in_europe', 'alice_adventures'] },
      { id: 'it2', name: 'Louvre Morning Tour', votes: 8, votedBy: ['bob_travels'] }
    ],
    messages: [
      {
        id: 'gm1',
        senderId: 'u2',
        senderName: 'Emma Watson',
        senderUsername: 'emma_in_europe',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Hey group! Welcome. Currently planning a meetup in Prague for early September. Anyone around?',
        timestamp: '10:14 AM'
      },
      {
        id: 'gm2',
        senderId: 'u1',
        senderName: 'Alice Cooper',
        senderUsername: 'alice_adventures',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'Ooh, I will be in Budapest around then but could train up to Prague! Keep me posted.',
        timestamp: '10:30 AM'
      }
    ],
    pinnedMessages: ['gm1']
  },
  {
    id: 'solo-japan-2026',
    name: 'Solo Japan 2026',
    destination: 'Japan',
    vibe: 'Food, Shrines & City Neon',
    description: 'Navigating the bullet trains, sushi counters, and mountain trails of Japan. Open to anyone planning or currently on a solo trip to Japan!',
    avatar: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80',
    membersCount: 842,
    members: ['kento_tokyo'],
    recentInstants: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80',
    ],
    adminUsername: 'kento_tokyo',
    messages: [
      {
        id: 'jm1',
        senderId: 'u3',
        senderName: 'Kento Sato',
        senderUsername: 'kento_tokyo',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Welcome to Solo Japan chat! I just pinned the bullet train route guide for first-timers.',
        timestamp: 'Yesterday'
      }
    ],
    pinnedMessages: ['jm1']
  },
  {
    id: 'wanderlust-photographers',
    name: 'Wanderlust Photographers',
    destination: 'Global',
    vibe: 'Visual Storytelling & Aesthetics',
    description: 'For photographers capturing travel moments. Share your Instants, discuss gear, settings, and coordinate sunset shoots globally.',
    avatar: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d84a?auto=format&fit=crop&w=200&q=80',
    membersCount: 3,
    members: ['alice_adventures', 'emma_in_europe', 'kento_tokyo'],
    recentInstants: [
      'https://images.unsplash.com/photo-1527838832700-50592524df75?q=80&w=300&auto=format&fit=crop',
    ],
    adminUsername: 'alice_adventures', // Current user is admin!
    messages: [
      {
        id: 'wp1',
        senderId: 'u1',
        senderName: 'Alice Cooper',
        senderUsername: 'alice_adventures',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'Hey folks, share your absolute best golden hour shots here today!',
        timestamp: '3 hours ago'
      }
    ],
    pinnedMessages: ['wp1']
  }
];

const MOCK_REQUESTS: JoinRequest[] = [
  {
    id: 'req1',
    groupId: 'wanderlust-photographers',
    username: 'bob_travels',
    status: 'pending',
    applicantName: 'Bob Vance',
    applicantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    applicantBio: 'Roadtripper and landscape seeker. Camping across national parks with my trusty old campervan.',
    applicantInstants: [
      {
        id: 'b1',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80', // Arizona road trip
        type: 'image',
        timestamp: '3 days ago',
        caption: 'Highway 163 leading into Monument Valley 🌵🚗',
        author: 'Bob Vance',
        authorUsername: 'bob_travels',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        likes: 120,
        comments: [],
        audience: 'Public'
      },
      {
        id: 'b2',
        url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80', // Santorini sunset
        type: 'image',
        timestamp: '1 week ago',
        caption: 'Blue domes and orange glows 🌅🇬🇷',
        author: 'Bob Vance',
        authorUsername: 'bob_travels',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        likes: 243,
        comments: [],
        audience: 'Public'
      }
    ]
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    name: 'Alice Cooper',
    username: 'alice_adventures',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    bio: 'Finding the best coffee shops around the world. ☕🌍',
    instants: [],
    isLocationShared: true,
    currentLocation: { lat: 30, lng: 45, timestamp: '1m ago', speed: 'Stopped' },
    stats: { tripsCompleted: 14, destinationsVisited: 8, reputationScore: '4.9 (24 Reviews)' },
    stamps: [
      { id: 's1', name: 'Mysore Explorer', icon: '🏛️' },
      { id: 's2', name: 'Coorg Trailblazer', icon: '☕' },
      { id: 's3', name: 'Gokarna Nomad', icon: '🏖️' }
    ],
    reviews: [
      {
        id: 'r1',
        text: 'Great trail partner in Coorg! Very organized.',
        author: 'Emma Watson',
        authorUsername: 'emma_in_europe',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        timestamp: '2 weeks ago'
      }
    ]
  },
  {
    name: 'Emma Watson',
    username: 'emma_in_europe',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'Backpacker. Usually found near a train station. 🚆',
    instants: [],
    isLocationShared: true,
    currentLocation: { lat: 60, lng: 60, timestamp: 'Just now', speed: 'Moving • 15 km/h' },
    stats: { tripsCompleted: 4, destinationsVisited: 12, reputationScore: '4.8 (10 Reviews)' },
    stamps: [
      { id: 's4', name: 'Western Ghats Trekker', icon: '⛰️' },
      { id: 's5', name: 'Eurotrip Veteran', icon: '🌍' }
    ],
    reviews: [
      {
        id: 'r2',
        text: 'Super fun to travel with, knew all the best spots in Florence.',
        author: 'Alice Cooper',
        authorUsername: 'alice_adventures',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        timestamp: '1 month ago'
      }
    ]
  },
  {
    name: 'Kento Sato',
    username: 'kento_tokyo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bio: 'Solo Tokyo explorer. Looking for the best ramen and hidden alleys. 🍜🇯🇵',
    instants: []
  },
  {
    name: 'Bob Vance',
    username: 'bob_travels',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    bio: 'Roadtripper and landscape seeker. Camping across national parks with my trusty old campervan.',
    instants: []
  }
];

export const MOCK_PERSONAL_CHATS: PersonalChat[] = [
  {
    id: 'alice_adventures-emma_in_europe',
    usernames: ['alice_adventures', 'emma_in_europe'],
    messages: [
      {
        id: 'pm1',
        senderId: 'emma_in_europe',
        senderName: 'Emma Watson',
        senderUsername: 'emma_in_europe',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Hey Alice! Loved your hot air balloon photo. Let me know when you are free to discuss our next camera gear setup.',
        timestamp: 'Yesterday'
      },
      {
        id: 'pm2',
        senderId: 'alice_adventures',
        senderName: 'Alice Cooper',
        senderUsername: 'alice_adventures',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'Thanks Emma! I have some free time tonight. Are you online?',
        timestamp: 'Yesterday'
      }
    ]
  },
  {
    id: 'alice_adventures-kento_tokyo',
    usernames: ['alice_adventures', 'kento_tokyo'],
    messages: [
      {
        id: 'pm3',
        senderId: 'kento_tokyo',
        senderName: 'Kento Sato',
        senderUsername: 'kento_tokyo',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Hi Alice, I am heading to a hidden ramen spot in Shibuya. Would love to get some photography tips from you.',
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: 'bob_travels-emma_in_europe',
    usernames: ['bob_travels', 'emma_in_europe'],
    messages: [
      {
        id: 'pm4',
        senderId: 'bob_travels',
        senderName: 'Bob Vance',
        senderUsername: 'bob_travels',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        text: 'Hi Emma, does the Backpackers Prague meetup have a set date yet?',
        timestamp: '2 days ago'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'reaction',
    senderUsername: 'emma_in_europe',
    senderName: 'Emma Watson',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    emoji: '❤️',
    postId: 'f3',
    postUrl: 'https://images.unsplash.com/photo-1527838832700-50592524df75?q=80&w=600&auto=format&fit=crop',
    timestamp: '2 hours ago',
    read: false,
    recipientUsername: 'alice_adventures'
  },
  {
    id: 'n2',
    type: 'reaction',
    senderUsername: 'kento_tokyo',
    senderName: 'Kento Sato',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    emoji: '👀',
    postId: 'f3',
    postUrl: 'https://images.unsplash.com/photo-1527838832700-50592524df75?q=80&w=600&auto=format&fit=crop',
    timestamp: '5 hours ago',
    read: true,
    recipientUsername: 'alice_adventures'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [feed, setFeed] = useState<Instant[]>(MOCK_FEED);
  const [groups, setGroups] = useState<TravelGroup[]>(MOCK_GROUPS);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(MOCK_REQUESTS);
  const [personalChats, setPersonalChats] = useState<PersonalChat[]>(MOCK_PERSONAL_CHATS);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [globalTheme, setGlobalTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Restore user session on startup and load any registered users
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUsers = localStorage.getItem('instants_registered_users');
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers) as UserProfile[];
          setAllUsers(parsed);
        }

        const stored = localStorage.getItem('instants_current_user');
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }

        const storedTheme = localStorage.getItem('instants_theme') as 'light' | 'dark' | 'system';
        if (storedTheme) {
          setGlobalTheme(storedTheme);
        }
      }
    } catch (e) {
      console.warn("Could not read localStorage for auth session:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync currentUser with localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (typeof window !== 'undefined') {
        if (currentUser) {
          localStorage.setItem('instants_current_user', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('instants_current_user');
        }
      }
    } catch (e) {
      console.warn("Could not sync auth session to localStorage:", e);
    }
  }, [currentUser, isInitialized]);

  // Sync theme with localStorage and document
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('instants_theme', globalTheme);
        let activeTheme = globalTheme;
        if (activeTheme === 'system') {
          activeTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        document.documentElement.setAttribute('data-theme', activeTheme);
      }
    } catch (e) {
      console.warn("Could not sync theme:", e);
    }
  }, [globalTheme, isInitialized]);

  // Keep allUsers instants updated from feed
  useEffect(() => {
    setAllUsers(prevUsers =>
      prevUsers.map(user => ({
        ...user,
        instants: feed.filter(f => f.authorUsername === user.username)
      }))
    );
  }, [feed]);

  const login = (identifier: string): boolean => {
    const clean = identifier.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!clean) return false;

    // Check alias maps
    let targetUsername = clean;
    if (clean === 'alice') targetUsername = 'alice_adventures';
    if (clean === 'emma') targetUsername = 'emma_in_europe';
    if (clean === 'kento') targetUsername = 'kento_tokyo';
    if (clean === 'bob') targetUsername = 'bob_travels';

    // Find in all registered/mock users
    const matchedUser = allUsers.find(
      u => u.username.toLowerCase() === targetUsername || u.username.toLowerCase() === clean
    );

    if (matchedUser) {
      const userProfileWithInstants: UserProfile = {
        ...matchedUser,
        instants: feed.filter(f => f.authorUsername === matchedUser.username)
      };
      setCurrentUser(userProfileWithInstants);
      return true;
    }

    // Return false if user does not exist so UI can suggest signup
    return false;
  };

  const signup = (name: string, username: string, bio: string, avatarUrl?: string): boolean => {
    const formattedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!formattedUsername) return false;

    const newUser: UserProfile = {
      name: name.trim() || formattedUsername,
      username: formattedUsername,
      avatar: avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      bio: bio.trim() || 'Exploring the world one Instant at a time.',
      instants: []
    };

    setAllUsers(prev => {
      const filtered = prev.filter(u => u.username !== formattedUsername);
      const updated = [...filtered, newUser];
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('instants_registered_users', JSON.stringify(updated));
        }
      } catch (err) {
        console.warn("Could not save registered users:", err);
      }
      return updated;
    });

    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const likePost = (postId: string) => {
    setFeed(prevFeed =>
      prevFeed.map(post => {
        if (post.id === postId) {
          const liked = !post.likedByCurrentUser;
          return {
            ...post,
            likes: liked ? post.likes + 1 : post.likes - 1,
            likedByCurrentUser: liked
          };
        }
        return post;
      })
    );

    // Also update current user's profile instants if it belongs to them
    if (currentUser) {
      setCurrentUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          instants: prevUser.instants.map(inst => {
            if (inst.id === postId) {
              const liked = !inst.likedByCurrentUser;
              return {
                ...inst,
                likes: liked ? inst.likes + 1 : inst.likes - 1,
                likedByCurrentUser: liked
              };
            }
            return inst;
          })
        };
      });
    }
  };

  const addComment = (postId: string, text: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      author: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      text,
      timestamp: 'Just now'
    };

    setFeed(prevFeed =>
      prevFeed.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  const deleteComment = (postId: string, commentId: string) => {
    setFeed(prevFeed =>
      prevFeed.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId)
          };
        }
        return post;
      })
    );
  };

  const requestToJoinGroup = (groupId: string, message?: string) => {
    if (!currentUser) return;

    // Check if request already exists
    const exists = joinRequests.some(r => r.groupId === groupId && r.username === currentUser.username);
    if (exists) return;

    // Create a new join request
    const newRequest: JoinRequest = {
      id: `req_${Date.now()}`,
      groupId,
      username: currentUser.username,
      status: 'pending',
      applicantName: currentUser.name,
      applicantAvatar: currentUser.avatar,
      applicantBio: currentUser.bio,
      applicantInstants: currentUser.instants,
      applicantMessage: message
    };

    setJoinRequests(prev => [...prev, newRequest]);
  };

  const approveJoinRequest = (requestId: string) => {
    const request = joinRequests.find(r => r.id === requestId);
    if (!request) return;

    // Update request status
    setJoinRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );

    // Add user to the group
    setGroups(prevGroups =>
      prevGroups.map(g => {
        if (g.id === request.groupId) {
          
          // Send notification to the applicant
          addNotification(
            request.username,
            undefined,
            undefined,
            undefined,
            'system',
            `Your request to join ${g.name} was approved!`
          );

          return {
            ...g,
            members: [...g.members, request.username],
            membersCount: g.membersCount + 1,
            messages: [
              ...g.messages,
              {
                id: `sys_${Date.now()}`,
                senderId: 'system',
                senderName: 'System',
                senderUsername: 'system',
                senderAvatar: '',
                text: `@${request.username} has joined the trip! 🎉`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return g;
      })
    );
  };

  const declineJoinRequest = (requestId: string) => {
    setJoinRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'declined' } : r))
    );
  };

  const sendPersonalMessage = (recipientUsername: string, text: string, attachedInstant?: Instant, replyToId?: string) => {
    if (!currentUser) return;

    const sorted = [currentUser.username, recipientUsername].sort();
    const chatId = `${sorted[0]}-${sorted[1]}`;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.username,
      senderName: currentUser.name,
      senderUsername: currentUser.username,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instant: attachedInstant,
      replyToId
    };

    setPersonalChats(prev => {
      const exists = prev.some(c => c.id === chatId);
      if (exists) {
        return prev.map(c => {
          if (c.id === chatId) {
            return { ...c, messages: [...c.messages, newMessage] };
          }
          return c;
        });
      } else {
        return [
          ...prev,
          {
            id: chatId,
            usernames: [currentUser.username, recipientUsername],
            messages: [newMessage]
          }
        ];
      }
    });
  };

  const sendGroupMessage = (groupId: string, text: string, attachedInstant?: Instant, replyToId?: string) => {
    if (!currentUser) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.username,
      senderName: currentUser.name,
      senderUsername: currentUser.username,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instant: attachedInstant,
      replyToId
    };

    setGroups(prevGroups =>
      prevGroups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            messages: [...g.messages, newMessage]
          };
        }
        return g;
      })
    );
  };

  const pinGroupMessage = (groupId: string, messageId: string) => {
    setGroups(prevGroups =>
      prevGroups.map(g => {
        if (g.id === groupId) {
          if (!g.pinnedMessages.includes(messageId)) {
            return {
              ...g,
              pinnedMessages: [...g.pinnedMessages, messageId]
            };
          }
        }
        return g;
      })
    );
  };

  const unpinGroupMessage = (groupId: string, messageId: string) => {
    setGroups(prevGroups =>
      prevGroups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            pinnedMessages: g.pinnedMessages.filter(id => id !== messageId)
          };
        }
        return g;
      })
    );
  };

  const captureInstant = (mediaUrl: string, type: 'image' | 'video', caption: string, audience: string, destination?: string, region?: string, country?: string, hasOpenGroup?: boolean, groupId?: string) => {
    if (!currentUser) return;

    const newInstant: Instant = {
      id: `inst_${Date.now()}`,
      url: mediaUrl,
      type,
      timestamp: 'Just now',
      caption,
      author: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      likes: 0,
      likedByCurrentUser: false,
      comments: [],
      audience,
      destination,
      region,
      country,
      hasOpenGroup,
      groupId

    };

    // Add to user's history
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        instants: [newInstant, ...prevUser.instants]
      };
    });

    // If audience is Public, add to global feed
    if (audience === 'Public') {
      setFeed(prevFeed => [newInstant, ...prevFeed]);
    } 
    // If audience is a group, share it to the group chat
    else if (audience !== 'Friends') {
      // Find the group and attach as a message
      sendGroupMessage(audience, `Shared a live Instant! 📸`, newInstant);
      
      // Update recent instants list in the group
      setGroups(prevGroups =>
        prevGroups.map(g => {
          if (g.id === audience) {
            return {
              ...g,
              recentInstants: [newInstant.url, ...g.recentInstants.slice(0, 3)]
            };
          }
          return g;
        })
      );
    }
  };

  const deleteInstant = (instantId: string) => {
    if (!currentUser) return;
    
    // Remove from global feed if it exists there
    setFeed(prevFeed => prevFeed.filter(inst => inst.id !== instantId));
    
    // Remove from current user's profile
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        instants: prevUser.instants.filter(inst => inst.id !== instantId)
      };
    });
  };

  // Sound synthesis to create a premium tactile camera click
  const playShutterSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.08; // 80ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // White noise for shutter snap
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      // Bandpass filter centered at 1500Hz
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1500;
      filter.Q.value = 2;
      
      // Quick exponential ramp down
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.warn("AudioContext block/error:", e);
    }
  };

  const addNotification = (recipientUsername: string, emoji?: string, postId?: string, postUrl?: string, type: 'reaction' | 'system' = 'reaction', message?: string) => {
    if (!currentUser && type !== 'system') return;
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type,
      senderUsername: currentUser?.username,
      senderName: currentUser?.name,
      senderAvatar: currentUser?.avatar,
      emoji,
      postId,
      postUrl,
      message,
      timestamp: 'Just now',
      read: false,
      recipientUsername
    };
    
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => (n.recipientUsername === currentUser.username ? { ...n, read: true } : n))
    );
  };

  const addItineraryStop = (groupId: string, name: string) => {
    setGroups(prevGroups => 
      prevGroups.map(g => {
        if (g.id === groupId) {
          const newStop: ItineraryStop = {
            id: `stop_${Date.now()}`,
            name,
            votes: 1,
            votedBy: currentUser ? [currentUser.username] : []
          };
          return {
            ...g,
            itinerary: [...(g.itinerary || []), newStop]
          };
        }
        return g;
      })
    );
  };

  const voteItineraryStop = (groupId: string, stopId: string) => {
    if (!currentUser) return;
    setGroups(prevGroups => 
      prevGroups.map(g => {
        if (g.id === groupId && g.itinerary) {
          return {
            ...g,
            itinerary: g.itinerary.map(stop => {
              if (stop.id === stopId) {
                const hasVoted = stop.votedBy.includes(currentUser.username);
                if (hasVoted) {
                  return { ...stop, votes: stop.votes - 1, votedBy: stop.votedBy.filter(u => u !== currentUser.username) };
                } else {
                  return { ...stop, votes: stop.votes + 1, votedBy: [...stop.votedBy, currentUser.username] };
                }
              }
              return stop;
            })
          };
        }
        return g;
      })
    );
  };

  const toggleLocationSharing = () => {
    if (!currentUser) return;
    const isShared = !currentUser.isLocationShared;
    const mockLocation = { lat: 50, lng: 50, timestamp: 'Just now', speed: 'Stopped' };
    
    setCurrentUser({
      ...currentUser,
      isLocationShared: isShared,
      currentLocation: isShared ? mockLocation : undefined
    });

    setAllUsers(prev => prev.map(u => 
      u.username === currentUser.username ? {
        ...u,
        isLocationShared: isShared,
        currentLocation: isShared ? mockLocation : undefined
      } : u
    ));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isInitialized,
        feed,
        groups,
        joinRequests,
        personalChats,
        allUsers,
        notifications,
        globalTheme,
        setGlobalTheme,
        setCurrentUser,
        login,
        signup,
        logout,
        likePost,
        addComment,
        deleteComment,
        requestToJoinGroup,
        approveJoinRequest,
        declineJoinRequest,
        sendGroupMessage,
        pinGroupMessage,
        unpinGroupMessage,
        sendPersonalMessage,
        addNotification,
        markNotificationsAsRead,
        captureInstant,
        deleteInstant,
        playShutterSound,
        addItineraryStop,
        voteItineraryStop,
        toggleLocationSharing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
