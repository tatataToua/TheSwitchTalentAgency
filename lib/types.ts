export interface DJ {
  id: string
  name: string
  slug: string
  genre: string[]
  location: string
  image: string
  bio: string
  experience: string
  equipment: string[]
  socialMedia: {
    instagram?: string
    soundcloud?: string
    spotify?: string
    twitter?: string
  }
  mixSamples: {
    title: string
    url: string
    duration: string
  }[]
  upcomingGigs: {
    venue: string
    date: string
    time: string
    city: string
  }[]
  residencies: string[]
  achievements: string[]
  bookingRate: string
  availability: "available" | "busy" | "booked"
  rating: number
  totalGigs: number
  joinedDate: string
  isActive: boolean
}

export interface Venue {
  id: string
  name: string
  location: string
  city: string
  capacity: number
  type: string
  image: string
  description: string
  amenities: string[]
  contactInfo: {
    email: string
    phone: string
    website?: string
  }
  preferredGenres: string[]
  isActive: boolean
}

export interface Booking {
  id: string
  djId: string
  venueId: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  rate: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface TradeRequest {
  id: string
  requestingDjId: string
  targetDjId: string
  originalBookingId: string
  proposedBookingId: string
  status: "pending" | "accepted" | "declined"
  message?: string
  createdAt: string
}

export interface ContactInquiry {
  id: string
  type: "booking" | "general" | "dj-application" | "trade-request"
  name: string
  email: string
  phone?: string
  message: string
  djId?: string
  venueId?: string
  eventDate?: string
  status: "new" | "in-progress" | "resolved"
  createdAt: string
}
