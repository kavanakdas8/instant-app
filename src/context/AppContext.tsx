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
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  instants: Instant[];
}

export interface PersonalChat {
  id: string; // e.g. "alice_adventures-emma_in_europe"
  usernames: string[]; // participant usernames
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type: 'reaction';
  senderUsername: string;
  senderName: string;
  senderAvatar: string;
  emoji: string;
  postId: string;
  postUrl: string;
  timestamp: string;
  read: boolean;
  recipientUsername: string; // The user who receives this notification
}

interface AppContextType {
  currentUser: UserProfile | null;
  feed: Instant[];
  groups: TravelGroup[];
  joinRequests: JoinRequest[];
  personalChats: PersonalChat[];
  allUsers: UserProfile[];
  notifications: AppNotification[];
  setCurrentUser: (user: UserProfile | null) => void;
  login: (username: string) => boolean;
  signup: (name: string, username: string, bio: string) => boolean;
  logout: () => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  requestToJoinGroup: (groupId: string) => void;
  approveJoinRequest: (requestId: string) => void;
  declineJoinRequest: (requestId: string) => void;
  sendGroupMessage: (groupId: string, text: string, attachedInstant?: Instant) => void;
  pinGroupMessage: (groupId: string, messageId: string) => void;
  unpinGroupMessage: (groupId: string, messageId: string) => void;
  sendPersonalMessage: (recipientUsername: string, text: string, attachedInstant?: Instant) => void;
  addNotification: (recipientUsername: string, emoji: string, postId: string, postUrl: string) => void;
  markNotificationsAsRead: () => void;
  captureInstant: (mediaUrl: string, type: 'image' | 'video', caption: string, audience: string) => void;
  deleteInstant: (instantId: string) => void;
  playShutterSound: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// High-quality vertical media from Unsplash & Mixkit (free standard URLs)
const MOCK_FEED: Instant[] = [
  {
    id: 'f1',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop', // beautiful beach sunset
    type: 'image',
    timestamp: '2 hours ago',
    caption: 'Waking up to Italian coastlines is something else 🌊🇮🇹 #amalfi #italy',
    author: 'Emma Watson',
    authorUsername: 'emma_in_europe',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    likes: 342,
    likedByCurrentUser: false,
    audience: 'Public',
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
    caption: 'Shibuya neon rain hits different 🌧️🏙️🇯🇵 #tokyonight #japan',
    author: 'Kento Sato',
    authorUsername: 'kento_tokyo',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    likes: 856,
    likedByCurrentUser: true,
    audience: 'Public',
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
    caption: 'Sunrises in Cappadocia. Truly felt like another planet. 🎈✨ #turkey #wanderlust',
    author: 'Alice Cooper',
    authorUsername: 'alice_adventures',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    likes: 1205,
    likedByCurrentUser: false,
    audience: 'Public',
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
    bio: 'Travel photographer & filmmaker. Searching for the unseen corners of the world. 🌍✨',
    instants: []
  },
  {
    name: 'Emma Watson',
    username: 'emma_in_europe',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'Backpacker traveling across Europe. Currently in Florence! 🍕🗺️',
    instants: []
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
  const [feed, setFeed] = useState<Instant[]>(MOCK_FEED);
  const [groups, setGroups] = useState<TravelGroup[]>(MOCK_GROUPS);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(MOCK_REQUESTS);
  const [personalChats, setPersonalChats] = useState<PersonalChat[]>(MOCK_PERSONAL_CHATS);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    setAllUsers(MOCK_USERS.map(user => ({
      ...user,
      instants: feed.filter(f => f.authorUsername === user.username)
    })));
  }, [feed]);



  const login = (username: string): boolean => {
    // If logging in as existing mock users, load their profile
    if (username === 'alice_adventures' || username === 'alice') {
      setCurrentUser({
        name: 'Alice Cooper',
        username: 'alice_adventures',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        bio: 'Travel photographer & filmmaker. Searching for the unseen corners of the world. 🌍✨',
        instants: feed.filter(f => f.authorUsername === 'alice_adventures')
      });
      return true;
    } else if (username === 'emma_in_europe' || username === 'emma') {
      setCurrentUser({
        name: 'Emma Watson',
        username: 'emma_in_europe',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        bio: 'Backpacker traveling across Europe. Currently in Florence! 🍕🗺️',
        instants: feed.filter(f => f.authorUsername === 'emma_in_europe')
      });
      return true;
    } else if (username === 'kento_tokyo' || username === 'kento') {
      setCurrentUser({
        name: 'Kento Sato',
        username: 'kento_tokyo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        bio: 'Solo Tokyo explorer. Looking for the best ramen and hidden alleys. 🍜🇯🇵',
        instants: feed.filter(f => f.authorUsername === 'kento_tokyo')
      });
      return true;
    }
    
    // Create new profile for unknown user
    setCurrentUser({
      name: username.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&q=80`,
      bio: 'Travel lover and Instants pioneer.',
      instants: []
    });
    return true;
  };

  const signup = (name: string, username: string, bio: string): boolean => {
    const formattedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setCurrentUser({
      name,
      username: formattedUsername,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`, // default friendly avatar
      bio: bio || 'Exploring the world one Instant at a time.',
      instants: []
    });
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

  const requestToJoinGroup = (groupId: string) => {
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
      applicantInstants: currentUser.instants
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
                text: `@${request.username} has joined the group! 🎉`,
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

  const sendPersonalMessage = (recipientUsername: string, text: string, attachedInstant?: Instant) => {
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
      instant: attachedInstant
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

  const sendGroupMessage = (groupId: string, text: string, attachedInstant?: Instant) => {
    if (!currentUser) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.username,
      senderName: currentUser.name,
      senderUsername: currentUser.username,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instant: attachedInstant
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

  const captureInstant = (mediaUrl: string, type: 'image' | 'video', caption: string, audience: string) => {
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
      audience
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

  const addNotification = (recipientUsername: string, emoji: string, postId: string, postUrl: string) => {
    if (!currentUser) return;
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'reaction',
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      emoji,
      postId,
      postUrl,
      timestamp: 'Just now',
      read: false,
      recipientUsername
    };
    // Format sender info correctly
    newNotif.senderUsername = currentUser.username;
    
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => (n.recipientUsername === currentUser.username ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        feed,
        groups,
        joinRequests,
        personalChats,
        allUsers,
        notifications,
        setCurrentUser,
        login,
        signup,
        logout,
        likePost,
        addComment,
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
        playShutterSound
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
