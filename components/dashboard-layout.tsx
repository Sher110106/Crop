import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, Home, Upload, BarChart3, Settings, LogOut, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const storedUser = localStorage.getItem("cropcare_user")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("cropcare_user")
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    })
    router.push("/login")
  }

  if (!isMounted) {
    return null
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Upload Analysis", href: "/dashboard/upload", icon: Upload },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <SidebarProvider>
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">CropCare AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-4">
                <div className="flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <span className="text-xl font-bold">CropCare AI</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button variant="ghost" className="w-full justify-start">
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Log out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar>
          <SidebarHeader className="flex h-16 items-center px-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">CropCare AI</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={item.href === window.location.pathname}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5 text-red-500" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="hidden h-16 items-center justify-between border-b px-6 md:flex">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" />
              {user.name}
            </Button>
          </div>
        </div>
        <main className="container py-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}

