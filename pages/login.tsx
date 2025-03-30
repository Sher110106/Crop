"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // For demo purposes, we'll just check if there's a user in localStorage
    // In a real app, this would be an API call to authenticate
    const storedUser = localStorage.getItem("cropcare_user")

    setTimeout(() => {
      setIsLoading(false)

      if (storedUser) {
        // In a real app, we would validate the password here
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        })
        router.push("/dashboard")
      } else {
        // For demo purposes, we'll create a user if none exists
        localStorage.setItem(
          "cropcare_user",
          JSON.stringify({
            id: "user_" + Date.now(),
            name: "Demo User",
            email: formData.email,
          }),
        )

        toast({
          title: "Demo account created",
          description: "You've been logged in with a demo account.",
        })
        router.push("/dashboard")
      }
    }, 1500)
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-green-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Leaf className="mr-2 h-6 w-6" />
          CropCare AI
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "The real-time weather and soil moisture data integration has helped us optimize our irrigation schedule,
              saving water and improving crop yields."
            </p>
            <footer className="text-sm">Michael Chen - Farm Manager</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  <Link href="#" className="underline underline-offset-4 hover:text-primary">
                    Forgot password?
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

