import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar, Clock, Image as ImageIcon, Leaf, Thermometer } from "lucide-react";
import type { TimelineEvent } from "@/types/crop";

interface CropTimelineProps {
  timeline: TimelineEvent[];
}

export function CropTimeline({ timeline }: CropTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "planting":
        return <Leaf className="h-4 w-4" />;
      case "analysis":
        return <ImageIcon className="h-4 w-4" />;
      case "treatment":
        return <Thermometer className="h-4 w-4" />;
      case "harvest":
        return <Calendar className="h-4 w-4" />;
      case "observation":
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventStatusBadge = (event: TimelineEvent) => {
    if (event.type !== "analysis" || !event.imageData?.analysis) return null;
    
    const status = event.imageData.analysis.status;
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Timeline</CardTitle>
        <CardDescription>History of events and analyses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {timeline.map((event) => (
            <div key={event.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                  {getEventIcon(event.type)}
                </div>
                <div className="h-full w-px bg-border" />
              </div>
              <div className="flex flex-col gap-2 pb-8">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{new Date(event.date).toLocaleDateString()}</h4>
                  {getEventStatusBadge(event)}
                </div>
                <p className="text-sm text-muted-foreground">{event.notes}</p>
                {event.metrics && (
                  <div className="mt-2 flex gap-4">
                    {event.metrics.health && (
                      <div>
                        <span className="text-xs text-muted-foreground">Health</span>
                        <p className="text-sm font-medium">{event.metrics.health}%</p>
                      </div>
                    )}
                    {event.metrics.soilMoisture && (
                      <div>
                        <span className="text-xs text-muted-foreground">Soil Moisture</span>
                        <p className="text-sm font-medium">{event.metrics.soilMoisture}%</p>
                      </div>
                    )}
                    {event.metrics.temperature && (
                      <div>
                        <span className="text-xs text-muted-foreground">Temperature</span>
                        <p className="text-sm font-medium">{event.metrics.temperature}°C</p>
                      </div>
                    )}
                    {event.metrics.rainfall && (
                      <div>
                        <span className="text-xs text-muted-foreground">Rainfall</span>
                        <p className="text-sm font-medium">{event.metrics.rainfall}mm</p>
                      </div>
                    )}
                  </div>
                )}
                {event.imageData && (
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        View Image Analysis
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Content className="max-w-2xl">
                      <div className="grid gap-4">
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img
                            src={event.imageData.url}
                            alt="Crop analysis"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {event.imageData.analysis && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Analysis Results</h4>
                              <p className="text-sm text-muted-foreground">
                                {event.imageData.analysis.description}
                              </p>
                            </div>
                            {event.imageData.analysis.recommendations && (
                              <div>
                                <h4 className="font-medium">Recommendations</h4>
                                <ul className="mt-2 list-inside list-disc space-y-1">
                                  {event.imageData.analysis.recommendations.map((rec, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Dialog.Content>
                  </Dialog.Root>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}