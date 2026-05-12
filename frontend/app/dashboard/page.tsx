"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"

const PLANS: Record<string, string[]> = {
  cursor: ["Hobby", "Pro", "Business"],
  "claude-code": ["Pro", "Max (5x)", "Max (20x)", "Enterprise"],
  openai: ["Free", "Plus", "Team", "Enterprise"],
}

const PROVIDER_LABELS: Record<string, string> = {
  cursor: "Cursor",
  "claude-code": "Claude Code",
  openai: "OpenAI",
}

type FormValues = {
  provider: string
  teamMembers: number
  plan: string
}

type SuggestionFormValues = {
  name: string
  email: string
}

export function Dashboard() {
  const [selectedProvider, setSelectedProvider] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>()

  const {
    register: registerSuggestion,
    handleSubmit: handleSuggestionSubmit,
    reset: resetSuggestion,
  } = useForm<SuggestionFormValues>()

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  function onSuggestionSubmit(data: SuggestionFormValues) {
    
    setSuggestion(
      `AI Suggestion for ${data.name}: Based on your email ${data.email}, we recommend...`
    )
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Add AI Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Provider Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Provider</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {selectedProvider
                      ? PROVIDER_LABELS[selectedProvider]
                      : "Select provider…"}
                    <ChevronDownIcon className="size-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => {
                        setSelectedProvider(value)
                        setValue("provider", value)
                        setSelectedPlan("")
                        setValue("plan", "")
                      }}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.provider && (
                <p className="text-xs text-destructive">{errors.provider.message}</p>
              )}
            </div>

            {/* Conditional Fields */}
            {selectedProvider && (
              <>
                {/* Team Members Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Number of team members
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 5"
                    {...register("teamMembers", {
                      required: "Enter team size",
                      min: { value: 1, message: "Must be at least 1" },
                      valueAsNumber: true,
                    })}
                    aria-invalid={!!errors.teamMembers}
                  />
                  {errors.teamMembers && (
                    <p className="text-xs text-destructive">
                      {errors.teamMembers.message}
                    </p>
                  )}
                </div>

                {/* Plan Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Current plan
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedPlan || "Select plan…"}
                        <ChevronDownIcon className="size-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {[
                        ...(selectedProvider
                          ? PLANS[selectedProvider] ?? []
                          : []),
                      ].map((plan) => (
                        <DropdownMenuItem
                          key={plan}
                          onClick={() => {
                            setSelectedPlan(plan)
                            setValue("plan", plan)
                          }}
                        >
                          {plan}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors.plan && (
                    <p className="text-xs text-destructive">{errors.plan.message}</p>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSuggestionModal(true)}
              >
                Get AI Suggestion
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* AI Suggestion Modal */}
      {showSuggestionModal && (
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Get AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!suggestion ? (
              <form
                onSubmit={handleSuggestionSubmit(onSuggestionSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <Input
                    placeholder="Your name"
                    {...registerSuggestion("name", {
                      required: "Name is required",
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...registerSuggestion("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email",
                      },
                    })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    Get Suggestion
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowSuggestionModal(false)
                      setSuggestion(null)
                      resetSuggestion()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-foreground">{suggestion}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowSuggestionModal(false)
                    setSuggestion(null)
                    resetSuggestion()
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
