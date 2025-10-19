"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CheckCircleIcon, AlertTriangleIcon, TrendingUpIcon, TrendingDownIcon, DownloadIcon, PrinterIcon } from "lucide-react"

interface InventoryReportViewProps {
  inventory: {
    id: string
    name: string
    date: string
    status: string
    totalItems: number
    reconciledItems: number
    discrepancies: number
    createdBy: string
  }
}

// Mock detailed inventory data
const mockInventoryDetails = {
  "INV-001": {
    summary: {
      totalValue: 45250.75,
      adjustmentValue: -1250.50,
      accuracyRate: 97.96
    },
    items: [
      {
        id: "1",
        productName: "Wireless Headphones",
        sku: "WH-001",
        location: "A1-B2",
        expectedQuantity: 25,
        actualQuantity: 23,
        unitCost: 45.99,
        status: "discrepancy",
        variance: -2,
        varianceValue: -91.98,
        notes: "2 units missing from shelf"
      },
      {
        id: "2",
        productName: "Bluetooth Speaker",
        sku: "BS-002",
        location: "A2-C1",
        expectedQuantity: 15,
        actualQuantity: 15,
        unitCost: 89.99,
        status: "reconciled",
        variance: 0,
        varianceValue: 0,
        notes: ""
      },
      {
        id: "3",
        productName: "USB Cable",
        sku: "UC-003",
        location: "B1-A3",
        expectedQuantity: 100,
        actualQuantity: 98,
        unitCost: 12.99,
        status: "discrepancy",
        variance: -2,
        varianceValue: -25.98,
        notes: "Damaged units removed"
      },
      {
        id: "4",
        productName: "Phone Case",
        sku: "PC-004",
        location: "C1-B2",
        expectedQuantity: 50,
        actualQuantity: 52,
        unitCost: 19.99,
        status: "discrepancy",
        variance: 2,
        varianceValue: 39.98,
        notes: "Found extra units in storage"
      },
      {
        id: "5",
        productName: "Screen Protector",
        sku: "SP-005",
        location: "C2-A1",
        expectedQuantity: 75,
        actualQuantity: 75,
        unitCost: 8.99,
        status: "reconciled",
        variance: 0,
        varianceValue: 0,
        notes: ""
      }
    ]
  }
}

export function InventoryReportView({ inventory }: InventoryReportViewProps) {
  const [activeTab, setActiveTab] = useState("summary")
  
  const details = mockInventoryDetails[inventory.id as keyof typeof mockInventoryDetails] || {
    summary: { totalValue: 0, adjustmentValue: 0, accuracyRate: 100 },
    items: []
  }

  const reconciledItems = details.items.filter(item => item.status === "reconciled")
  const discrepancyItems = details.items.filter(item => item.status === "discrepancy")
  const positiveVariances = discrepancyItems.filter(item => item.variance > 0)
  const negativeVariances = discrepancyItems.filter(item => item.variance < 0)

  const handleExport = () => {
    // Simulate export functionality
    console.log("Exporting inventory report...")
  }

  const handlePrint = () => {
    // Simulate print functionality
    window.print()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reconciled':
        return <Badge variant="default" className="bg-green-500"><CheckCircleIcon className="w-3 h-3 mr-1" />Reconciled</Badge>
      case 'discrepancy':
        return <Badge variant="destructive"><AlertTriangleIcon className="w-3 h-3 mr-1" />Discrepancy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) {
      return <TrendingUpIcon className="w-4 h-4 text-green-600" />
    } else if (variance < 0) {
      return <TrendingDownIcon className="w-4 h-4 text-red-600" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{inventory.name}</h3>
          <p className="text-sm text-muted-foreground">
            Completed on {new Date(inventory.date).toLocaleDateString()} by {inventory.createdBy}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {inventory.reconciledItems} reconciled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{details.summary.accuracyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {inventory.discrepancies} discrepancies found
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${details.summary.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adjustment Value</CardTitle>
            {details.summary.adjustmentValue >= 0 ? 
              <TrendingUpIcon className="h-4 w-4 text-green-600" /> : 
              <TrendingDownIcon className="h-4 w-4 text-red-600" />
            }
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              details.summary.adjustmentValue >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${Math.abs(details.summary.adjustmentValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {details.summary.adjustmentValue >= 0 ? 'Gain' : 'Loss'} from variances
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="reconciled">Reconciled</TabsTrigger>
          <TabsTrigger value="discrepancies">Discrepancies</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Positive Variances:</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{positiveVariances.length} items</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Negative Variances:</span>
                  <div className="flex items-center space-x-2">
                    <TrendingDownIcon className="w-4 h-4 text-red-600" />
                    <span className="font-medium">{negativeVariances.length} items</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Net Adjustment:</span>
                  <span className={details.summary.adjustmentValue >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${Math.abs(details.summary.adjustmentValue).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy Rate</span>
                    <span>{details.summary.accuracyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${details.summary.accuracyRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    {details.summary.accuracyRate >= 95 ? 
                      "Excellent inventory accuracy" :
                      details.summary.accuracyRate >= 90 ?
                      "Good inventory accuracy" :
                      "Inventory accuracy needs improvement"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Inventory Items</CardTitle>
              <CardDescription>
                Complete list of all items counted in this inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Value Impact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.expectedQuantity}</TableCell>
                      <TableCell>{item.actualQuantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getVarianceIcon(item.variance)}
                          <span className={item.variance !== 0 ? 
                            (item.variance > 0 ? 'text-green-600' : 'text-red-600') : ''
                          }>
                            {item.variance > 0 ? '+' : ''}{item.variance}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={item.varianceValue !== 0 ? 
                          (item.varianceValue > 0 ? 'text-green-600' : 'text-red-600') : ''
                        }>
                          {item.varianceValue > 0 ? '+' : ''}${item.varianceValue.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reconciled Items</CardTitle>
              <CardDescription>
                Items where actual count matches expected quantity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciledItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.actualQuantity}</TableCell>
                      <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                      <TableCell>${(item.actualQuantity * item.unitCost).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discrepancies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Items with Discrepancies</CardTitle>
              <CardDescription>
                Items where actual count differs from expected quantity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Value Impact</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discrepancyItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.expectedQuantity}</TableCell>
                      <TableCell>{item.actualQuantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getVarianceIcon(item.variance)}
                          <span className={item.variance > 0 ? 'text-green-600' : 'text-red-600'}>
                            {item.variance > 0 ? '+' : ''}{item.variance}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={item.varianceValue > 0 ? 'text-green-600' : 'text-red-600'}>
                          {item.varianceValue > 0 ? '+' : ''}${item.varianceValue.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">{item.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}