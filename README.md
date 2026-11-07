# HealthCheckMonitor![npm version](https://img.shields.io/npm/v/health-check-monitor)![build status](https://img.shields.io/github/actions/workflow/status/yourusername/health-check-monitor/nodejs.yml?branch=main)![license](https://img.shields.io/github/license/yourusername/health-check-monitor)

## Overview

HealthCheckMonitor is a lightweight, production‑ready service that continuously checks the health of configurable external services and provides a clean UI and JSON API for consumption. It demonstrates modern HTML, CSS, and JavaScript practices together with a robust Node.js backend.

## Features

- Configurable list of URLs to monitor via `.env`
- Asynchronous health checks with timeout handling
- Structured logging with **Winston**
- Express static file serving for a responsive dashboard
- Comprehensive test suite with **Jest** and **SuperTest**
- Clear separation of concerns (config, utilities, server, UI)

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation