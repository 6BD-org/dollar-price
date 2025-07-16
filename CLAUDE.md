# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js web application that fetches USD/CNY exchange rates from Chinese banks (Bank of China and Bank of China Hong Kong). The application provides an API endpoint that scrapes real-time exchange rate data.

## Common Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Code Architecture

### Technology Stack
- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **HTML Parsing**: Cheerio (for web scraping)

### Project Structure
- `/app/` - Next.js App Router directory
  - `/app/dollar/route.ts` - API route that fetches exchange rates from BOC and BOCHK
  - `/app/page.tsx` - Homepage (currently using default Next.js template)
  - `/app/layout.tsx` - Root layout
  - `/app/globals.css` - Global styles with Tailwind directives

### Key Implementation Details

1. **Exchange Rate API** (`/app/dollar/route.ts`):
   - Fetches data from two sources in parallel:
     - Bank of China (BOC): `https://www.boc.cn/`
     - Bank of China Hong Kong (BOCHK): `https://www.bochk.com/`
   - Uses Cheerio to parse HTML and extract exchange rate data
   - Implements retry logic for BOC (searches up to 3 pages if data not found)
   - Returns formatted text response with buy/sell rates and timestamps

2. **API Behavior**:
   - Route is marked as `dynamic = 'force-dynamic'` to prevent caching
   - All fetch requests use `cache: 'no-store'` for real-time data
   - Returns plain text response with exchange rates from both banks

### Development Notes

- No testing framework is currently configured
- The main page still uses the default Next.js template and needs implementation
- The API endpoint is accessible at `/dollar` when the server is running