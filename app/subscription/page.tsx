"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Crown, Star, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  max_bookings_per_month: number | null
  priority_listing: boolean
  analytics_access: boolean
  custom_branding: boolean
}

interface DJSubscription {
  id: string
  plan_id: string
  status: string
  billing_cycle: string
  current_period_start: string
  current_period_end: string
  subscription_plans: SubscriptionPlan
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<DJSubscription | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Load subscription plans
      const { data: plansData } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly")

      if (plansData) setPlans(plansData)

      // Load current subscription if user is logged in
      if (user) {
        const { data: subscriptionData } = await supabase
          .from("dj_subscriptions")
          .select(`
            *,
            subscription_plans (*)
          `)
          .eq("dj_id", user.id)
          .eq("status", "active")
          .single()

        if (subscriptionData) setCurrentSubscription(subscriptionData)
      }
    } catch (error) {
      console.error("Error loading subscription data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = "/login"
      return
    }

    try {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll simulate the subscription creation
      const plan = plans.find((p) => p.id === planId)
      if (!plan) return

      const subscriptionData = {
        dj_id: user.id,
        plan_id: planId,
        status: "active",
        billing_cycle: billingCycle,
        current_period_start: new Date().toISOString().split("T")[0],
        current_period_end: new Date(Date.now() + (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }

      const { error } = await supabase.from("dj_subscriptions").upsert([subscriptionData])

      if (error) {
        console.error("Error creating subscription:", error)
        alert("Error creating subscription. Please try again.")
        return
      }

      alert(`Successfully subscribed to ${plan.name} plan!`)
      loadData()
    } catch (error) {
      console.error("Error handling subscription:", error)
      alert("Error processing subscription. Please try again.")
    }
  }

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return

    if (confirm("Are you sure you want to cancel your subscription?")) {
      try {
        const { error } = await supabase
          .from("dj_subscriptions")
          .update({ status: "cancelled" })
          .eq("id", currentSubscription.id)

        if (error) {
          console.error("Error cancelling subscription:", error)
          alert("Error cancelling subscription. Please try again.")
          return
        }

        alert("Subscription cancelled successfully.")
        loadData()
      } catch (error) {
        console.error("Error cancelling subscription:", error)
        alert("Error cancelling subscription. Please try again.")
      }
    }
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return <Zap className="w-6 h-6" />
      case "pro":
        return <Star className="w-6 h-6" />
      case "premium":
        return <Crown className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "free":
        return "from-gray-500 to-gray-600"
      case "pro":
        return "from-orange-500 to-red-500"
      case "premium":
        return "from-purple-500 to-pink-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscription plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              DJ Plan
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features and grow your DJ career with our flexible subscription plans.
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Current Plan: {currentSubscription.subscription_plans.name}
                    </h3>
                    <p className="text-muted-foreground">
                      Active until {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                      {currentSubscription.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelSubscription}
                      className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                    >
                      Cancel Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <Tabs
            value={billingCycle}
            onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-700">
                  Save 17%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_id === plan.id
            const price = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly
            const savings =
              billingCycle === "yearly"
                ? Math.round(((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100)
                : 0

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.name.toLowerCase() === "pro" ? "ring-2 ring-primary scale-105" : ""
                } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
              >
                {plan.name.toLowerCase() === "pro" && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-orange-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-blue-500 text-white text-center py-2 text-sm font-medium">
                    Current Plan
                  </div>
                )}

                <CardHeader
                  className={`text-center ${plan.name.toLowerCase() === "pro" || isCurrentPlan ? "pt-12" : ""}`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getPlanColor(plan.name)} flex items-center justify-center text-white`}
                  >
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-foreground">
                      ${price}
                      <span className="text-lg font-normal text-muted-foreground">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && savings > 0 && (
                      <p className="text-sm text-green-600 mt-1">Save {savings}% with yearly billing</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-6 ${
                      plan.name.toLowerCase() === "free"
                        ? "bg-gray-600 hover:bg-gray-700"
                        : `bg-gradient-to-r ${getPlanColor(plan.name)} hover:opacity-90`
                    }`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || (plan.name.toLowerCase() === "free" && !currentSubscription)}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : plan.name.toLowerCase() === "free"
                        ? "Get Started Free"
                        : `Subscribe to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Compare Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto bg-card rounded-lg border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center p-4 font-semibold text-foreground">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground">Monthly Bookings</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center p-4">
                      {plan.max_bookings_per_month ? plan.max_bookings_per_month : "Unlimited"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground">Priority Listing</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center p-4">
                      {plan.priority_listing ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground">Analytics Access</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center p-4">
                      {plan.analytics_access ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground">Custom Branding</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center p-4">
                      {plan.custom_branding ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in
                  your next billing cycle.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, debit cards, and PayPal through our secure payment processor.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Start with our Free plan to explore the platform, then upgrade when you're ready for more
                  features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
