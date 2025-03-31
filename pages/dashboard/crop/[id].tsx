import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { SpeakableElement } from "@/components/SpeakableElement"
import { CropTimeline } from "@/components/CropTimeline"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as Dialog from "@radix-ui/react-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Cloud, Droplets, AlertTriangle, Calendar, LineChart, Plus, Camera, Leaf, Sprout, Thermometer, Sun, Wind, Clock, Scale, Droplet, Wheat, CalendarDays, Eye, Flower } from "lucide-react"
import type { Crop, TimelineEvent } from "@/types/crop"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { fetchWeather, fetchWeatherForecast } from "@/lib/weather"

export default function CropDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [crop, setCrop] = useState<Crop | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [uploadMethod, setUploadMethod] = useState<'file' | 'camera'>('file')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCropType, setSelectedCropType] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState<TimelineEvent[]>([])
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({})
  const translationTimeoutRef = useRef<NodeJS.Timeout>()
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const pendingTranslationsRef = useRef<Set<string>>(new Set())
  const [activeReportTab, setActiveReportTab] = useState('overview')

  useEffect(() => {
    // Simulate API call
    const fetchCrop = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Check if params exists before accessing id
      if (!params || !params.id) return;
      
      // Fetch weather data for the crop's location
      const weatherData = await fetchWeather(44.34, 10.99); // Example coordinates
      const weatherForecast = await fetchWeatherForecast(44.34, 10.99);
      
      // Calculate health based on analysis
      const healthPercentage = 100; // Since the analysis shows healthy wheat
      
      setCrop({
        id: params.id as string,
        name: "Wheat Field A",
        type: "wheat",
        variety: "Winter wheat",
        fieldSize: "12 acres",
        plantingDate: "2024-01-15",
        expectedHarvest: "2024-07-20",
        health: healthPercentage, // Set the correct health percentage
        lastUpdated: "2024-03-30",
        status: healthPercentage >= 80 ? "healthy" : healthPercentage >= 60 ? "warning" : "critical",
        alerts: 0,
        image: "/wheat-field.jpg",
        history: [
          {
            date: "2024-03-30",
            health: healthPercentage
          }
        ],
        treatments: [],
        notes: "Performing well with consistent growth",
        timeline: [],
        location: {
          latitude: 44.34,
          longitude: 10.99,
          address: "Zocca, Italy"
        },
        weather: weatherData || undefined,
        growthStage: {
          current: "Maturity",
          week: 12,
          totalWeeks: 12,
          progress: 100
        },
        nextWaterCycle: {
          date: "2024-04-01",
          time: "08:00",
          amount: "2.5 inches",
          priority: "medium"
        },
        environmentalData: {
          temperature: 22,
          humidity: 65,
          windSpeed: 3.5,
          sunlight: 8.5
        },
        upcomingTasks: [
          {
            type: "Harvest Preparation",
            date: "2024-07-15",
            priority: "high",
            details: "Prepare equipment and storage facilities"
          }
        ],
        recommendations: [
          {
            category: "Harvest",
            title: "Harvest Timing",
            description: "Plan harvest for optimal moisture content (13-15%)",
            priority: "high"
          },
          {
            category: "Monitoring",
            title: "Regular Field Checks",
            description: "Continue daily field monitoring for any signs of disease or stress",
            priority: "medium"
          }
        ]
      })

      setEvents([
        {
          id: "1",
          type: "analysis",
          date: "2024-03-30",
          notes: "Routine health assessment completed. All metrics within normal range.",
          metrics: {
            health: 100,
            soilMoisture: 65
          }
        },
        {
          id: "2",
          type: "observation",
          date: "2024-03-29",
          notes: "Soil moisture levels below optimal range. Consider irrigation in the next 48 hours.",
          metrics: {
            health: 95,
            soilMoisture: 45
          }
        },
      ])
    }
    fetchCrop()
  }, [params?.id])

  useEffect(() => {
    if (params?.id) {
      const storedHistory = localStorage.getItem(`crop-analysis-${params.id}`)
      if (storedHistory) {
        setAnalysisHistory(JSON.parse(storedHistory))
      }
    }
  }, [params?.id])

  useEffect(() => {
    if (params?.id && analysisHistory.length > 0) {
      localStorage.setItem(`crop-analysis-${params.id}`, JSON.stringify(analysisHistory))
    }
  }, [analysisHistory, params?.id])

  // Load translation cache from localStorage on mount
  useEffect(() => {
    const storedCache = localStorage.getItem('translation-cache')
    if (storedCache) {
      setTranslationCache(JSON.parse(storedCache))
    }
  }, [])

  // Save translation cache to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('translation-cache', JSON.stringify(translationCache))
  }, [translationCache])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsProcessing(true)
      setUploadMethod('file')

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      // Convert image to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string

        // Send to API with previous analysis data
        const response = await fetch('/api/process-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Data,
            cropType: selectedCropType,
            previousAnalysis: analysisHistory.length > 0 ? analysisHistory[0] : null, // Send most recent analysis
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to process image')
        }

        // Create timeline event
        const timelineEvent: TimelineEvent = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          type: 'analysis',
          imageData: {
            url: base64Data,
            analysis: data.analysis
          },
          metrics: {
            health: data.analysis.healthStatus === 'Healthy' ? 100 : 
                   data.analysis.healthStatus === 'Moderate' ? 50 : 0,
            soilMoisture: data.analysis.soilMoisture || 65,
          },
          notes: data.analysis.fullText
        }

        // Update analysis history
        setAnalysisHistory(prev => [timelineEvent, ...prev])

        // Update crop data
        setCrop(prev => ({
          ...prev!,
          health: data.analysis.healthStatus === 'Healthy' ? 100 : 
                  data.analysis.healthStatus === 'Moderate' ? 50 : 0,
          status: data.analysis.healthStatus.toLowerCase(),
          lastUpdated: new Date().toISOString(),
          alerts: data.analysis.healthStatus === 'Unhealthy' ? (prev!.alerts || 0) + 1 : prev!.alerts,
          timeline: [timelineEvent, ...(prev!.timeline || [])],
          notes: `${data.analysis.fullText}\n\nRecommendations:\n${data.analysis.recommendations}`
        }))

        toast({
          title: "Analysis Complete",
          description: "Image has been successfully analyzed",
        })

        // Close dialog
        setShowUploadDialog(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Implement camera capture logic here
      // This would typically involve creating a video element, capturing frames, etc.
      toast({
        title: "Camera capture",
        description: "Camera capture functionality coming soon",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Error",
        description: "Failed to access camera. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note",
        variant: "destructive",
      })
      return
    }

    try {
      const noteEvent: TimelineEvent = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'observation',
        notes: newNote,
        metrics: {
          health: crop?.health || 0,
          soilMoisture: 65 // Default value
        }
      }

      // Update crop data
      setCrop(prev => ({
        ...prev!,
        timeline: [noteEvent, ...(prev!.timeline || [])],
        lastUpdated: new Date().toISOString()
      }))

      // Update events
      setEvents(prev => [noteEvent, ...prev])

      toast({
        title: "Success",
        description: "Note added successfully",
      })

      // Reset and close dialog
      setNewNote("")
      setShowAddNoteDialog(false)
    } catch (error) {
      console.error('Error adding note:', error)
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Improved translation function with better debouncing and caching
  const getTranslation = useCallback((text: string) => {
    if (!text) return ""
    
    // Return cached translation if available
    if (translationCache[text]) {
      return translationCache[text]
    }

    // If translation is already pending, don't start a new request
    if (pendingTranslationsRef.current.has(text)) {
      return text
    }

    // Clear any pending timeout
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current)
    }

    // Set a new timeout for translation
    translationTimeoutRef.current = setTimeout(async () => {
      try {
        // Mark this text as pending translation
        pendingTranslationsRef.current.add(text)
        setIsTranslating(true)

        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) {
          throw new Error(`Translation failed: ${response.statusText}`)
        }

        const data = await response.json()
        
        if (data.success) {
          setTranslationCache(prev => ({
            ...prev,
            [text]: data.translatedText
          }))
        } else {
          console.warn('Translation returned unsuccessful:', data)
        }
      } catch (error) {
        console.error('Translation error:', error)
      } finally {
        // Remove from pending translations
        pendingTranslationsRef.current.delete(text)
        setIsTranslating(false)
      }
    }, 1000) // Increased debounce time to 1 second

    return text // Return original text while translation is pending
  }, [translationCache])

  // Memoize the translation function for each event's notes
  const getTranslatedNotes = useMemo(() => {
    return (notes: string) => {
      if (!notes) return ""
      return translationCache[notes] || notes
    }
  }, [translationCache])

  if (!crop) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <SpeakableElement text={`Crop details for ${crop.name}`}>
          <div>
            <h1 className="text-2xl font-bold">{crop.name}</h1>
            <p className="text-muted-foreground">Monitor crop health and conditions</p>
          </div>
        </SpeakableElement>
        <div className="flex gap-2">
          <Dialog.Root open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
            <Dialog.Trigger asChild>
              <Button 
                variant="outline"
                aria-label="Add new observation or note"
              >
                <SpeakableElement text="Add new observation">
                  <span className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </span>
                </SpeakableElement>
              </Button>
            </Dialog.Trigger>
            <Dialog.Content className="sm:max-w-[425px]">
              <Dialog.Title>Add New Note</Dialog.Title>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your observation..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddNoteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote}>
                    Add Note
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <Dialog.Trigger asChild>
              <Button
                aria-label="Upload new analysis"
              >
                <SpeakableElement text="Upload new analysis">
                  <span className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    New Analysis
                  </span>
                </SpeakableElement>
              </Button>
            </Dialog.Trigger>
            <Dialog.Content className="sm:max-w-[425px]">
              <Dialog.Title>Upload New Analysis</Dialog.Title>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="upload" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="upload" 
                      onClick={() => setUploadMethod('file')}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger 
                      value="camera" 
                      onClick={() => setUploadMethod('camera')}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Camera
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Crop Type</Label>
                        <Select
                          value={selectedCropType}
                          onValueChange={setSelectedCropType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="corn">Corn</SelectItem>
                            <SelectItem value="soybean">Soybean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Upload Image</Label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Select Image"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="camera">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Crop Type</Label>
                        <Select
                          value={selectedCropType}
                          onValueChange={setSelectedCropType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="corn">Corn</SelectItem>
                            <SelectItem value="soybean">Soybean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleCameraCapture}
                        disabled={isProcessing}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {isProcessing ? "Processing..." : "Capture Image"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crop.health}%</div>
            <Progress value={crop.health} className="mt-2" />
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={crop.health > 80 ? "default" : crop.health > 60 ? "warning" : "destructive"}>
                {crop.health > 80 ? "Healthy" : crop.health > 60 ? "Warning" : "Critical"}
              </Badge>
              <span className="text-xs text-muted-foreground">Last updated: {new Date(crop.lastUpdated).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Field Size</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crop.fieldSize}</div>
            <p className="text-xs text-muted-foreground">Total area</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">{crop.variety}</Badge>
              <span className="text-xs text-muted-foreground">{crop.type}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">Optimal range: 60-70%</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">Good</Badge>
              <span className="text-xs text-muted-foreground">Updated 2h ago</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crop.alerts}</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={crop.alerts > 0 ? "destructive" : "default"}>
                {crop.alerts > 0 ? "Action Required" : "All Clear"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weather</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {crop.weather ? (
              <>
                <div className="text-2xl font-bold">{crop.weather.temperature}°C</div>
                <p className="text-xs text-muted-foreground capitalize">{crop.weather.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline">
                    Humidity: {crop.weather.humidity}%
                  </Badge>
                  <Badge variant="outline">
                    Wind: {crop.weather.windSpeed} m/s
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Last updated: {new Date(crop.weather.timestamp).toLocaleString()}
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                Weather data is not available. Please check your OpenWeather API key configuration.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crop Timeline</CardTitle>
            <CardDescription>Key events and observations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crop.timeline.map((event) => (
                <div key={event.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {event.type === 'analysis' && <LineChart className="h-5 w-5 text-primary" />}
                    {event.type === 'observation' && <Eye className="h-5 w-5 text-primary" />}
                    {event.type === 'treatment' && <Sprout className="h-5 w-5 text-primary" />}
                    {event.type === 'planting' && <Flower className="h-5 w-5 text-primary" />}
                    {event.type === 'harvest' && <Wheat className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{event.type}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{event.notes}</p>
                    {event.metrics && (
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline">
                          Health: {event.metrics?.health ?? 0}%
                        </Badge>
                        {event.metrics?.soilMoisture && (
                          <Badge variant="outline">
                            Soil: {event.metrics.soilMoisture}%
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treatment History</CardTitle>
            <CardDescription>Recent treatments and applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crop.treatments.map((treatment, index) => (
                <div key={index} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{treatment.type}</h4>
                      <span className="text-xs text-muted-foreground">{treatment.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{treatment.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {analysisHistory.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Previous image analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            {analysisHistory.map((event) => (
              <div key={event.id} className="mb-4 flex items-start gap-4 last:mb-0">
                <div className="flex w-full items-start gap-4">
                  <div className="mt-1">
                    {event.imageData?.url && (
                      <img 
                        src={event.imageData.url} 
                        alt="Analysis result" 
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Image Analysis</p>
                      <Badge variant={event.metrics?.health && event.metrics.health > 80 ? "default" : event.metrics?.health && event.metrics.health > 60 ? "warning" : "destructive"}>
                        {event.metrics?.health ?? 0}% Health
                      </Badge>
                    </div>
                    <SpeakableElement text={event.notes}>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {getTranslatedNotes(event.notes)}
                      </p>
                    </SpeakableElement>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline">
                        Health: {event.metrics?.health ?? 0}%
                      </Badge>
                      <Badge variant="outline">
                        Soil Moisture: {event.metrics?.soilMoisture ?? 0}%
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Reports Section after the Analysis History */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Crop Reports</CardTitle>
          <CardDescription>Detailed analysis and recommendations for your crop</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeReportTab} onValueChange={setActiveReportTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <LineChart className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <CalendarDays className="mr-2 h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="health">
                <Leaf className="mr-2 h-4 w-4" />
                Health
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <Sprout className="mr-2 h-4 w-4" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Growth Stage</CardTitle>
                    <Wheat className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{crop.growthStage?.current || "Unknown"}</div>
                    <p className="text-xs text-muted-foreground">
                      Week {crop.growthStage?.week || 0} of {crop.growthStage?.totalWeeks || 0}
                    </p>
                    <Progress value={crop.growthStage?.progress || 0} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Water Cycle</CardTitle>
                    <Droplet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{crop.nextWaterCycle?.date || "Not Scheduled"}</div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: {crop.nextWaterCycle?.amount || "N/A"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Best time: {crop.nextWaterCycle?.time || "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Environmental Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Temperature</p>
                        <p className="text-xs text-muted-foreground">
                          {crop.environmentalData?.temperature || "N/A"}°C / {(crop.environmentalData?.temperature || 0) * 1.8 + 32}°F
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Humidity</p>
                        <p className="text-xs text-muted-foreground">
                          {crop.environmentalData?.humidity || "N/A"}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Wind Speed</p>
                        <p className="text-xs text-muted-foreground">
                          {crop.environmentalData?.windSpeed || "N/A"} km/h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Sunlight</p>
                        <p className="text-xs text-muted-foreground">
                          {crop.environmentalData?.sunlight || "N/A"} hours
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crop.upcomingTasks?.map((task, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{task.type}</p>
                            <p className="text-xs text-muted-foreground">{task.date}</p>
                          </div>
                        </div>
                        <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Overall Health</p>
                        <Badge variant={crop.health > 80 ? "default" : crop.health > 60 ? "warning" : "destructive"}>
                          {crop.health}%
                        </Badge>
                      </div>
                      <Progress value={crop.health} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Soil Health</p>
                        <Badge variant="outline">Good</Badge>
                      </div>
                      <Progress value={75} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Nutrient Levels</p>
                        <Badge variant="outline">Optimal</Badge>
                      </div>
                      <Progress value={85} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Current Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crop.recommendations?.map((rec, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "warning" : "outline"}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {rec.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

