"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

export function Dashboard() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>()

  const selectedProvider = watch("provider")
  const plans = selectedProvider ? PLANS[selectedProvider] ?? [] : []

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 className="text-base font-semibold text-foreground">Add AI Tool</h2>

        {/* Provider */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Provider</label>
          <select
            className={selectClass}
            {...register("provider", { required: "Select a provider" })}
            defaultValue=""
          >
            <option value="" disabled>
              Select provider…
            </option>
            {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.provider && (
            <p className="text-xs text-destructive">{errors.provider.message}</p>
          )}
        </div>

        {/* Conditional fields */}
        {selectedProvider && (
          <>
            {/* Team members */}
            <div className="space-y-1.5">
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
                <p className="text-xs text-destructive">{errors.teamMembers.message}</p>
              )}
            </div>

            {/* Plan */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Current plan</label>
              <select
                className={selectClass}
                {...register("plan", { required: "Select a plan" })}
                defaultValue=""
              >
                <option value="" disabled>
                  Select plan…
                </option>
                {plans.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
              {errors.plan && (
                <p className="text-xs text-destructive">{errors.plan.message}</p>
              )}
            </div>
          </>
        )}

        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </div>
  )
}

export default Dashboard
