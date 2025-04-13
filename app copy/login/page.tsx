import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <Mail className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your email account
          </p>
        </div>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
            />
          </div>
          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <a
            href="#"
            className="text-primary hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
} 