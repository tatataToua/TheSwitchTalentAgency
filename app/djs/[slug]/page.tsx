import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Calendar,
  Play,
  Download,
  ExternalLink,
  Instagram,
  Twitter,
  AirplayIcon as Spotify,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const djProfiles = {
  "nicky-nice": {
    name: "Nicky Nice",
    genre: "House/Tech House",
    rating: 4.9,
    bookings: 45,
    location: "Austin, TX",
    residencies: ["Kingdom", "IYKYK"],
    available: true,
    nextGig: "Dec 28, 2024",
    bio: "Nicky Nice has been setting dance floors ablaze across Texas with his infectious house and tech house sets. Known for his ability to read the crowd and deliver exactly what they need, Nicky has become a staple in Austin's electronic music scene.",
    experience: "8+ years",
    specialties: ["Peak Time House", "Tech House", "Progressive House"],
    equipment: ["Pioneer CDJ-3000", "DJM-900NXS2", "Custom Lighting Rig"],
    achievements: [
      "Resident DJ at Kingdom Austin (2022-Present)",
      "Featured at SXSW 2023",
      "Over 1M streams on SoundCloud",
      "Austin Music Awards Nominee 2023",
    ],
    socialLinks: {
      instagram: "@nickynice_dj",
      twitter: "@nickynice",
      spotify: "Nicky Nice",
      soundcloud: "nickynice",
    },
    mixSamples: [
      { title: "House Vibes Vol. 3", duration: "62:45", plays: "15.2K" },
      { title: "Tech House Sessions", duration: "58:30", plays: "12.8K" },
      { title: "Peak Time Energy", duration: "71:20", plays: "18.5K" },
    ],
    upcomingGigs: [
      { date: "Dec 28, 2024", venue: "Kingdom", time: "10:00 PM", city: "Austin, TX" },
      { date: "Jan 1, 2025", venue: "IYKYK", time: "10:00 PM", city: "Austin, TX" },
      { date: "Jan 15, 2025", venue: "Private Event", time: "9:00 PM", city: "Austin, TX" },
    ],
  },
  "tony-jack": {
    name: "Tony Jack",
    genre: "Progressive/Trance",
    rating: 4.8,
    bookings: 38,
    location: "Charleston, SC",
    residencies: ["Tongys Conway", "Coopbar"],
    available: true,
    nextGig: "Dec 30, 2024",
    bio: "Tony Jack brings the euphoric sounds of progressive and trance to the Southeast. His emotional journey-driven sets have captivated audiences from Charleston to Atlanta, making him one of the most sought-after trance DJs in the region.",
    experience: "6+ years",
    specialties: ["Progressive Trance", "Uplifting Trance", "Melodic Techno"],
    equipment: ["Pioneer CDJ-2000NXS2", "DJM-750MK2", "Ableton Live Setup"],
    achievements: [
      "Resident at Tongys Conway (2021-Present)",
      "Played at Electric Forest 2023",
      "Featured on Trance Family Radio",
      "Charleston Electronic Music Festival Headliner",
    ],
    socialLinks: {
      instagram: "@tonyjack_music",
      twitter: "@tonyjackdj",
      spotify: "Tony Jack",
      soundcloud: "tonyjackofficial",
    },
    mixSamples: [
      { title: "Progressive Journey", duration: "68:15", plays: "22.1K" },
      { title: "Trance Euphoria", duration: "74:30", plays: "19.7K" },
      { title: "Melodic Escape", duration: "65:45", plays: "16.3K" },
    ],
    upcomingGigs: [
      { date: "Dec 30, 2024", venue: "Tongys Conway", time: "11:00 PM", city: "Charleston, SC" },
      { date: "Jan 2, 2025", venue: "Coopbar", time: "9:00 PM", city: "Charleston, SC" },
      { date: "Jan 18, 2025", venue: "Club Pantheon", time: "10:30 PM", city: "Atlanta, GA" },
    ],
  },
  brotherhood: {
    name: "Brotherhood",
    genre: "Deep House",
    rating: 4.9,
    bookings: 52,
    location: "Austin, TX",
    residencies: ["Secret Disco Society"],
    available: false,
    nextGig: "Jan 2, 2025",
    bio: "Brotherhood represents the deeper side of house music, crafting immersive sonic experiences that transport listeners to another realm. Their underground approach and carefully curated deep house selections have made them legends in Austin's underground scene.",
    experience: "10+ years",
    specialties: ["Deep House", "Minimal House", "Underground Techno"],
    equipment: ["Technics 1200s", "Rane MP2015", "Analog Effects Chain"],
    achievements: [
      "Resident at Secret Disco Society (2020-Present)",
      "Played at Burning Man 2022 & 2023",
      "Released on Dirtybird Records",
      "Featured in Mixmag Underground Heroes",
    ],
    socialLinks: {
      instagram: "@brotherhood_deep",
      twitter: "@brotherhooddj",
      spotify: "Brotherhood",
      soundcloud: "brotherhooddeep",
    },
    mixSamples: [
      { title: "Deep Underground", duration: "82:20", plays: "31.5K" },
      { title: "Minimal Vibes", duration: "76:45", plays: "28.9K" },
      { title: "After Hours Sessions", duration: "94:15", plays: "35.2K" },
    ],
    upcomingGigs: [
      { date: "Jan 2, 2025", venue: "Secret Disco Society", time: "10:30 PM", city: "Austin, TX" },
      { date: "Jan 20, 2025", venue: "The Midway", time: "11:00 PM", city: "San Francisco, CA" },
      { date: "Feb 5, 2025", venue: "Output", time: "12:00 AM", city: "Brooklyn, NY" },
    ],
  },
  trek: {
    name: "Trek",
    genre: "Techno/Minimal",
    rating: 4.7,
    bookings: 41,
    location: "Clemson, SC",
    residencies: ["Roar"],
    available: true,
    nextGig: "Dec 29, 2024",
    bio: "Trek pushes the boundaries of techno and minimal electronic music, delivering hypnotic sets that build tension and release in perfect harmony. His technical precision and innovative track selection have earned him respect throughout the Southeast techno community.",
    experience: "7+ years",
    specialties: ["Minimal Techno", "Industrial Techno", "Ambient Techno"],
    equipment: ["Native Instruments Traktor", "Kontrol S4", "Modular Synth Setup"],
    achievements: [
      "Resident at Roar Clemson (2022-Present)",
      "Played at Movement Detroit 2023",
      "Released on Ostgut Ton sublabel",
      "Clemson Electronic Music Pioneer Award",
    ],
    socialLinks: {
      instagram: "@trek_techno",
      twitter: "@trektechno",
      spotify: "Trek",
      soundcloud: "trekofficial",
    },
    mixSamples: [
      { title: "Minimal Journey", duration: "71:30", plays: "14.7K" },
      { title: "Industrial Soundscapes", duration: "68:45", plays: "12.3K" },
      { title: "Techno Meditation", duration: "85:20", plays: "17.8K" },
    ],
    upcomingGigs: [
      { date: "Dec 29, 2024", venue: "Roar", time: "9:00 PM", city: "Clemson, SC" },
      { date: "Jan 12, 2025", venue: "Stereo", time: "11:30 PM", city: "Montreal, QC" },
      { date: "Jan 25, 2025", venue: "Berghain", time: "2:00 AM", city: "Berlin, DE" },
    ],
  },
  protaxia: {
    name: "PROTAXIA",
    genre: "Bass/Dubstep",
    rating: 4.8,
    bookings: 33,
    location: "High Point, NC",
    residencies: ["1614", "Greys Tavern"],
    available: true,
    nextGig: "Jan 1, 2025",
    bio: "PROTAXIA brings earth-shaking bass and cutting-edge dubstep to the Carolinas. Known for his high-energy performances and ability to make any crowd move, PROTAXIA has become synonymous with bass music excellence in the region.",
    experience: "5+ years",
    specialties: ["Dubstep", "Bass Music", "Trap", "Future Bass"],
    equipment: ["Pioneer DDJ-FLX10", "Custom Bass Rig", "LED Visual Setup"],
    achievements: [
      "Resident at 1614 High Point (2023-Present)",
      "Played at Lost Lands 2023",
      "Over 500K plays on bass music mixes",
      "North Carolina Bass Music Awards Winner",
    ],
    socialLinks: {
      instagram: "@protaxia_bass",
      twitter: "@protaxiamusic",
      spotify: "PROTAXIA",
      soundcloud: "protaxiaofficial",
    },
    mixSamples: [
      { title: "Bass Destruction", duration: "45:30", plays: "42.1K" },
      { title: "Dubstep Mayhem", duration: "52:15", plays: "38.7K" },
      { title: "Future Bass Vibes", duration: "48:45", plays: "35.9K" },
    ],
    upcomingGigs: [
      { date: "Jan 1, 2025", venue: "1614", time: "10:00 PM", city: "High Point, NC" },
      { date: "Jan 5, 2025", venue: "Greys Tavern", time: "9:30 PM", city: "High Point, NC" },
      { date: "Jan 28, 2025", venue: "The Fillmore", time: "8:00 PM", city: "Charlotte, NC" },
    ],
  },
  dillz: {
    name: "Dillz",
    genre: "Hip-Hop/Trap",
    rating: 4.9,
    bookings: 47,
    location: "Chapel Hill, NC",
    residencies: ["Still Life UNC"],
    available: true,
    nextGig: "Dec 31, 2024",
    bio: "Dillz dominates the hip-hop and trap scene with his seamless mixing and crowd-pleasing track selection. From college parties to major venues, Dillz knows how to keep the energy high and the dance floor packed all night long.",
    experience: "6+ years",
    specialties: ["Hip-Hop", "Trap", "R&B", "Pop Remixes"],
    equipment: ["Serato DJ Pro", "Pioneer DDJ-SZ2", "Wireless Mic Setup"],
    achievements: [
      "Resident at Still Life UNC (2021-Present)",
      "Official DJ for UNC Basketball",
      "Featured on Hot 97 Summer Jam",
      "Chapel Hill Hip-Hop Legend Award",
    ],
    socialLinks: {
      instagram: "@dillz_dj",
      twitter: "@dillzmusic",
      spotify: "Dillz",
      soundcloud: "dillzofficial",
    },
    mixSamples: [
      { title: "Hip-Hop Bangers", duration: "55:20", plays: "67.3K" },
      { title: "Trap Nation", duration: "48:15", plays: "59.8K" },
      { title: "R&B Smooth", duration: "62:30", plays: "45.2K" },
    ],
    upcomingGigs: [
      { date: "Dec 31, 2024", venue: "Still Life UNC", time: "11:00 PM", city: "Chapel Hill, NC" },
      { date: "Jan 8, 2025", venue: "The Ritz", time: "10:00 PM", city: "Raleigh, NC" },
      { date: "Jan 22, 2025", venue: "Music Farm", time: "9:30 PM", city: "Charleston, SC" },
    ],
  },
  fresh: {
    name: "Fresh",
    genre: "House/Electronic",
    rating: 4.6,
    bookings: 29,
    location: "Oklahoma City, OK",
    residencies: ["15Nightclub"],
    available: true,
    nextGig: "Jan 3, 2025",
    bio: "Fresh brings a modern twist to classic house music, blending electronic elements with infectious grooves. As Oklahoma City's rising star, Fresh is quickly making a name for himself with his innovative approach to dance music.",
    experience: "4+ years",
    specialties: ["Electronic House", "Future House", "Dance Pop"],
    equipment: ["Virtual DJ", "Hercules DJControl", "LED Light Show"],
    achievements: [
      "Resident at 15Nightclub (2023-Present)",
      "Oklahoma Electronic Music Rising Star",
      "Featured on local radio stations",
      "Growing social media following",
    ],
    socialLinks: {
      instagram: "@fresh_okc",
      twitter: "@freshdjokc",
      spotify: "Fresh",
      soundcloud: "freshokc",
    },
    mixSamples: [
      { title: "Fresh House Vibes", duration: "51:45", plays: "8.9K" },
      { title: "Electronic Dreams", duration: "47:20", plays: "7.2K" },
      { title: "Dance Floor Energy", duration: "54:15", plays: "9.8K" },
    ],
    upcomingGigs: [
      { date: "Jan 3, 2025", venue: "15Nightclub", time: "9:30 PM", city: "Oklahoma City, OK" },
      { date: "Jan 17, 2025", venue: "The Criterion", time: "10:00 PM", city: "Oklahoma City, OK" },
      { date: "Feb 1, 2025", venue: "House of Blues", time: "8:30 PM", city: "Dallas, TX" },
    ],
  },
}

