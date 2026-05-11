# TC Collectibles - Phase 2 Implementation Plan
**Date:** May 3, 2026  
**Target Launch:** June 15, 2026  
**Duration:** 6 weeks  
**Status:** Planning Phase

---

## Executive Summary

Phase 2 adds a **premium 3D printing service** to TC Collectibles marketplace, enabling customers to submit designs, receive quotes based on materials/dimensions, manage token-based payments, and track project completion via Meshy AI integration.

### Key Deliverables
- Token wallet system (purchase, track, spend)
- Design request submission form and workflow
- Meshy AI 3D model generation integration
- Dynamic pricing engine (material + complexity)
- Project management and file storage
- Admin tools for job oversight and token administration

### Phase 2 Structure
- **Phase 2.1 (Week 1-2):** Token System
- **Phase 2.2 (Week 2-3):** Design Requests
- **Phase 2.3 (Week 3-4):** Meshy Integration
- **Phase 2.4 (Week 4-5):** Pricing Engine
- **Phase 2.5 (Week 5-6):** File Management

---

## Critical Path Analysis

### Blocking Dependencies
1. ⏳ **Meshy Account Setup** (CRITICAL)
   - Must be done in Week 1
   - Blocks Phase 2.3 (weeks 3-4)
   - Required: API key, webhook configuration

2. ⏳ **Database Schema** (CRITICAL)
   - Required by end of Week 1
   - Blocks all subsequent phases
   - 5 new tables + RLS policies

3. ⏳ **Authentication & RBAC**
   - Existing system from Phase 1
   - Extend to 3D admin role
   - Non-blocking but required for admin features

### Parallel Work Possible
- Phase 2.1 (Token System) can start immediately
- Phase 2.2 (Design Requests) can overlap with 2.1 after db schema
- Phase 2.4 & 2.5 can start after design requests form defined

---

## Week-by-Week Sprint Plan

### Sprint 1: Weeks 1-2 (May 16-29) - Token System Foundation

#### Week 1 Goals
- [ ] Meshy account created and API key secured
- [ ] Database schema implemented (all 5 tables)
- [ ] RLS policies configured
- [ ] Token wallet API routes stubbed

#### Week 1 Tasks

**Database Setup (Day 1-2)**
```
1. Create design_requests table
2. Create 3d_projects table
3. Create user_tokens table (master wallet)
4. Create token_ledger table (transaction log)
5. Create 3d_pricing table
6. Create 3d_jobs table
7. Create indexes on all user_id, status, created_at
8. Set up RLS policies (users can only see own data)
9. Create test data: 5 sample users + tokens
10. Run database integrity tests
```

**Meshy Setup (Day 1-2)**
```
1. Create Meshy account at meshy.ai
2. Generate API key
3. Configure webhook receiver URL (staging)
4. Test API connectivity
5. Document Meshy endpoints and parameters
6. Create Meshy wrapper functions (submit, status, download)
7. Set rate limiting strategy
```

**Token System API (Day 3-5)**
```
1. POST /api/3d/wallet - Create wallet for new user
2. GET /api/3d/wallet - Get balance
3. GET /api/3d/wallet/ledger - Get transaction history
4. POST /api/3d/wallet/add-tokens - Admin operation
5. Internal: deductTokens() function
6. Internal: recordTransaction() function
7. Write unit tests (80% coverage target)
```

#### Week 2 Goals
- [ ] Wallet UI components created
- [ ] Token purchase flow implemented
- [ ] Admin token management page
- [ ] Comprehensive unit tests
- [ ] Integration tests for token operations

#### Week 2 Tasks

**Frontend Components (Day 1-3)**
```
1. TokenBalance component - Display balance
2. TokenLedger component - Transaction history table
3. PurchaseTokensForm component - Buy tokens interface
4. TokenStatus indicator - Balance widget
5. TokenPrice display - Current token cost
6. Refund handler - Cancel transactions
```

**Admin Interface (Day 3-4)**
```
1. /admin/3d/tokens page
2. User token lookup
3. Add tokens to user account
4. View token ledger across all users
5. Token usage analytics
6. Export reports (CSV)
```

**Testing & QA (Day 5)**
```
1. Integration tests: purchase → balance update → ledger
2. Edge cases: insufficient tokens, negative balance
3. Concurrency tests: simultaneous transactions
4. Performance tests: 1000+ user lookups
5. Security: RLS policy verification
```

