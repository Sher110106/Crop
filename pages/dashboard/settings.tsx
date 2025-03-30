"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Bell, Cloud, CreditCard, Lock, Save, Droplets } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    farmName: "Green Valley Farm",
    farmAddress: "123 Rural Road, Farmington, CA 95230",
    farmSize: "55",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    })
  }

  const handleSaveIntegrations = () => {
    toast({
      title: "Integration settings updated",
      description: "Your integration settings have been saved.",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and farm information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={user.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={user.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input id="farmName" name="farmName" value={user.farmName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="farmAddress">Farm Address</Label>
                  <Textarea
                    id="farmAddress"
                    name="farmAddress"
                    value={user.farmAddress}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (acres)</Label>
                  <Input
                    id="farmSize"
                    name="farmSize"
                    type="number"
                    value={user.farmSize}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">Enable two-factor authentication</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Lock className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts">Disease Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications when diseases are detected
                    </p>
                  </div>
                  <Switch id="email-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-weather">Weather Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for extreme weather conditions
                    </p>
                  </div>
                  <Switch id="email-weather" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports of your farm's health
                    </p>
                  </div>
                  <Switch id="email-reports" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-alerts">Critical Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive SMS for critical issues requiring immediate attention
                    </p>
                  </div>
                  <Switch id="sms-alerts" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-weather">Severe Weather</Label>
                    <p className="text-sm text-muted-foreground">Receive SMS for severe weather warnings</p>
                  </div>
                  <Switch id="sms-weather" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Frequency</h3>
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Alert Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather API Integration</CardTitle>
              <CardDescription>Configure your weather data provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weather-provider">Weather Provider</Label>
                <Select defaultValue="openweather">
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openweather">OpenWeatherMap</SelectItem>
                    <SelectItem value="weatherapi">WeatherAPI</SelectItem>
                    <SelectItem value="accuweather">AccuWeather</SelectItem>
                    <SelectItem value="custom">Custom API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weather-api-key">API Key</Label>
                <Input id="weather-api-key" type="password" value="••••••••••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weather-location">Default Location</Label>
                <Input id="weather-location" placeholder="Enter coordinates or location name" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="weather-auto-location" defaultChecked />
                <Label htmlFor="weather-auto-location">Use farm address as default location</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mr-2">
                <Cloud className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button onClick={handleSaveIntegrations}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soil Moisture Sensors</CardTitle>
              <CardDescription>Configure your soil moisture sensor integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sensor-provider">Sensor Provider</Label>
                <Select defaultValue="generic">
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generic">Generic Sensors</SelectItem>
                    <SelectItem value="davis">Davis Instruments</SelectItem>
                    <SelectItem value="onset">Onset HOBO</SelectItem>
                    <SelectItem value="custom">Custom Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor-api-endpoint">API Endpoint</Label>
                <Input id="sensor-api-endpoint" placeholder="https://api.example.com/sensors" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor-api-key">API Key</Label>
                <Input id="sensor-api-key" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor-refresh">Data Refresh Interval (minutes)</Label>
                <Input id="sensor-refresh" type="number" defaultValue="15" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mr-2">
                <Droplets className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button onClick={handleSaveIntegrations}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">$29.99/month</p>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm">Features included:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                      Unlimited crop monitoring
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                      Advanced disease detection
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                      Weather and soil moisture integration
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                      Detailed analytics and reporting
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                      Email and SMS notifications
                    </li>
                  </ul>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Update Payment Method
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Billing History</h3>
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between border-b p-4">
                    <div>
                      <p className="font-medium">Pro Plan - Monthly</p>
                      <p className="text-sm text-muted-foreground">Aug 1, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.99</p>
                      <p className="text-sm text-green-500">Paid</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b p-4">
                    <div>
                      <p className="font-medium">Pro Plan - Monthly</p>
                      <p className="text-sm text-muted-foreground">Jul 1, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.99</p>
                      <p className="text-sm text-green-500">Paid</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">Pro Plan - Monthly</p>
                      <p className="text-sm text-muted-foreground">Jun 1, 2023</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$29.99</p>
                      <p className="text-sm text-green-500">Paid</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="link" size="sm">
                    View All Invoices
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-red-500">
                Cancel Subscription
              </Button>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Update Billing
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

