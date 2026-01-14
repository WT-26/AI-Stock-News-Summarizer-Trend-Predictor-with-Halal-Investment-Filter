"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsCardProps {
  news: {
    id: string
    company: string
    ticker: string
    headline: string
    source: string
    sourceIcon: string
    url: string
    publishedAt: string
    category: string
    isHalal: boolean
    price: number
    priceChange: number
    summary: string[]
  }
  isFavorite: boolean
  onToggleFavorite: (ticker: string) => void
}

interface SentimentAnalysis {
  sentiment: "bullish" | "bearish" | "neutral"
  confidence: number
  summary: string
  buyRange: string
  keyPoints: string[]
}

export function NewsCard({ news, isFavorite, onToggleFavorite }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (expanded && !analysis && !error) {
      analyzeSentiment()
    }
  }, [expanded])

  const analyzeSentiment = async () => {
    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null) // Clear previous analysis to prevent rendering stale data

    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: news.headline,
          company: news.company,
          ticker: news.ticker,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.sentiment) {
        throw new Error(data.error || "Failed to analyze sentiment")
      }

      setAnalysis(data)
    } catch (error) {
      console.error("Failed to analyze sentiment:", error)
      setError(
        error instanceof Error ? error.message : "Unable to analyze sentiment at this time. Please try again later.",
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "bullish") return <TrendingUp className="h-5 w-5" />
    if (sentiment === "bearish") return <TrendingDown className="h-5 w-5" />
    return <Minus className="h-5 w-5" />
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "bullish") return "text-success bg-success/10 border-success/20"
    if (sentiment === "bearish") return "text-warning bg-warning/10 border-warning/20"
    return "text-muted-foreground bg-muted border-border"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="font-mono font-semibold">
                  {news.ticker}
                </Badge>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted">
                  <span className="font-mono font-semibold text-sm">${news.price.toFixed(2)}</span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      news.priceChange >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {news.priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(news.priceChange).toFixed(2)}%
                  </span>
                </div>
                {news.isHalal && (
                  <Badge variant="outline" className="text-success border-success/30">
                    Halal ✓
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">{formatDate(news.publishedAt)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-auto sm:ml-0"
                  onClick={() => onToggleFavorite(news.ticker)}
                >
                  <Star
                    className={`h-4 w-4 ${isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                  />
                </Button>
              </div>
              <h3 className="text-lg font-semibold leading-tight text-balance mb-1">{news.headline}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{news.sourceIcon}</span>
                  <span>{news.source}</span>
                </div>
                <span>•</span>
                <span>{news.company}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="shrink-0">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Analysis
              {expanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          <div className="border-t pt-3">
            <ul className="space-y-2">
              {news.summary.map((point, index) => (
                <li key={index} className="text-sm text-foreground/80 flex gap-2 leading-relaxed">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span className="flex-1">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t">
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Read more
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            {isAnalyzing ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-sm text-destructive mb-3">{error}</p>
                <Button variant="outline" size="sm" onClick={analyzeSentiment}>
                  Try Again
                </Button>
              </div>
            ) : analysis && analysis.sentiment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${getSentimentColor(analysis.sentiment)} flex items-center gap-2 px-3 py-1.5 text-sm font-semibold`}
                  >
                    {getSentimentIcon(analysis.sentiment)}
                    {analysis.sentiment.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Confidence: {Math.round(analysis.confidence * 100)}%
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">AI Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-1 text-sm">Suggested Buy Range</h4>
                  <p className="text-lg font-mono font-bold text-primary">{analysis.buyRange}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Points</h4>
                  <ul className="space-y-2">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">•</span>
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
