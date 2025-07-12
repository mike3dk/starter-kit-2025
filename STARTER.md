# STARTER KIT 2025

## Description

This comprehensive full‑stack starter kit is built for rapid development of modern web applications in 2025. It combines the power of Next.js 15 with React 19 for the frontend, FastAPI with Python for the backend, and PostgreSQL for data persistence.

Out of the box, it includes a solid foundation with authentication, internationalization (i18n), testing, and deployment infrastructure fully configured.

The architecture follows a hybrid approach: Next.js handles the primary web application, server‑side rendering, and API routes, while FastAPI serves as a dedicated backend for complex business logic and background job processing (powered by RQ). This design offers flexibility to support everything from simple MVPs to complex enterprise applications.

Built with developer experience in mind, the kit features modern tooling, a complete testing setup, and production‑ready containerization. It’s crafted to help startup teams go from idea to deployment quickly — without compromising code quality or scalability.

## Features

### 🔐 Authentication & Authorization

- **Complete auth system** using [Better Auth](https://www.better-auth.com/) with email/password and [GitHub OAuth](https://docs.github.com/en/apps/oauth-apps)
- **Email verification** with automated email sending via [Nodemailer](https://nodemailer.com/)
- **Password reset** flow with secure token-based verification
- **Role-based access control** with user/admin roles
- **Session management** with configurable expiration and cookie caching
- **Admin dashboard** with user management and impersonation capabilities
- **Protected routes** with middleware-based authentication

### 🌐 Internationalization (i18n)

- **Multi-language support** with English and Korean translations
- **Dynamic language switching** with persistent user preferences
- **Server-side and client-side** translation support via [next-intl](https://next-intl-docs.vercel.app/)
- **Extensible translation system** for easy addition of new languages

### 🎨 Modern UI/UX

- **Responsive design** built with [Tailwind CSS 4](https://tailwindcss.com/)
- **Component library** using [Radix UI](https://www.radix-ui.com/) primitives
- **Dark/light theme** support with [next-themes](https://github.com/pacocoursey/next-themes)
- **Form handling** with [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) validation
- **Toast notifications** using [Sonner](https://sonner.emilkowal.ski/)
- **Loading states** and error handling throughout the app

### 🗄️ Database & Backend

- **PostgreSQL** database with [Prisma ORM](https://www.prisma.io/)
- **Dual database clients** - JavaScript (Next.js) and Python ([FastAPI](https://fastapi.tiangolo.com/))
- **Database migrations** managed by [Alembic](https://alembic.sqlalchemy.org/)
- **FastAPI backend** for API endpoints and background processing
- **Background jobs** using [RQ (Redis Queue)](https://python-rq.org/) with scheduler support
- **Database connection pooling** and optimization

### 🧪 Testing & Quality

- **End-to-end testing** with [Playwright](https://playwright.dev/)
- **Authentication flow testing** with dedicated test utilities
- **CI/CD pipeline** configured for [GitLab](https://gitlab.com/) with automated testing
- **Code formatting** with [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/)
- **Type safety** with [TypeScript](https://www.typescriptlang.org/) throughout
- **Python code quality** with [Ruff](https://docs.astral.sh/ruff/) linting

### 🚀 Development & Deployment

- **Docker containerization** with multi-stage builds for both [Next.js](https://nextjs.org/) and Python
- **Docker Compose** setup for local development
- **Production-ready** configuration with security headers and CSP
- **Environment-based** configuration for different deployment stages
- **Hot reload** development with [Turbopack](https://turbo.build/pack) support
- **Standalone Next.js** build for optimized production deployment

### 📊 Monitoring & Analytics

- **Plausible Analytics** integration for privacy-focused tracking
- **Microsoft Clarity** for user behavior insights
- **Error tracking** and logging throughout the application
- **Performance monitoring** with Next.js built-in analytics

### 🔧 Developer Experience

- **Modern tooling** with latest versions of all dependencies
- **Comprehensive scripts** for development, testing, and deployment
- **Type-safe APIs** with full TypeScript support
- **Hot module replacement** for rapid development
- **Extensible architecture** for easy feature additions
- **Well-documented** codebase with clear project structure

### 🔒 Security

- **Content Security Policy** configured for production
- **CSRF protection** with secure session handling
- **Input validation** using Zod schemas
- **SQL injection prevention** through Prisma ORM
- **Secure password hashing** handled by Better Auth
- **Rate limiting** and security headers configured
