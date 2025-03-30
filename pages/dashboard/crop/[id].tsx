import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Cloud, Droplets, AlertTriangle, Calendar, LineChart, Upload } from "lucide-react"
import Link from "next/link"

// Mock data for crops
const cropData = [
  {
    id: "1",
    name: "Corn Field A",
    health: 85,
    status: "healthy",
    lastUpdated: "2 days ago",
    alerts: 0,
    image: "/placeholder.svg?height=300&width=600",
    plantingDate: "March 15, 2023",
    expectedHarvest: "August 20, 2023",
    variety: "Sweet Corn XH-5",
    size: "12 acres",
    history: [
      { date: "Apr 1", health: 90 },
      { date: "Apr 15", health: 88 },
      { date: "May 1", health: 85 },
      { date: "May 15", health: 82 },
      { date: "Jun 1", health: 80 },
      { date: "Jun 15", health: 83 },
      { date: "Jul 1", health: 85 },
    ],
    treatments: [
      { date: "April 5, 2023", type: "Fertilizer", details: "NPK 10-20-10 application" },
      { date: "May 10, 2023", type: "Pesticide", details: "Preventive insecticide application" },
      { date: "June 20, 2023", type: "Irrigation", details: "Supplemental irrigation during dry period" },
    ],
    notes:
      "This field has been performing well despite the dry conditions in early June. The irrigation system has been effective in maintaining soil moisture levels.",
  },
  {
    id: "2",
    name: "Wheat Field B",
    health: 62,
    status: "warning",
    lastUpdated: "1 day ago",
    alerts: 1,
    image: "/placeholder.svg?height=300&width=600",
    plantingDate: "October 10, 2022",
    expectedHarvest: "July 5, 2023",
    variety: "Winter Wheat KWS-8",
    size: "20 acres",
    history: [
      { date: "Nov 1", health: 88 },
      { date: "Dec 1", health: 85 },
      { date: "Jan 1", health: 80 },
      { date: "Feb 1", health: 75 },
      { date: "Mar 1", health: 70 },
      { date: "Apr 1", health: 65 },
      { date: "May 1", health: 62 },
    ],
    treatments: [
      { date: "October 15, 2022", type: "Fertilizer", details: "Base fertilizer application" },
      { date: "March 5, 2023", type: "Herbicide", details: "Broadleaf weed control" },
      { date: "April 10, 2023", type: "Fungicide", details: "Preventive fungicide application" },
    ],
    notes:
      "This field has shown signs of water stress in the past month. Soil moisture levels have been below optimal range. Consider additional irrigation if dry conditions persist.",
  },
  {
    id: "3",
    name: "Soybean Field C",
    health: 45,
    status: "critical",
    lastUpdated: "5 hours ago",
    alerts: 2,
    image: "/placeholder.svg?height=300&width=600",
    plantingDate: "May 1, 2023",
    expectedHarvest: "October 15, 2023",
    variety: "Soybean RR-2",
    size: "15 acres",
    history: [
      { date: "May 15", health: 85 },
      { date: "Jun 1", health: 80 },
      { date: "Jun 15", health: 70 },
      { date: "Jul 1", health: 60 },
      { date: "Jul 15", health: 50 },
      { date: "Aug 1", health: 45 },
    ],
    treatments: [
      { date: "May 5, 2023", type: "Fertilizer", details: "Starter fertilizer application" },
      { date: "June 10, 2023", type: "Herbicide", details: "Post-emergence weed control" },
      { date: "July 15, 2023", type: "Fungicide", details: "Treatment for early signs of leaf blight" },
    ],
    notes:
      "This field has been showing signs of disease pressure. Leaf blight was detected in mid-July and has been spreading despite treatment. Consider more aggressive fungicide application and consult with an agronomist.",
  },
  {
    id: "4",
    name: "Rice Paddy D",
    health: 78,
    status: "healthy",
    lastUpdated: "3 days ago",
    alerts: 0,
    image: "/placeholder.svg?height=300&width=600",
    plantingDate: "April 20, 2023",
    expectedHarvest: "September 10, 2023",
    variety: "Long Grain Rice LG-7",
    size: "8 acres",
    history: [
      { date: "May 1", health: 82 },
      { date: "May 15", health: 85 },
      { date: "Jun 1", health: 88 },
      { date: "Jun 15", health: 86 },
      { date: "Jul 1", health: 82 },
      { date: "Jul 15", health: 80 },
      { date: "Aug 1", health: 78 },
    ],
    treatments: [
      { date: "April 25, 2023", type: "Fertilizer", details: "Base fertilizer application" },
      { date: "June 5, 2023", type: "Pesticide", details: "Treatment for rice water weevil" },
      { date: "July 10, 2023", type: "Fertilizer", details: "Mid-season nitrogen application" },
    ],
    notes:
      "This field has been performing well with consistent water management. Water levels have been maintained at optimal depth throughout the growing season.",
  },
]

