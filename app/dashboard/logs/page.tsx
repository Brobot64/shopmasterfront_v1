"use client"

import { useState, useEffect } from "react"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logsService, LogEntry } from "@/services"
import { toast } from "sonner"
import dayjs from "dayjs"

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(20)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [filters, setFilters] = useState<{
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    performerId?: string;
  }>({})

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...filters
      }
      const response = await logsService.getLogs(params)
      // @ts-ignore
      setLogs(response.data)
      // @ts-ignore
      setTotalPages(response.totalPages)
      // @ts-ignore
      setTotalItems(response.totalItems)
      // @ts-ignore
      setCurrentPage(response.currentPage)
    } catch (error) {
      toast.error('Failed to fetch logs')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [currentPage, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }))
    setCurrentPage(1)
  }

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Create</span>
      case 'update':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Update</span>
      case 'delete':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">Delete</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{action}</span>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mt-2">
            <span>Dashboard</span>
            <span>•</span>
            <span className="text-foreground">Logs</span>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select 
                value={filters.action || ''} 
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select 
                value={filters.entityType || ''} 
                onValueChange={(value) => handleFilterChange('entityType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Outlet">Outlet</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                type="date" 
                value={filters.startDate || ''} 
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                type="date" 
                value={filters.endDate || ''} 
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No logs found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Performer</TableHead>
                      <TableHead>Outlet ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {dayjs(log.timestamp).format('MMM DD, YYYY HH:mm')}
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>{log.receiverType || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.description}</TableCell>
                        <TableCell>
                          {log.performer?.firstName} {log.performer?.lastName} 
                          <span className="text-muted-foreground"> ({log.performer?.email})</span>
                        </TableCell>
                        <TableCell>{log.outletId || 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-6 p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} logs
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm bg-muted rounded-md">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-bold text-foreground">ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedLog.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground">Timestamp</Label>
                  <p className="text-sm text-muted-foreground">
                    {dayjs(selectedLog.timestamp).format('MMM DD, YYYY HH:mm:ss')}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-bold text-foreground">Action</Label>
                <p className="text-sm">{getActionBadge(selectedLog.action)}</p>
              </div>
              <div>
                <Label className="text-sm font-bold text-foreground">Description</Label>
                <p className="text-sm">{selectedLog.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-bold text-foreground">Entity Type</Label>
                  <p className="text-sm">{selectedLog.receiverType || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground">Entity ID</Label>
                  <p className="text-sm">{selectedLog.receiverId || 'N/A'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-bold text-foreground">Performer</Label>
                <p className="text-sm">
                  {selectedLog.performer?.firstName} {selectedLog.performer?.lastName} 
                  ({selectedLog.performer?.email})
                </p>
                <p className="text-sm text-muted-foreground">
                  Role: {selectedLog.performer?.userType}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-bold text-foreground">Business ID</Label>
                  <p className="text-sm">{selectedLog.businessId}</p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground">Outlet ID</Label>
                  <p className="text-sm">{selectedLog.outletId || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}