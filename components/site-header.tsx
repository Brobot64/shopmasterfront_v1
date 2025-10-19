import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SettingsPopup } from "@/components/settings-popup"
import { useAuth } from "@/contexts/auth-context"

export function SiteHeader() {
  const { user } = useAuth();
  
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2 flex-1">
          <h1 className="text-base font-medium capitalize">
            {user?.userType?.replace('_', ' ')} Dashboard
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            Welcome, {user?.firstName || user?.email?.split('@')[0] || 'User'}
          </div>
          <SettingsPopup />
        </div>
      </div>
    </header>
  )
}
