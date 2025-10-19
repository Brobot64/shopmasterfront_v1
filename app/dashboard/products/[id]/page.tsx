"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { productsService } from "@/services"
import { toast } from "sonner" // or your preferred toast library

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  quantity: number
  status: string
  skuNumber: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  imageUrl?: string
  minPrice?: number
  reOrderPoint?: number
  outlet?: {
    name: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({})

  const productId = params.id as string

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      const response = await productsService.getProductById(productId)
      setProduct(response.data)
      setEditedProduct(response.data)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Failed to load product details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await productsService.updateProduct(productId, editedProduct)
      setProduct(editedProduct as Product)
      setIsEditing(false)
      toast.success("Product updated successfully")
      fetchProduct() // Refresh data to get latest from server
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProduct(product || {})
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    setEditedProduct(prev => ({
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight">Product Not Found</h1>
        </div>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
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
              {isEditing ? "Edit Product" : "Product Details"}
            </h1>
          </div>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>.</span>
            <span>Products</span>
            <span>.</span>
            <span className="text-foreground font-semibold">{product.name}</span>
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
              Edit Product
            </Button>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-bold text-foreground uppercase tracking-wide">Product Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProduct.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-medium">{product.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="skuNumber" className="text-sm font-bold text-foreground uppercase tracking-wide">SKU</Label>
                  {isEditing ? (
                    <Input
                      id="skuNumber"
                      value={editedProduct.skuNumber || ""}
                      onChange={(e) => handleInputChange("skuNumber", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-medium font-mono">{product.skuNumber}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-bold text-foreground uppercase tracking-wide">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={editedProduct.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-lg">{product.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-bold text-foreground uppercase tracking-wide">Price ($)</Label>
                  {isEditing ? (
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={editedProduct.price || 0}
                      onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-semibold">${product.price}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-sm font-bold text-foreground uppercase tracking-wide">Stock Quantity</Label>
                  {isEditing ? (
                    <Input
                      id="quantity"
                      type="number"
                      value={editedProduct.quantity || 0}
                      onChange={(e) => handleInputChange("quantity", parseInt(e.target.value))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-medium">{product.quantity} units</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-bold text-foreground uppercase tracking-wide">Category</Label>
                  {isEditing ? (
                    <Select
                      value={editedProduct.category || ""}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Home">Home & Garden</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-2 text-lg font-medium">{product.category}</p>
                  )}
                </div>
              </div>

              {/* Additional fields from your API response */}
              {product.minPrice !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minPrice" className="text-sm font-bold text-foreground uppercase tracking-wide">Minimum Price ($)</Label>
                    {isEditing ? (
                      <Input
                        id="minPrice"
                        type="number"
                        step="0.01"
                        value={editedProduct.minPrice || 0}
                        onChange={(e) => handleInputChange("minPrice", parseFloat(e.target.value))}
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 text-lg font-semibold">${product.minPrice}</p>
                    )}
                  </div>
                </div>
              )}

              {product.reOrderPoint !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="reOrderPoint" className="text-sm font-bold text-foreground uppercase tracking-wide">Re-order Point</Label>
                    {isEditing ? (
                      <Input
                        id="reOrderPoint"
                        type="number"
                        value={editedProduct.reOrderPoint || 0}
                        onChange={(e) => handleInputChange("reOrderPoint", parseInt(e.target.value))}
                        className="mt-2"
                      />
                    ) : (
                      <p className="mt-2 text-lg font-medium">{product.reOrderPoint} units</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Current Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedProduct.status || ""}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge
                        variant={
                          product.status === "active" ? "default" :
                          product.status === "inactive" ? "secondary" :
                          "destructive"
                        }
                      >
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
                {product.outlet && (
                  <div>
                    <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Outlet</Label>
                    <p className="mt-2 text-lg font-medium">{product.outlet.name}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Created</Label>
                  <p className="mt-2 text-lg font-medium">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Last Updated</Label>
                  <p className="mt-2 text-lg font-medium">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}