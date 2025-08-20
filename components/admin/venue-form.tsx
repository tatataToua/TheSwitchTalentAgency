"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Venue } from "@/lib/types"

interface VenueFormProps {
  venue?: Venue | null
  onSave: (venue: Omit<Venue, "id">) => void
  onCancel: () => void
}

export function VenueForm({ venue, onSave, onCancel }: VenueFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    capacity: 0,
    description: "",
    image: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    address: "",
  })

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name,
        type: venue.type,
        location: venue.location,
        capacity: venue.capacity,
        description: venue.description || "",
        image: venue.image || "",
        contactEmail: venue.contactEmail || "",
        contactPhone: venue.contactPhone || "",
        website: venue.website || "",
        address: venue.address || "",
      })
    }
  }, [venue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 to-pink-900 text-white border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">{venue ? "Edit Venue" : "Add New Venue"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Venue Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-white">
                Venue Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select venue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nightclub">Nightclub</SelectItem>
                  <SelectItem value="Lounge">Lounge</SelectItem>
                  <SelectItem value="Bar">Bar</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Beach Club">Beach Club</SelectItem>
                  <SelectItem value="Rooftop">Rooftop</SelectItem>
                  <SelectItem value="Event Space">Event Space</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location" className="text-white">
                City/Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="capacity" className="text-white">
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity: Number.parseInt(e.target.value) || 0 }))}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail" className="text-white">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="text-white">
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <Label htmlFor="address" className="text-white">
              Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Full address"
            />
          </div>

          <div>
            <Label htmlFor="website" className="text-white">
              Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="https://venue-website.com"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-white">
              Image URL
            </Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="https://example.com/venue-image.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-white/10 border-white/20 text-white min-h-[100px]"
              placeholder="Describe the venue..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {venue ? "Update Venue" : "Add Venue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
