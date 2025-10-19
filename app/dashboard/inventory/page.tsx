"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, EyeIcon, EditIcon, FileTextIcon, ClockIcon, CheckCircleIcon } from "lucide-react"
import { AddInventoryForm } from "@/components/add-inventory-form"
import { InventoryReportView } from "@/components/inventory-report-view"

// Mock data for inventories
const inventories = [
  {
    id: "INV-001",
    name: "Monthly Stock Count - January 2024",
    date: "2024-01-15",
    status: "completed",
    totalItems: 245,
    reconciledItems: 240,
    discrepancies: 5,
    createdBy: "John Doe"
  },
  {
    id: "INV-002",
    name: "Quarterly Audit - Q4 2023",
    date: "2023-12-30",
    status: "completed",
    totalItems: 312,
    reconciledItems: 308,
    discrepancies: 4,
    createdBy: "Jane Smith"
  },
  {
    id: "INV-003",
    name: "Weekly Count - Electronics",
    date: "2024-01-20",
    status: "draft",
    totalItems: 89,
    reconciledItems: 45,
    discrepancies: 0,
    createdBy: "Mike Johnson"
  },
  {
    id: "INV-004",
    name: "Emergency Recount - Warehouse A",
    date: "2024-01-18",
    status: "in_progress",
    totalItems: 156,
    reconciledItems: 120,
    discrepancies: 2,
    createdBy: "Sarah Wilson"
  }
]

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-500"><CheckCircleIcon className="w-3 h-3 mr-1" />Completed</Badge>
    case "in_progress":
      return <Badge variant="secondary"><ClockIcon className="w-3 h-3 mr-1" />In Progress</Badge>
    case "draft":
      return <Badge variant="outline"><EditIcon className="w-3 h-3 mr-1" />Draft</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function InventoryPage() {
  const [selectedInventory, setSelectedInventory] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  const handleInventorySuccess = () => {
    setIsAddDialogOpen(false)
    // Refresh inventory list
  }

  const handleViewReport = (inventory: any) => {
    setSelectedInventory(inventory)
    setIsReportDialogOpen(true)
  }

  const handleEditDraft = (inventory: any) => {
    setSelectedInventory(inventory)
    setIsAddDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage your physical inventory counts and reconciliation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Inventory Count</DialogTitle>
                <DialogDescription>
                  Start a new physical inventory count. You can save as draft and continue later.
                </DialogDescription>
              </DialogHeader>
              <AddInventoryForm 
                onSuccess={handleInventorySuccess}
                editData={selectedInventory?.status === 'draft' ? selectedInventory : null}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Inventories</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory History</CardTitle>
              <CardDescription>
                View all inventory counts and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inventory ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Reconciled</TableHead>
                    <TableHead>Discrepancies</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventories.map((inventory) => (
                    <TableRow key={inventory.id}>
                      <TableCell className="font-medium">{inventory.id}</TableCell>
                      <TableCell>{inventory.name}</TableCell>
                      <TableCell>{new Date(inventory.date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(inventory.status)}</TableCell>
                      <TableCell>{inventory.totalItems}</TableCell>
                      <TableCell>{inventory.reconciledItems}</TableCell>
                      <TableCell>
                        {inventory.discrepancies > 0 ? (
                          <span className="text-red-600 font-medium">{inventory.discrepancies}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell>{inventory.createdBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {inventory.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(inventory)}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View Report
                            </Button>
                          )}
                          {inventory.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDraft(inventory)}
                            >
                              <EditIcon className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          )}
                          {inventory.status === 'in_progress' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDraft(inventory)}
                            >
                              <EditIcon className="h-4 w-4 mr-1" />
                              Continue
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Inventories</CardTitle>
              <CardDescription>
                View all completed inventory counts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inventory ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Reconciled</TableHead>
                    <TableHead>Discrepancies</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventories.filter(inv => inv.status === 'completed').map((inventory) => (
                    <TableRow key={inventory.id}>
                      <TableCell className="font-medium">{inventory.id}</TableCell>
                      <TableCell>{inventory.name}</TableCell>
                      <TableCell>{new Date(inventory.date).toLocaleDateString()}</TableCell>
                      <TableCell>{inventory.totalItems}</TableCell>
                      <TableCell>{inventory.reconciledItems}</TableCell>
                      <TableCell>
                        {inventory.discrepancies > 0 ? (
                          <span className="text-red-600 font-medium">{inventory.discrepancies}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(inventory)}
                        >
                          <FileTextIcon className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Inventories</CardTitle>
              <CardDescription>
                Continue working on active inventory counts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inventory ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date Started</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventories.filter(inv => inv.status === 'in_progress').map((inventory) => (
                    <TableRow key={inventory.id}>
                      <TableCell className="font-medium">{inventory.id}</TableCell>
                      <TableCell>{inventory.name}</TableCell>
                      <TableCell>{new Date(inventory.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(inventory.reconciledItems / inventory.totalItems) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((inventory.reconciledItems / inventory.totalItems) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDraft(inventory)}
                        >
                          <EditIcon className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Inventories</CardTitle>
              <CardDescription>
                Resume working on saved draft inventories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inventory ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Items Counted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventories.filter(inv => inv.status === 'draft').map((inventory) => (
                    <TableRow key={inventory.id}>
                      <TableCell className="font-medium">{inventory.id}</TableCell>
                      <TableCell>{inventory.name}</TableCell>
                      <TableCell>{new Date(inventory.date).toLocaleDateString()}</TableCell>
                      <TableCell>{inventory.reconciledItems} / {inventory.totalItems}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDraft(inventory)}
                        >
                          <EditIcon className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report View Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inventory Report - {selectedInventory?.name}</DialogTitle>
            <DialogDescription>
              Detailed report showing reconciled and unreconciled items.
            </DialogDescription>
          </DialogHeader>
          {selectedInventory && (
            <InventoryReportView inventory={selectedInventory} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}