"use client"

import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="navbar sticky top-0 z-50">
      {/* Top Banner */}
      <div className="top-banner">
        📊 Financial News AI powered by sentiment analysis • Get smarter investment insights
      </div>

      {/* Main Navbar */}
      <nav className="container mx-auto px-4 max-w-7xl py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] rounded-lg group-hover:shadow-lg group-hover:shadow-[var(--accent)]/50 transition-all duration-300">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[color:var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
              Financial News
            </h1>
            <p className="text-xs text-[color:var(--text-muted)]">AI Analysis</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-[color:var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Insights
          </a>
          <a
            href="#"
            className="text-sm font-medium text-[color:var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Markets
          </a>
          <a
            href="#"
            className="text-sm font-medium text-[color:var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Portfolio
          </a>
        </div>

        {/* Action Button */}
        <button className="ai-analysis-btn hidden sm:block">
          ✨ AI Analysis
        </button>
      </nav>
    </header>
  )
}
