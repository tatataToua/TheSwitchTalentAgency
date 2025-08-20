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
import { Music, Star, Clock, MapPin, ArrowLeft, Settings } from "lucide-react"
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
  location: string
  bio: string
}

export default function DJsPage() {
  const [allDJs, setAllDJs] = useState<DJ[]>([])
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    event_date: "",
    event_time: "",
    venue_name: "",
    venue_address: "",
    event_type: "",
    duration: "",
    special_requests: "",
  })
  const supabase = createClient()

  useEffect(() => {
    loadDJs()
  }, [])

  const loadDJs = async () => {
    try {
      const { data } = await supabase.from("djs").select("*").order("rating", { ascending: false })

      if (data) setAllDJs(data)
    } catch (error) {
      console.error("Error loading DJs:", error)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDJ) return

    try {
      const bookingData = {
        dj_id: selectedDJ.id,
        client_name: bookingForm.client_name,
        client_email: bookingForm.client_email,
        client_phone: bookingForm.client_phone,
        event_date: bookingForm.event_date,
        event_time: bookingForm.event_time,
        venue_name: bookingForm.venue_name,
        venue_address: bookingForm.venue_address,
        event_type: bookingForm.event_type,
        duration: Number.parseInt(bookingForm.duration),
        special_requests: bookingForm.special_requests,
        rate: selectedDJ.booking_rate,
        status: "pending",
      }

      await supabase.from("bookings").insert([bookingData])

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          name: bookingForm.client_name,
          email: bookingForm.client_email,
          phone: bookingForm.client_phone,
          subject: `DJ Booking Request - ${selectedDJ.stage_name || selectedDJ.name}`,
          message: `New booking request for ${selectedDJ.stage_name || selectedDJ.name}:
          
Event Date: ${bookingForm.event_date}
Event Time: ${bookingForm.event_time}
Venue: ${bookingForm.venue_name}
Address: ${bookingForm.venue_address}
Event Type: ${bookingForm.event_type}
Duration: ${bookingForm.duration} hours
Rate: $${selectedDJ.booking_rate}

Special Requests: ${bookingForm.special_requests}`,
          djName: selectedDJ.stage_name || selectedDJ.name,
        }),
      })

      alert("Booking request submitted successfully!")
      setShowBookingForm(false)
      setBookingForm({
        client_name: "",
        client_email: "",
        client_phone: "",
        event_date: "",
        event_time: "",
        venue_name: "",
        venue_address: "",
        event_type: "",
        duration: "",
        special_requests: "",
      })
    } catch (error) {
      console.error("Error submitting booking:", error)
      alert("Error submitting booking request")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-foreground" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-orange-500 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">The Switch</h1>
                  <p className="text-sm text-primary">Talent Agency</p>
                </div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/venues" className="text-foreground hover:text-primary transition-colors">
                Venues
              </Link>
              <Link href="/calendar" className="text-foreground hover:text-primary transition-colors">
                Calendar
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

      {/* Page Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our DJ Roster</h2>
          <p className="text-xl text-muted-foreground mb-8">Discover our talented artists available for booking</p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Badge variant="secondary" className="bg-green-600/20 text-green-400">
              {allDJs.length} Total Artists
            </Badge>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Multiple Genres Available
            </Badge>
          </div>
        </div>
      </section>

      {/* DJ Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDJs.map((dj) => (
              <Card key={dj.id} className="bg-card border-border hover:bg-card/80 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center overflow-hidden">
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
                    <Badge variant="default" className="bg-green-600 text-white">
                      Available
                    </Badge>
                  </div>
                  <CardTitle className="text-foreground">{dj.stage_name || dj.name}</CardTitle>
                  <CardDescription className="text-primary">{dj.genres?.join(", ") || "Multi-Genre"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{dj.location || "Miami, FL"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/djs/${dj.slug}`}>
                      <Button className="flex-1 bg-primary hover:bg-primary/90">View EPK</Button>
                    </Link>
                    <Dialog
                      open={showBookingForm && selectedDJ?.id === dj.id}
                      onOpenChange={(open) => {
                        setShowBookingForm(open)
                        if (open) setSelectedDJ(dj)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                          onClick={() => setSelectedDJ(dj)}
                        >
                          Book
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-border max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Book {dj.stage_name || dj.name}</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Fill out the form below to request a booking for ${dj.booking_rate}/night
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="client_name" className="text-foreground">
                                Your Name
                              </Label>
                              <Input
                                id="client_name"
                                value={bookingForm.client_name}
                                onChange={(e) => setBookingForm({ ...bookingForm, client_name: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                            <div>
                              <Label htmlFor="client_email" className="text-foreground">
                                Email
                              </Label>
                              <Input
                                id="client_email"
                                type="email"
                                value={bookingForm.client_email}
                                onChange={(e) => setBookingForm({ ...bookingForm, client_email: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="client_phone" className="text-foreground">
                                Phone
                              </Label>
                              <Input
                                id="client_phone"
                                value={bookingForm.client_phone}
                                onChange={(e) => setBookingForm({ ...bookingForm, client_phone: e.target.value })}
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                            <div>
                              <Label htmlFor="event_type" className="text-foreground">
                                Event Type
                              </Label>
                              <Input
                                id="event_type"
                                value={bookingForm.event_type}
                                onChange={(e) => setBookingForm({ ...bookingForm, event_type: e.target.value })}
                                placeholder="Wedding, Club Night, etc."
                                required
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="event_date" className="text-foreground">
                                Event Date
                              </Label>
                              <Input
                                id="event_date"
                                type="date"
                                value={bookingForm.event_date}
                                onChange={(e) => setBookingForm({ ...bookingForm, event_date: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                            <div>
                              <Label htmlFor="event_time" className="text-foreground">
                                Event Time
                              </Label>
                              <Input
                                id="event_time"
                                type="time"
                                value={bookingForm.event_time}
                                onChange={(e) => setBookingForm({ ...bookingForm, event_time: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="venue_name" className="text-foreground">
                                Venue Name
                              </Label>
                              <Input
                                id="venue_name"
                                value={bookingForm.venue_name}
                                onChange={(e) => setBookingForm({ ...bookingForm, venue_name: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                            <div>
                              <Label htmlFor="duration" className="text-foreground">
                                Duration (hours)
                              </Label>
                              <Input
                                id="duration"
                                type="number"
                                min="1"
                                max="12"
                                value={bookingForm.duration}
                                onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
                                required
                                className="bg-background border-border text-foreground"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="venue_address" className="text-foreground">
                              Venue Address
                            </Label>
                            <Input
                              id="venue_address"
                              value={bookingForm.venue_address}
                              onChange={(e) => setBookingForm({ ...bookingForm, venue_address: e.target.value })}
                              required
                              className="bg-background border-border text-foreground"
                            />
                          </div>
                          <div>
                            <Label htmlFor="special_requests" className="text-foreground">
                              Special Requests
                            </Label>
                            <Textarea
                              id="special_requests"
                              value={bookingForm.special_requests}
                              onChange={(e) => setBookingForm({ ...bookingForm, special_requests: e.target.value })}
                              placeholder="Any special requirements, music preferences, etc."
                              className="bg-background border-border text-foreground"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                              Submit Booking Request
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowBookingForm(false)}
                              className="border-border text-foreground hover:bg-muted"
                            >
                              Cancel
                            </Button>
                          </div>
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
