"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { outletsService, Outlet, CreateOutletData } from "@/services"
import { Contact, UpdateOutletData } from "@/services/outlets"
import { toast } from "@/lib/toast"
import { useAuth } from "@/contexts/auth-context"
import { Plus, Trash2 } from "lucide-react"

interface AddOutletFormProps {
  outlet?: Outlet
  onSuccess: () => void
}

export function AddOutletForm({ outlet, onSuccess }: AddOutletFormProps) {
  const { user: authUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>(outlet?.contact || [])
  
  const [formData, setFormData] = useState({
    name: outlet?.name || "",
    address: outlet?.address || "",
    phone: outlet?.phone || "",
    email: outlet?.email || "",
    imageUrl: outlet?.imageUrl || "",
    description: outlet?.description || "",
    status: outlet?.status || "active"
  })

  const addContact = () => {
    setContacts([...contacts, { name: "", value: "" }])
  }

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index)
    setContacts(newContacts)
  }

  const updateContact = (index: number, field: 'name' | 'value', value: string) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    setContacts(newContacts)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (outlet) {
        // Update existing outlet
        const updateData: UpdateOutletData = {
          name: formData.name,
          address: formData.address,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          contact: contacts.length > 0 ? contacts : undefined,
          imageUrl: formData.imageUrl || undefined,
          description: formData.description || undefined,
          status: formData.status as any
        }

        await outletsService.updateOutlet(outlet.id, updateData)
      } else {
        // Create new outlet
        if (!authUser?.businessId) {
          toast.error("Business ID is required")
          return
        }

        const createData: CreateOutletData = {
          name: formData.name,
          address: formData.address,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          contact: contacts.length > 0 ? contacts : undefined,
          imageUrl: formData.imageUrl || undefined,
          description: formData.description || undefined,
          businessId: authUser.businessId
        }

        await outletsService.createOutlet(authUser.businessId, createData)
      }

      onSuccess()
    } catch (error: any) {
      console.error("Error saving outlet:", error)
      toast.error(error.response?.data?.message || "Failed to save outlet")
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!outlet
  const title = isEditing ? "Edit Outlet" : "Add New Outlet"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Outlet Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{isEditing ? "Status" : "Initial Status"}</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                placeholder="Brief description of this outlet..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="https://example.com/outlet-image.jpg"
              />
            </div>
          </div>

          {/* Contacts Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Contact Information
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContact}
                  className="ml-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              )}
            </Label>
            <div className="space-y-2">
              {contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Contact name (e.g., Sales Manager)"
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Contact value (e.g., phone, email)"
                      value={contact.value}
                      onChange={(e) => updateContact(index, 'value', e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeContact(index)}
                    className="h-10 w-10 p-0"
                    disabled={contacts.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {isEditing && contacts.length === 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContact}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (isEditing ? "Update Outlet" : "Add Outlet")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}