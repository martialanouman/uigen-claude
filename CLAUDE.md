# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, and AI generates React/JSX code that renders in real-time without writing files to disk.

## Commands

```bash
# Setup (first time)
npm run setup          # Install deps, generate Prisma client, run migrations

# Development
npm run dev            # Start dev server with Turbopack (http://localhost:3000)
npm run dev:daemon     # Start dev server in background (logs to logs.txt)

# Build & Deploy
npm run build          # Production build
npm start              # Start production server

# Testing
npm test               # Run tests with Vitest (interactive watch mode)
npx vitest run         # Run tests once
npx vitest run src/lib/__tests__/file-system.test.ts  # Run single test file

# Linting
npm run lint           # ESLint

# Database
npm run db:reset       # Reset database (destructive)
npx prisma studio      # Database GUI
```

## Architecture

### Core Data Flow

1. **Chat API** (`src/app/api/chat/route.ts`) - Receives messages + serialized virtual filesystem, streams AI responses via Vercel AI SDK
2. **AI Tools** - Two tools exposed to the AI:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`) - Create/edit/view files
   - `file_manager` (`src/lib/tools/file-manager.ts`) - Rename/delete files
3. **VirtualFileSystem** (`src/lib/file-system.ts`) - In-memory file system class, files never touch disk
4. **JSX Transformer** (`src/lib/transform/jsx-transformer.ts`) - Transforms JSX/TSX using Babel, creates blob URLs for import maps
5. **PreviewFrame** (`src/components/preview/PreviewFrame.tsx`) - Renders components in sandboxed iframe using import maps and esm.sh

### Key Contexts

- `FileSystemProvider` - Manages virtual filesystem state, handles tool calls from AI
- `ChatProvider` - Wraps Vercel AI SDK's `useChat`, connects to filesystem context

### Mock Provider

When no `ANTHROPIC_API_KEY` is set, a mock provider (`src/lib/provider.ts`) returns static responses for demo purposes.

### Database

SQLite via Prisma. Reference `prisma/schema.prisma` for the database schema.

## Code Style

- Use comments sparingly. Only add comments for complex code.

## Key Patterns

- All generated files use `@/` import alias (maps to root `/` of virtual FS)
- Entry point is always `/App.jsx` - AI is instructed to create this first
- Third-party imports resolved via esm.sh CDN
- Missing imports get placeholder modules to prevent preview crashes
- CSS imports are extracted and injected as `<style>` tags in preview
