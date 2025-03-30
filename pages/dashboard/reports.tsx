"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { BarChart3, Download, FileText, LineChart, PieChart, Share2 } from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            Share Report
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Health Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.5%</div>
            <p className="text-xs text-muted-foreground">-5.2% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disease Incidents</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245 gal</div>
            <p className="text-xs text-muted-foreground">+12% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Costs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,890</div>
            <p className="text-xs text-muted-foreground">+$350 from previous period</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <Card className="w-full md:w-64">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Crop Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="soybean">Soybean</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <Button className="w-full">Apply Filters</Button>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <Tabs defaultValue="health">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="health">Health Trends</TabsTrigger>
              <TabsTrigger value="disease">Disease Analysis</TabsTrigger>
              <TabsTrigger value="weather">Weather Impact</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
            </TabsList>

            <TabsContent value="health" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Crop Health Trends</CardTitle>
                  <CardDescription>Average health score over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                  {/* Placeholder for chart */}
                  <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Health trend chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Health by Crop Type</CardTitle>
                    <CardDescription>Comparison across different crops</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    {/* Placeholder for chart */}
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Crop type comparison chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Health Distribution</CardTitle>
                    <CardDescription>Distribution of health scores</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    {/* Placeholder for chart */}
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Health distribution chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="disease" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Incidents Over Time</CardTitle>
                  <CardDescription>Number of detected diseases by month</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {/* Placeholder for chart */}
                  <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Disease incidents chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disease Types</CardTitle>
                  <CardDescription>Breakdown of detected diseases by type</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  {/* Placeholder for chart */}
                  <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Disease types breakdown chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weather Impact Analysis</CardTitle>
                  <CardDescription>Correlation between weather conditions and crop health</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {/* Placeholder for chart */}
                  <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Weather impact chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature vs. Health</CardTitle>
                    <CardDescription>Impact of temperature on crop health</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    {/* Placeholder for chart */}
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Temperature correlation chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rainfall vs. Health</CardTitle>
                    <CardDescription>Impact of rainfall on crop health</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    {/* Placeholder for chart */}
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <LineChart className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Rainfall correlation chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="treatments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Effectiveness</CardTitle>
                  <CardDescription>Impact of treatments on crop health</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {/* Placeholder for chart */}
                  <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Treatment effectiveness chart would appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Treatment Types</CardTitle>
                  <CardDescription>Breakdown of treatments by type</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  {/* Placeholder for chart */}
                  <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                      <PieChart className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Treatment types breakdown chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