export default function CropDetailPage() {
  const params = useParams()
  const cropId = params?.id as string || ""
  const [crop, setCrop] = useState<any>(null)

  useEffect(() => {
    // Load crops from localStorage and find the matching one
    const crops = JSON.parse(localStorage.getItem("crops") || "[]")
    const foundCrop = crops.find((c: any) => c.id === cropId)
    if (foundCrop) {
      setCrop(foundCrop)
    }
  }, [cropId])

  if (!crop) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p>Loading crop data...</p>
        </div>
      </DashboardLayout>
    )
  }

  const getHealthColor = (health: number) => {
    if (health >= 75) return "bg-green-500"
    if (health >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{crop.name}</h1>
          {getStatusBadge(crop.status)}
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/upload">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Image
            </Button>
          </Link>
          <Button>
            <LineChart className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Crop Overview</CardTitle>
            <CardDescription>Last updated: {crop.lastUpdated}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img src={crop.image || "/placeholder.svg"} alt={crop.name} className="h-full w-full object-cover" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-medium">Crop Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Variety</dt>
                    <dd className="text-sm font-medium">{crop.variety}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Field Size</dt>
                    <dd className="text-sm font-medium">{crop.size}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Planting Date</dt>
                    <dd className="text-sm font-medium">{crop.plantingDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Expected Harvest</dt>
                    <dd className="text-sm font-medium">{crop.expectedHarvest}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">Health Status</h3>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Health Score</span>
                  <span className="text-sm font-medium">{crop.health}%</span>
                </div>
                <Progress value={crop.health} className={getHealthColor(crop.health)} />

                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium">Health History</h4>
                  <div className="flex h-24 items-end justify-between gap-1">
                    {crop.history.map((point: any, index: number) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-8 ${getHealthColor(point.health)}`}
                          style={{ height: `${point.health}%` }}
                        ></div>
                        <span className="mt-1 text-xs">{point.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {crop.status !== "healthy" && (
              <Alert className="mt-6" variant={crop.status === "critical" ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{crop.status === "warning" ? "Warning" : "Critical Issue"}</AlertTitle>
                <AlertDescription>
                  {crop.status === "warning"
                    ? "This field is showing signs of water stress. Consider adjusting irrigation schedule."
                    : "Disease detected: Leaf blight. Immediate treatment recommended to prevent further spread."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">24°C</div>
                  <div className="text-sm text-muted-foreground">Partly Cloudy</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted p-2">
                  <div className="text-xs text-muted-foreground">Humidity</div>
                  <div className="text-sm font-medium">65%</div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <div className="text-xs text-muted-foreground">Wind</div>
                  <div className="text-sm font-medium">12 km/h</div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <div className="text-xs text-muted-foreground">Precipitation</div>
                  <div className="text-sm font-medium">0%</div>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <div className="text-xs text-muted-foreground">Soil Temp</div>
                  <div className="text-sm font-medium">22°C</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soil Moisture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">42%</div>
                  <div className="text-sm text-muted-foreground">Current Level</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Moisture Level</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <Progress value={42} className="bg-blue-500" />
                <p className="mt-2 text-xs text-muted-foreground">Optimal range: 35-50%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Treatment History</CardTitle>
            <CardDescription>Recent treatments applied to this field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crop.treatments.map((treatment: any, index: number) => (
                <div key={index} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
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

        <Card>
          <CardHeader>
            <CardTitle>Notes & Recommendations</CardTitle>
            <CardDescription>Field observations and AI recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Field Notes</h4>
                <p className="text-sm text-muted-foreground">{crop.notes}</p>
              </div>

              <div>
                <h4 className="mb-2 font-medium">AI Recommendations</h4>
                <ul className="space-y-2">
                  {crop.status === "healthy" && (
                    <>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Continue with current management practices.
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Consider soil testing in the next 2 weeks to optimize fertilizer application.
                      </li>
                    </>
                  )}

                  {crop.status === "warning" && (
                    <>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Increase irrigation to address water stress signs.
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Monitor for signs of disease as water-stressed plants are more susceptible.
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Consider applying a foliar nutrient spray to support plant health.
                      </li>
                    </>
                  )}

                  {crop.status === "critical" && (
                    <>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Apply recommended fungicide treatment immediately to control leaf blight.
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Remove and destroy severely affected plants to prevent spread.
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Adjust irrigation to avoid overhead watering which can spread the disease.
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                        Consult with an agronomist for a comprehensive disease management plan.
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

