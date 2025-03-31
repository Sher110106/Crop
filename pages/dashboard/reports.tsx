"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { SpeakableElement } from "@/components/SpeakableElement"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { BarChart3, Download, FileText, LineChart, PieChart, Share2 } from "lucide-react"
import { DateRange } from "react-day-picker"

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  })

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <SpeakableElement text="Analytics and Reports Dashboard">
          <div>
            <h1 className="text-2xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground">View detailed analysis and export reports</p>
          </div>
        </SpeakableElement>
        <div className="flex gap-2">
          <SpeakableElement text="Export report as PDF">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </SpeakableElement>
          <SpeakableElement text="Share report">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </SpeakableElement>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <SpeakableElement text="Report filters and options">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Customize your report view</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <SpeakableElement text="Select date range for report">
                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <DateRangePicker 
                      className="w-full" 
                      date={date}
                      onDateChange={setDate}
                    />
                  </div>
                </SpeakableElement>
              </div>

              <div className="space-y-2">
                <SpeakableElement text="Select field to analyze">
                  <div>
                    <label className="text-sm font-medium">Field</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="field-a">Field A</SelectItem>
                        <SelectItem value="field-b">Field B</SelectItem>
                        <SelectItem value="field-c">Field C</SelectItem>
                        <SelectItem value="field-d">Field D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SpeakableElement>
              </div>

              <div className="space-y-2">
                <SpeakableElement text="Select metric to analyze">
                  <div>
                    <label className="text-sm font-medium">Metric</label>
                    <Select defaultValue="health">
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health Score</SelectItem>
                        <SelectItem value="moisture">Soil Moisture</SelectItem>
                        <SelectItem value="disease">Disease Incidents</SelectItem>
                        <SelectItem value="water">Water Usage</SelectItem>
                        <SelectItem value="treatments">Treatments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SpeakableElement>
              </div>

              <SpeakableElement text="Apply selected filters">
                <Button className="w-full">Apply Filters</Button>
              </SpeakableElement>
            </CardContent>
          </Card>
        </SpeakableElement>

        <div className="flex-1 space-y-4">
          <Tabs defaultValue="health">
            <TabsList className="grid w-full grid-cols-4">
              <SpeakableElement text="View health trends">
                <TabsTrigger value="health">Health Trends</TabsTrigger>
              </SpeakableElement>
              <SpeakableElement text="View disease analysis">
                <TabsTrigger value="disease">Disease Analysis</TabsTrigger>
              </SpeakableElement>
              <SpeakableElement text="View weather impact">
                <TabsTrigger value="weather">Weather Impact</TabsTrigger>
              </SpeakableElement>
              <SpeakableElement text="View treatments">
                <TabsTrigger value="treatments">Treatments</TabsTrigger>
              </SpeakableElement>
            </TabsList>

            <TabsContent value="health" className="space-y-4">
              <SpeakableElement text="Crop health trends over time">
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Health Trends</CardTitle>
                    <CardDescription>Average health score over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Health trend chart would appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>

              <SpeakableElement text="Field comparison analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Field Comparison</CardTitle>
                    <CardDescription>Health scores by field</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Field comparison chart would appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>
            </TabsContent>

            <TabsContent value="disease" className="space-y-4">
              <SpeakableElement text="Disease detection analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Disease Detection</CardTitle>
                    <CardDescription>Disease incidents over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Disease detection chart would appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>

              <SpeakableElement text="Disease type distribution">
                <Card>
                  <CardHeader>
                    <CardTitle>Disease Distribution</CardTitle>
                    <CardDescription>Types of diseases detected</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Disease distribution chart would appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <SpeakableElement text="Weather correlation analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Correlation</CardTitle>
                    <CardDescription>Impact of weather on crop health</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Weather correlation chart would appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>

              <SpeakableElement text="Conditions breakdown">
                <Card>
                  <CardHeader>
                    <CardTitle>Conditions Breakdown</CardTitle>
                    <CardDescription>Distribution of weather conditions</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Weather conditions chart would appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>
            </TabsContent>

            <TabsContent value="treatments" className="space-y-4">
              <SpeakableElement text="Treatment effectiveness analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Effectiveness</CardTitle>
                    <CardDescription>Impact of treatments on crop health</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Treatment effectiveness chart would appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>

              <SpeakableElement text="Treatment types breakdown">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Types</CardTitle>
                    <CardDescription>Breakdown of treatments by type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Treatment types breakdown chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpeakableElement>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

