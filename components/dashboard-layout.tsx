import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf, Home, Upload, BarChart3, Settings, LogOut, Menu, User, MousePointer2, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SpeakableElement } from "@/components/SpeakableElement"
import { useLanguage } from "@/lib/language-context"
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

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t, translateContent, language } = useLanguage()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>("")
  const [translatedItems, setTranslatedItems] = useState<{
    navItems: NavItem[];
    appName: string;
    loading: string;
    logout: string;
    logoutMessage: string;
    userProfile: string;
    toggleSidebar: string;
    accessibilitySettings: string;
    loggedInAs: string;
  }>({
    navItems: [],
    appName: "CropCare AI",
    loading: "Loading...",
    logout: "Log out",
    logoutMessage: "You've been successfully logged out.",
    userProfile: "User profile information",
    toggleSidebar: "Toggle sidebar",
    accessibilitySettings: "Accessibility",
    loggedInAs: "Logged in as"
  })

  // Original English text for nav items
  const originalNavItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home, description: "View your crop monitoring dashboard" },
    { name: "Upload Analysis", href: "/dashboard/upload", icon: Upload, description: "Upload and analyze crop images" },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3, description: "View detailed crop analysis reports" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, description: "Manage your account settings" },
    { name: "Accessibility", href: "/dashboard/settings?tab=accessibility", icon: Accessibility, description: "Customize accessibility options" },
  ]

  // Translate all text when language changes
  useEffect(() => {
    const translateUI = async () => {
      if (!isMounted) return;
      
      try {
        // Translate static strings
        const [
          appName, loading, logout, logoutMessage, userProfile, 
          toggleSidebar, accessibilitySettings, loggedInAs
        ] = await Promise.all([
          translateContent("CropCare AI"),
          translateContent("Loading..."),
          translateContent("Log out"),
          translateContent("You've been successfully logged out."),
          translateContent("User profile information"),
          translateContent("Toggle sidebar"),
          translateContent("Accessibility"),
          translateContent("Logged in as")
        ]);

        // Translate nav items
        const navItemPromises = originalNavItems.map(async (item) => ({
          ...item,
          name: await translateContent(item.name),
          description: await translateContent(item.description)
        }));
        
        const translatedNavItems = await Promise.all(navItemPromises);
        
        // Update all translated content
        setTranslatedItems({
          navItems: translatedNavItems,
          appName,
          loading,
          logout,
          logoutMessage,
          userProfile,
          toggleSidebar,
          accessibilitySettings,
          loggedInAs
        });
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    translateUI();
  }, [language, isMounted, translateContent])

  useEffect(() => {
    setIsMounted(true)
    // Safe way to access window object
    setCurrentPath(window.location.pathname)
    
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
      title: translatedItems.logout,
      description: translatedItems.logoutMessage,
    })
    router.push("/login")
  }

  if (!isMounted) {
    return null
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">{translatedItems.loading}</div>
  }

  return (
    <SidebarProvider>
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b px-4 md:hidden">
        <SpeakableElement text="CropCare AI Dashboard">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">{translatedItems.appName}</span>
          </div>
        </SpeakableElement>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <SpeakableElement text="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </SpeakableElement>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SpeakableElement text="CropCare AI Navigation Menu">
                <div className="flex h-16 items-center border-b px-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="text-xl font-bold">{translatedItems.appName}</span>
                  </div>
                </div>
              </SpeakableElement>
              <div className="flex flex-col gap-1 p-4">
                {translatedItems.navItems.map((item) => (
                  <Link href={item.href} key={item.name}>
                    <SpeakableElement text={`${item.name}: ${item.description}`}>
                      <Button variant="ghost" className="w-full justify-start">
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Button>
                    </SpeakableElement>
                  </Link>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500" 
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <SpeakableElement text="Log out of your account">
                    <span className="flex items-center">
                      <LogOut className="mr-2 h-5 w-5" />
                      {translatedItems.logout}
                    </span>
                  </SpeakableElement>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar>
          <SpeakableElement text="CropCare AI Dashboard">
            <SidebarHeader className="flex h-16 items-center px-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="text-xl font-bold">{translatedItems.appName}</span>
              </div>
            </SidebarHeader>
          </SpeakableElement>
          <SidebarContent>
            <SidebarMenu>
              {translatedItems.navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.href === currentPath}
                  >
                    <Link href={item.href}>
                      <SpeakableElement text={`${item.name}: ${item.description}`}>
                        <span className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </span>
                      </SpeakableElement>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <SpeakableElement text={translatedItems.userProfile}>
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <SpeakableElement text="Log out of your account">
                    <LogOut className="h-5 w-5 text-red-500" />
                  </SpeakableElement>
                </Button>
              </div>
            </SpeakableElement>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="hidden h-16 items-center justify-between border-b px-6 md:flex">
          <Button variant="ghost" size="icon" aria-label="Toggle sidebar">
            <SpeakableElement text={translatedItems.toggleSidebar}>
              <SidebarTrigger />
            </SpeakableElement>
          </Button>
          <div className="flex items-center gap-4">
            <SpeakableElement text={translatedItems.accessibilitySettings}>
              <Link href="/dashboard/settings?tab=accessibility">
                <Button variant="outline" size="sm" className="mr-2">
                  <Accessibility className="mr-2 h-4 w-4" />
                  {translatedItems.accessibilitySettings}
                </Button>
              </Link>
            </SpeakableElement>
            <SpeakableElement text={`${translatedItems.loggedInAs} ${user.name}`}>
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                {user.name}
              </Button>
            </SpeakableElement>
          </div>
        </div>
        <main className="container py-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}