**Deliverables After Sprint 1**
- Working token wallet system
- All tokens routes tested
- Admin tools operational
- Database ready for next phases

---

### Sprint 2: Weeks 2-3 (May 30-Jun 12) - Design Requests

#### Week 2-3 Overlapping Goals
- Design request form UI
- Request submission API
- Admin approval workflow
- Initial quote calculation

#### Week 2-3 Tasks

**Design Request Form (Day 1-3)**
```
1. DesignRequestForm component
   - Text field: title
   - Textarea: description
   - Multi-image upload (JPG, PNG, GIF, ZIP)
   - Material dropdown
   - Dimension inputs (L x W x H)
   - Budget display (estimated tokens)
   - Submit button
   
2. File upload handler
   - Validate file types
   - Check file sizes (max 100MB)
   - Show upload progress
   - Display preview thumbnails
   - Error messages
   
3. Form validation
   - Required field checks
   - File type validation
   - Image count limits (max 10)
   - Dimension sanity checks
```

**Request API Routes (Day 2-5)**
```
1. POST /api/3d/design-request - Submit request
2. GET /api/3d/design-request - List user's requests
3. GET /api/3d/design-request/:id - Get details
4. PATCH /api/3d/design-request/:id - Update request
5. POST /api/3d/design-request/:id/cancel - Cancel

Features:
- Store reference images to Supabase
- Calculate initial quote
- Create project record
- Send confirmation email
- Queue for admin review
```

**Admin Approval Workflow (Day 3-5)**
```
1. /admin/3d/requests page
   - List pending requests
   - Filter by status, date, user
   - Sorting options
   
2. Request detail view
   - Display reference images
   - Show calculated quote
   - Comment/feedback field
   
3. Actions:
   - Approve → deduct tokens, create job
   - Reject → provide reason, refund tokens
   - Request clarification → email user
```

**Initial Quote System (Day 1-2)**
```
1. Create base pricing rules:
   - Resin: ฿50 + ฿5/gram + ฿10/hour
   - Plastic: ฿30 + ฿3/gram + ฿8/hour
   - Metal: ฿100 + ฿15/gram + ฿20/hour
   
2. Implement calculateQuote():
   - Estimate weight from dimensions
   - Estimate processing time (base + AI)
   - Apply material costs
   - Apply 20% markup
   - Round to token increments
   
3. Display quote:
   - Material cost breakdown
   - Token requirement
   - Estimated timeline
   - Refund policy
```

**Testing (Day 4-5)**
```
1. Form submission end-to-end
2. File upload with various formats
3. Quote calculation accuracy
4. Email delivery
5. Admin approval workflow
6. Token deduction on acceptance
```

**Deliverables After Sprint 2**
- Functional design request form
- Request submission and tracking
- Admin approval system
- Working quote calculation
- Email notifications

---

### Sprint 3: Weeks 3-4 (Jun 13-26) - Meshy Integration

#### Sprint 3 Goals
- Meshy API integration complete
- Job submission working
- Webhook processing functional
- Job status tracking

#### Sprint 3 Tasks

**Meshy API Wrapper (Day 1-2)**
```
1. submitToMeshy(projectId, referenceImages, parameters)
   - Upload images to Meshy
   - Set model type and quality
   - Receive job_id
   - Store job_id in 3d_jobs table
   - Configure webhook URL
   
2. getMeshyStatus(meshyJobId)
   - Poll job status
   - Return progress (0-100)
   - Check for completion
   
3. downloadMeshyOutput(meshyJobId)
   - Download generated STL/OBJ
   - Store in Supabase bucket
   - Update project with file URL
   
4. Error handling
   - API rate limiting
   - Timeout handling
   - Retry logic (exponential backoff)
   - Logging all requests/responses
```

**Webhook Receiver (Day 2-3)**
```
1. POST /api/3d/webhook/meshy
   - Authenticate Meshy webhook
   - Parse job completion event
   - Update 3d_jobs table status
   - Download output file
   - Create file record
   - Send user notification
   
2. Webhook security
   - Verify Meshy signature
   - Validate job_id ownership
   - Idempotent processing
   - Error recovery
```

