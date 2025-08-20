"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { DJ, Venue } from "@/lib/types"

interface BookingFormProps {
  djs: DJ[]
  venues: Venue[]
  onSave: (booking: {
    djId: string
    venueId: string
    date: string
    time: string
    rate: number
    status: "pending" | "confirmed" | "cancelled"
    notes?: string
  }) => void
  onCancel: () => void
}

export function BookingForm({ djs, venues, onSave, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    djId: "",
    venueId: "",
    date: "",
    time: "",
    rate: 0,
    status: "pending" as "pending" | "confirmed" | "cancelled",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const selectedDJ = djs.find((dj) => dj.id === formData.djId)

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-900 to-pink-900 text-white border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DJ Selection */}
          <div>
            <Label htmlFor="djId" className="text-white">
              Select DJ
            </Label>
            <Select
              value={formData.djId}
              onValueChange={(value) => {
                const dj = djs.find((d) => d.id === value)
                setFormData((prev) => ({
                  ...prev,
                  djId: value,
                  rate: dj?.rate || 0,
                }))
              }}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a DJ" />
              </SelectTrigger>
              <SelectContent>
                {djs.map((dj) => (
                  <SelectItem key={dj.id} value={dj.id}>
                    {dj.name} - {dj.genre} (${dj.rate}/night)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Venue Selection */}
          <div>
            <Label htmlFor="venueId" className="text-white">
              Select Venue
            </Label>
            <Select
              value={formData.venueId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, venueId: value }))}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name} - {venue.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-white">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-white">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>
          </div>

          {/* Rate and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate" className="text-white">
                Rate ($)
              </Label>
              <Input
                id="rate"
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData((prev) => ({ ...prev, rate: Number.parseInt(e.target.value) || 0 }))}
                className="bg-white/10 border-white/20 text-white"
                required
              />
              {selectedDJ && <p className="text-sm text-purple-200 mt-1">Default rate: ${selectedDJ.rate}</p>}
            </div>
            <div>
              <Label htmlFor="status" className="text-white">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "confirmed" | "cancelled") =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-white">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Any additional notes about this booking..."
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
              Add Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
