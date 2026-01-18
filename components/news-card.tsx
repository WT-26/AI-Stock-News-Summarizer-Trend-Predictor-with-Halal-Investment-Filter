"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronDown, ChevronUp, ExternalLink, Star, Calendar } from "lucide-react"
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

  const isPositive = news.priceChange >= 0
  const formattedDate = new Date(news.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <article className="news-card animate-fade-in-up">
      {/* Header Section */}
      <div className="news-card-header">
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
              <h3 className="text-lg font-semibold leading-tight text-balance mb-1 news-card-title">{news.headline}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground news-card-meta">
                <div className="flex items-center gap-1.5 news-card-source">
                  <span className="text-base">{news.sourceIcon}</span>
                  <span>{news.source}</span>
                </div>
                <span className="flex items-center gap-2 text-[color:var(--text-muted)]">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section - Two Column Layout */}
      <div className="news-card-body-layout">
        {/* Left Side - Summary Box */}
        <div className="summary-section">
          <div className="summary-box">
            <p className="summary-title">Key Points:</p>
            <ul className="summary-list">
              {news.summary.map((point, index) => (
                <li key={index} className="summary-point">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - AI Analysis */}
        <div className="ai-section">
          <div className="ai-analysis-card">
            <button className="ai-analysis-btn-compact">
              <Sparkles className="h-4 w-4" />
              <span>AI Analysis</span>
            </button>
            <p className="ai-analysis-desc">
              Get sentiment analysis, trend insights, and investment recommendations powered by AI
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="news-card-footer">
        <div className="mt-3 pt-3 border-t">
          <div className="read-more-box">
            <a href={news.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
