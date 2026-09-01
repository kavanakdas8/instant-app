export interface Destination {
  id: string;
  name: string;
  state?: string;
  country: string;
  region: string;
  category: 'India Getaways' | 'Himalayas' | 'International';
  isTrending?: boolean;
}

export const DESTINATIONS: Destination[] = [
  // South India & Ghats -> India Getaways
  { id: 'mysore', name: 'Mysore', state: 'Karnataka', country: 'India', region: 'South India & Ghats', category: 'India Getaways', isTrending: true },
  { id: 'coorg', name: 'Coorg', state: 'Karnataka', country: 'India', region: 'South India & Ghats', category: 'India Getaways', isTrending: true },
  { id: 'gokarna', name: 'Gokarna', state: 'Karnataka', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'hampi', name: 'Hampi', state: 'Karnataka', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'ooty', name: 'Ooty', state: 'Tamil Nadu', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'munnar', name: 'Munnar', state: 'Kerala', country: 'India', region: 'South India & Ghats', category: 'India Getaways', isTrending: true },
  { id: 'wayanad', name: 'Wayanad', state: 'Kerala', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'kodaikanal', name: 'Kodaikanal', state: 'Tamil Nadu', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'varkala', name: 'Varkala', state: 'Kerala', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'chikmagalur', name: 'Chikmagalur', state: 'Karnataka', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'alleppey', name: 'Alleppey', state: 'Kerala', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },
  { id: 'pondicherry', name: 'Pondicherry', country: 'India', region: 'South India & Ghats', category: 'India Getaways' },

  // North & Himalayas -> Himalayas
  { id: 'manali', name: 'Manali', state: 'Himachal Pradesh', country: 'India', region: 'North & Himalayas', category: 'Himalayas', isTrending: true },
  { id: 'leh-ladakh', name: 'Leh Ladakh', state: 'Ladakh', country: 'India', region: 'North & Himalayas', category: 'Himalayas', isTrending: true },
  { id: 'kasol', name: 'Kasol', state: 'Himachal Pradesh', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'spiti-valley', name: 'Spiti Valley', state: 'Himachal Pradesh', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'dharamshala', name: 'Dharamshala', state: 'Himachal Pradesh', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'gulmarg', name: 'Gulmarg', state: 'Jammu & Kashmir', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'nainital', name: 'Nainital', state: 'Uttarakhand', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },
  { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand', country: 'India', region: 'North & Himalayas', category: 'Himalayas' },

  // West & Coastal India -> India Getaways
  { id: 'goa', name: 'Goa', country: 'India', region: 'West & Coastal India', category: 'India Getaways', isTrending: true },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', country: 'India', region: 'West & Coastal India', category: 'India Getaways', isTrending: true },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', country: 'India', region: 'West & Coastal India', category: 'India Getaways' },
  { id: 'jaisalmer', name: 'Jaisalmer', state: 'Rajasthan', country: 'India', region: 'West & Coastal India', category: 'India Getaways' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', country: 'India', region: 'West & Coastal India', category: 'India Getaways' },
  { id: 'lonavala', name: 'Lonavala', state: 'Maharashtra', country: 'India', region: 'West & Coastal India', category: 'India Getaways' },
  { id: 'rann-of-kutch', name: 'Rann of Kutch', state: 'Gujarat', country: 'India', region: 'West & Coastal India', category: 'India Getaways' },
  { id: 'mount-abu', name: 'Mount Abu', state: 'Rajasthan', country: 'India', region: 'West & Coastal India', category: 'India Getaways' },

  // East & Northeast India -> India Getaways
  { id: 'darjeeling', name: 'Darjeeling', state: 'West Bengal', country: 'India', region: 'East & Northeast India', category: 'India Getaways' },
  { id: 'gangtok', name: 'Gangtok', state: 'Sikkim', country: 'India', region: 'East & Northeast India', category: 'India Getaways' },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', country: 'India', region: 'East & Northeast India', category: 'India Getaways' },
  { id: 'tawang', name: 'Tawang', state: 'Arunachal Pradesh', country: 'India', region: 'East & Northeast India', category: 'India Getaways' },
  { id: 'kaziranga', name: 'Kaziranga', state: 'Assam', country: 'India', region: 'East & Northeast India', category: 'India Getaways' },
  { id: 'ziro-valley', name: 'Ziro Valley', state: 'Arunachal Pradesh', country: 'India', region: 'East & Northeast India', category: 'India Getaways' },
  { id: 'puri', name: 'Puri', state: 'Odisha', country: 'India', region: 'East & Northeast India', category: 'India Getaways' },

  // Southeast Asia & East Asia -> International
  { id: 'bali', name: 'Bali', country: 'Indonesia', region: 'Southeast Asia', category: 'International', isTrending: true },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', region: 'Southeast Asia', category: 'International' },
  { id: 'phuket', name: 'Phuket', country: 'Thailand', region: 'Southeast Asia', category: 'International' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', region: 'East Asia', category: 'International', isTrending: true },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', region: 'East Asia', category: 'International' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', region: 'Southeast Asia', category: 'International' },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', region: 'Southeast Asia', category: 'International' },
  { id: 'da-nang', name: 'Da Nang', country: 'Vietnam', region: 'Southeast Asia', category: 'International' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', region: 'East Asia', category: 'International' },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', region: 'Southeast Asia', category: 'International' },

  // Middle East & Europe -> International
  { id: 'dubai', name: 'Dubai', country: 'UAE', region: 'Middle East', category: 'International', isTrending: true },
  { id: 'cappadocia', name: 'Cappadocia', country: 'Turkey', region: 'Europe', category: 'International' },
  { id: 'santorini', name: 'Santorini', country: 'Greece', region: 'Europe', category: 'International' },
  { id: 'amalfi-coast', name: 'Amalfi Coast', country: 'Italy', region: 'Europe', category: 'International', isTrending: true },
  { id: 'paris', name: 'Paris', country: 'France', region: 'Europe', category: 'International' },
  { id: 'interlaken', name: 'Interlaken', country: 'Switzerland', region: 'Europe', category: 'International' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', region: 'Europe', category: 'International' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', region: 'Europe', category: 'International' },
  { id: 'rome', name: 'Rome', country: 'Italy', region: 'Europe', category: 'International' },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', region: 'Europe', category: 'International' },

  // Americas & Africa -> International
  { id: 'banff', name: 'Banff', country: 'Canada', region: 'Americas', category: 'International' },
  { id: 'cusco', name: 'Cusco', country: 'Peru', region: 'Americas', category: 'International' },
  { id: 'patagonia', name: 'Patagonia', country: 'Argentina', region: 'Americas', category: 'International' },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', region: 'Africa', category: 'International' },
  { id: 'queenstown', name: 'Queenstown', country: 'New Zealand', region: 'Oceania', category: 'International' },
  { id: 'maui', name: 'Maui', country: 'USA', region: 'Americas', category: 'International' },
];

export const getDestinationFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'India': '🇮🇳',
    'Indonesia': '🇮🇩',
    'Thailand': '🇹🇭',
    'Japan': '🇯🇵',
    'Singapore': '🇸🇬',
    'Vietnam': '🇻🇳',
    'South Korea': '🇰🇷',
    'Malaysia': '🇲🇾',
    'UAE': '🇦🇪',
    'Turkey': '🇹🇷',
    'Greece': '🇬🇷',
    'Italy': '🇮🇹',
    'France': '🇫🇷',
    'Switzerland': '🇨🇭',
    'Netherlands': '🇳🇱',
    'Spain': '🇪🇸',
    'Czech Republic': '🇨🇿',
    'Canada': '🇨🇦',
    'Peru': '🇵🇪',
    'Argentina': '🇦🇷',
    'South Africa': '🇿🇦',
    'New Zealand': '🇳🇿',
    'USA': '🇺🇸',
  };
  return flags[country] || '📍';
};
