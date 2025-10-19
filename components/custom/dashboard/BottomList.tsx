import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function TempTemplate() {
  // Sample data
  const systemLogs = [
    { action: "User login", time: "2 mins ago", user: "John Doe" },
    { action: "File uploaded", time: "15 mins ago", user: "Jane Smith" },
    { action: "Settings updated", time: "1 hour ago", user: "Mike Johnson" },
    { action: "New order placed", time: "2 hours ago", user: "Sarah Williams" },
    { action: "Report generated", time: "3 hours ago", user: "David Brown" },
  ];

  const topPerformers = [
    { name: "Alex Chen", title: "Sales Director", location: "New York", avatar: "/avatars/alex.png", performance: "98%" },
    { name: "Maria Garcia", title: "Marketing Lead", location: "Chicago", avatar: "/avatars/maria.png", performance: "95%" },
    { name: "James Wilson", title: "Developer", location: "Remote", avatar: "/avatars/james.png", performance: "93%" },
    { name: "Lisa Wong", title: "UX Designer", location: "San Francisco", avatar: "/avatars/lisa.png", performance: "91%" },
    { name: "Robert Kim", title: "Data Analyst", location: "Boston", avatar: "/avatars/robert.png", performance: "89%" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Grid container with equal height columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Column - System Logs */}
        <div className="lg:col-span-2 flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">System Activity Log</h2>
          <div className="border rounded-lg overflow-hidden flex-1">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[40%] py-4">Action</TableHead>
                  <TableHead className="w-[30%] py-4">Performed By</TableHead>
                  <TableHead className="w-[30%] py-4 text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemLogs.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium py-4">{log.action}</TableCell>
                    <TableCell className="py-4">{log.user}</TableCell>
                    <TableCell className="py-4 text-right">{log.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Column - Top Performers */}
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Top Performers</h2>
          <div className="border rounded-lg p-4 space-y-4 flex-1">
            {topPerformers.map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{user.name}</h3>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <p className="truncate">{user.title}</p>
                    <span>•</span>
                    <p className="truncate text-gray-500">{user.location}</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                  {user.performance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}