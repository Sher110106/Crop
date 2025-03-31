"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { SpeakableElement } from "@/components/SpeakableElement"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Bell, Cloud, CreditCard, Lock, Save, Droplets, Settings as SettingsIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useSpeech } from "@/lib/speech-context"
import { useLanguage } from "@/lib/language-context"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const { t, translateContent, language } = useLanguage()
  const [translatedTexts, setTranslatedTexts] = useState({
    // Tab titles
    profile: "Profile",
    notifications: "Notifications",
    integrations: "Integrations",
    billing: "Billing",
    accessibility: "Accessibility",
    
    // Card titles and descriptions
    accessibilitySettings: "Accessibility Settings",
    accessibilityDescription: "Customize your accessibility preferences including speech, language, and visual settings.",
    languagePreferences: "Language Preferences",
    displayLanguage: "Display Language",
    
    // Speech settings
    speechSettings: "Speech Settings",
    textToSpeech: "Text-to-Speech",
    enableContentReadAloud: "Enable content to be read aloud",
    speechRate: "Speech Rate",
    slower: "Slower",
    faster: "Faster",
    speechPitch: "Speech Pitch",
    lower: "Lower",
    higher: "Higher",
    volume: "Volume",
    quieter: "Quieter",
    louder: "Louder",
    selectVoice: "Voice",
    speechNotSupported: "Speech synthesis is not supported in your browser.",
    
    // Visual settings
    visualSettings: "Visual Settings",
    highContrastMode: "High Contrast Mode",
    highContrastDescription: "Increase contrast for better visibility",
    reducedMotion: "Reduced Motion",
    reducedMotionDescription: "Decrease or remove animations",
    textSize: "Text Size",
    normal: "Normal",
    smaller: "Smaller",
    larger: "Larger",
    
    // Button texts
    saveSettings: "Save Settings",
    saving: "Saving...",
  })
  
  // Translate UI texts when language changes
  useEffect(() => {
    const translateUI = async () => {
      if (language === 'en-IN') {
        setTranslatedTexts({
          // Tab titles
          profile: "Profile",
          notifications: "Notifications",
          integrations: "Integrations",
          billing: "Billing",
          accessibility: "Accessibility",
          
          // Card titles and descriptions
          accessibilitySettings: "Accessibility Settings",
          accessibilityDescription: "Customize your accessibility preferences including speech, language, and visual settings.",
          languagePreferences: "Language Preferences",
          displayLanguage: "Display Language",
          
          // Speech settings
          speechSettings: "Speech Settings",
          textToSpeech: "Text-to-Speech",
          enableContentReadAloud: "Enable content to be read aloud",
          speechRate: "Speech Rate",
          slower: "Slower",
          faster: "Faster",
          speechPitch: "Speech Pitch",
          lower: "Lower",
          higher: "Higher",
          volume: "Volume",
          quieter: "Quieter",
          louder: "Louder",
          selectVoice: "Voice",
          speechNotSupported: "Speech synthesis is not supported in your browser.",
          
          // Visual settings
          visualSettings: "Visual Settings",
          highContrastMode: "High Contrast Mode",
          highContrastDescription: "Increase contrast for better visibility",
          reducedMotion: "Reduced Motion",
          reducedMotionDescription: "Decrease or remove animations",
          textSize: "Text Size",
          normal: "Normal",
          smaller: "Smaller",
          larger: "Larger",
          
          // Button texts
          saveSettings: "Save Settings",
          saving: "Saving...",
        });
        return;
      }
      
      try {
        const translations = await Promise.all([
          // Tab titles
          translateContent("Profile"),
          translateContent("Notifications"),
          translateContent("Integrations"),
          translateContent("Billing"),
          translateContent("Accessibility"),
          
          // Card titles and descriptions
          translateContent("Accessibility Settings"),
          translateContent("Customize your accessibility preferences including speech, language, and visual settings."),
          translateContent("Language Preferences"),
          translateContent("Display Language"),
          
          // Speech settings
          translateContent("Speech Settings"),
          translateContent("Text-to-Speech"),
          translateContent("Enable content to be read aloud"),
          translateContent("Speech Rate"),
          translateContent("Slower"),
          translateContent("Faster"),
          translateContent("Speech Pitch"),
          translateContent("Lower"),
          translateContent("Higher"),
          translateContent("Volume"),
          translateContent("Quieter"),
          translateContent("Louder"),
          translateContent("Voice"),
          translateContent("Speech synthesis is not supported in your browser."),
          
          // Visual settings
          translateContent("Visual Settings"),
          translateContent("High Contrast Mode"),
          translateContent("Increase contrast for better visibility"),
          translateContent("Reduced Motion"),
          translateContent("Decrease or remove animations"),
          translateContent("Text Size"),
          translateContent("Normal"),
          translateContent("Smaller"),
          translateContent("Larger"),
          
          // Button texts
          translateContent("Save Settings"),
          translateContent("Saving..."),
        ]);
        
        setTranslatedTexts({
          // Tab titles
          profile: translations[0],
          notifications: translations[1],
          integrations: translations[2],
          billing: translations[3],
          accessibility: translations[4],
          
          // Card titles and descriptions
          accessibilitySettings: translations[5],
          accessibilityDescription: translations[6],
          languagePreferences: translations[7],
          displayLanguage: translations[8],
          
          // Speech settings
          speechSettings: translations[9],
          textToSpeech: translations[10],
          enableContentReadAloud: translations[11],
          speechRate: translations[12],
          slower: translations[13],
          faster: translations[14],
          speechPitch: translations[15],
          lower: translations[16],
          higher: translations[17],
          volume: translations[18],
          quieter: translations[19],
          louder: translations[20],
          selectVoice: translations[21],
          speechNotSupported: translations[22],
          
          // Visual settings
          visualSettings: translations[23],
          highContrastMode: translations[24],
          highContrastDescription: translations[25],
          reducedMotion: translations[26],
          reducedMotionDescription: translations[27],
          textSize: translations[28],
          normal: translations[29],
          smaller: translations[30],
          larger: translations[31],
          
          // Button texts
          saveSettings: translations[32],
          saving: translations[33],
        });
      } catch (error) {
        console.error("Error translating settings UI:", error);
      }
    };
    
    translateUI();
  }, [language, translateContent]);

  const handleSaveProfile = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handleSaveIntegrations = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Integration settings updated",
      description: "Your integration settings have been saved.",
    })
  }

  return (
    <DashboardLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <SpeakableElement text="Profile settings tab">
            <TabsTrigger value="profile">{translatedTexts.profile}</TabsTrigger>
          </SpeakableElement>
          <SpeakableElement text="Notification preferences tab">
            <TabsTrigger value="notifications">{translatedTexts.notifications}</TabsTrigger>
          </SpeakableElement>
          <SpeakableElement text="Integration settings tab">
            <TabsTrigger value="integrations">{translatedTexts.integrations}</TabsTrigger>
          </SpeakableElement>
          <SpeakableElement text="Billing and subscription tab">
            <TabsTrigger value="billing">{translatedTexts.billing}</TabsTrigger>
          </SpeakableElement>
          <SpeakableElement text="Accessibility options tab">
            <TabsTrigger value="accessibility">{translatedTexts.accessibility}</TabsTrigger>
          </SpeakableElement>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account profile and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <SpeakableElement text="Enter your full name">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Update your email address">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Change your password">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Change password" />
                  </div>
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Enter your farm or organization name">
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" placeholder="Farm or organization name" />
                  </div>
                </SpeakableElement>
              </div>
            </CardContent>
            <CardFooter>
              <SpeakableElement text="Save profile changes">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? translatedTexts.saving : "Save Changes"}
                </Button>
              </SpeakableElement>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <SpeakableElement text="Toggle email notifications">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                  </div>
                  <Switch />
                </SpeakableElement>
              </div>
              <div className="flex items-center justify-between">
                <SpeakableElement text="Toggle SMS notifications">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <div className="text-sm text-muted-foreground">Get alerts on your phone</div>
                  </div>
                  <Switch />
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Set notification frequency">
                  <div>
                    <Label>Notification Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SpeakableElement>
              </div>
            </CardContent>
            <CardFooter>
              <SpeakableElement text="Save notification preferences">
                <Button onClick={handleSaveNotifications} disabled={isLoading}>
                  <Bell className="mr-2 h-4 w-4" />
                  {isLoading ? translatedTexts.saving : "Save Preferences"}
                </Button>
              </SpeakableElement>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure external service integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <SpeakableElement text="Configure weather service API endpoint">
                  <div>
                    <Label htmlFor="weather-api-endpoint">Weather API Endpoint</Label>
                    <Input id="weather-api-endpoint" placeholder="https://api.weather.com" />
                  </div>
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Enter weather service API key">
                  <div>
                    <Label htmlFor="weather-api-key">Weather API Key</Label>
                    <Input id="weather-api-key" type="password" />
                  </div>
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Configure sensor data API endpoint">
                  <div>
                    <Label htmlFor="sensor-api-endpoint">Sensor API Endpoint</Label>
                    <Input id="sensor-api-endpoint" placeholder="https://api.example.com/sensors" />
                  </div>
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Enter sensor API key">
                  <div>
                    <Label htmlFor="sensor-api-key">Sensor API Key</Label>
                    <Input id="sensor-api-key" type="password" />
                  </div>
                </SpeakableElement>
              </div>
              <div className="space-y-2">
                <SpeakableElement text="Set data refresh interval">
                  <div>
                    <Label htmlFor="sensor-refresh">Data Refresh Interval (minutes)</Label>
                    <Input id="sensor-refresh" type="number" defaultValue="15" />
                  </div>
                </SpeakableElement>
              </div>
            </CardContent>
            <CardFooter>
              <SpeakableElement text="Test connection to sensors">
                <Button variant="outline" className="mr-2">
                  <Droplets className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </SpeakableElement>
              <SpeakableElement text="Save integration settings">
                <Button onClick={handleSaveIntegrations}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </SpeakableElement>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="space-y-4">
                  <SpeakableElement text="Current plan: Professional. Active subscription with advanced features">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-muted-foreground">Professional</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </SpeakableElement>
                  <div>
                    <p className="text-sm font-medium">Features included:</p>
                    <ul className="mt-2 space-y-2 text-sm">
                      <SpeakableElement text="Feature: Advanced disease detection">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                          Advanced disease detection
                        </li>
                      </SpeakableElement>
                      <SpeakableElement text="Feature: Weather and soil moisture integration">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                          Weather and soil moisture integration
                        </li>
                      </SpeakableElement>
                      <SpeakableElement text="Feature: Detailed analytics and reporting">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                          Detailed analytics and reporting
                        </li>
                      </SpeakableElement>
                      <SpeakableElement text="Feature: Email and SMS notifications">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                          Email and SMS notifications
                        </li>
                      </SpeakableElement>
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <SpeakableElement text="Change subscription plan">
                      <Button variant="outline">Change Plan</Button>
                    </SpeakableElement>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-medium">Billing History</h3>
                <div className="space-y-4">
                  <SpeakableElement text="Latest invoice: Professional Plan - March 2024, $29.99, Paid">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Professional Plan - March 2024</p>
                        <p className="text-sm text-muted-foreground">Mar 1, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$29.99</p>
                        <p className="text-sm text-green-500">Paid</p>
                      </div>
                    </div>
                  </SpeakableElement>
                </div>
                <div className="flex justify-end">
                  <SpeakableElement text="View all invoices">
                    <Button variant="link" size="sm">
                      View All Invoices
                    </Button>
                  </SpeakableElement>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <SpeakableElement text="Cancel subscription">
                <Button variant="outline" className="text-red-500">
                  Cancel Subscription
                </Button>
              </SpeakableElement>
              <SpeakableElement text="Update billing information">
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Update Billing
                </Button>
              </SpeakableElement>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>{translatedTexts.accessibilitySettings}</CardTitle>
              <CardDescription>{translatedTexts.accessibilityDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{translatedTexts.languagePreferences}</h3>
                <div className="space-y-2">
                  <SpeakableElement text="Select your preferred language">
                    <div>
                      <Label htmlFor="language-preference">{translatedTexts.displayLanguage}</Label>
                      <div className="mt-2">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </SpeakableElement>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">{translatedTexts.speechSettings}</h3>
                <div className="space-y-4">
                  {/* Speech Enabled toggle */}
                  <div className="flex items-center justify-between">
                    <SpeakableElement text="Enable speech reading of content">
                      <div className="space-y-0.5">
                        <Label htmlFor="speech-enabled">{translatedTexts.textToSpeech}</Label>
                        <div className="text-sm text-muted-foreground">{translatedTexts.enableContentReadAloud}</div>
                      </div>
                      <Switch 
                        id="speech-enabled" 
                        checked={useSpeech().settings.enabled}
                        onCheckedChange={(checked) => useSpeech().updateSettings({ enabled: checked })}
                      />
                    </SpeakableElement>
                  </div>

                  {useSpeech().settings.enabled && (
                    <>
                      {/* Speech Rate slider */}
                      <div className="space-y-2">
                        <SpeakableElement text="Adjust speech rate">
                          <div>
                            <div className="flex justify-between">
                              <Label htmlFor="speech-rate">{translatedTexts.speechRate}</Label>
                              <span className="text-sm">{useSpeech().settings.rate.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">{translatedTexts.slower}</span>
                              <Input
                                id="speech-rate"
                                type="range"
                                className="flex-1"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={useSpeech().settings.rate}
                                onChange={(e) => useSpeech().updateSettings({ rate: parseFloat(e.target.value) })}
                              />
                              <span className="text-sm text-muted-foreground">{translatedTexts.faster}</span>
                            </div>
                          </div>
                        </SpeakableElement>
                      </div>

                      {/* Speech Pitch slider */}
                      <div className="space-y-2">
                        <SpeakableElement text="Adjust speech pitch">
                          <div>
                            <div className="flex justify-between">
                              <Label htmlFor="speech-pitch">{translatedTexts.speechPitch}</Label>
                              <span className="text-sm">{useSpeech().settings.pitch.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">{translatedTexts.lower}</span>
                              <Input
                                id="speech-pitch"
                                type="range"
                                className="flex-1"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={useSpeech().settings.pitch}
                                onChange={(e) => useSpeech().updateSettings({ pitch: parseFloat(e.target.value) })}
                              />
                              <span className="text-sm text-muted-foreground">{translatedTexts.higher}</span>
                            </div>
                          </div>
                        </SpeakableElement>
                      </div>

                      {/* Volume slider */}
                      <div className="space-y-2">
                        <SpeakableElement text="Adjust speech volume">
                          <div>
                            <div className="flex justify-between">
                              <Label htmlFor="speech-volume">{translatedTexts.volume}</Label>
                              <span className="text-sm">{useSpeech().settings.volume.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">{translatedTexts.quieter}</span>
                              <Input
                                id="speech-volume"
                                type="range"
                                className="flex-1"
                                min="0"
                                max="1"
                                step="0.1"
                                value={useSpeech().settings.volume}
                                onChange={(e) => useSpeech().updateSettings({ volume: parseFloat(e.target.value) })}
                              />
                              <span className="text-sm text-muted-foreground">{translatedTexts.louder}</span>
                            </div>
                          </div>
                        </SpeakableElement>
                      </div>

                      {/* Voice selection */}
                      {useSpeech().voices.length > 0 && (
                        <div className="space-y-2">
                          <SpeakableElement text="Select voice for speech">
                            <div>
                              <Label htmlFor="speech-voice">{translatedTexts.selectVoice}</Label>
                              <Select
                                value={useSpeech().settings.selectedVoice}
                                onValueChange={(value) => useSpeech().updateSettings({ selectedVoice: value })}
                              >
                                <SelectTrigger id="speech-voice" className="mt-2">
                                  <SelectValue placeholder="Select a voice" />
                                </SelectTrigger>
                                <SelectContent>
                                  {useSpeech().voices
                                    .filter(voice => voice.lang.startsWith(useLanguage().language.split('-')[0]))
                                    .map(voice => (
                                      <SelectItem key={voice.name} value={voice.name}>
                                        {voice.name}
                                      </SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                            </div>
                          </SpeakableElement>
                        </div>
                      )}
                    </>
                  )}

                  {!useSpeech().isSpeechSupported && (
                    <div className="p-4 border rounded-md bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                      <p>{translatedTexts.speechNotSupported}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">{translatedTexts.visualSettings}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <SpeakableElement text="Use high contrast mode for better visibility">
                      <div className="space-y-0.5">
                        <Label htmlFor="high-contrast">{translatedTexts.highContrastMode}</Label>
                        <div className="text-sm text-muted-foreground">{translatedTexts.highContrastDescription}</div>
                      </div>
                      <Switch id="high-contrast" />
                    </SpeakableElement>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <SpeakableElement text="Enable reduced motion for animations">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduced-motion">{translatedTexts.reducedMotion}</Label>
                        <div className="text-sm text-muted-foreground">{translatedTexts.reducedMotionDescription}</div>
                      </div>
                      <Switch id="reduced-motion" />
                    </SpeakableElement>
                  </div>
                  
                  <div className="space-y-2">
                    <SpeakableElement text="Adjust text size">
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="text-size">{translatedTexts.textSize}</Label>
                          <span className="text-sm">{translatedTexts.normal}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-muted-foreground">{translatedTexts.smaller}</span>
                          <Input
                            id="text-size"
                            type="range"
                            className="flex-1"
                            min="1"
                            max="3"
                            step="1"
                            defaultValue="2"
                          />
                          <span className="text-sm text-muted-foreground">{translatedTexts.larger}</span>
                        </div>
                      </div>
                    </SpeakableElement>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <SpeakableElement text="Save accessibility settings">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {translatedTexts.saveSettings}
                </Button>
              </SpeakableElement>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

