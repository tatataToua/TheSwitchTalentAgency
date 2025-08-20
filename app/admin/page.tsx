"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Users, MapPin, Calendar, ArrowLeftRight, Trash2, CheckCircle, XCircle, Plus } from "lucide-react"

interface DJ {
  id: string
  name: string
  stage_name: string
  slug: string
  genres: string[]
  booking_rate: number
  location: string
  residencies: string[]
}

interface Venue {
  id: string
  name: string
  location: string
  city: string
  capacity: number
  contact_email: string
}

interface Booking {
  id: string
  dj_id: string
  venue_id: string
  event_date: string
  event_time: string
  status: string
  rate: number
  djs: { name: string; stage_name: string }
  venues: { name: string; location: string }
}

interface TradeRequest {
  id: string
  requesting_dj_id: string
  target_dj_id: string
  requesting_venue: string
  target_venue: string
  requested_date: string
  target_date: string
  status: string
  message: string
  created_at: string
}

interface ContactInquiry {
  id: string
  type: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [djs, setDJs] = useState<DJ[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([])
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])

  const [showDJForm, setShowDJForm] = useState(false)
  const [showVenueForm, setShowVenueForm] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [djFormData, setDJFormData] = useState({
    name: "",
    stage_name: "",
    slug: "",
    bio: "",
    genres: "",
    booking_rate: "",
    location: "",
    phone: "",
    email: "",
    social_instagram: "",
    social_soundcloud: "",
    social_spotify: "",
    experience: "",
    equipment: "",
    residencies: "",
  })
  const [venueFormData, setVenueFormData] = useState({
    name: "",
    location: "",
    city: "",
    capacity: "",
    contact_email: "",
    contact_phone: "",
    description: "",
    amenities: "",
    preferred_genres: "",
  })
  const [bookingFormData, setBookingFormData] = useState({
    dj_id: "",
    venue_id: "",
    event_date: "",
    event_time: "",
    rate: "",
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: djsData } = await supabase
        .from("djs")
        .select("id, name, stage_name, slug, genres, booking_rate, location, residencies")
        .order("name")

      if (djsData) setDJs(djsData)

      const { data: venuesData } = await supabase
        .from("venues")
        .select("id, name, location, city, capacity, contact_email")
        .order("name")

      if (venuesData) setVenues(venuesData)

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          id, dj_id, venue_id, event_date, event_time, status, rate,
          djs (name, stage_name),
          venues (name, location)
        `)
        .order("event_date", { ascending: false })

      if (bookingsData) setBookings(bookingsData)

      const { data: tradesData } = await supabase
        .from("trade_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (tradesData) setTradeRequests(tradesData)

      const { data: inquiriesData } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false })

      if (inquiriesData) setInquiries(inquiriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleDeleteDJ = async (id: string) => {
    if (confirm("Are you sure you want to delete this DJ?")) {
      try {
        await supabase.from("djs").delete().eq("id", id)
        loadData()
      } catch (error) {
        console.error("Error deleting DJ:", error)
        alert("Error deleting DJ")
      }
    }
  }

  const handleDeleteVenue = async (id: string) => {
    if (confirm("Are you sure you want to delete this venue?")) {
      try {
        await supabase.from("venues").delete().eq("id", id)
        loadData()
      } catch (error) {
        console.error("Error deleting venue:", error)
        alert("Error deleting venue")
      }
    }
  }

  const handleDeleteBooking = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await supabase.from("bookings").delete().eq("id", id)
        loadData()
      } catch (error) {
        console.error("Error deleting booking:", error)
        alert("Error deleting booking")
      }
    }
  }

  const handleApproveTradeRequest = async (id: string) => {
    try {
      await supabase.from("trade_requests").update({ status: "approved" }).eq("id", id)
      loadData()
    } catch (error) {
      console.error("Error approving trade request:", error)
      alert("Error approving trade request")
    }
  }

  const handleRejectTradeRequest = async (id: string) => {
    try {
      await supabase.from("trade_requests").update({ status: "rejected" }).eq("id", id)
      loadData()
    } catch (error) {
      console.error("Error rejecting trade request:", error)
      alert("Error rejecting trade request")
    }
  }

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await supabase.from("contact_inquiries").update({ status }).eq("id", id)
      loadData()
    } catch (error) {
      console.error("Error updating inquiry status:", error)
      alert("Error updating inquiry status")
    }
  }

  const handleAddDJ = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const djData = {
        ...djFormData,
        genres: djFormData.genres.split(",").map((g) => g.trim()),
        booking_rate: Number.parseInt(djFormData.booking_rate),
        residencies: djFormData.residencies
          .split(",")
          .map((r) => r.trim())
          .filter((r) => r),
        social_media: {
          instagram: djFormData.social_instagram,
          soundcloud: djFormData.social_soundcloud,
          spotify: djFormData.social_spotify,
        },
      }

      await supabase.from("djs").insert([djData])
      setShowDJForm(false)
      setDJFormData({
        name: "",
        stage_name: "",
        slug: "",
        bio: "",
        genres: "",
        booking_rate: "",
        location: "",
        phone: "",
        email: "",
        social_instagram: "",
        social_soundcloud: "",
        social_spotify: "",
        experience: "",
        equipment: "",
        residencies: "",
      })
      loadData()
    } catch (error) {
      console.error("Error adding DJ:", error)
      alert("Error adding DJ")
    }
  }

  const handleAddVenue = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const venueData = {
        ...venueFormData,
        capacity: Number.parseInt(venueFormData.capacity),
        amenities: venueFormData.amenities.split(",").map((a) => a.trim()),
        preferred_genres: venueFormData.preferred_genres.split(",").map((g) => g.trim()),
      }

      await supabase.from("venues").insert([venueData])
      setShowVenueForm(false)
      setVenueFormData({
        name: "",
        location: "",
        city: "",
        capacity: "",
        contact_email: "",
        contact_phone: "",
        description: "",
        amenities: "",
        preferred_genres: "",
      })
      loadData()
    } catch (error) {
      console.error("Error adding venue:", error)
      alert("Error adding venue")
    }
  }

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const bookingData = {
        ...bookingFormData,
        rate: Number.parseInt(bookingFormData.rate),
        status: "confirmed",
      }

      await supabase.from("bookings").insert([bookingData])
      setShowBookingForm(false)
      setBookingFormData({
        dj_id: "",
        venue_id: "",
        event_date: "",
        event_time: "",
        rate: "",
        notes: "",
      })
      loadData()
    } catch (error) {
      console.error("Error adding booking:", error)
      alert("Error adding booking")
    }
  }

  const getDJById = (id: string) => djs.find((dj) => dj.id === id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-orange-200">Manage your talent agency data</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/10 border-orange-500/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total DJs</CardTitle>
              <Users className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{djs.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-orange-500/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
              <MapPin className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{venues.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-orange-500/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-orange-500/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trade Requests</CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tradeRequests.filter((t) => t.status === "pending").length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-orange-500/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
              <Calendar className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inquiries.filter((i) => i.status === "new").length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="bg-white/10 border-orange-500/20">
            <TabsTrigger
              value="inquiries"
              className="data-[state=active]:bg-orange-500/30 data-[state=active]:text-white"
            >
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="djs" className="data-[state=active]:bg-orange-500/30 data-[state=active]:text-white">
              DJs
            </TabsTrigger>
            <TabsTrigger value="venues" className="data-[state=active]:bg-orange-500/30 data-[state=active]:text-white">
              Venues
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-orange-500/30 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-orange-500/30 data-[state=active]:text-white">
              Trade Requests
            </TabsTrigger>
          </TabsList>

          {/* Contact Inquiries */}
          <TabsContent value="inquiries" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Contact Inquiries</h2>
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="bg-white/10 border-orange-500/20 text-white">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                          <Badge
                            variant="secondary"
                            className={`${
                              inquiry.status === "resolved"
                                ? "bg-green-600/50"
                                : inquiry.status === "in_progress"
                                  ? "bg-orange-600/50"
                                  : "bg-orange-500/50"
                            } text-white`}
                          >
                            {inquiry.status.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className="text-orange-300 border-orange-300">
                            {inquiry.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-orange-200">{inquiry.email}</p>
                        {inquiry.phone && <p className="text-orange-200">{inquiry.phone}</p>}
                        <p className="text-sm text-orange-300">{inquiry.subject}</p>
                        <p className="text-sm text-gray-300 bg-white/5 p-3 rounded">{inquiry.message}</p>
                        <p className="text-xs text-gray-400">{new Date(inquiry.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {inquiry.status === "new" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateInquiryStatus(inquiry.id, "in_progress")}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            In Progress
                          </Button>
                        )}
                        {inquiry.status !== "resolved" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateInquiryStatus(inquiry.id, "resolved")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* DJs Management */}
          <TabsContent value="djs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">DJ Management</h2>
              <Dialog open={showDJForm} onOpenChange={setShowDJForm}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add DJ
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-orange-500/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New DJ</DialogTitle>
                    <DialogDescription className="text-orange-200">
                      Fill in the details to add a new DJ to your roster.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDJ} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={djFormData.name}
                          onChange={(e) => setDJFormData({ ...djFormData, name: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="stage_name">Stage Name</Label>
                        <Input
                          id="stage_name"
                          value={djFormData.stage_name}
                          onChange={(e) => setDJFormData({ ...djFormData, stage_name: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={djFormData.slug}
                        onChange={(e) => setDJFormData({ ...djFormData, slug: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        placeholder="e.g., dj-name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={djFormData.bio}
                        onChange={(e) => setDJFormData({ ...djFormData, bio: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="genres">Genres (comma-separated)</Label>
                        <Input
                          id="genres"
                          value={djFormData.genres}
                          onChange={(e) => setDJFormData({ ...djFormData, genres: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          placeholder="House, Techno, EDM"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking_rate">Booking Rate ($)</Label>
                        <Input
                          id="booking_rate"
                          type="number"
                          value={djFormData.booking_rate}
                          onChange={(e) => setDJFormData({ ...djFormData, booking_rate: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={djFormData.location}
                          onChange={(e) => setDJFormData({ ...djFormData, location: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={djFormData.phone}
                          onChange={(e) => setDJFormData({ ...djFormData, phone: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={djFormData.email}
                        onChange={(e) => setDJFormData({ ...djFormData, email: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="social_instagram">Instagram</Label>
                        <Input
                          id="social_instagram"
                          value={djFormData.social_instagram}
                          onChange={(e) => setDJFormData({ ...djFormData, social_instagram: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="social_soundcloud">SoundCloud</Label>
                        <Input
                          id="social_soundcloud"
                          value={djFormData.social_soundcloud}
                          onChange={(e) => setDJFormData({ ...djFormData, social_soundcloud: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          placeholder="URL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="social_spotify">Spotify</Label>
                        <Input
                          id="social_spotify"
                          value={djFormData.social_spotify}
                          onChange={(e) => setDJFormData({ ...djFormData, social_spotify: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          placeholder="URL"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="residencies">Residencies (comma-separated)</Label>
                      <Input
                        id="residencies"
                        value={djFormData.residencies}
                        onChange={(e) => setDJFormData({ ...djFormData, residencies: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        placeholder="Club A, Venue B"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowDJForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                        Add DJ
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {djs.map((dj) => (
                <Card key={dj.id} className="bg-white/10 border-orange-500/20 text-white">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{dj.stage_name || dj.name}</CardTitle>
                        <CardDescription className="text-orange-200">
                          {dj.genres?.join(", ") || "Multi-Genre"}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDJ(dj.id)}
                        className="text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-orange-600/50 text-white">
                        {dj.location}
                      </Badge>
                      <p className="text-sm text-orange-200">Rate: ${dj.booking_rate}/night</p>
                      <p className="text-sm text-orange-200">Residencies: {dj.residencies?.length || 0}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Venues Management */}
          <TabsContent value="venues" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Venue Management</h2>
              <Dialog open={showVenueForm} onOpenChange={setShowVenueForm}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Venue
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-orange-500/20 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Venue</DialogTitle>
                    <DialogDescription className="text-orange-200">
                      Fill in the details to add a new venue to your network.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddVenue} className="space-y-4">
                    <div>
                      <Label htmlFor="venue_name">Venue Name</Label>
                      <Input
                        id="venue_name"
                        value={venueFormData.name}
                        onChange={(e) => setVenueFormData({ ...venueFormData, name: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="venue_location">Address</Label>
                        <Input
                          id="venue_location"
                          value={venueFormData.location}
                          onChange={(e) => setVenueFormData({ ...venueFormData, location: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="venue_city">City</Label>
                        <Input
                          id="venue_city"
                          value={venueFormData.city}
                          onChange={(e) => setVenueFormData({ ...venueFormData, city: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="venue_capacity">Capacity</Label>
                        <Input
                          id="venue_capacity"
                          type="number"
                          value={venueFormData.capacity}
                          onChange={(e) => setVenueFormData({ ...venueFormData, capacity: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="venue_contact_phone">Contact Phone</Label>
                        <Input
                          id="venue_contact_phone"
                          value={venueFormData.contact_phone}
                          onChange={(e) => setVenueFormData({ ...venueFormData, contact_phone: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="venue_contact_email">Contact Email</Label>
                      <Input
                        id="venue_contact_email"
                        type="email"
                        value={venueFormData.contact_email}
                        onChange={(e) => setVenueFormData({ ...venueFormData, contact_email: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue_description">Description</Label>
                      <Textarea
                        id="venue_description"
                        value={venueFormData.description}
                        onChange={(e) => setVenueFormData({ ...venueFormData, description: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue_amenities">Amenities (comma-separated)</Label>
                      <Input
                        id="venue_amenities"
                        value={venueFormData.amenities}
                        onChange={(e) => setVenueFormData({ ...venueFormData, amenities: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        placeholder="VIP Area, Sound System, LED Walls"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue_preferred_genres">Preferred Genres (comma-separated)</Label>
                      <Input
                        id="venue_preferred_genres"
                        value={venueFormData.preferred_genres}
                        onChange={(e) => setVenueFormData({ ...venueFormData, preferred_genres: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        placeholder="House, Techno, Hip-Hop"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowVenueForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                        Add Venue
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <Card key={venue.id} className="bg-white/10 border-orange-500/20 text-white">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{venue.name}</CardTitle>
                        <CardDescription className="text-orange-200">
                          {venue.location}, {venue.city}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteVenue(venue.id)}
                        className="text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-orange-600/50 text-white">
                        Capacity: {venue.capacity}
                      </Badge>
                      <p className="text-sm text-orange-200">Contact: {venue.contact_email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Management */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Booking Management</h2>
              <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Booking
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-orange-500/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Booking</DialogTitle>
                    <DialogDescription className="text-orange-200">
                      Create a new booking for a DJ at a venue.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddBooking} className="space-y-4">
                    <div>
                      <Label htmlFor="booking_dj">DJ</Label>
                      <Select
                        value={bookingFormData.dj_id}
                        onValueChange={(value) => setBookingFormData({ ...bookingFormData, dj_id: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-orange-500/20">
                          <SelectValue placeholder="Select a DJ" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-orange-500/20">
                          {djs.map((dj) => (
                            <SelectItem key={dj.id} value={dj.id}>
                              {dj.stage_name || dj.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="booking_venue">Venue</Label>
                      <Select
                        value={bookingFormData.venue_id}
                        onValueChange={(value) => setBookingFormData({ ...bookingFormData, venue_id: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-orange-500/20">
                          <SelectValue placeholder="Select a venue" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-orange-500/20">
                          {venues.map((venue) => (
                            <SelectItem key={venue.id} value={venue.id}>
                              {venue.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="booking_date">Event Date</Label>
                        <Input
                          id="booking_date"
                          type="date"
                          value={bookingFormData.event_date}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, event_date: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking_time">Event Time</Label>
                        <Input
                          id="booking_time"
                          type="time"
                          value={bookingFormData.event_time}
                          onChange={(e) => setBookingFormData({ ...bookingFormData, event_time: e.target.value })}
                          className="bg-white/10 border-orange-500/20"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="booking_rate">Rate ($)</Label>
                      <Input
                        id="booking_rate"
                        type="number"
                        value={bookingFormData.rate}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, rate: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking_notes">Notes</Label>
                      <Textarea
                        id="booking_notes"
                        value={bookingFormData.notes}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                        className="bg-white/10 border-orange-500/20"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                        Add Booking
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="bg-white/10 border-orange-500/20 text-white">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-semibold">{booking.djs.stage_name || booking.djs.name}</h3>
                          <Badge
                            variant="secondary"
                            className={`${
                              booking.status === "confirmed"
                                ? "bg-green-600/50"
                                : booking.status === "pending"
                                  ? "bg-yellow-600/50"
                                  : "bg-red-600/50"
                            } text-white`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-orange-200">
                          {booking.venues.name} - {booking.venues.location}
                        </p>
                        <p className="text-sm text-orange-300">
                          {new Date(booking.event_date).toLocaleDateString()} at {booking.event_time}
                        </p>
                        <p className="text-sm text-orange-300">Rate: ${booking.rate}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trade Requests Management */}
          <TabsContent value="trades" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Trade Request Management</h2>

            <div className="space-y-4">
              {tradeRequests.map((trade) => {
                const requestingDJ = getDJById(trade.requesting_dj_id)
                const targetDJ = getDJById(trade.target_dj_id)
                return (
                  <Card key={trade.id} className="bg-white/10 border-orange-500/20 text-white">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold">Trade Request</h3>
                            <Badge
                              variant="secondary"
                              className={`${
                                trade.status === "approved"
                                  ? "bg-green-600/50"
                                  : trade.status === "pending"
                                    ? "bg-orange-600/50"
                                    : "bg-red-600/50"
                              } text-white`}
                            >
                              {trade.status}
                            </Badge>
                          </div>
                          <p className="text-orange-200">
                            {requestingDJ?.stage_name || requestingDJ?.name} wants to trade with{" "}
                            {targetDJ?.stage_name || targetDJ?.name}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-orange-300">
                            <div>
                              <p>
                                <strong>Requesting:</strong> {trade.requesting_venue}
                              </p>
                              <p>Date: {trade.requested_date}</p>
                            </div>
                            <div>
                              <p>
                                <strong>Target:</strong> {trade.target_venue}
                              </p>
                              <p>Date: {trade.target_date}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 bg-white/5 p-3 rounded">{trade.message}</p>
                          <p className="text-xs text-gray-400">{new Date(trade.created_at).toLocaleString()}</p>
                        </div>
                        {trade.status === "pending" && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleApproveTradeRequest(trade.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejectTradeRequest(trade.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