interface PageProps {
  params: { slug: string }
}

export default function DJProfilePage({ params }: PageProps) {
  const dj = djProfiles[params.slug as keyof typeof djProfiles]

  if (!dj) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900/20">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/djs" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-white" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">The Switch</h1>
                  <p className="text-sm text-orange-300">Talent Agency</p>
                </div>
              </div>
            </Link>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white bg-transparent"
            >
              Book {dj.name}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Music className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{dj.name}</h2>
                  <p className="text-xl text-orange-300 mb-2">{dj.genre}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{dj.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{dj.bookings} gigs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{dj.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">{dj.bio}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {dj.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="bg-orange-600/20 text-orange-300">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="lg:w-80">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Experience</p>
                    <p className="text-white font-medium">{dj.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Next Gig</p>
                    <p className="text-white font-medium">{dj.nextGig}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Availability</p>
                    <Badge className={dj.available ? "bg-green-600" : "bg-red-600"}>
                      {dj.available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Residencies</p>
                    <div className="space-y-1">
                      {dj.residencies.map((venue, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="block w-fit border-orange-500/30 text-orange-300"
                        >
                          {venue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mix Samples */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-5 h-5" />
                Mix Samples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dj.mixSamples.map((mix, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{mix.title}</h4>
                    <Button size="sm" variant="ghost" className="text-orange-300 hover:text-white">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{mix.duration}</span>
                    <span>{mix.plays} plays</span>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Download className="w-4 h-4 mr-2" />
                Download EPK
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Gigs */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Gigs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dj.upcomingGigs.map((gig, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-medium">{gig.venue}</h4>
                    <span className="text-sm text-orange-300">{gig.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{gig.date}</span>
                    <span>{gig.city}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Equipment & Social */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dj.equipment.map((item, index) => (
                    <li key={index} className="text-gray-300 text-sm">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-pink-500/30 text-pink-300 hover:bg-pink-500 hover:text-white bg-transparent"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  {dj.socialLinks.instagram}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white bg-transparent"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  {dj.socialLinks.twitter}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-green-500/30 text-green-300 hover:bg-green-500 hover:text-white bg-transparent"
                >
                  <Spotify className="w-4 h-4 mr-2" />
                  {dj.socialLinks.spotify}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-orange-500/30 text-orange-300 hover:bg-orange-500 hover:text-white bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  SoundCloud
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-white">Career Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dj.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-300">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
