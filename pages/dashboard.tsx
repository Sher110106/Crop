import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { SpeakableElement } from "@/components/SpeakableElement"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Plus, Droplets, ThermometerSun, Sprout } from "lucide-react"
import type { Crop } from "@/types/crop"

export default function DashboardPage() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchCrops = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCrops([
        {
          id: "1",
          name: "Wheat Field A",
          type: "wheat",
          variety: "Winter wheat",
          fieldSize: "12 acres",
          plantingDate: "2024-01-15",
          expectedHarvest: "2024-07-20",
          health: 85,
          lastUpdated: "2024-03-30",
          status: "healthy",
          alerts: 0,
          image: "/wheat-field.jpg",
          history: [],
          treatments: [],
          notes: "Performing well with consistent growth",
          timeline: []
        },
        {
          id: "2",
          name: "Rice Paddy B",
          type: "rice",
          variety: "Jasmine",
          fieldSize: "8 acres",
          plantingDate: "2024-02-10",
          expectedHarvest: "2024-08-15",
          health: 65,
          lastUpdated: "2024-03-30",
          status: "warning",
          alerts: 2,
          image: "/rice-field.jpg",
          history: [],
          treatments: [],
          notes: "Some concerns about moisture levels",
          timeline: []
        },
        {
          id: "3",
          name: "Corn Field C",
          type: "corn",
          variety: "Sweet corn",
          fieldSize: "15 acres",
          plantingDate: "2024-02-28",
          expectedHarvest: "2024-09-01",
          health: 92,
          lastUpdated: "2024-03-30",
          status: "healthy",
          alerts: 0,
          image: "/corn-field.jpg",
          history: [],
          treatments: [],
          notes: "Excellent growth rate and health indicators",
          timeline: []
        },
      ])
      setIsLoading(false)
    }
    fetchCrops()
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <SpeakableElement text="Dashboard Overview">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your crop health and conditions</p>
          </div>
        </SpeakableElement>
        <Link href="/dashboard/crops/new">
          <SpeakableElement text="Add new crop">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Crop
            </Button>
          </SpeakableElement>
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <SpeakableElement text="Weather: Sunny, 24°C">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weather</CardTitle>
              <ThermometerSun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24°C</div>
              <p className="text-xs text-muted-foreground">Sunny</p>
            </CardContent>
          </SpeakableElement>
        </Card>
        
        <Card>
          <SpeakableElement text="Soil Moisture: 65% average across all fields">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65%</div>
              <p className="text-xs text-muted-foreground">Average across all fields</p>
            </CardContent>
          </SpeakableElement>
        </Card>
        
        <Card>
          <SpeakableElement text="Overall Health: 82% Good condition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">Good condition</p>
            </CardContent>
          </SpeakableElement>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {crops.map((crop) => (
            <Card key={crop.id}>
              <SpeakableElement text={`${crop.name}: ${crop.health}% health, Status: ${crop.status}`}>
                <CardHeader>
                  <CardTitle>{crop.name}</CardTitle>
                  <CardDescription>Type: {crop.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Health Score</span>
                    <span className="text-sm font-medium">{crop.health}%</span>
                  </div>
                  <Progress 
                    value={crop.health} 
                    className={
                      crop.health >= 75 ? "bg-green-500" : 
                      crop.health >= 50 ? "bg-yellow-500" : 
                      "bg-red-500"
                    } 
                  />
                  <div className="mt-4 block">
                    <Link href={`/dashboard/crop/${crop.id}`}>
                      <SpeakableElement text={`View details for ${crop.name}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </SpeakableElement>
                    </Link>
                  </div>
                </CardContent>
              </SpeakableElement>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

