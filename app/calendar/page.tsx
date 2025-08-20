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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Music, ArrowLeft, ChevronLeft, ChevronRight, CalendarIcon, RefreshCw, Plus, Send } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface DJ {
  id: string
  name: string
  stage_name: string
  slug: string
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

interface Booking {
  id: string
  dj_id: string
  venue_id: string
  event_date: string
  event_time: string
  status: string
  djs: { name: string; stage_name: string }
  venues: { name: string }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 28))
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null)
  const [djs, setDjs] = useState<DJ[]>([])
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [tradeForm, setTradeForm] = useState({
    requestingDjId: "",
    targetDjId: "",
    requestingVenue: "",
    targetVenue: "",
    requestedDate: "",
    targetDate: "",
    message: "",
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load DJs
      const { data: djsData } = await supabase.from("djs").select("id, name, stage_name, slug").order("name")

      if (djsData) setDjs(djsData)

      // Load trade requests
      const { data: tradesData } = await supabase
        .from("trade_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (tradesData) setTradeRequests(tradesData)

      // Load bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          *,
          djs (name, stage_name),
          venues (name)
        `)
        .order("event_date")

      if (bookingsData) setBookings(bookingsData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/trade-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeForm),
      })

      if (response.ok) {
        setIsTradeModalOpen(false)
        setTradeForm({
          requestingDjId: "",
          targetDjId: "",
          requestingVenue: "",
          targetVenue: "",
          requestedDate: "",
          targetDate: "",
          message: "",
        })
        loadData() // Refresh data
        alert("Trade request submitted successfully!")
      } else {
        alert("Failed to submit trade request")
      }
    } catch (error) {
      console.error("Error submitting trade request:", error)
      alert("Error submitting trade request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const formatDate = (day: number) => {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const dayStr = String(day).padStart(2, "0")
    return `${year}-${month}-${dayStr}`
  }

  const getEventsForDate = (day: number) => {
    const dateStr = formatDate(day)
    const dayBookings = bookings.filter((booking) => booking.event_date === dateStr)
    return selectedDJ
      ? dayBookings.filter((booking) => booking.djs.name === selectedDJ || booking.djs.stage_name === selectedDJ)
      : dayBookings
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
              <Link href="/djs" className="text-foreground hover:text-primary transition-colors">
                DJs
              </Link>
              <Link href="/venues" className="text-foreground hover:text-primary transition-colors">
                Venues
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* DJ Filter */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Filter by DJ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedDJ === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedDJ(null)}
                >
                  All DJs
                </Button>
                {djs.map((dj) => (
                  <Button
                    key={dj.id}
                    variant={selectedDJ === dj.stage_name || selectedDJ === dj.name ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedDJ(dj.stage_name || dj.name)}
                  >
                    {dj.stage_name || dj.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Trade Requests */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Trade Requests
                  </CardTitle>
                  <Dialog open={isTradeModalOpen} onOpenChange={setIsTradeModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border text-foreground max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Trade Request</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Request to trade gigs with another DJ
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleTradeSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="requestingDj">Your DJ</Label>
                            <Select
                              value={tradeForm.requestingDjId}
                              onValueChange={(value) => setTradeForm({ ...tradeForm, requestingDjId: value })}
                            >
                              <SelectTrigger className="bg-input border-border">
                                <SelectValue placeholder="Select your DJ" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                {djs.map((dj) => (
                                  <SelectItem key={dj.id} value={dj.id}>
                                    {dj.stage_name || dj.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="targetDj">Target DJ</Label>
                            <Select
                              value={tradeForm.targetDjId}
                              onValueChange={(value) => setTradeForm({ ...tradeForm, targetDjId: value })}
                            >
                              <SelectTrigger className="bg-input border-border">
                                <SelectValue placeholder="Select target DJ" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                {djs
                                  .filter((dj) => dj.id !== tradeForm.requestingDjId)
                                  .map((dj) => (
                                    <SelectItem key={dj.id} value={dj.id}>
                                      {dj.stage_name || dj.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="requestingVenue">Your Venue</Label>
                            <Input
                              id="requestingVenue"
                              value={tradeForm.requestingVenue}
                              onChange={(e) => setTradeForm({ ...tradeForm, requestingVenue: e.target.value })}
                              className="bg-input border-border"
                              placeholder="e.g., LIV Miami"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="targetVenue">Target Venue</Label>
                            <Input
                              id="targetVenue"
                              value={tradeForm.targetVenue}
                              onChange={(e) => setTradeForm({ ...tradeForm, targetVenue: e.target.value })}
                              className="bg-input border-border"
                              placeholder="e.g., Story Miami"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="requestedDate">Your Date</Label>
                            <Input
                              id="requestedDate"
                              type="date"
                              value={tradeForm.requestedDate}
                              onChange={(e) => setTradeForm({ ...tradeForm, requestedDate: e.target.value })}
                              className="bg-input border-border"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="targetDate">Target Date</Label>
                            <Input
                              id="targetDate"
                              type="date"
                              value={tradeForm.targetDate}
                              onChange={(e) => setTradeForm({ ...tradeForm, targetDate: e.target.value })}
                              className="bg-input border-border"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={tradeForm.message}
                            onChange={(e) => setTradeForm({ ...tradeForm, message: e.target.value })}
                            className="bg-input border-border"
                            placeholder="Explain why you want to make this trade..."
                            rows={3}
                            required
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsTradeModalOpen(false)}
                            className="border-border"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                            {isSubmitting ? (
                              "Submitting..."
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Request
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {tradeRequests.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No trade requests yet</p>
                ) : (
                  tradeRequests.slice(0, 5).map((trade) => {
                    const requestingDj = djs.find((dj) => dj.id === trade.requesting_dj_id)
                    const targetDj = djs.find((dj) => dj.id === trade.target_dj_id)

                    return (
                      <div key={trade.id} className="p-3 bg-secondary/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              trade.status === "approved"
                                ? "default"
                                : trade.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              trade.status === "approved"
                                ? "bg-green-600"
                                : trade.status === "rejected"
                                  ? "bg-red-600"
                                  : "bg-yellow-600"
                            }
                          >
                            {trade.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(trade.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          {requestingDj?.stage_name || requestingDj?.name} → {targetDj?.stage_name || targetDj?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {trade.requesting_venue} ↔ {trade.target_venue}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {trade.requested_date} ↔ {trade.target_date}
                        </p>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground text-2xl">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                    <CardDescription className="text-primary">
                      {selectedDJ ? `${selectedDJ}'s Schedule` : "All DJ Schedules"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2 h-24"></div>
                  ))}

                  {/* Calendar days */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1
                    const events = getEventsForDate(day)
                    const isToday = day === 28 && currentDate.getMonth() === 11

                    return (
                      <div
                        key={day}
                        className={`p-2 h-24 border border-border rounded-lg ${
                          isToday ? "bg-primary/20 border-primary" : "bg-secondary/10"
                        }`}
                      >
                        <div className="text-sm text-foreground font-medium mb-1">{day}</div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="text-xs p-1 bg-primary/30 rounded text-primary-foreground truncate"
                              title={`${event.djs.stage_name || event.djs.name} at ${event.venues.name} (${event.event_time})`}
                            >
                              {event.djs.stage_name || event.djs.name}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{events.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
