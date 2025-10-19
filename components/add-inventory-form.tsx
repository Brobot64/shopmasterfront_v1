"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, MinusIcon, SaveIcon, CheckIcon, AlertTriangleIcon } from "lucide-react"
import { toast } from "sonner"

interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  expectedQuantity: number
  actualQuantity: number | null
  location: string
  status: 'pending' | 'counted' | 'discrepancy'
  notes?: string
}

interface AddInventoryFormProps {
  onSuccess?: () => void
  editData?: any
}

// Mock product data
const mockProducts = [
  { id: "1", name: "Wireless Headphones", sku: "WH-001", expectedQty: 25, location: "A1-B2" },
  { id: "2", name: "Bluetooth Speaker", sku: "BS-002", expectedQty: 15, location: "A2-C1" },
  { id: "3", name: "USB Cable", sku: "UC-003", expectedQty: 100, location: "B1-A3" },
  { id: "4", name: "Phone Case", sku: "PC-004", expectedQty: 50, location: "C1-B2" },
  { id: "5", name: "Screen Protector", sku: "SP-005", expectedQty: 75, location: "C2-A1" },
]

export function AddInventoryForm({ onSuccess, editData }: AddInventoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    type: "full" // full, partial, cycle
  })

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        description: editData.description || "",
        location: editData.location || "",
        type: editData.type || "full"
      })
      // Load existing inventory items if editing
      if (editData.items) {
        setInventoryItems(editData.items)
      }
    }
  }, [editData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addProductsToInventory = () => {
    if (formData.type === "full") {
      // Add all products for full inventory
      const allItems: InventoryItem[] = mockProducts.map(product => ({
        id: `item-${product.id}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        expectedQuantity: product.expectedQty,
        actualQuantity: null,
        location: product.location,
        status: 'pending' as const
      }))
      setInventoryItems(allItems)
    } else {
      // For partial inventory, add selected products
      const newItems: InventoryItem[] = selectedProducts
        .filter(productId => !inventoryItems.some(item => item.productId === productId))
        .map(productId => {
          const product = mockProducts.find(p => p.id === productId)!
          return {
            id: `item-${productId}`,
            productId,
            productName: product.name,
            sku: product.sku,
            expectedQuantity: product.expectedQty,
            actualQuantity: null,
            location: product.location,
            status: 'pending' as const
          }
        })
      setInventoryItems(prev => [...prev, ...newItems])
    }
  }

  const updateItemQuantity = (itemId: string, quantity: number | null) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const status = quantity === null ? 'pending' : 
                      quantity === item.expectedQuantity ? 'counted' : 'discrepancy'
        return { ...item, actualQuantity: quantity, status }
      }
      return item
    }))
  }

  const updateItemNotes = (itemId: string, notes: string) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ))
  }

  const removeItem = (itemId: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Inventory saved as draft")
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to save draft")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    if (inventoryItems.some(item => item.actualQuantity === null)) {
      toast.error("Please count all items before completing the inventory")
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Inventory completed successfully")
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to complete inventory")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ name: "", description: "", location: "", type: "full" })
    setInventoryItems([])
    setSelectedProducts([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'counted':
        return <Badge variant="default" className="bg-green-500"><CheckIcon className="w-3 h-3 mr-1" />Counted</Badge>
      case 'discrepancy':
        return <Badge variant="destructive"><AlertTriangleIcon className="w-3 h-3 mr-1" />Discrepancy</Badge>
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const countedItems = inventoryItems.filter(item => item.actualQuantity !== null).length
  const totalItems = inventoryItems.length
  const discrepancies = inventoryItems.filter(item => item.status === 'discrepancy').length

  return (
    <div className="space-y-6">
      {/* Inventory Details */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
          <CardDescription>
            Set up the basic information for this inventory count.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Inventory Name</Label>
              <Input
                id="name"
                placeholder="e.g., Monthly Stock Count - January 2024"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Warehouse A, Store Front"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Inventory Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select inventory type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Inventory</SelectItem>
                <SelectItem value="partial">Partial Inventory</SelectItem>
                <SelectItem value="cycle">Cycle Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this inventory count..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Selection (for partial inventory) */}
      {formData.type !== "full" && (
        <Card>
          <CardHeader>
            <CardTitle>Product Selection</CardTitle>
            <CardDescription>
              Select which products to include in this inventory count.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value="" onValueChange={(value) => {
                if (!selectedProducts.includes(value)) {
                  setSelectedProducts(prev => [...prev, value])
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select products to add" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts
                    .filter(product => !selectedProducts.includes(product.id))
                    .map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map(productId => {
                    const product = mockProducts.find(p => p.id === productId)
                    return (
                      <Badge key={productId} variant="secondary" className="flex items-center gap-1">
                        {product?.name}
                        <button
                          onClick={() => setSelectedProducts(prev => prev.filter(id => id !== productId))}
                          className="ml-1 hover:bg-red-500 hover:text-white rounded-full p-0.5"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Products Button */}
      {(formData.type === "full" || selectedProducts.length > 0) && inventoryItems.length === 0 && (
        <div className="flex justify-center">
          <Button onClick={addProductsToInventory} className="w-full md:w-auto">
            <PlusIcon className="mr-2 h-4 w-4" />
            {formData.type === "full" ? "Add All Products" : "Add Selected Products"}
          </Button>
        </div>
      )}

      {/* Inventory Items */}
      {inventoryItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inventory Items</span>
              <div className="text-sm text-muted-foreground">
                Progress: {countedItems}/{totalItems} items counted
                {discrepancies > 0 && (
                  <span className="text-red-600 ml-2">({discrepancies} discrepancies)</span>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Count each item and enter the actual quantity found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${totalItems > 0 ? (countedItems / totalItems) * 100 : 0}%` }}
                ></div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Actual Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.expectedQuantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Count"
                          value={item.actualQuantity ?? ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value)
                            updateItemQuantity(item.id, value)
                          }}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <Input
                          placeholder="Notes..."
                          value={item.notes || ""}
                          onChange={(e) => updateItemNotes(item.id, e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {inventoryItems.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="flex-1"
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            type="button"
            onClick={handleComplete}
            disabled={isLoading || inventoryItems.some(item => item.actualQuantity === null)}
            className="flex-1"
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            {isLoading ? "Completing..." : "Complete Inventory"}
          </Button>
        </div>
      )}
    </div>
  )
}