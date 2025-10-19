"use client"

import { useState } from "react"
import { Settings, Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "@/contexts/theme-context"

const themes = [
  {
    name: 'Light',
    value: 'light' as const,
    description: 'Clean and bright interface',
    colors: ['#c5d7bd', '#9fb8ad', '#383e56', '#fb743e']
  },
  {
    name: 'Dark',
    value: 'dark' as const,
    description: 'Easy on the eyes',
    colors: ['#222831', '#393e46', '#dfd0b8', '#948979']
  },
  {
    name: 'Custom',
    value: 'custom' as const,
    description: 'Warm and vibrant',
    colors: ['#d3ca79', '#ea7300', '#a62c2c', '#e83f25']
  },
  {
    name: 'Material',
    value: 'material' as const,
    description: 'Material Design inspired',
    colors: ['#FFFFFF', '#fda92d', '#8E33FF', '#22C55E']
  }
]

export function SettingsPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shadow-md hover:shadow-lg transition-shadow">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md shadow-2xl backdrop-blur-sm bg-background/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Choose your preferred color scheme for the dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {themes.map((themeOption) => (
            <div
              key={themeOption.value}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                theme === themeOption.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setTheme(themeOption.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{themeOption.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {themeOption.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {themeOption.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {theme === themeOption.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Theme changes are saved automatically
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}