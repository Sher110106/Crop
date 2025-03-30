import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Leaf, Cloud, Droplets, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">CropCare AI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container flex flex-col items-center justify-center py-12 text-center md:py-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Monitor Your Crops with <span className="text-green-600">AI</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            CropCare AI helps farmers detect diseases, monitor crop health, and receive actionable recommendations based
            on real-time weather and soil data.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/50 py-12 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Disease Detection</h3>
              <p className="text-muted-foreground">
                Upload images of your crops and our AI will detect signs of diseases, providing recommendations for
                treatment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Weather Integration</h3>
              <p className="text-muted-foreground">
                Get real-time weather updates and forecasts to help you make informed decisions about crop management.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Soil Moisture Monitoring</h3>
              <p className="text-muted-foreground">
                Monitor soil moisture levels to ensure optimal growing conditions and prevent water-related stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold">CropCare AI</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CropCare AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

