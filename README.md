# RGI Training & Placement (T&P) Portal

A comprehensive **Full-Stack Training & Placement Management System** built with modern web technologies. The platform connects students, alumni, recruiters, and administrators in a seamless ecosystem for managing placement drives, job applications, referrals, and feedback.

**Live Demo:** https://ankit-dev.me 
**Repository:** https://github.com/Ankit-Kumar-108/rgi-tnp

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Current Features](#-current-features)
- [🎯 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [📦 Key Modules](#-key-modules)
- [🗄️ Database Schema](#️-database-schema)
- [📡 API Endpoints](#-api-endpoints)
- [🔮 Future Features & Roadmap](#-future-features--roadmap)
- [🚢 Deployment](#-deployment)
- [📝 Contributing](#-contributing)
- [📄 License](#-license)

---

## Overview

The **RGI T&P Portal** is designed to modernize the placement process for institutions like RGI. It provides:

- **For Students:** Dashboard to view drives, apply for positions, manage applications, upload memories
- **For Alumni:** Referral system, profile management, feedback submission
- **For Recruiters:** Drive creation, application screening, feedback
- **For Administrators:** Complete queue management, email verification, approvals workflow

The platform combines **security, usability, and scalability** with a professional UI and real-time feedback mechanisms.

---

## ✨ Current Features

### 🎓 **Student Portal**
- ✅ User authentication with email verification
- ✅ Personal dashboard with placement statistics
- ✅ Browse and apply for active placement drives
- ✅ Application tracking and history
- ✅ Profile management (resume, LinkedIn, GitHub links)
- ✅ Memory gallery contribution
- ✅ Feedback submission with star ratings
- ✅ Password reset functionality
- ✅ Responsive mobile-friendly design

### 👔 **Alumni Portal**
- ✅ Dedicated alumni dashboard
- ✅ Alumni network & referral system
- ✅ Profile management with job history
- ✅ Memory gallery access
- ✅ Alumni feedback on syllabus relevance
- ✅ Account verification workflow
- ✅ Professional profile showcase

### 🏢 **Recruiter Portal**
- ✅ Create and manage placement drives
- ✅ View and screened external student applications
- ✅ Application review and processing
- ✅ Corporate feedback submission
- ✅ Placement statistics dashboard
- ✅ Real-time notifications

### 👨‍💼 **External Student Registration**
- ✅ Self-registration for non-RGI students
- ✅ Email verification
- ✅ Application to active drives
- ✅ Profile management
- ✅ Password recovery

### ⚙️ **Admin Dashboard**
- ✅ **Approval Queue System:**
  - Drive approvals/rejections
  - Student feedback review
  - Alumni feedback verification
  - External student screening
  - Memory content moderation
- ✅ Unverified email management
- ✅ Referral tracking
- ✅ User statistics and analytics
- ✅ Batch management
- ✅ Master data configuration

### 🔧 **General Features**
- ✅ Email verification with Gmail OAuth2
- ✅ Password reset with secure tokens
- ✅ Toast notifications (Sonner library)
- ✅ Professional error handling
- ✅ Responsive UI with Tailwind CSS
- ✅ Dark/Light theme support
- ✅ Multiple authentication roles
- ✅ Session-based JWT authentication
- ✅ Cloudflare R2 file storage for images/resumes
- ✅ SQLite database with Prisma ORM
- ✅ Professional dashboard components

---

## 🎯 Tech Stack

### **Frontend**
- **Framework:** Next.js 15.5.2 (React 19)
- **Styling:** Tailwind CSS 4.2 + CSS Animations
- **UI Components:** Radix UI, shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Notifications:** Sonner (Toast)
- **Theme:** next-themes for Dark/Light mode
- **Animations:** Motion (Framer Motion alternative)
- **Form Validation:** Zod
- **Utility:** clsx, tailwind-merge

### **Backend**
- **Runtime:** Node.js 20
- **Framework:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT (jsonwebtoken), Jose
- **Password Hashing:** bcryptjs
- **Email Service:** Gmail API + OAuth2
- **Cloud Storage:** Cloudflare R2 (AWS S3 compatible)
- **Validation:** Zod schemas

### **Infrastructure & Deployment**
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2
- **Deployment:** Vercel (with Cloudflare Workers)
- **Version Control:** Git + GitHub

### **Development Tools**
- **Language:** TypeScript
- **Linting:** ESLint
- **Build Tool:** Next.js built-in compiler
- **Package Manager:** npm

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- Git
- Cloudflare Account (for D1, R2, Email)
- Gmail Account with OAuth2 credentials
- Code editor (VSCode recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankit-Kumar-108/rgi-tnp.git
   cd rgi-tnp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with:
   ```env
   # Database
   DATABASE_URL=file:./dev.db

   # Cloudflare Configuration
   R2_BUCKET_NAME=your-bucket-name
   R2_ACCOUNT_ID=your-account-id
   R2_PUBLIC_URL=https://your-public-url.r2.dev
   R2_END_POINT=https://your-account-id.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key

   # JWT & Security
   JWT_SECRET=your-super-secret-jwt-key

   # Email (Gmail OAuth2)
   GMAIL_USER=your-gmail@gmail.com
   GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GMAIL_CLIENT_SECRET=your-client-secret
   GMAIL_REFRESH_TOKEN=your-refresh-token

   # Email From
   EMAIL_FROM=noreply@yourdomain.com
   ```

4. **Run database migrations**
   ```bash
   npm run db:generate
   npm run db:migrate:local  # For local dev
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Database operations
npm run db:generate          # Generate Prisma client
npm run db:migrate:local     # Local migrations
npm run db:migrate:remote    # Remote D1 migrations

# Cloudflare Pages build
npm run pages:build
```

---

## 📁 Project Structure

```
rgi-tnp/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (marketing)/              # Public marketing pages
│   │   │   ├── about/
│   │   │   │   ├── rgi/
│   │   │   │   └── training-placement/
│   │   │   ├── activities/
│   │   │   │   ├── achievements/
│   │   │   │   ├── certificates/
│   │   │   │   └── mou/
│   │   │   ├── feedbacks/
│   │   │   ├── memories/
│   │   │   ├── open-drives/
│   │   │   └── page.tsx
│   │   │
│   │   ├── (portal)/                 # Protected routes
│   │   │   ├── admin/                # Admin dashboard
│   │   │   │   ├── dashboard/
│   │   │   │   ├── approvals/
│   │   │   │   ├── drives/
│   │   │   │   ├── master-data/
│   │   │   │   ├── notifications/
│   │   │   │   └── users/
│   │   │   ├── alumni/               # Alumni portal
│   │   │   │   ├── dashboard/
│   │   │   │   ├── alumni-network/
│   │   │   │   ├── alumni-register/
│   │   │   │   ├── feedback/
│   │   │   │   └── login/
│   │   │   ├── students/             # Student dashboard
│   │   │   │   ├── dashboard/
│   │   │   │   ├── external-dashboard/
│   │   │   │   ├── feedback/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── recruiters/           # Recruiter portal
│   │   │   │   ├── dashboard/
│   │   │   │   ├── feedback/
│   │   │   │   ├── login/
│   │   │   │   ├── Placement-Stats/
│   │   │   │   └── register/
│   │   │   ├── external-students/   # External student portal
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                      # API routes
│   │   │   ├── admin/                # Admin APIs
│   │   │   │   ├── approvals/
│   │   │   │   ├── drives/
│   │   │   │   ├── login/
│   │   │   │   ├── master-data/
│   │   │   │   ├── stats/
│   │   │   │   └── users/
│   │   │   ├── alumni/               # Alumni APIs
│   │   │   │   ├── dashboard/
│   │   │   │   ├── feedback/
│   │   │   │   ├── login/
│   │   │   │   └── profile/
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── reset-password/
│   │   │   │   └── verify-email/
│   │   │   ├── external/             # External student APIs
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── dashboard/
│   │   │   ├── feedback/             # Feedback APIs
│   │   │   ├── memories/             # Memory APIs
│   │   │   ├── recruiter/            # Recruiter APIs
│   │   │   ├── student/              # Student APIs
│   │   │   └── upload/               # File upload (R2)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/                   # React components
│   │   ├── forms/
│   │   │   └── studentApplyModal/
│   │   ├── layout/
│   │   │   ├── footer/
│   │   │   └── nav/
│   │   └── ui/
│   │       └── animated-theme-toggler.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useAuth.ts
│   │
│   ├── lib/                          # Utility functions
│   │   ├── auth-api.ts               # Auth API calls
│   │   ├── auth-client.ts            # Client auth logic
│   │   ├── auth-utils.ts             # Auth utilities
│   │   ├── db.ts                     # Database connection
│   │   ├── email-templates.ts        # Email HTML templates
│   │   ├── r2.ts                     # Cloudflare R2 config
│   │   ├── send-email.ts             # Email sending
│   │   ├── upload-r2.ts              # R2 upload handler
│   │   ├── utils.ts                  # General utilities
│   │   └── validations/              # Zod schemas
│   │       ├── alumni.ts
│   │       ├── external-student.ts
│   │       ├── recruiter.ts
│   │       └── student.ts
│   │
│   └── types/
│       └── index.ts                  # TypeScript types
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Migration history
│
├── public/                           # Static assets
│   ├── images/
│   └── logo/
│
├── components.json                   # shadcn/ui config
├── eslint.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── wrangler.toml                    # Cloudflare config
├── next.config.ts
├── postcss.config.mjs
└── README.md                        # This file
```

---

## 🔐 Authentication & Authorization

The system uses **JWT-based authentication** with role-based authorization:

### Roles
1. **Student** - Can apply to drives, manage profile, submit feedback
2. **Alumni** - Can refer candidates, manage profile, submit feedback
3. **Admin** - Full access to approvals, user management, statistics
4. **Recruiter** - Can create drives, screen applications
5. **External Student** - Can apply to drives (non-RGI)

### Auth Flow
```
User Login → Credential Validation → Token Generation (JWT)
    ↓
Store Token (SessionStorage/Cookies)
    ↓
Include in Protected Route Requests
    ↓
Verify Token + Role Authorization
```

### Email Verification
- Gmail OAuth2 integration for secure email delivery
- Automated verification emails on registration
- Token-based password reset
- Error tracking for unverified accounts

---

## 📦 Key Modules

### 1. **Placement Drives Management**
- Create/Edit/Delete drives (Admin & Recruiter)
- Student applications
- Application tracking
- Drive statistics

### 2. **User Management**
- Student registration & verification
- Alumni profile management
- Recruiter onboarding
- External student registration
- Admin queue processing

### 3. **Feedback System**
- Student feedback on syllabus relevance
- Alumni feedback on institutional preparedness
- Corporate feedback on student quality
- Rating system (1-5 stars)
- Professional card UI with toast notifications

### 4. **Referral System**
- Alumni can refer candidates
- Referral tracking
- Referral statistics
- Professional referral cards

### 5. **Memory Gallery**
- Upload placement memories (photos/videos)
- Cloudflare R2 storage
- Image optimization
- Admin moderation queue
- Filter by uploader and date

### 6. **File Upload System**
- Resume upload (Students)
- Profile images
- Memory media
- Presigned URLs via Cloudflare R2
- Type validation

### 7. **Admin Queue System**
- Drive approvals
- Feedback review
- Student verification
- External student screening
- Memory moderation
- Bulk actions support

---

## 🗄️ Database Schema

### Core Models
- **Student** - RGI enrolled students
- **Alumni** - RGI alumni network
- **ExternalStudent** - Non-RGI student applicants
- **Admin** - System administrators
- **Recruiter** - Corporate recruiters

### Placement Models
- **PlacementDrive** - Job drives/openings
- **DriveRegistration** - Student applications
- **ExternalScreening** - External student review

### Feedback Models
- **StudentFeedback** - Syllabus feedback
- **AlumniFeedback** - Alumni feedback
- **CorporateFeedback** - Recruiter feedback

### Additional Models
- **Memory** - Photo gallery
- **Referral** - Alumni referrals
- **EmailFailureTracking** - Failed email logs

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register/student
POST   /api/auth/register/alumni
POST   /api/auth/register/external-student
POST   /api/auth/login/student
POST   /api/auth/login/alumni
POST   /api/auth/reset-password
GET    /api/auth/verify-email
```

### Student APIs
```
GET    /api/student/dashboard
GET    /api/student/applications
POST   /api/student/feedback
GET    /api/student/profile
```

### Alumni APIs
```
GET    /api/alumni/dashboard
POST   /api/alumni/referral
POST   /api/alumni/feedback
GET    /api/alumni/profile
```

### Admin APIs
```
GET    /api/admin/approvals
POST   /api/admin/approvals (approve/reject)
GET    /api/admin/stats
POST   /api/admin/master-data
```

### Recruiter APIs
```
POST   /api/recruiter/drive (create)
GET    /api/recruiter/applications
POST   /api/recruiter/feedback
```

### File Upload
```
POST   /api/upload/presigned-url (get R2 upload URL)
```

---

## 🔮 Future Features & Roadmap

### Phase 1
- [ ] **Feedback UI card change  (to change on 15/04/2026 [Done])**
 - add notification for password mismatch
 - auto removal of space in name or free name from implementation during registration 
 - UI improvement 
 - take suggetion from teacher
- [ ] **Feedback UI card change  (to change on 18/04/2026 [Under Work])**
 - add isProfileComplete functionality both in frontend and backend

### Phase 2 (Next Quarter)
- [ ] **Advanced Analytics Dashboard**
  - Placement success rate tracking
  - Package distribution charts
  - Skills-based matching
  - Placement trends by branch/course

- [ ] **Email Digest System**
  - Weekly placement updates
  - Application status summaries
  - New drive notifications
  - Monthly reports

- [ ] **Interview Scheduling**
  - Calendar integration
  - Interview slots management
  - Automated reminders
  - Interview feedback forms

- [ ] **Resume Parser & ATS**
  - Automatic skill extraction
  - Resume scoring
  - Keyword matching with job descriptions
  - Resume optimization suggestions

### Phase 3 (Future)
- [ ] **AI-Powered Recommendations**
  - Smart job matching for students
  - Skill gap identification
  - Course suggestions
  - Career path recommendations

- [ ] **Mobile Application**
  - Native iOS & Android apps
  - Push notifications
  - Offline support
  - Mobile-optimized UI

- [ ] **Video Interview Integration**
  - Pre-recorded video interviews
  - Live interview scheduling
  - Interviewer feedback
  - Recording storage

- [ ] **Social Features**
  - Student networking
  - Alumni mentorship matching
  - Discussion forums
  - Post-placement network

- [ ] **Advanced Reporting**
  - Custom report builder
  - Excel/PDF exports
  - Scheduled reports
  - Data visualization

- [ ] **Compliance & Auditing**
  - Activity logs
  - Data export for regulations
  - Compliance reports
  - Security audit trails

- [ ] **Third-party Integrations**
  - LinkedIn API integration
  - GitHub profile sync
  - Slack notifications
  - Google Calendar sync
  - Webhook support for ERP systems

- [ ] **Multi-language Support**
  - Internationalization (i18n)
  - Multiple language interface
  - Locale-specific content

- [ ] **Advanced Search & Filters**
  - Full-text search
  - Complex filtering by multiple criteria
  - Saved searches
  - Search analytics

---

## 🚢 Deployment

### Local Development
```bash
npm run dev
# App runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Cloudflare Pages Deployment
```bash
npm run pages:build
# Deploys to Cloudflare Workers
```

### Environment Configuration
- **Development:** `.env.local`
- **Production:** Set environment variables in Vercel/Cloudflare dashboard

### Database
- **Local:** SQLite file (`dev.db`)
- **Production:** Cloudflare D1 (managed SQLite)

### Deployment Checklist
- [ ] Update environment variables
- [ ] Run migrations on production database
- [ ] Test email service with production credentials
- [ ] Configure R2 bucket for production
- [ ] Set up SSL/TLS certificates
- [ ] Configure domain DNS
- [ ] Enable monitoring and logging
- [ ] Set up backups

---

## 🛠️ Common Issues & Solutions

### Email Not Sending
**Issue:** Gmail authentication fails with "unauthorized_client"
**Solution:** 
1. Regenerate OAuth2 credentials
2. Ensure CLIENT_ID and CLIENT_SECRET match
3. Verify REFRESH_TOKEN hasn't expired (10-day threshold)
4. Check `.env` file formatting (remove unnecessary quotes)

### Database Connection Issues
**Solution:**
1. Verify `DATABASE_URL` is set
2. Run `npm run db:generate` to sync Prisma
3. Check SQLite file permissions

### File Upload Failures
**Solution:**
1. Verify R2 credentials in `.env`
2. Check bucket name and public URL
3. Ensure presigned URL generation works

---

## 📝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Add meaningful comments
- Test changes locally before submitting PR
- Update README for significant changes

---

## 📄 License

This project is proprietary software developed for RGI institution. All rights reserved.

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/Ankit-Kumar-108/rgi-tnp/issues)
- **Email:** ankit.education86@gmail.com
- **Documentation:** Check `/docs` folder for detailed guides

---

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org), [React](https://react.dev), and [TypeScript](https://www.typescriptlang.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)
- Notifications via [Sonner](https://sonner.emilkowal.ski)
- Database with [Prisma](https://www.prisma.io)
- Hosted on [Cloudflare](https://www.cloudflare.com)

---

**Last Updated:** April 12, 2026  
**Version:** 0.1.0 (Beta)
