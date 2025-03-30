import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, ThermometerSun } from "lucide-react"

interface CropHistory {
  date: string;
  health: number;
}

interface Treatment {
  date: string;
  type: string;
  details: string;
}

interface Crop {
  id: string;
  name: string;
  variety: string;
  fieldSize: string;
  plantingDate: string;
  expectedHarvest: string;
  health: number;
  status: string;
  lastUpdated: string;
  alerts: number;
  image: string;
  history: CropHistory[];
  treatments: Treatment[];
  notes: string;
}

// Mock data for initial crops
const initialCrops: Crop[] = [
  {
    id: "1",
    name: "Wheat Field North",
    variety: "HD-2967",
    fieldSize: "25 acres",
    plantingDate: "2024-11-15",
    expectedHarvest: "2025-04-15",
    health: 85,
    status: "healthy",
    lastUpdated: new Date().toISOString(),
    alerts: 0,
    image: "/placeholder.svg?height=300&width=600",
    history: [
      { date: "Dec 1", health: 90 },
      { date: "Jan 1", health: 88 },
      { date: "Feb 1", health: 85 },
      { date: "Mar 1", health: 85 }
    ],
    treatments: [
      { date: "2024-11-20", type: "Fertilizer", details: "Base NPK application" },
      { date: "2025-01-15", type: "Herbicide", details: "Post-emergence weed control" },
      { date: "2025-02-28", type: "Irrigation", details: "Supplemental irrigation during dry spell" }
    ],
    notes: "First-year crop showing excellent growth. Soil moisture levels optimal despite regional dry conditions."
  },
  {
    id: "2",
    name: "Cotton Field East",
    variety: "Bt Cotton MCH-6304",
    fieldSize: "18 acres",
    plantingDate: "2024-05-15",
    expectedHarvest: "2024-11-30",
    health: 62,
    status: "warning",
    lastUpdated: new Date().toISOString(),
    alerts: 1,
    image: "/placeholder.svg?height=300&width=600",
    history: [
      { date: "Jun 1", health: 88 },
      { date: "Jul 1", health: 82 },
      { date: "Aug 1", health: 75 },
      { date: "Sep 1", health: 62 }
    ],
    treatments: [
      { date: "2024-05-20", type: "Fertilizer", details: "Starter fertilizer application" },
      { date: "2024-07-10", type: "Pesticide", details: "Bollworm prevention spray" },
      { date: "2024-08-15", type: "Foliar Spray", details: "Micronutrient supplement" }
    ],
    notes: "Signs of water stress appearing in patches. Bollworm pressure increasing in neighboring fields."
  },
  {
    id: "3",
    name: "Rice Paddy South",
    variety: "Basmati-370",
    fieldSize: "15 acres",
    plantingDate: "2024-07-01",
    expectedHarvest: "2024-11-15",
    health: 45,
    status: "critical",
    lastUpdated: new Date().toISOString(),
    alerts: 2,
    image: "/placeholder.svg?height=300&width=600",
    history: [
      { date: "Jul 15", health: 90 },
      { date: "Aug 1", health: 75 },
      { date: "Aug 15", health: 60 },
      { date: "Sep 1", health: 45 }
    ],
    treatments: [
      { date: "2024-07-05", type: "Fertilizer", details: "Base fertilizer application" },
      { date: "2024-08-01", type: "Pesticide", details: "Stem borer control" },
      { date: "2024-08-20", type: "Fungicide", details: "Blast disease treatment" }
    ],
    notes: "Blast disease detected in multiple sections. Immediate fungicide treatment required."
  }
];

export default function DashboardPage() {
  const [cropData, setCropData] = useState<Crop[]>([])

  useEffect(() => {
    // Load crops from localStorage or use initial mock data if empty
    const storedCrops = JSON.parse(localStorage.getItem("crops") || "[]")
    if (storedCrops.length === 0) {
      localStorage.setItem("crops", JSON.stringify(initialCrops))
      setCropData(initialCrops)
    } else {
      setCropData(storedCrops)
    }
  }, [])

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

  const averageHealth = cropData.length > 0 
    ? Math.round(cropData.reduce((acc: number, crop: any) => acc + crop.health, 0) / cropData.length)
    : 0

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/crops/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Crop
          </Button>
        </Link>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cropData.length}</div>
            <p className="text-xs text-muted-foreground">Active crop fields</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Health</CardTitle>
            <ThermometerSun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHealth}%</div>
            <p className="text-xs text-muted-foreground">Overall farm health score</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-8 text-xl font-bold">Your Crops</h2>
      {cropData.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-muted-foreground">No crops added yet. Add your first crop to start monitoring.</p>
            <Link href="/dashboard/crops/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Crop
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cropData.map((crop: any) => (
            <Card key={crop.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted">
                <img src={crop.image || "/placeholder.svg"} alt={crop.name} className="h-full w-full object-cover" />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{crop.name}</CardTitle>
                  {getStatusBadge(crop.status)}
                </div>
                <CardDescription>Last updated: {new Date(crop.lastUpdated).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Health Score</span>
                  <span className="text-sm font-medium">{crop.health}%</span>
                </div>
                <Progress value={crop.health} className={crop.health >= 75 ? "bg-green-500" : crop.health >= 50 ? "bg-yellow-500" : "bg-red-500"} />
                <Link href={`/dashboard/crop/${crop.id}`} className="mt-4 block">
                  <Button 
                    variant="outline" 
                    className="w-full text-foreground hover:text-background dark:text-foreground dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-background dark:hover:border-gray-500"
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

