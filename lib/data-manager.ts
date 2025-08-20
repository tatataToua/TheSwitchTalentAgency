import type { DJ, Venue, Booking, ContactInquiry, TradeRequest } from "./types"

class DataManager {
  private static instance: DataManager

  private constructor() {
    this.initializeData()
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  private initializeData() {
    // Initialize with existing data if localStorage is empty
    if (!this.getDJs().length) {
      this.seedInitialData()
    }
  }

  private seedInitialData() {
    const initialDJs: DJ[] = [
      {
        id: "1",
        name: "Nicky Nice",
        slug: "nicky-nice",
        genre: ["House", "Tech House", "Deep House"],
        location: "Miami, FL",
        image: "/professional-dj-mixing.png",
        bio: "Nicky Nice has been setting dance floors ablaze for over 8 years with his infectious house beats and seamless mixing skills.",
        experience: "8+ years",
        equipment: ["Pioneer CDJ-3000", "DJM-900NXS2", "Technics SL-1200"],
        socialMedia: {
          instagram: "@nickynice_dj",
          soundcloud: "nickynice",
          spotify: "Nicky Nice",
        },
        mixSamples: [
          { title: "Miami Nights Mix", url: "#", duration: "45:30" },
          { title: "Deep House Sessions", url: "#", duration: "38:15" },
        ],
        upcomingGigs: [
          { venue: "LIV Miami", date: "2024-01-15", time: "11:00 PM", city: "Miami" },
          { venue: "Story Nightclub", date: "2024-01-22", time: "10:30 PM", city: "Miami" },
        ],
        residencies: ["LIV Miami", "Story Nightclub"],
        achievements: ["Miami Music Week 2023 Headliner", "Ultra Music Festival 2022"],
        bookingRate: "$2,500 - $5,000",
        availability: "available",
        rating: 4.8,
        totalGigs: 150,
        joinedDate: "2020-03-15",
        isActive: true,
      },
      {
        id: "2",
        name: "Tony Jack",
        slug: "tony-jack",
        genre: ["Progressive House", "Trance", "Melodic Techno"],
        location: "Las Vegas, NV",
        image: "/professional-dj-performing.png",
        bio: "Tony Jack brings progressive house and trance to life with his emotional storytelling through music.",
        experience: "6+ years",
        equipment: ["Pioneer CDJ-2000NXS2", "DJM-750MK2", "KRK Rokit 8"],
        socialMedia: {
          instagram: "@tonyjack_music",
          soundcloud: "tonyjackofficial",
          spotify: "Tony Jack",
        },
        mixSamples: [
          { title: "Vegas Vibes", url: "#", duration: "52:20" },
          { title: "Trance Journey", url: "#", duration: "41:45" },
        ],
        upcomingGigs: [{ venue: "XS Nightclub", date: "2024-01-18", time: "12:00 AM", city: "Las Vegas" }],
        residencies: ["XS Nightclub", "Hakkasan"],
        achievements: ["EDC Las Vegas 2023", "Tomorrowland 2022"],
        bookingRate: "$3,000 - $6,000",
        availability: "busy",
        rating: 4.9,
        totalGigs: 120,
        joinedDate: "2021-01-10",
        isActive: true,
      },
      {
        id: "3",
        name: "Brotherhood",
        slug: "brotherhood",
        genre: ["Hip Hop", "R&B", "Afrobeats"],
        location: "Atlanta, GA",
        image: "/dj-duo-hip-hop.png",
        bio: "The Brotherhood duo brings the hottest hip hop and R&B tracks with unmatched energy and crowd interaction.",
        experience: "10+ years",
        equipment: ["Serato DJ Pro", "Pioneer DDJ-SZ2", "JBL PRX815W"],
        socialMedia: {
          instagram: "@brotherhood_djs",
          soundcloud: "brotherhoodatl",
          spotify: "Brotherhood ATL",
        },
        mixSamples: [
          { title: "ATL Nights", url: "#", duration: "35:10" },
          { title: "Hip Hop Classics", url: "#", duration: "42:30" },
        ],
        upcomingGigs: [{ venue: "Gold Room", date: "2024-01-20", time: "10:00 PM", city: "Atlanta" }],
        residencies: ["Gold Room", "Compound"],
        achievements: ["BET Hip Hop Awards After Party 2023", "A3C Festival 2022"],
        bookingRate: "$2,000 - $4,000",
        availability: "available",
        rating: 4.7,
        totalGigs: 200,
        joinedDate: "2019-08-20",
        isActive: true,
      },
      {
        id: "4",
        name: "Trek",
        slug: "trek",
        genre: ["Techno", "Industrial", "Dark Techno"],
        location: "Detroit, MI",
        image: "/techno-dj-trek.png",
        bio: "Trek delivers raw, industrial techno that captures the essence of Detroit's underground scene.",
        experience: "12+ years",
        equipment: ["Native Instruments Traktor", "Allen & Heath Xone:96", "Void Acoustics"],
        socialMedia: {
          instagram: "@trek_techno",
          soundcloud: "trekdetroit",
          spotify: "Trek Detroit",
        },
        mixSamples: [
          { title: "Underground Detroit", url: "#", duration: "58:45" },
          { title: "Industrial Sessions", url: "#", duration: "46:20" },
        ],
        upcomingGigs: [{ venue: "Marble Bar", date: "2024-01-25", time: "11:30 PM", city: "Detroit" }],
        residencies: ["Marble Bar", "TV Lounge"],
        achievements: ["Movement Festival 2023", "Detroit Techno Militia Member"],
        bookingRate: "$1,800 - $3,500",
        availability: "available",
        rating: 4.6,
        totalGigs: 180,
        joinedDate: "2018-05-12",
        isActive: true,
      },
      {
        id: "5",
        name: "PROTAXIA",
        slug: "protaxia",
        genre: ["Bass", "Dubstep", "Future Bass"],
        location: "Los Angeles, CA",
        image: "/bass-dj-protaxia-led.png",
        bio: "PROTAXIA brings earth-shaking bass and cutting-edge production to every performance.",
        experience: "5+ years",
        equipment: ["Ableton Live", "Push 2", "Funktion-One Resolution 2"],
        socialMedia: {
          instagram: "@protaxia_bass",
          soundcloud: "protaxiaofficial",
          spotify: "PROTAXIA",
        },
        mixSamples: [
          { title: "Bass Destruction", url: "#", duration: "33:15" },
          { title: "Future Sounds", url: "#", duration: "39:50" },
        ],
        upcomingGigs: [{ venue: "Exchange LA", date: "2024-01-28", time: "11:00 PM", city: "Los Angeles" }],
        residencies: ["Exchange LA", "Sound Nightclub"],
        achievements: ["EDC Las Vegas 2023", "Bass Canyon 2022"],
        bookingRate: "$2,200 - $4,500",
        availability: "booked",
        rating: 4.8,
        totalGigs: 95,
        joinedDate: "2022-02-28",
        isActive: true,
      },
      {
        id: "6",
        name: "Dillz",
        slug: "dillz",
        genre: ["Open Format", "Top 40", "Latin"],
        location: "New York, NY",
        image: "/dj-dillz-mixing.png",
        bio: "Dillz is the ultimate open format DJ, seamlessly blending genres to keep any crowd moving all night long.",
        experience: "9+ years",
        equipment: ["Pioneer DDJ-FLX10", "Serato DJ Pro", "QSC K12.2"],
        socialMedia: {
          instagram: "@dillz_nyc",
          soundcloud: "dillznyc",
          spotify: "DJ Dillz",
        },
        mixSamples: [
          { title: "NYC Open Format", url: "#", duration: "44:25" },
          { title: "Latin Vibes", url: "#", duration: "37:40" },
        ],
        upcomingGigs: [{ venue: "1 OAK", date: "2024-01-30", time: "10:00 PM", city: "New York" }],
        residencies: ["1 OAK", "PHD Rooftop"],
        achievements: ["Summer Jam 2023", "Latin Music Awards After Party 2022"],
        bookingRate: "$2,800 - $5,500",
        availability: "available",
        rating: 4.9,
        totalGigs: 175,
        joinedDate: "2020-11-05",
        isActive: true,
      },
      {
        id: "7",
        name: "Fresh",
        slug: "fresh",
        genre: ["Drum & Bass", "Jungle", "Liquid DnB"],
        location: "London, UK",
        image: "/dj-fresh-turntables.png",
        bio: "Fresh brings the authentic UK drum & bass sound with precision mixing and deep knowledge of the scene.",
        experience: "15+ years",
        equipment: ["Technics SL-1200MK7", "Pioneer DJM-V10", "Monitor Audio"],
        socialMedia: {
          instagram: "@fresh_dnb",
          soundcloud: "freshdrumnbass",
          spotify: "Fresh DnB",
        },
        mixSamples: [
          { title: "London Underground", url: "#", duration: "51:30" },
          { title: "Liquid Sessions", url: "#", duration: "43:15" },
        ],
        upcomingGigs: [{ venue: "Fabric", date: "2024-02-02", time: "12:00 AM", city: "London" }],
        residencies: ["Fabric", "XOYO"],
        achievements: ["Hospitality Records Artist", "Drum & Bass Arena Awards 2023"],
        bookingRate: "$3,500 - $7,000",
        availability: "busy",
        rating: 4.9,
        totalGigs: 250,
        joinedDate: "2017-09-15",
        isActive: true,
      },
    ]

    const initialVenues: Venue[] = [
      {
        id: "1",
        name: "LIV Miami",
        location: "4441 Collins Ave, Miami Beach, FL",
        city: "Miami",
        capacity: 2000,
        type: "Nightclub",
        image: "/luxury-nightclub-liv-miami-interior.png",
        description: "World-renowned nightclub in the heart of South Beach",
        amenities: ["VIP Tables", "Premium Sound System", "LED Walls", "Bottle Service"],
        contactInfo: {
          email: "bookings@livnightclub.com",
          phone: "+1 (305) 674-4680",
          website: "https://livnightclub.com",
        },
        preferredGenres: ["House", "EDM", "Hip Hop"],
        isActive: true,
      },
      {
        id: "2",
        name: "XS Nightclub",
        location: "3131 Las Vegas Blvd S, Las Vegas, NV",
        city: "Las Vegas",
        capacity: 1800,
        type: "Nightclub",
        image: "/xs-nightclub-pool.png",
        description: "Outdoor nightclub with pool and stunning views",
        amenities: ["Outdoor Pool", "Cabanas", "Premium Bar", "Dance Floor"],
        contactInfo: {
          email: "events@xslasvegas.com",
          phone: "+1 (702) 770-0097",
          website: "https://xslasvegas.com",
        },
        preferredGenres: ["Progressive House", "Trance", "EDM"],
        isActive: true,
      },
      {
        id: "3",
        name: "Gold Room",
        location: "2416 Piedmont Rd NE, Atlanta, GA",
        city: "Atlanta",
        capacity: 800,
        type: "Lounge",
        image: "/upscale-gold-room-atlanta.png",
        description: "Upscale lounge with sophisticated atmosphere",
        amenities: ["VIP Sections", "Full Bar", "Dance Floor", "Private Events"],
        contactInfo: {
          email: "info@goldroomatlanta.com",
          phone: "+1 (404) 846-0449",
        },
        preferredGenres: ["Hip Hop", "R&B", "Top 40"],
        isActive: true,
      },
    ]

    localStorage.setItem("switch-djs", JSON.stringify(initialDJs))
    localStorage.setItem("switch-venues", JSON.stringify(initialVenues))
    localStorage.setItem("switch-bookings", JSON.stringify([]))
    localStorage.setItem("switch-trade-requests", JSON.stringify([]))
    localStorage.setItem("switch-inquiries", JSON.stringify([]))
  }

  // DJ Management
  getDJs(): DJ[] {
    const data = localStorage.getItem("switch-djs")
    return data ? JSON.parse(data) : []
  }

  getDJ(id: string): DJ | null {
    const djs = this.getDJs()
    return djs.find((dj) => dj.id === id) || null
  }

  getDJBySlug(slug: string): DJ | null {
    const djs = this.getDJs()
    return djs.find((dj) => dj.slug === slug) || null
  }

  addDJ(dj: Omit<DJ, "id">): DJ {
    const djs = this.getDJs()
    const newDJ: DJ = {
      ...dj,
      id: Date.now().toString(),
    }
    djs.push(newDJ)
    localStorage.setItem("switch-djs", JSON.stringify(djs))
    return newDJ
  }

  updateDJ(id: string, updates: Partial<DJ>): DJ | null {
    const djs = this.getDJs()
    const index = djs.findIndex((dj) => dj.id === id)
    if (index === -1) return null

    djs[index] = { ...djs[index], ...updates }
    localStorage.setItem("switch-djs", JSON.stringify(djs))
    return djs[index]
  }

  deleteDJ(id: string): boolean {
    const djs = this.getDJs()
    const filteredDJs = djs.filter((dj) => dj.id !== id)
    if (filteredDJs.length === djs.length) return false

    localStorage.setItem("switch-djs", JSON.stringify(filteredDJs))
    return true
  }

  // Venue Management
  getVenues(): Venue[] {
    const data = localStorage.getItem("switch-venues")
    return data ? JSON.parse(data) : []
  }

  getVenue(id: string): Venue | null {
    const venues = this.getVenues()
    return venues.find((venue) => venue.id === id) || null
  }

  addVenue(venue: Omit<Venue, "id">): Venue {
    const venues = this.getVenues()
    const newVenue: Venue = {
      ...venue,
      id: Date.now().toString(),
    }
    venues.push(newVenue)
    localStorage.setItem("switch-venues", JSON.stringify(venues))
    return newVenue
  }

  updateVenue(id: string, updates: Partial<Venue>): Venue | null {
    const venues = this.getVenues()
    const index = venues.findIndex((venue) => venue.id === id)
    if (index === -1) return null

    venues[index] = { ...venues[index], ...updates }
    localStorage.setItem("switch-venues", JSON.stringify(venues))
    return venues[index]
  }

  deleteVenue(id: string): boolean {
    const venues = this.getVenues()
    const filteredVenues = venues.filter((venue) => venue.id !== id)
    if (filteredVenues.length === venues.length) return false

    localStorage.setItem("switch-venues", JSON.stringify(filteredVenues))
    return true
  }

  // Booking Management
  getBookings(): Booking[] {
    const data = localStorage.getItem("switch-bookings")
    return data ? JSON.parse(data) : []
  }

  addBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking {
    const bookings = this.getBookings()
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    bookings.push(newBooking)
    localStorage.setItem("switch-bookings", JSON.stringify(bookings))
    return newBooking
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const bookings = this.getBookings()
    const index = bookings.findIndex((booking) => booking.id === id)
    if (index === -1) return null

    bookings[index] = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem("switch-bookings", JSON.stringify(bookings))
    return bookings[index]
  }

  // Contact Inquiry Management
  getInquiries(): ContactInquiry[] {
    const data = localStorage.getItem("switch-inquiries")
    return data ? JSON.parse(data) : []
  }

  addInquiry(inquiry: Omit<ContactInquiry, "id" | "createdAt">): ContactInquiry {
    const inquiries = this.getInquiries()
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    inquiries.push(newInquiry)
    localStorage.setItem("switch-inquiries", JSON.stringify(inquiries))
    return newInquiry
  }

  updateInquiry(id: string, updates: Partial<ContactInquiry>): ContactInquiry | null {
    const inquiries = this.getInquiries()
    const index = inquiries.findIndex((inquiry) => inquiry.id === id)
    if (index === -1) return null

    inquiries[index] = { ...inquiries[index], ...updates }
    localStorage.setItem("switch-inquiries", JSON.stringify(inquiries))
    return inquiries[index]
  }

  // Trade Request Management
  getTradeRequests(): TradeRequest[] {
    const data = localStorage.getItem("switch-trade-requests")
    return data ? JSON.parse(data) : []
  }

  addTradeRequest(tradeRequest: Omit<TradeRequest, "id" | "createdAt">): TradeRequest {
    const tradeRequests = this.getTradeRequests()
    const newTradeRequest: TradeRequest = {
      ...tradeRequest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    tradeRequests.push(newTradeRequest)
    localStorage.setItem("switch-trade-requests", JSON.stringify(tradeRequests))
    return newTradeRequest
  }

  updateTradeRequest(id: string, updates: Partial<TradeRequest>): TradeRequest | null {
    const tradeRequests = this.getTradeRequests()
    const index = tradeRequests.findIndex((request) => request.id === id)
    if (index === -1) return null

    tradeRequests[index] = { ...tradeRequests[index], ...updates }
    localStorage.setItem("switch-trade-requests", JSON.stringify(tradeRequests))
    return tradeRequests[index]
  }

  deleteTradeRequest(id: string): boolean {
    const tradeRequests = this.getTradeRequests()
    const filteredRequests = tradeRequests.filter((request) => request.id !== id)
    if (filteredRequests.length === tradeRequests.length) return false

    localStorage.setItem("switch-trade-requests", JSON.stringify(filteredRequests))
    return true
  }
}

export const dataManager = DataManager.getInstance()
export { DataManager }
