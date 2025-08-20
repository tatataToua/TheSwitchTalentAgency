"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Music, ArrowLeft, MapPin, Users, Star, Settings, Phone, Mail, Clock, Plus, Send } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Venue } from "@/lib/types"

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    eventDate: "",
    eventType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadVenues()
  }, [])

  const loadVenues = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("venues").select("*").order("name")

    if (data && !error) {
      setVenues(data)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVenue) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          venue: selectedVenue.name,
          ...contactForm,
        }),
      })

      if (response.ok) {
        alert("Message sent successfully!")
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: "",
          eventDate: "",
          eventType: "",
        })
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-white" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">The Switch</h1>
                  <p className="text-sm text-orange-300">Talent Agency</p>
                </div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/djs" className="text-white hover:text-orange-300 transition-colors">
                DJs
              </Link>
              <Link href="/calendar" className="text-white hover:text-orange-300 transition-colors">
                Calendar
              </Link>
              <Link href="/admin" className="text-orange-300 hover:text-orange-200 transition-colors">
                <Settings className="w-4 h-4" />
              </Link>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Artist
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white bg-transparent"
              >
                Book Now
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Partner Venues</h2>
          <p className="text-xl text-gray-300 mb-8">Premium venues across multiple cities</p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Badge variant="secondary" className="bg-green-600/20 text-green-300">
              {venues.length} Partner Venues
            </Badge>
            <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">
              Multiple Cities
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
              Premium Locations
            </Badge>
          </div>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card
                key={venue.id}
                className="bg-black/50 border-white/10 backdrop-blur-sm hover:bg-black/70 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center overflow-hidden">
                      {venue.image ? (
                        <img
                          src={venue.image || "/placeholder.svg"}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MapPin className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">
                      {venue.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{venue.name}</CardTitle>
                  <CardDescription className="text-orange-300">{venue.city}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">{venue.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300">4.8</span>
                    </div>
                  </div>

                  {venue.preferredGenres && venue.preferredGenres.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Preferred Genres:</p>
                      <div className="flex flex-wrap gap-1">
                        {venue.preferredGenres.map((genre, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-orange-500/30 text-orange-300">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {venue.amenities.slice(0, 2).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-green-500/30 text-green-300">
                            {amenity}
                          </Badge>
                        ))}
                        {venue.amenities.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-500/30 text-gray-300">
                            +{venue.amenities.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-orange-600 hover:bg-orange-700">View Details</Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-orange-300">{venue.name}</DialogTitle>
                          <DialogDescription className="text-gray-300">
                            {venue.city} • {venue.type}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {venue.image && (
                            <div className="w-full h-48 rounded-lg overflow-hidden">
                              <img
                                src={venue.image || "/placeholder.svg"}
                                alt={venue.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div>
                            <h4 className="text-lg font-semibold text-orange-300 mb-2">About</h4>
                            <p className="text-gray-300">{venue.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-lg font-semibold text-orange-300 mb-2">Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span>Capacity: {venue.capacity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{venue.address}</span>
                                </div>
                                {venue.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{venue.phone}</span>
                                  </div>
                                )}
                                {venue.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{venue.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-orange-300 mb-2">Operating Hours</h4>
                              <div className="space-y-1 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span>Mon-Thu: 8PM - 2AM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span>Fri-Sat: 9PM - 3AM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span>Sun: 8PM - 1AM</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {venue.amenities && venue.amenities.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-orange-300 mb-2">Amenities</h4>
                              <div className="flex flex-wrap gap-2">
                                {venue.amenities.map((amenity, i) => (
                                  <Badge key={i} variant="outline" className="border-green-500/30 text-green-300">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {venue.preferredGenres && venue.preferredGenres.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-orange-300 mb-2">Preferred Music Genres</h4>
                              <div className="flex flex-wrap gap-2">
                                {venue.preferredGenres.map((genre, i) => (
                                  <Badge key={i} variant="outline" className="border-orange-500/30 text-orange-300">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-white bg-transparent"
                          onClick={() => setSelectedVenue(venue)}
                        >
                          Contact
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-xl text-orange-300">Contact {venue.name}</DialogTitle>
                          <DialogDescription className="text-gray-300">
                            Send a message to inquire about booking or events
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name" className="text-gray-300">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                className="bg-slate-800 border-white/10 text-white"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-gray-300">
                                Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                className="bg-slate-800 border-white/10 text-white"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone" className="text-gray-300">
                                Phone
                              </Label>
                              <Input
                                id="phone"
                                value={contactForm.phone}
                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                className="bg-slate-800 border-white/10 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="eventDate" className="text-gray-300">
                                Event Date
                              </Label>
                              <Input
                                id="eventDate"
                                type="date"
                                value={contactForm.eventDate}
                                onChange={(e) => setContactForm({ ...contactForm, eventDate: e.target.value })}
                                className="bg-slate-800 border-white/10 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="eventType" className="text-gray-300">
                              Event Type
                            </Label>
                            <Input
                              id="eventType"
                              placeholder="e.g., Corporate Event, Wedding, Birthday Party"
                              value={contactForm.eventType}
                              onChange={(e) => setContactForm({ ...contactForm, eventType: e.target.value })}
                              className="bg-slate-800 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message" className="text-gray-300">
                              Message
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="Tell us about your event and requirements..."
                              value={contactForm.message}
                              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                              className="bg-slate-800 border-white/10 text-white min-h-[100px]"
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                          >
                            {isSubmitting ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
