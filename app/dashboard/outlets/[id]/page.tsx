"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Save, X, Users, Package, Phone, Mail, MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { outletsService, Outlet } from "@/services"
import { UpdateOutletData, Contact } from "@/services/outlets"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

export default function OutletDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [outlet, setOutlet] = useState<Outlet | null>(null)
  const [editedOutlet, setEditedOutlet] = useState<Partial<Outlet>>({})
  const [contacts, setContacts] = useState<Contact[]>([])

  const outletId = params.id as string

  useEffect(() => {
    fetchOutlet()
  }, [outletId])

  const fetchOutlet = async () => {
    try {
      setIsLoading(true)
      const response = await outletsService.getOutletById(outletId)
      const fetchedOutlet = response.data.outlet
      setOutlet(fetchedOutlet)
      setEditedOutlet(fetchedOutlet)
      setContacts(fetchedOutlet.contact || [])
    } catch (error) {
      console.error("Error fetching outlet:", error)
      toast.error("Failed to load outlet details")
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const updateData: UpdateOutletData = {
        name: editedOutlet.name,
        address: editedOutlet.address,
        phone: editedOutlet.phone || undefined,
        email: editedOutlet.email || undefined,
        contact: contacts.length > 0 ? contacts : undefined,
        imageUrl: editedOutlet.imageUrl || undefined,
        description: editedOutlet.description || undefined,
        status: editedOutlet.status as any
      }

      await outletsService.updateOutlet(outletId, updateData)
      setOutlet({ ...outlet, ...updateData } as Outlet)
      setIsEditing(false)
      toast.success("Outlet updated successfully")
    } catch (error) {
      console.error("Error updating outlet:", error)
      toast.error("Failed to update outlet")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedOutlet(outlet || {})
    setContacts(outlet?.contact || [])
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof Outlet, value: any) => {
    setEditedOutlet(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!outlet) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight">Outlet Not Found</h1>
        </div>
        <p className="text-muted-foreground">The outlet you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {isEditing ? "Edit Outlet" : outlet.name}
            </h1>
          </div>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>•</span>
            <span>Outlets</span>
            <span>•</span>
            <span className="text-foreground font-semibold">{outlet.name}</span>
          </nav>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Outlet
            </Button>
          )}
        </div>
      </div>

      {/* Outlet Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outlet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedOutlet.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-2"
                      required
                    />
                  ) : (
                    <p className="mt-2 text-lg font-semibold">{outlet.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Status
                  </Label>
                  {isEditing ? (
                    <Select
                      value={editedOutlet.status || ""}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge
                        variant={
                          outlet.status === "active" ? "default" : "destructive"
                        }
                      >
                        {outlet.status.charAt(0).toUpperCase() + outlet.status.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editedOutlet.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-medium">
                      <Phone className="inline h-4 w-4 mr-2" />
                      {outlet.phone || 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedOutlet.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-medium">
                      <Mail className="inline h-4 w-4 mr-2" />
                      {outlet.email || 'N/A'}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold text-foreground uppercase tracking-wide">
                  Address
                </Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={editedOutlet.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="mt-2"
                    rows={3}
                    required
                  />
                ) : (
                  <p className="mt-2 text-lg">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    {outlet.address}
                  </p>
                )}
              </div>

              {outlet.description && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Description
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editedOutlet.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2 text-lg text-muted-foreground">
                      {outlet.description}
                    </p>
                  )}
                </div>
              )}

              {outlet.imageUrl && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Image
                  </Label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={editedOutlet.imageUrl || ""}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      className="mt-2"
                      placeholder="https://example.com/outlet-image.jpg"
                    />
                  ) : (
                    <img
                      src={outlet.imageUrl}
                      alt={outlet.name}
                      className="mt-2 w-48 h-32 object-cover rounded-md"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contacts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Contact Information
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addContact}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length > 0 ? (
                <div className="space-y-2">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-md">
                      {isEditing ? (
                        <>
                          <Input
                            placeholder="Contact name"
                            value={contact.name}
                            onChange={(e) => updateContact(index, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Contact value"
                            value={contact.value}
                            onChange={(e) => updateContact(index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeContact(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{contact.name}:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsEditing(true)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.value}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No contact information available
                  {isEditing && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={addContact}
                      className="mt-2"
                    >
                      Add first contact
                    </Button>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(outlet.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">
                    {new Date(outlet.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {outlet.business && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Business</div>
                  <div className="font-medium">{outlet.business.name}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {outlet.users && outlet.users.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Assigned Employees ({outlet.users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {outlet.users.slice(0, 5).map((user) => (
                    <div key={user.id} className="text-sm">
                      {user.firstName} {user.lastName}
                    </div>
                  ))}
                  {outlet.users.length > 5 && (
                    <div className="text-sm text-muted-foreground">
                      +{outlet.users.length - 5} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {outlet.products && outlet.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products ({outlet.products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {outlet.products.slice(0, 5).map((product, index) => (
                    <div key={index} className="text-sm">
                      {product.name}
                    </div>
                  ))}
                  {outlet.products.length > 5 && (
                    <div className="text-sm text-muted-foreground">
                      +{outlet.products.length - 5} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}