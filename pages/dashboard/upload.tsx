"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Upload, Image, Camera, AlertTriangle, CheckCircle2, Loader2, X, RefreshCw } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cropType, setCropType] = useState<string>("")
  const [fieldName, setFieldName] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  
  // Camera related states
  const [isCapturing, setIsCapturing] = useState(false)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Camera Error",
        description: "Your browser doesn't support camera access",
        variant: "destructive",
      })
      return
    }
    
    setIsCameraLoading(true)
    setShowVideo(true)
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => {
              setIsCapturing(true)
              setIsCameraLoading(false)
            })
            .catch(err => {
              console.error("Error playing video:", err)
              toast({
                title: "Camera Error",
                description: "Error starting camera",
                variant: "destructive",
              })
            })
        }
      }
    } catch (err) {
      setShowVideo(false)
      
      const errorMessage = err instanceof DOMException && err.name === "NotAllowedError" 
        ? "Camera access denied. Please grant permission." 
        : `Could not access camera: ${err instanceof Error ? err.message : String(err)}`
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      })
      
      setIsCameraLoading(false)
      stopCamera()
    }
  }
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCapturing(false)
    setShowVideo(false)
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    
    canvas.width = video.videoWidth || video.clientWidth
    canvas.height = video.videoHeight || video.clientHeight
    
    const context = canvas.getContext("2d")
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setPreviewUrl(imageDataUrl)
      
      // Convert data URL to File object
      const byteString = atob(imageDataUrl.split(',')[1])
      const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })
      const file = new File([blob], "camera-capture.jpg", { type: mimeString })
      
      setSelectedFile(file)
      stopCamera()
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile || !cropType || !fieldName) {
      toast({
        title: "Missing information",
        description: "Please select a file, crop type, and field name.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    console.log('Starting image analysis...', {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
      cropType,
      fieldName
    });

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      
      reader.onload = async () => {
        const base64Image = reader.result as string
        console.log('Image converted to base64, size:', Math.round(base64Image.length / 1024), 'KB');
        
        try {
          console.log('Sending request to API...');
          // Send the image for analysis
          const response = await fetch('/api/process-image/route', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageData: base64Image,
              cropType: cropType,
              fieldName: fieldName
            }),
          })
          
          console.log('Response received:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', {
              status: response.status,
              statusText: response.statusText,
              body: errorText
            });
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
          }
          
          const data = await response.json()
          console.log('Response data:', data);
          
          if (data.success) {
            setAnalysisResult(data.analysisResult)
            console.log('Analysis result:', data.analysisResult);
            toast({
              title: "Analysis complete",
              description: `Analysis completed with ${data.analysisResult.confidence}% confidence.`,
            })
          } else {
            console.error('API returned error:', data.error);
            throw new Error(data.error || 'Failed to analyze image')
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          throw fetchError;
        }
        
        setIsAnalyzing(false)
      }
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        throw new Error('Failed to read file')
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      })
      setIsAnalyzing(false)
    }
  }

  const handleSave = () => {
    toast({
      title: "Results saved",
      description: "The analysis results have been saved to your dashboard.",
    })
    router.push("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Upload & Analyze</h1>
      </div>

      <Tabs defaultValue="upload" className="mt-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="camera">Capture Image</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Crop Image</CardTitle>
              <CardDescription>
                Upload an image of your crop for AI analysis to detect diseases and assess health.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop-type">Crop Type</Label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-name">Field Name</Label>
                    <Input
                      id="field-name"
                      placeholder="e.g., North Field A"
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select Image
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WEBP. Max size: 10MB.</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {previewUrl ? (
                    <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg border">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full max-w-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
                      <Image className="mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedFile || !cropType || !fieldName || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capture Crop Image</CardTitle>
              <CardDescription>
                Take a photo of your crop using your device's camera for AI analysis to detect diseases and assess health.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop-type-camera">Crop Type</Label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-name-camera">Field Name</Label>
                    <Input
                      id="field-name-camera"
                      placeholder="e.g., North Field A"
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Position your device to get a clear view of the crop. Make sure there is good lighting and the affected parts are visible.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg border bg-black">
                    {showVideo ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <Camera className="mb-2 h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center px-4">
                          {isCameraLoading ? "Initializing camera..." : "Camera preview will appear here"}
                        </p>
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              {!isCapturing ? (
                <Button
                  onClick={startCamera}
                  disabled={isAnalyzing || isCameraLoading}
                  className="w-full"
                >
                  {isCameraLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Camera...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Open Camera
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={captureImage}
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopCamera}
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
              {previewUrl && !isCapturing && (
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || !cropType || !fieldName || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered analysis of your crop image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {analysisResult.status === "healthy" && <CheckCircle2 className="h-8 w-8 text-green-500" />}
              {analysisResult.status === "warning" && <AlertTriangle className="h-8 w-8 text-yellow-500" />}
              {analysisResult.status === "critical" && <AlertTriangle className="h-8 w-8 text-red-500" />}

              <div>
                <h3 className="text-lg font-medium">
                  {analysisResult.status === "healthy" && "Healthy - No Disease Detected"}
                  {analysisResult.status === "warning" && "Warning - Potential Issues Detected"}
                  {analysisResult.status === "critical" && "Critical - Disease Detected"}
                </h3>
                <p className="text-sm text-muted-foreground">Confidence: {analysisResult.confidence}%</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-medium">Description</h4>
              <p className="text-sm">{analysisResult.description}</p>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Recommendations</h4>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Alert>
              <AlertTitle>Weather Context</AlertTitle>
              <AlertDescription>
                Current weather conditions (partly cloudy, 24°C) are favorable for crop growth. No extreme weather
                events are predicted in the next 7 days.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline">Download Report</Button>
            <Button onClick={handleSave}>Save Results</Button>
          </CardFooter>
        </Card>
      )}
    </DashboardLayout>
  )
}

