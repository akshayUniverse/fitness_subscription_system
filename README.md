# Fitness Subscription Management System

A Next.js App Router application for managing fitness subscriptions, plans, coupons, transactions, and billing history.

## Stack

- Next.js 16 App Router
- React 19
- Clerk Authentication
- MongoDB with Mongoose
- TailwindCSS v4
- Shadcn UI primitives

## Core Features

- Public landing page with hero, plan/feature summaries, and About page
- Clerk sign-in and sign-up routes
- Role-based post-auth redirect through `/redirect`
- User dashboard with subscription overview and payment progress
- Billing history for member transactions
- Admin dashboard analytics
- Admin plan CRUD
- Admin coupon CRUD
- Admin subscription oversight
- Admin transaction management
- Subscription creation with coupon support
- Full and partial payment tracking

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env.local
```

3. Fill in MongoDB and Clerk credentials in `.env.local`.

4. Run the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Required Environment Variables

- `MONGODB_URI`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `CLERK_WEBHOOK_SECRET`

## Important Routes

- `/` - landing page
- `/about` - about page
- `/sign-in` - Clerk sign in
- `/sign-up` - Clerk sign up
- `/redirect` - role-based redirect
- `/dashboard` - user dashboard
- `/billing` - billing history
- `/admin/dashboard` - admin dashboard
- `/admin/plans` - plan manager
- `/admin/coupons` - coupon manager
- `/admin/transactions` - transaction management
- `/admin/subscriptions` - subscription oversight

## API Routes

- `GET /api/plan`
- `POST /api/plan`
- `PUT /api/plan/:id`
- `DELETE /api/plan/:id`
- `GET /api/coupon`
- `POST /api/coupon`
- `PUT /api/coupon/:id`
- `DELETE /api/coupon/:id`
- `POST /api/subscription`
- `GET /api/subscription`
- `GET /api/subscription/:id`
- `POST /api/transaction`
- `GET /api/transaction`
- `GET /api/admin/subscriptions`
- `GET /api/analytics/summary`
- `GET /api/analytics/transactions`
- `GET /api/analytics/revenue`
- `GET /api/analytics/subscriptions`
- `GET /api/analytics/plans`

## Deployment Checklist

- Add all variables from `.env.example` to the deployment provider.
- Configure Clerk allowed redirect URLs for `/sign-in`, `/sign-up`, and `/redirect`.
- Configure the Clerk webhook endpoint at `/api/webhooks/clerk`.
- Ensure MongoDB network access allows the deployment host.
- Run `npm run build` before submission or deployment.