**Job Status Tracking (Day 3-4)**
```
1. GET /api/3d/process/:jobId/status
   - Return current status
   - Progress percentage
   - Error messages if failed
   
2. Job statuses:
   - queued → waiting in Meshy queue
   - processing → Meshy working
   - completed → ready for download
   - failed → error occurred
   
3. Status UI
   - Progress bar component
   - Status badge
   - Error display
   - Retry button
```

**Error Handling & Retries (Day 4-5)**
```
1. Transient errors (rate limit, timeout)
   - Exponential backoff: 1s, 2s, 4s, 8s
   - Max 3 retries
   - Log all attempts
   
2. Permanent errors (invalid params, auth failure)
   - Mark job as failed
   - Notify user with reason
   - Offer token refund
   
3. Webhook failures
   - Retry webhook delivery
   - Admin notification if repeated failures
   - Manual recovery option
```

**Testing (Day 5)**
```
1. Happy path: submit → process → complete → download
2. Webhook delivery and processing
3. Error scenarios and retries
4. Large file downloads
5. Concurrent job submissions
6. Rate limiting behavior
```

**Deliverables After Sprint 3**
- Meshy integration complete
- Job submission working end-to-end
- Webhook receiver functional
- File storage configured
- Error handling robust

---

### Sprint 4: Weeks 4-5 (Jun 27-Jul 10) - Pricing & Admin Tools

#### Sprint 4 Goals
- Dynamic pricing engine
- Admin pricing configuration
- Cost analytics
- Profitability tracking

#### Sprint 4 Tasks

**Pricing Engine (Day 1-3)**
```
1. Database pricing table
   - Material types and base costs
   - Per-gram costs
   - Per-hour processing costs
   - Markup percentage
   - Min/max boundaries
   
2. Quote calculation (enhanced)
   - Load pricing from database
   - Estimate weight/volume
   - Estimate processing time
   - Apply all cost factors
   - Round to token increments
   - Consider min/max limits
   
3. Token conversion
   - Dynamic token price (e.g., ฿10 per token)
   - Calculate tokens needed
   - Display cost breakdown to user
```

**Admin Pricing Interface (Day 2-4)**
```
1. /admin/3d/pricing page
   - Pricing table view
   - Edit material costs
   - Update markup percentage
   - View cost trends
   
2. Features:
   - Inline editing
   - Version history
   - Compare to previous prices
   - Test quote calculator
   
3. Controls:
   - Activate/deactivate materials
   - Set min/max quotes
   - Seasonal adjustments
```

**Analytics & Reporting (Day 4-5)**
```
1. Cost analytics
   - Average cost by material
   - Cost per project
   - Margin percentage
   
2. Job analytics
   - Jobs per day/week/month
   - Average processing time
   - Success rate
   - Failed job reasons
   
3. Reports
   - Daily summary
   - Monthly profitability
   - Customer segmentation
   - Export to CSV
```

**Testing (Day 5)**
```
1. Quote calculation with various inputs
2. Token conversion accuracy
3. Pricing updates apply correctly
4. Analytics calculations
5. Admin form validation
6. Permission checks (admin only)
```

**Deliverables After Sprint 4**
- Dynamic pricing fully functional
- Admin tools for price management
- Analytics dashboard
- Cost tracking accurate

---

### Sprint 5: Weeks 5-6 (Jul 11-24) - File Management & Finalization

#### Sprint 5 Goals
- File storage and management
- Project page UI
- Download functionality
- Testing and bug fixes

#### Sprint 5 Tasks

**File Management API (Day 1-2)**
```
1. Supabase Storage setup
   - Create bucket: 3d-input-files (private)
   - Create bucket: 3d-output-files (private)
   - Set up RLS policies
   - Configure retention (30 days)
   
2. File API routes
   - POST /api/3d/projects/:id/upload
   - GET /api/3d/projects/:id/files
   - GET /api/3d/projects/:id/download/:fileId
   - DELETE /api/3d/projects/:id/files/:fileId
   
3. File operations
   - Upload with progress tracking
   - Generate signed download URLs
   - Handle large files (>100MB)
   - Track file access in database
```

**Project Management UI (Day 2-4)**
```
1. /3d-service/projects page
   - List user's projects
   - Filter by status
   - Sort by date, material, cost
   - Project summary card
   
2. Project detail page
   - Project metadata
   - Reference images
   - Generated model preview
   - File downloads
   - Status timeline
   
3. Components:
   - ProjectCard
   - ProjectStatus
   - FileList
   - DownloadButton
   - TimelineView
```

