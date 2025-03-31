"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { SpeakableElement } from "@/components/SpeakableElement"
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
  const [uploadMethod, setUploadMethod] = useState<'file' | 'camera'>('file')
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        setUploadError(null)
      } else {
        setUploadError('Please select an image file')
        setSelectedFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded and is being analyzed.",
      })

      setIsAnalyzing(true)
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 3000))

      toast({
        title: "Analysis complete",
        description: "Image analysis has been completed successfully.",
      })

    } catch (error) {
      setUploadError('Failed to upload image. Please try again.')
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setIsAnalyzing(false)
    }
  }

  const handleRetry = () => {
    setSelectedFile(null)
    setUploadError(null)
    setIsUploading(false)
    setIsAnalyzing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Upload Analysis</CardTitle>
            <CardDescription>Upload crop images for disease detection and health analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="upload" 
                  onClick={() => setUploadMethod('file')}
                  aria-label="Upload from file"
                >
                  <SpeakableElement text="Upload from file">
                    <span className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </span>
                  </SpeakableElement>
                </TabsTrigger>
                <TabsTrigger 
                  value="camera" 
                  onClick={() => setUploadMethod('camera')}
                  aria-label="Use camera"
                >
                  <SpeakableElement text="Use camera to capture image">
                    <span className="flex items-center">
                      <Camera className="mr-2 h-4 w-4" />
                      Camera
                    </span>
                  </SpeakableElement>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <SpeakableElement text="Select crop type for analysis">
                      <div>
                        <Label>Crop Type</Label>
                        <Select>
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
                    </SpeakableElement>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-dashed p-8">
                    <SpeakableElement text={selectedFile ? 
                      `Selected file: ${selectedFile.name}` : 
                      "Drop or select image file for upload"
                    }>
                      <div className="flex items-center justify-center">
                        {selectedFile ? (
                          <Image className="h-8 w-8 text-green-500" />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="text-center">
                        {selectedFile ? (
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                        ) : (
                          <>
                            <p className="text-sm font-medium">Drag and drop your image here or</p>
                            <label
                              htmlFor="file-upload"
                              className="text-primary hover:text-primary/90 cursor-pointer text-sm font-medium"
                            >
                              browse files
                            </label>
                          </>
                        )}
                      </div>
                    </SpeakableElement>
                    <Input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                      aria-label="Select file to upload"
                    />
                  </div>

                  {uploadError && (
                    <Alert variant="destructive">
                      <SpeakableElement text={`Error: ${uploadError}`}>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{uploadError}</AlertDescription>
                        </div>
                      </SpeakableElement>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="camera">
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-dashed p-8">
                  <SpeakableElement text="Camera functionality is not yet available">
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Camera functionality coming soon</p>
                    </div>
                  </SpeakableElement>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleRetry}
              disabled={!selectedFile || isUploading || isAnalyzing}
              aria-label="Clear selection"
            >
              <SpeakableElement text="Clear selection and start over">
                <span className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </span>
              </SpeakableElement>
            </Button>
            
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isAnalyzing}
              aria-label={isAnalyzing ? "Analyzing image" : isUploading ? "Uploading image" : "Upload and analyze image"}
            >
              <SpeakableElement 
                text={isAnalyzing ? "Analyzing image" : isUploading ? "Uploading image" : "Upload and analyze image"}
              >
                <span className="flex items-center">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Analyze
                    </>
                  )}
                </span>
              </SpeakableElement>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}

