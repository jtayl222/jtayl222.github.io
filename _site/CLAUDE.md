# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based GitHub Pages site containing:
- A Jekyll blog in the `myblog/` directory
- Technical publication drafts in the `publication/` directory  
- Generated site content in `_site/` directories

The site focuses on MLOps engineering content, A/B testing for ML models, and production ML infrastructure.

## Architecture

### Directory Structure
- `myblog/`: Main Jekyll blog site
  - `_config.yml`: Jekyll configuration 
  - `_posts/`: Blog post markdown files
  - `Gemfile`: Ruby gem dependencies
  - `_site/`: Generated static site (ignored in git)
- `publication/`: Draft articles and content being prepared for publication
- `_site/`: Top-level generated content (ignored in git)

### Content Types
- Jekyll blog posts follow naming convention: `YYYY-MM-DD-title.md`
- Publication drafts are versioned (e.g., `PART-1-PROBLEM-SOLUTION-v2.md`)
- Content focuses on MLOps, Kubernetes, A/B testing, and ML infrastructure

## Development Commands

### Jekyll Development
```bash
cd myblog
bundle install              # Install Ruby dependencies
bundle exec jekyll serve    # Start development server
bundle exec jekyll build    # Build static site
```

### Content Management
- Blog posts go in `myblog/_posts/` with proper date prefixes
- Publication drafts go in `publication/` directory
- Generated sites in `_site/` directories are auto-generated, don't edit directly

## Key Configuration

### Jekyll Setup
- Uses Jekyll ~4.4.1 with Minima theme
- Configured in `myblog/_config.yml`
- Includes jekyll-feed plugin for RSS
- Uses Webrick for local development

### Dependencies
- Ruby gems managed via Bundler (see `myblog/Gemfile`)
- No Node.js/npm dependencies detected
- Static site generation only

## Content Guidelines

This repository contains technical content about MLOps and ML infrastructure. When working with content:
- Maintain consistent markdown formatting
- Keep technical accuracy for MLOps concepts
- Follow existing file naming conventions
- Don't modify generated `_site/` content directly