**File Download & Storage (Day 3-5)**
```
1. Download functionality
   - Generate signed URL
   - Track downloads in database
   - Archive old files after 30 days
   - Allow re-download (optional cost)
   
2. Storage organization
   - User folder structure
   - Project subfolders
   - File naming convention
   - Metadata storage
   
3. Quality controls
   - File validation on download
   - Checksum verification
   - Corruption detection
   - Retry on failure
```

**Final Testing & QA (Day 4-5)**
```
1. Complete user journey tests
2. Performance under load
3. Security: RLS verification
4. Cross-browser compatibility
5. Mobile responsiveness
6. Error scenarios
7. Edge cases (large files, concurrent ops)
```

**Deliverables After Sprint 5**
- File storage fully operational
- Project management pages complete
- Download system working
- Storage optimized
- All features tested

---

## Database Schema Implementation Order

### Week 1: Critical Tables
```sql
1. user_tokens          -- Master wallet
2. token_ledger         -- Transaction log
3. 3d_pricing           -- Cost configuration
4. design_requests      -- Customer requests
5. 3d_projects          -- Project metadata
```

### Week 2: Supporting Tables
```sql
1. 3d_jobs              -- Job tracking
2. 3d_files             -- File metadata
```

### Week 1-2: RLS Policies
```
- user_tokens: users can only view own
- token_ledger: users can only view own
- design_requests: users can only view own
- 3d_projects: users can only view own
- 3d_jobs: users can only view own
- 3d_files: users can only view own
- 3d_pricing: public read, admin write
```

---

## File Structure & Setup

### New Directories to Create
```
app/
├── (app)/3d-service/
│   ├── page.tsx                  # Service hub
│   ├── design-request/
│   │   └── page.tsx              # Request form
│   ├── projects/
│   │   ├── page.tsx              # Projects list
│   │   └── [projectId]/
│   │       └── page.tsx          # Project detail
│   └── wallet/
│       └── page.tsx              # Token wallet

├── admin/3d/
│   ├── page.tsx                  # Admin dashboard
│   ├── jobs/
│   │   └── page.tsx              # Job management
│   ├── tokens/
│   │   └── page.tsx              # Token admin
│   └── pricing/
│       └── page.tsx              # Pricing config

└── api/3d/
    ├── design-request/
    │   └── route.ts              # Design requests CRUD
    ├── projects/
    │   └── route.ts              # Projects CRUD
    ├── wallet/
    │   └── route.ts              # Wallet operations
    ├── process/
    │   └── route.ts              # Meshy submission
    ├── quote/
    │   └── route.ts              # Quote calculation
    ├── pricing/
    │   └── route.ts              # Pricing management
    └── webhook/
        └── meshy/
            └── route.ts          # Meshy webhook

components/3d/
├── DesignRequestForm.tsx
├── ProjectCard.tsx
├── TokenBalance.tsx
├── TokenLedger.tsx
├── PricingCalculator.tsx
├── JobProgressBar.tsx
├── FileUploader.tsx
├── AdminPricingTable.tsx
└── AdminTokenManager.tsx

lib/3d/
├── meshy.ts                      # Meshy API wrapper
├── pricing.ts                    # Pricing calculations
├── tokens.ts                     # Token operations
├── quotes.ts                     # Quote logic
└── validation.ts                 # Form validation
```

---

## Key Implementation Files

### Phase 2.1 (Token System)
1. Database: migration script with 3 tables + RLS
2. API: `/api/3d/wallet/route.ts`
3. Components: `TokenBalance.tsx`, `TokenLedger.tsx`
4. Lib: `lib/3d/tokens.ts`

### Phase 2.2 (Design Requests)
1. Database: migration script with 2 tables
2. API: `/api/3d/design-request/route.ts`
3. Components: `DesignRequestForm.tsx`
4. Pages: `/app/(app)/3d-service/design-request/page.tsx`

### Phase 2.3 (Meshy Integration)
1. Lib: `lib/3d/meshy.ts` (Meshy wrapper)
2. API: `/api/3d/process/route.ts`, `/api/3d/webhook/meshy/route.ts`
3. Database: migration for 3d_jobs table

