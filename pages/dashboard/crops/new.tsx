import { useState } from "react"
import { useRouter } from "next/router"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewCropPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    fieldSize: "",
    plantingDate: "",
    expectedHarvest: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get existing crops from localStorage or initialize empty array
    const existingCrops = JSON.parse(localStorage.getItem("crops") || "[]")
    
    // Create new crop with form data
    const newCrop = {
      id: Date.now().toString(),
      ...formData,
      health: 100,
      status: "healthy",
      lastUpdated: new Date().toISOString(),
      alerts: 0,
      image: "/placeholder.svg?height=300&width=600",
      history: [
        { date: new Date().toLocaleDateString(), health: 100 }
      ],
      treatments: [],
      notes: "New crop field added to monitoring system."
    }
    
    // Add new crop to storage
    localStorage.setItem("crops", JSON.stringify([...existingCrops, newCrop]))
    
    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Add New Crop</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Crop Details</CardTitle>
            <CardDescription>Enter the details for your new crop field</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Field Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., North Field A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variety">Crop Variety</Label>
                <Input
                  id="variety"
                  placeholder="e.g., Sweet Corn XH-5"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldSize">Field Size</Label>
                <Input
                  id="fieldSize"
                  placeholder="e.g., 12 acres"
                  value={formData.fieldSize}
                  onChange={(e) => setFormData({ ...formData, fieldSize: e.target.value })}
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plantingDate">Planting Date</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedHarvest">Expected Harvest Date</Label>
                <Input
                  id="expectedHarvest"
                  type="date"
                  value={formData.expectedHarvest}
                  onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                  required
                  className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">Create Crop</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}