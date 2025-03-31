import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { SpeakableElement } from "@/components/SpeakableElement"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, MapPin } from "lucide-react"

export default function NewCropPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success",
        description: "New crop has been added successfully.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new crop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Add New Crop</CardTitle>
              <CardDescription>Create a new crop monitoring entry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SpeakableElement text="Enter crop name">
                <div className="space-y-2">
                  <Label htmlFor="name">Crop Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter a name for this crop"
                    required
                  />
                </div>
              </SpeakableElement>

              <SpeakableElement text="Select crop type">
                <div className="space-y-2">
                  <Label htmlFor="type">Crop Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="corn">Corn</SelectItem>
                      <SelectItem value="soybean">Soybean</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SpeakableElement>

              <SpeakableElement text="Enter field area in hectares">
                <div className="space-y-2">
                  <Label htmlFor="area">Field Area (hectares)</Label>
                  <Input
                    id="area"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Enter field area"
                    required
                  />
                </div>
              </SpeakableElement>

              <SpeakableElement text="Enter planting date">
                <div className="space-y-2">
                  <Label htmlFor="plantingDate">Planting Date</Label>
                  <Input
                    id="plantingDate"
                    type="date"
                    required
                  />
                </div>
              </SpeakableElement>

              <SpeakableElement text="Enter field location">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="Latitude"
                      required
                    />
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="Longitude"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>
              </SpeakableElement>

              <SpeakableElement text="Add additional notes about the crop">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional information about this crop"
                    className="min-h-[100px]"
                  />
                </div>
              </SpeakableElement>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <SpeakableElement text="Cancel and return to dashboard">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </SpeakableElement>
              <SpeakableElement text={isSubmitting ? "Creating new crop entry" : "Create new crop entry"}>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Crop
                    </>
                  )}
                </Button>
              </SpeakableElement>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}