### Phase 2.4 (Pricing)
1. Database: migration for 3d_pricing table
2. API: `/api/3d/pricing/route.ts`, `/api/3d/quote/route.ts`
3. Lib: `lib/3d/pricing.ts`, `lib/3d/quotes.ts`
4. Components: `PricingCalculator.tsx`

### Phase 2.5 (File Management)
1. API: `/api/3d/projects/route.ts` (file operations)
2. Components: `FileUploader.tsx`, `ProjectCard.tsx`
3. Pages: `/app/(app)/3d-service/projects/page.tsx`

---

## Testing Strategy

### Unit Tests (Per Sprint)
- Token calculations
- Quote generation
- File validation
- Permission checks
- Error handling

### Integration Tests (Weeks 5-6)
- Complete design request → project → processing → download
- Token purchase → wallet update → ledger
- File upload → storage → download
- Permission and RLS verification

### Performance Tests (Week 6)
- Quote calculation: < 500ms
- File upload: < 30s (100MB)
- Job status check: < 200ms
- Token ledger lookup: < 100ms

### Security Tests (Week 6)
- RLS policies block unauthorized access
- Meshy API key never exposed
- File access only by owner
- Admin operations require role

---

## Success Criteria for Phase 2 Launch

### Functionality ✓
- [ ] All 5 components complete (2.1-2.5)
- [ ] All API routes tested
- [ ] Meshy integration working
- [ ] Token system consistent
- [ ] File storage operational
- [ ] Admin tools functional

### Quality ✓
- [ ] Unit test coverage > 80%
- [ ] Integration tests passing
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] Error handling robust
- [ ] Logging comprehensive

### Security ✓
- [ ] RLS policies correct
- [ ] API authentication required
- [ ] File access restricted
- [ ] Meshy key secured
- [ ] Input validation complete
- [ ] CSRF protection enabled

### Documentation ✓
- [ ] API endpoint documentation
- [ ] Database schema documented
- [ ] Admin user guide
- [ ] Customer-facing FAQ
- [ ] Troubleshooting guide
- [ ] Code comments clear

### Team Readiness ✓
- [ ] Team trained on new features
- [ ] Admin tools documented
- [ ] Support scripts prepared
- [ ] Monitoring configured
- [ ] Rollback plan ready

---

## Risk Assessment & Mitigation

### High Risk: Meshy API Integration
- **Risk:** API changes, downtime, quota limits
- **Mitigation:** 
  - Wrapper functions provide abstraction
  - Error handling with retries
  - Fallback to manual processing
  - Monitor Meshy status page

### Medium Risk: Token System Consistency
- **Risk:** Double-spending, balance discrepancies
- **Mitigation:**
  - Ledger-based (immutable transactions)
  - Database constraints
  - Regular audit queries
  - Admin recovery tools

### Medium Risk: File Storage Limits
- **Risk:** Quota exceeded, storage costs
- **Mitigation:**
  - 100MB file size limit
  - 30-day retention policy
  - Archive to cold storage
  - Monitoring and alerts

### Low Risk: Performance
- **Risk:** Slow quote calculation, file downloads
- **Mitigation:**
  - Optimize database queries
  - Add caching for pricing
  - CDN for file delivery
  - Load testing before launch

---

## Next Steps (Immediate Actions)

### Before Sprint 1 Start (May 9-15)
- [ ] Notify team of Phase 2 kickoff
- [ ] Verify Meshy account requirements
- [ ] Set up staging environment
- [ ] Create GitHub project board
- [ ] Schedule daily standups
- [ ] Prepare database migration tools

### Sprint 1 Day 1 (May 16)
- [ ] Create Meshy account
- [ ] Generate API key
- [ ] Run database schema migrations
- [ ] Create test user accounts
- [ ] Start token system API implementation

---

## Timeline Summary

| Week | Component | Status | Blockers |
|------|-----------|--------|----------|
| 1-2 | Token System | In Progress | Meshy setup |
| 2-3 | Design Requests | Scheduled | DB schema |
| 3-4 | Meshy Integration | Scheduled | Token system |
| 4-5 | Pricing Engine | Scheduled | Requests |
| 5-6 | File Management | Scheduled | Projects |
| 6+ | Testing/QA | Scheduled | All above |

---

**Document Owner:** TechCraftLab  
**Last Updated:** May 3, 2026  
**Status:** Ready for Execution  
**Approval Required:** Team Lead, Product Owner
