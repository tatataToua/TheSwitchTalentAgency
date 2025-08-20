"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music, Users, MapPin, Star, Clock, Settings } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

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

  const supabase = createClient()

  useEffect(() => {
    loadData()
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
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
              <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors">
                <Settings className="w-4 h-4" />
              </Link>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Book Now
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Where Talent
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Meets Opportunity
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Premium DJ talent for unforgettable experiences. Connect with top-tier artists and elevate your venue's
            sound.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/djs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-primary-foreground px-8 py-3"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse DJs
              </Button>
            </Link>
            <Link href="/calendar">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 bg-transparent"
              >
                <Calendar className="w-5 h-5 mr-2" />
                View Calendar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured DJs */}
      <section className="py-16 px-4">
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
      <section className="py-20 px-4">
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
