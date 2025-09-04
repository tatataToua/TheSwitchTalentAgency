"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Users, MapPin, Star, Clock, Settings, LogOut, Crown } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth"

interface DJ {
  id: string
  name: string
  stage_name: string
  slug: string
  genres: string[]
  booking_rate: number
  image_url: string
  rating: number
}

interface Venue {
  id: string
  name: string
  location: string
  city: string
  capacity: number
}

export default function HomePage() {
  const [featuredDJs, setFeaturedDJs] = useState<DJ[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [user, setUser] = useState<any>(null)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  const supabase = createClient()
  const { signOut } = useAuth()

  const backgroundImages = [
    "/dj-performing-at-nightclub-with-colorful-lights-an.png",
    "/professional-dj-mixing-console-with-vinyl-records-.png",
    "/concert-venue-with-stage-lights-and-sound-equipmen.png",
    "/electronic-music-festival-with-dj-booth-and-dancin.png",
    "/modern-nightclub-interior-with-led-walls-and-dj-se.png",
  ]

  useEffect(() => {
    loadData()
    checkUser()

    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 8000) // Change background every 8 seconds

    return () => clearInterval(bgInterval)
  }, [])

  const loadData = async () => {
    try {
      const { data: djsData } = await supabase
        .from("djs")
        .select("id, name, stage_name, slug, genres, booking_rate, image_url, rating")
        .order("rating", { ascending: false })
        .limit(4)

      if (djsData) setFeaturedDJs(djsData)

      const { data: venuesData } = await supabase
        .from("venues")
        .select("id, name, location, city, capacity")
        .order("capacity", { ascending: false })
        .limit(4)

      if (venuesData) setVenues(venuesData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-50 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-orange-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">The Switch</h1>
                <p className="text-sm text-primary">Talent Agency</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/djs" className="text-foreground hover:text-primary transition-colors">
                DJs
              </Link>
              <Link href="/venues" className="text-foreground hover:text-primary transition-colors">
                Venues
              </Link>
              <Link href="/calendar" className="text-foreground hover:text-primary transition-colors">
                Calendar
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link
                href="/subscription"
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden lg:inline">Subscription</span>
              </Link>
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors">
                    <Settings className="w-4 h-4" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-primary hover:text-primary/80 transition-colors p-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={() => (window.location.href = "/login")}
                  onClick={() => (window.location.href = "/admin")}
                  className="text-primary hover:text-primary/80 transition-colors p-1"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Dynamic Background */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((bg, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ${
                index === currentBgIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${bg}')`,
              }}
            />
          ))}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Where Talent
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-lg">
              Meets Opportunity
            </span>
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Premium DJ talent for unforgettable experiences. Connect with top-tier artists and elevate your venue's
            sound.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/djs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 shadow-2xl border-0"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse DJs
              </Button>
            </Link>
            <Link href="/subscription">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/80 text-white hover:bg-white hover:text-black px-8 py-3 bg-white/10 backdrop-blur-sm shadow-2xl"
              >
                <Crown className="w-5 h-5 mr-2" />
                Join as DJ
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBgIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBgIndex ? "bg-white shadow-lg" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Switch to background ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured DJs */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Featured Artists</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDJs.map((dj) => (
              <Card key={dj.id} className="bg-card border-border hover:bg-card/80 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {dj.image_url ? (
                      <img
                        src={dj.image_url || "/placeholder.svg"}
                        alt={dj.stage_name || dj.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="w-8 h-8 text-primary-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-foreground text-center">{dj.stage_name || dj.name}</CardTitle>
                  <CardDescription className="text-primary text-center">
                    {dj.genres?.join(", ") || "Multi-Genre"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-muted-foreground">{dj.rating || 4.8}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">${dj.booking_rate || 2000}/night</span>
                    </div>
                  </div>
                  <Link href={`/djs/${dj.slug}`}>
                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90">View Profile</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Partner Venues</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {venue.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {venue.location}, {venue.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    Capacity: {venue.capacity}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-foreground mb-6">Ready to Book?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with our talented DJs and create unforgettable experiences for your venue.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-primary-foreground px-12 py-4"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/20 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground font-bold">The Switch Talent Agency</span>
          </div>
          <p className="text-muted-foreground">Where Talent Meets Opportunity</p>
        </div>
      </footer>
    </div>
  )
}
