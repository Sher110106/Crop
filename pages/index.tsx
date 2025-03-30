import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Droplets, ThermometerSun, Cloud } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Smart Farming Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Monitor your crops, weather conditions, and soil health all in one place. Make data-driven decisions for better yields.
          </p>
          <div className="flex gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Leaf className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Crop Monitoring</CardTitle>
              <CardDescription>Track crop health and growth stages</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Droplets className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Soil Analysis</CardTitle>
              <CardDescription>Monitor soil moisture and nutrients</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ThermometerSun className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Weather Tracking</CardTitle>
              <CardDescription>Real-time weather data and forecasts</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Cloud className="h-8 w-8 text-gray-600 mb-2" />
              <CardTitle>Smart Alerts</CardTitle>
              <CardDescription>Get notified about important events</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farming?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of farmers who are already using our platform to improve their yields.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
