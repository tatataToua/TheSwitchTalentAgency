"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DJ } from "@/lib/types"
import { X, Plus } from "lucide-react"

interface DJFormProps {
  dj?: DJ | null
  onSave: (dj: Omit<DJ, "id">) => void
  onCancel: () => void
}

export function DJForm({ dj, onSave, onCancel }: DJFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    genre: [] as string[],
    location: "",
    bio: "",
    experience: "",
    bookingRate: "",
    image: "",
    socialMedia: {
      instagram: "",
      soundcloud: "",
      spotify: "",
      twitter: "",
    },
    equipment: [] as string[],
    mixSamples: [] as Array<{ title: string; url: string; duration: string }>,
    residencies: [] as string[],
    upcomingGigs: [] as Array<{ venue: string; date: string; time: string; city: string }>,
    achievements: [] as string[],
    availability: "available" as "available" | "busy" | "booked",
    rating: 0,
    totalGigs: 0,
    joinedDate: new Date().toISOString(),
    isActive: true,
  })

  const [newEquipment, setNewEquipment] = useState("")
  const [newGenre, setNewGenre] = useState("")
  const [newMixSample, setNewMixSample] = useState({ title: "", url: "", duration: "" })
  const [newAchievement, setNewAchievement] = useState("")
  const [newResidency, setNewResidency] = useState("")

  useEffect(() => {
    if (dj) {
      setFormData({
        name: dj.name,
        slug: dj.slug,
        genre: dj.genre || [],
        location: dj.location,
        bio: dj.bio,
        experience: dj.experience || "",
        bookingRate: dj.bookingRate || "",
        image: dj.image,
        socialMedia: dj.socialMedia || { instagram: "", soundcloud: "", spotify: "", twitter: "" },
        equipment: dj.equipment || [],
        mixSamples: dj.mixSamples || [],
        residencies: dj.residencies || [],
        upcomingGigs: dj.upcomingGigs || [],
        achievements: dj.achievements || [],
        availability: dj.availability || "available",
        rating: dj.rating || 0,
        totalGigs: dj.totalGigs || 0,
        joinedDate: dj.joinedDate || new Date().toISOString(),
        isActive: dj.isActive !== undefined ? dj.isActive : true,
      })
    }
  }, [dj])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const slug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    onSave({ ...formData, slug })
  }

  const addGenre = () => {
    if (newGenre.trim() && !formData.genre.includes(newGenre.trim())) {
      setFormData((prev) => ({
        ...prev,
        genre: [...prev.genre, newGenre.trim()],
      }))
      setNewGenre("")
    }
  }

  const removeGenre = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.filter((_, i) => i !== index),
    }))
  }

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData((prev) => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()],
      }))
      setNewEquipment("")
    }
  }

  const removeEquipment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }))
  }

  const addMixSample = () => {
    if (newMixSample.title.trim() && newMixSample.url.trim()) {
      setFormData((prev) => ({
        ...prev,
        mixSamples: [...prev.mixSamples, { ...newMixSample }],
      }))
      setNewMixSample({ title: "", url: "", duration: "" })
    }
  }

  const removeMixSample = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mixSamples: prev.mixSamples.filter((_, i) => i !== index),
    }))
  }

  const addResidency = () => {
    if (newResidency.trim()) {
      setFormData((prev) => ({
        ...prev,
        residencies: [...prev.residencies, newResidency.trim()],
      }))
      setNewResidency("")
    }
  }

  const removeResidency = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      residencies: prev.residencies.filter((_, i) => i !== index),
    }))
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }))
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 to-pink-900 text-white border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dj ? "Edit DJ" : "Add New DJ"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Name
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
              <Label htmlFor="slug" className="text-white">
                Slug (URL-friendly name)
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                placeholder="auto-generated from name"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-white">
                Location
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
              <Label htmlFor="bookingRate" className="text-white">
                Booking Rate
              </Label>
              <Input
                id="bookingRate"
                value={formData.bookingRate}
                onChange={(e) => setFormData((prev) => ({ ...prev, bookingRate: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                placeholder="$2,000/night"
                required
              />
            </div>
            <div>
              <Label htmlFor="rating" className="text-white">
                Rating (1-5)
              </Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number.parseFloat(e.target.value) || 0 }))}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="totalGigs" className="text-white">
                Total Gigs
              </Label>
              <Input
                id="totalGigs"
                type="number"
                value={formData.totalGigs}
                onChange={(e) => setFormData((prev) => ({ ...prev, totalGigs: Number.parseInt(e.target.value) || 0 }))}
                className="bg-white/10 border-white/20 text-white"
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
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="availability" className="text-white">
                Availability
              </Label>
              <select
                id="availability"
                value={formData.availability}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, availability: e.target.value as "available" | "busy" | "booked" }))
                }
                className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="booked">Booked</option>
              </select>
            </div>
          </div>

          {/* Bio and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="bg-white/10 border-white/20 text-white min-h-[100px]"
                placeholder="Tell us about this DJ..."
              />
            </div>
            <div>
              <Label htmlFor="experience" className="text-white">
                Experience
              </Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                className="bg-white/10 border-white/20 text-white min-h-[100px]"
                placeholder="Years of experience, notable achievements..."
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <Label className="text-white text-lg font-semibold">Genres</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Add genre..."
              />
              <Button type="button" onClick={addGenre} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.genre.map((genre, index) => (
                <div key={index} className="flex items-center gap-1 bg-purple-600/50 px-2 py-1 rounded text-sm">
                  {genre}
                  <button type="button" onClick={() => removeGenre(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <Label className="text-white text-lg font-semibold">Social Media</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="instagram" className="text-purple-200">
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, instagram: e.target.value },
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="soundcloud" className="text-purple-200">
                  SoundCloud
                </Label>
                <Input
                  id="soundcloud"
                  value={formData.socialMedia.soundcloud}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, soundcloud: e.target.value },
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="https://soundcloud.com/username"
                />
              </div>
              <div>
                <Label htmlFor="spotify" className="text-purple-200">
                  Spotify
                </Label>
                <Input
                  id="spotify"
                  value={formData.socialMedia.spotify}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, spotify: e.target.value },
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="https://open.spotify.com/artist/..."
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-purple-200">
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialMedia: { ...prev.socialMedia, twitter: e.target.value },
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <Label className="text-white text-lg font-semibold">Equipment</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Add equipment..."
              />
              <Button type="button" onClick={addEquipment} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.equipment.map((item, index) => (
                <div key={index} className="flex items-center gap-1 bg-purple-600/50 px-2 py-1 rounded text-sm">
                  {item}
                  <button type="button" onClick={() => removeEquipment(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mix Samples */}
          <div>
            <Label className="text-white text-lg font-semibold">Mix Samples</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
              <Input
                value={newMixSample.title}
                onChange={(e) => setNewMixSample((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Mix title..."
              />
              <Input
                value={newMixSample.url}
                onChange={(e) => setNewMixSample((prev) => ({ ...prev, url: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Mix URL..."
              />
              <Input
                value={newMixSample.duration}
                onChange={(e) => setNewMixSample((prev) => ({ ...prev, duration: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Duration (e.g., 45:30)"
              />
              <Button type="button" onClick={addMixSample} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.mixSamples.map((sample, index) => (
                <div key={index} className="flex items-center gap-2 bg-purple-600/20 p-2 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{sample.title}</div>
                    <div className="text-sm text-purple-200">{sample.url}</div>
                    <div className="text-xs text-purple-300">Duration: {sample.duration}</div>
                  </div>
                  <button type="button" onClick={() => removeMixSample(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Residencies */}
          <div>
            <Label className="text-white text-lg font-semibold">Residencies</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newResidency}
                onChange={(e) => setNewResidency(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Add residency..."
              />
              <Button type="button" onClick={addResidency} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.residencies.map((residency, index) => (
                <div key={index} className="flex items-center gap-1 bg-pink-600/50 px-2 py-1 rounded text-sm">
                  {residency}
                  <button type="button" onClick={() => removeResidency(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <Label className="text-white text-lg font-semibold">Achievements</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Add achievement..."
              />
              <Button type="button" onClick={addAchievement} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 bg-purple-600/20 p-2 rounded">
                  <span className="text-sm flex-1">{achievement}</span>
                  <button type="button" onClick={() => removeAchievement(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
              {dj ? "Update DJ" : "Add DJ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
