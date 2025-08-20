"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Music, ArrowLeft, Mail, Phone, MapPin, Calendar, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface DJ {
  id: string
  name: string
  stage_name: string
  slug: string
}

export default function ContactPage() {
  const [formType, setFormType] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [djs, setDjs] = useState<DJ[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventDate: "",
    eventTime: "",
    duration: "",
    djPreference: "",
    genre: "",
    experience: "",
    socialLinks: "",
    currentDj: "",
    tradeWith: "",
    tradeDate: "",
    message: "",
  })

  const supabase = createClient()

  useEffect(() => {
    loadDJs()
  }, [])

  const loadDJs = async () => {
    try {
      const { data } = await supabase.from("djs").select("id, name, stage_name, slug").order("name")

      if (data) setDjs(data)
    } catch (error) {
      console.error("Error loading DJs:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const emailData = {
        type: formType === "join" ? "dj_application" : formType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: getSubjectByType(formType),
        message: formatMessage(formType, formData),
        djId: formData.djPreference || null,
        venueName: formData.company || null,
        eventDate: formData.eventDate || null,
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      })

      if (response.ok) {
        alert("Thank you for your inquiry! We'll get back to you within 24 hours.")
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          eventDate: "",
          eventTime: "",
          duration: "",
          djPreference: "",
          genre: "",
          experience: "",
          socialLinks: "",
          currentDj: "",
          tradeWith: "",
          tradeDate: "",
          message: "",
        })
      } else {
        alert("Sorry, there was an error sending your message. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Sorry, there was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSubjectByType = (type: string) => {
    switch (type) {
      case "booking":
        return "DJ Booking Request"
      case "join":
        return "DJ Application"
      case "trade":
        return "Trade Request"
      default:
        return "General Inquiry"
    }
  }

  const formatMessage = (type: string, data: any) => {
    let message = data.message

    if (type === "booking") {
      message += `\n\nBooking Details:\n`
      if (data.eventDate) message += `Event Date: ${data.eventDate}\n`
      if (data.eventTime) message += `Event Time: ${data.eventTime}\n`
      if (data.duration) message += `Duration: ${data.duration} hours\n`
      if (data.djPreference) {
        const dj = djs.find((d) => d.id === data.djPreference)
        message += `DJ Preference: ${dj?.stage_name || dj?.name || "Any"}\n`
      }
    } else if (type === "join") {
      message += `\n\nDJ Application Details:\n`
      if (data.genre) message += `Primary Genre: ${data.genre}\n`
      if (data.experience) message += `Experience: ${data.experience}\n`
      if (data.socialLinks) message += `Social Links: ${data.socialLinks}\n`
    } else if (type === "trade") {
      message += `\n\nTrade Request Details:\n`
      if (data.currentDj) {
        const currentDj = djs.find((d) => d.id === data.currentDj)
        message += `Current DJ: ${currentDj?.stage_name || currentDj?.name}\n`
      }
      if (data.tradeWith) {
        const targetDj = djs.find((d) => d.id === data.tradeWith)
        message += `Trade With: ${targetDj?.stage_name || targetDj?.name}\n`
      }
      if (data.tradeDate) message += `Trade Date: ${data.tradeDate}\n`
    }

    return message
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
              <Link href="/calendar" className="text-foreground hover:text-primary transition-colors">
                Calendar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Ready to book talent or join our roster? We're here to help.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Contact Information</CardTitle>
                <CardDescription className="text-muted-foreground">Reach out to us directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground font-medium">Email</p>
                    <p className="text-muted-foreground">toualee10@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground font-medium">Phone</p>
                    <p className="text-muted-foreground">(555) 123-SWITCH</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground font-medium">Headquarters</p>
                    <p className="text-muted-foreground">Austin, TX</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground">9AM - 6PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground">10AM - 4PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">Closed</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-primary">Emergency bookings available 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Send Us a Message</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose your inquiry type and we'll get back to you quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Form Type Selector */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
                  <Button
                    variant={formType === "general" ? "default" : "outline"}
                    onClick={() => setFormType("general")}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    General
                  </Button>
                  <Button
                    variant={formType === "booking" ? "default" : "outline"}
                    onClick={() => setFormType("booking")}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Book DJ
                  </Button>
                  <Button
                    variant={formType === "join" ? "default" : "outline"}
                    onClick={() => setFormType("join")}
                    className="flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Join Us
                  </Button>
                  <Button
                    variant={formType === "trade" ? "default" : "outline"}
                    onClick={() => setFormType("trade")}
                    className="flex items-center gap-2"
                  >
                    <Music className="w-4 h-4" />
                    Trade Request
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-foreground">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-foreground">
                        {formType === "booking"
                          ? "Venue/Company"
                          : formType === "join"
                            ? "Current Residency"
                            : "Company"}
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        placeholder={
                          formType === "booking"
                            ? "Your venue name"
                            : formType === "join"
                              ? "Where do you currently play?"
                              : "Your company"
                        }
                      />
                    </div>
                  </div>

                  {/* Conditional Fields Based on Form Type */}
                  {formType === "booking" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="event-date" className="text-foreground">
                            Event Date *
                          </Label>
                          <Input
                            id="event-date"
                            type="date"
                            required
                            value={formData.eventDate}
                            onChange={(e) => handleInputChange("eventDate", e.target.value)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                        <div>
                          <Label htmlFor="event-time" className="text-foreground">
                            Event Time
                          </Label>
                          <Input
                            id="event-time"
                            type="time"
                            value={formData.eventTime}
                            onChange={(e) => handleInputChange("eventTime", e.target.value)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration" className="text-foreground">
                            Duration (hours)
                          </Label>
                          <Select
                            value={formData.duration}
                            onValueChange={(value) => handleInputChange("duration", value)}
                          >
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="3">3 hours</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                              <SelectItem value="5">5 hours</SelectItem>
                              <SelectItem value="6+">6+ hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dj-preference" className="text-foreground">
                          DJ Preference
                        </Label>
                        <Select
                          value={formData.djPreference}
                          onValueChange={(value) => handleInputChange("djPreference", value)}
                        >
                          <SelectTrigger className="bg-input border-border text-foreground">
                            <SelectValue placeholder="Any specific DJ or genre?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No preference</SelectItem>
                            {djs.map((dj) => (
                              <SelectItem key={dj.id} value={dj.id}>
                                {dj.stage_name || dj.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {formType === "join" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="genre" className="text-foreground">
                            Primary Genre *
                          </Label>
                          <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Select your genre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="techno">Techno</SelectItem>
                              <SelectItem value="trance">Trance</SelectItem>
                              <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                              <SelectItem value="bass">Bass/Dubstep</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience" className="text-foreground">
                            Years of Experience
                          </Label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) => handleInputChange("experience", value)}
                          >
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2">1-2 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="social-links" className="text-foreground">
                          Social Media / SoundCloud
                        </Label>
                        <Input
                          id="social-links"
                          value={formData.socialLinks}
                          onChange={(e) => handleInputChange("socialLinks", e.target.value)}
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          placeholder="Links to your mixes, Instagram, etc."
                        />
                      </div>
                    </>
                  )}

                  {formType === "trade" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="current-dj" className="text-foreground">
                            Your Name (DJ)
                          </Label>
                          <Select
                            value={formData.currentDj}
                            onValueChange={(value) => handleInputChange("currentDj", value)}
                          >
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Select your name" />
                            </SelectTrigger>
                            <SelectContent>
                              {djs.map((dj) => (
                                <SelectItem key={dj.id} value={dj.id}>
                                  {dj.stage_name || dj.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="trade-with" className="text-foreground">
                            Trade With
                          </Label>
                          <Select
                            value={formData.tradeWith}
                            onValueChange={(value) => handleInputChange("tradeWith", value)}
                          >
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Who do you want to trade with?" />
                            </SelectTrigger>
                            <SelectContent>
                              {djs
                                .filter((dj) => dj.id !== formData.currentDj)
                                .map((dj) => (
                                  <SelectItem key={dj.id} value={dj.id}>
                                    {dj.stage_name || dj.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="trade-date" className="text-foreground">
                          Date to Trade *
                        </Label>
                        <Input
                          id="trade-date"
                          type="date"
                          required
                          value={formData.tradeDate}
                          onChange={(e) => handleInputChange("tradeDate", e.target.value)}
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                    </>
                  )}

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-foreground">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      placeholder={
                        formType === "booking"
                          ? "Tell us about your event, venue capacity, music preferences, and any special requirements..."
                          : formType === "join"
                            ? "Tell us about your DJ experience, style, and why you want to join The Switch..."
                            : formType === "trade"
                              ? "Explain why you need to trade this date and any additional details..."
                              : "How can we help you today?"
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-primary-foreground py-3"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
