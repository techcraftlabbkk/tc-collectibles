# TC Collectibles - Phase 2: 3D Printing Service Roadmap

**Status:** In Development  
**Target Launch:** June 15, 2026 (After Phase 1 stabilization)  
**Duration:** 4-6 weeks  
**Phase 1 Prerequisite:** Live marketplace with stable payment system

---

## Overview

Phase 2 adds a premium 3D printing service to complement the PSA marketplace. Customers can submit designs, specify materials/dimensions, get quotes, and manage a token-based wallet system for payments.

### Phase 2 Scope
- **Design Request System** - Customers submit 3D designs or request design creation
- **Meshy AI Integration** - Backend processing for 3D model generation/refinement
- **Token Wallet System** - Prepaid tokens for 3D service payments
- **Pricing Engine** - Calculate costs based on materials, dimensions, time
- **Project Management** - Upload, manage, download 3D files
- **Admin Tools** - Monitor jobs, set token costs, manage quotas

### Phase 2 NOT Included
- Real-time 3D model viewer (Phase 3+)
- Multi-material support (Phase 3+)
- Batch processing (Phase 3+)
- Advanced AI image injection (Phase 3+)

---

## Technical Architecture

### New Components

```
Frontend (Next.js)
├── /app/3d-service/
│   ├── design-request/page.tsx       # Request form
│   ├── projects/page.tsx              # User's projects list
│   ├── [projectId]/page.tsx           # Project details
│   └── wallet/page.tsx                # Token wallet
├── /app/admin/3d/
│   ├── page.tsx                       # 3D admin dashboard
│   ├── jobs/page.tsx                  # Job management
│   ├── tokens/page.tsx                # Token administration
│   └── quotas/page.tsx                # Resource limits

Backend (Next.js API Routes)
├── /app/api/3d/
│   ├── design-request/route.ts        # Create request
│   ├── projects/route.ts              # CRUD projects
│   ├── process/route.ts               # Meshy integration
│   ├── wallet/route.ts                # Token operations
│   ├── quote/route.ts                 # Calculate price
│   └── webhook/meshy/route.ts         # Meshy callbacks

Database (Supabase)
├── Tables:
│   ├── design_requests                # Customer requests
│   ├── 3d_projects                    # Project metadata
│   ├── 3d_files                       # Uploaded/generated files
│   ├── user_tokens                    # Token wallet
│   ├── token_ledger                   # Transaction history
│   ├── 3d_jobs                        # Meshy job tracking
│   └── 3d_pricing                     # Cost configuration

External Services
├── Meshy AI API
│   ├── Webhook for job updates
│   ├── File upload/download
│   └── Model generation/refinement
```

---

## Phase 2 Development Phases

### Phase 2.1: Token System (Week 1-2)
**Goal:** Implement token wallet and ledger system

#### Tasks
1. **Database Schema**
   - [ ] Create `user_tokens` table
     - user_id, balance, last_updated, status
   - [ ] Create `token_ledger` table
     - user_id, transaction_type, amount, reason, timestamp, reference_id
   - [ ] Create indexes on user_id, timestamp
   - [ ] Set up RLS policies (users can only view own data)

2. **Token Wallet API Routes**
   - [ ] `GET /api/3d/wallet` - Get user's token balance
   - [ ] `POST /api/3d/wallet/add-tokens` - Purchase tokens (admin only)
   - [ ] `POST /api/3d/wallet/deduct-tokens` - Internal function
   - [ ] `GET /api/3d/wallet/ledger` - Transaction history

3. **Wallet UI Components**
   - [ ] Display current balance
   - [ ] Show transaction history
   - [ ] Purchase tokens form
   - [ ] Token top-up email confirmation

4. **Admin Tools**
   - [ ] Add tokens to user accounts (admin-only page)
   - [ ] View all user tokens
   - [ ] View transaction ledger
   - [ ] Monitor token usage trends
   - [ ] Export token reports (CSV)

### Phase 2.2: Design Request System (Week 2-3)
**Goal:** Allow customers to submit 3D design requests

#### Tasks
1. **Database Schema**
   - [ ] Create `design_requests` table
     - user_id, title, description, reference_images, status, created_at
   - [ ] Create `3d_projects` table
     - user_id, design_request_id, materials, dimensions, status
   - [ ] Create relationships and indexes

2. **Design Request Form**
   - [ ] Text description field
   - [ ] Multi-image upload (JPG, PNG, WEBP, HEIC, AVIF, GIF, PDF, ZIP, MP4)
   - [ ] Material selection dropdown
   - [ ] Dimension input (length, width, height, weight estimate)
   - [ ] Budget/token estimate display
   - [ ] Form validation
   - [ ] Error handling for large files

3. **API Routes**
   - [ ] `POST /api/3d/design-request` - Submit request
   - [ ] `GET /api/3d/design-request/:id` - Get request details
   - [ ] `GET /api/3d/design-request` - List user's requests
   - [ ] `PATCH /api/3d/design-request/:id` - Update request
   - [ ] `POST /api/3d/design-request/:id/cancel` - Cancel request

4. **Request Processing**
   - [ ] Calculate initial quote (tokens needed)
   - [ ] Send confirmation email
   - [ ] Deduct tokens from wallet on acceptance
   - [ ] Create project record
   - [ ] Queue for Meshy processing

5. **Admin Interface**
   - [ ] View pending design requests
   - [ ] Approve/reject requests
   - [ ] Send quote/feedback to customer
   - [ ] Monitor queue length
   - [ ] Benchmark processing times

### Phase 2.3: Meshy AI Integration (Week 3-4)
**Goal:** Connect to Meshy API for 3D generation/refinement

#### Tasks
1. **Meshy Setup**
   - [ ] Create Meshy account (requires API key)
   - [ ] Document Meshy API endpoints
   - [ ] Understand webhook flow
   - [ ] Test API with sample requests

2. **Integration Functions**
   - [ ] `submitToMeshy()` - Send job to Meshy
     - Upload reference images
     - Set parameters (model type, quality)
     - Receive job_id and webhook_url
   - [ ] `getMeshyStatus()` - Poll job status
   - [ ] `downloadMeshyOutput()` - Get completed model (STL, OBJ)
   - [ ] `handleMeshyWebhook()` - Process job completion

3. **API Routes for Meshy**
   - [ ] `POST /api/3d/process` - Submit to Meshy
   - [ ] `GET /api/3d/process/:jobId/status` - Check job status
   - [ ] `POST /api/3d/webhook/meshy` - Receive job updates
   - [ ] `GET /api/3d/process/:jobId/download` - Download output

4. **Job Tracking**
   - [ ] Create `3d_jobs` table
     - project_id, meshy_job_id, status, progress, error_message, created_at
   - [ ] Update status based on webhook events
   - [ ] Handle retries for failed jobs
   - [ ] Log all requests/responses for debugging

5. **Error Handling**
   - [ ] Invalid image format detection
   - [ ] Meshy API rate limiting
   - [ ] Network timeout handling
   - [ ] Job failure and retry logic
   - [ ] User notification on errors

### Phase 2.4: Pricing Engine (Week 4-5)
**Goal:** Calculate 3D printing costs dynamically

#### Tasks
1. **Database Schema**
   - [ ] Create `3d_pricing` table
     - material_type, base_cost, cost_per_gram, cost_per_hour_processing
     - markup_percentage, min_cost, max_cost, active
   - [ ] Create `3d_quotes` table
     - project_id, material, dimensions, estimated_grams, processing_hours
     - base_cost, markup, total_cost, tokens_required, expires_at

2. **Pricing Calculations**
   - [ ] `calculateQuote(material, dimensions, complexity)`
     - Estimate weight/volume
     - Estimate processing time (Meshy)
     - Apply base costs + markup
     - Round to token increments
   - [ ] `getTokenPrice()` - Cost per token (from admin config)
   - [ ] `quoteToTokens(costInBaht)` - Convert currency to tokens

3. **Pricing API Routes**
   - [ ] `GET /api/3d/quote` - Get real-time quote
   - [ ] `GET /api/3d/pricing` - Get pricing table (public)
   - [ ] `POST /api/3d/pricing` - Update pricing (admin only)

4. **Admin Tools**
   - [ ] Pricing configuration page
   - [ ] Set costs per material
   - [ ] Adjust markup percentage
   - [ ] View cost trends
   - [ ] Profitability analysis

### Phase 2.5: File Management (Week 5-6)
**Goal:** Store and manage 3D files securely

#### Tasks
1. **Database Schema**
   - [ ] Create `3d_files` table
     - project_id, file_type, file_url, file_size, upload_date, status
   - [ ] File types: input_image, reference, generated_model, final_output

2. **File Storage**
   - [ ] Use Supabase Storage buckets
   - [ ] Create `3d-input-files` bucket (private)
   - [ ] Create `3d-output-files` bucket (private)
   - [ ] Set up RLS to allow user access to own files
   - [ ] Auto-expire temporary files after 30 days

3. **File Operations API**
   - [ ] `POST /api/3d/projects/:id/upload` - Upload file
   - [ ] `GET /api/3d/projects/:id/files` - List project files
   - [ ] `GET /api/3d/projects/:id/download/:fileId` - Download file
   - [ ] `DELETE /api/3d/projects/:id/files/:fileId` - Delete file

4. **File Validation**
   - [ ] Check file type (image, STL, OBJ, ZIP, etc.)
   - [ ] Validate file size (max 100MB)
   - [ ] Scan for malware (Phase 3)
   - [ ] Generate thumbnail for preview (Phase 3)

5. **Quality Controls**
   - [ ] Keep generated files for 30 days
   - [ ] Archive to cold storage after 30 days
   - [ ] Allow re-download with token cost
   - [ ] Track downloads for analytics

---

## Database Schema

### design_requests
```sql
CREATE TABLE design_requests (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reference_images JSONB,  -- Array of file URLs
  materials VARCHAR(50),   -- material_type
  estimated_dimensions JSONB,  -- {length, width, height}
  status VARCHAR(20),  -- pending, approved, rejected, completed
  rejection_reason TEXT,
  quote_tokens INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(id),
  INDEX(user_id),
  INDEX(status),
  INDEX(created_at)
);
```

### 3d_projects
```sql
CREATE TABLE 3d_projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users,
  design_request_id BIGINT REFERENCES design_requests,
  material_type VARCHAR(50),
  dimensions JSONB,
  estimated_weight INT,  -- in grams
  meshy_job_id VARCHAR(100),
  status VARCHAR(20),  -- processing, ready, delivered, failed
  tokens_used INT,
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  INDEX(user_id),
  INDEX(status),
  INDEX(meshy_job_id)
);
```

### user_tokens
```sql
CREATE TABLE user_tokens (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID UNIQUE REFERENCES auth.users,
  balance INT NOT NULL DEFAULT 0,
  lifetime_earned INT DEFAULT 0,
  lifetime_spent INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT now(),
  status VARCHAR(20) DEFAULT 'active',
  INDEX(user_id)
);
```

### token_ledger
```sql
CREATE TABLE token_ledger (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users,
  transaction_type VARCHAR(20),  -- purchase, debit, refund, bonus
  amount INT NOT NULL,
  reason TEXT,
  reference_id VARCHAR(100),  -- order_id, project_id, etc
  balance_after INT,
  created_at TIMESTAMP DEFAULT now(),
  INDEX(user_id),
  INDEX(created_at),
  INDEX(reference_id)
);
```

### 3d_pricing
```sql
CREATE TABLE 3d_pricing (
  id BIGINT PRIMARY KEY,
  material_type VARCHAR(50) NOT NULL UNIQUE,
  base_cost_baht DECIMAL(10, 2),
  cost_per_gram_baht DECIMAL(10, 2),
  cost_per_hour_processing_baht DECIMAL(10, 2),
  markup_percentage INT DEFAULT 20,  -- 20% markup
  min_cost_baht DECIMAL(10, 2),
  max_cost_baht DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT now(),
  updated_by UUID  -- Admin user_id
);
```

### 3d_jobs
```sql
CREATE TABLE 3d_jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id BIGINT REFERENCES 3d_projects,
  meshy_job_id VARCHAR(100),
  status VARCHAR(20),  -- queued, processing, completed, failed
  progress INT,  -- 0-100
  error_message TEXT,
  result_url VARCHAR(500),  -- S3/Supabase URL to output file
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  webhook_received_at TIMESTAMP,
  INDEX(project_id),
  INDEX(meshy_job_id),
  INDEX(status)
);
```

---

## Frontend Components

### Pages
- **`/3d-service`** - Service overview and navigation hub
- **`/3d-service/design-request`** - Submit design request form
- **`/3d-service/projects`** - View all user projects
- **`/3d-service/projects/[projectId]`** - Project details and file download
- **`/3d-service/wallet`** - Token wallet and purchase history
- **`/admin/3d`** - Admin dashboard for 3D jobs
- **`/admin/3d/jobs`** - View and manage processing jobs
- **`/admin/3d/tokens`** - Token administration
- **`/admin/3d/pricing`** - Configure pricing and costs

### Components (to be built)
- `DesignRequestForm` - Form for submitting requests
- `ProjectCard` - Display project summary
- `TokenBalance` - Show wallet balance and purchase button
- `TokenLedger` - Transaction history table
- `PricingCalculator` - Quote display
- `JobProgressBar` - Show job processing status
- `FileUploader` - Multi-file upload with validation
- `AdminPricingTable` - Edit pricing configuration

---

## API Endpoints Summary

### Design Requests
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/3d/design-request` | Submit new request |
| GET | `/api/3d/design-request` | List user's requests |
| GET | `/api/3d/design-request/:id` | Get request details |
| PATCH | `/api/3d/design-request/:id` | Update request |
| POST | `/api/3d/design-request/:id/cancel` | Cancel request |

### Projects
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/3d/projects` | List user's projects |
| GET | `/api/3d/projects/:id` | Get project details |
| GET | `/api/3d/projects/:id/files` | List project files |
| GET | `/api/3d/projects/:id/download/:fileId` | Download file |
| POST | `/api/3d/projects/:id/upload` | Upload file |

### Wallet
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/3d/wallet` | Get balance |
| GET | `/api/3d/wallet/ledger` | Get transaction history |
| POST | `/api/3d/wallet/add-tokens` | Purchase tokens (admin) |

### Processing
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/3d/process` | Submit to Meshy |
| GET | `/api/3d/process/:jobId/status` | Check job status |
| POST | `/api/3d/webhook/meshy` | Receive job updates |

### Pricing & Quotes
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/3d/pricing` | Get pricing table |
| GET | `/api/3d/quote` | Calculate quote |
| POST | `/api/3d/pricing` | Update pricing (admin) |

---

## Integration Points

### External APIs
1. **Meshy AI**
   - Endpoint: `https://api.meshy.ai/v1`
   - Authentication: Bearer token (API key)
   - Main operations:
     - `POST /images-to-3d` - Convert images to 3D model
     - `GET /jobs/{job_id}` - Check job status
     - Webhook callbacks on completion

2. **Supabase**
   - Database: PostgreSQL
   - Storage: S3-compatible buckets
   - Authentication: Built-in
   - Real-time: Postgres subscriptions (optional)

### Email Notifications (Phase 2)
- Design request confirmation
- Quote received
- Processing started
- Model ready for download
- Project completion

---

## Security Considerations

### Authentication & Authorization
- [ ] All 3D endpoints require authentication
- [ ] Users can only access own projects/tokens
- [ ] Admin endpoints require admin role
- [ ] Meshy API key stored in `.env.production` (never client-side)

### File Security
- [ ] Files stored in private Supabase buckets
- [ ] RLS policies enforce user ownership
- [ ] File type validation (whitelist)
- [ ] File size limits (100MB max)
- [ ] Malware scanning (Phase 3)

### Token Security
- [ ] Token transactions immutable (ledger-based)
- [ ] All operations logged for audit
- [ ] No token deletion or manipulation
- [ ] Transaction verification on debit

---

## Testing Strategy

### Unit Tests (Phase 2.1-2.5)
- Token wallet calculations
- Price quote generation
- Meshy API wrapper functions
- File validation
- Token ledger consistency

### Integration Tests
- Complete request → project → processing → delivery flow
- Token purchase and deduction
- Meshy job lifecycle
- Webhook processing

### E2E Tests (if applicable)
- User submitting design request
- Admin approving/rejecting
- Job processing and webhook updates
- File download
- Token balance updates

---

## Success Metrics

### Phase 2 Launch Criteria
- [ ] All 5 Phase 2.1-2.5 components complete
- [ ] Unit test coverage > 80%
- [ ] Integration tests passing
- [ ] Meshy API integration stable
- [ ] Token system working (no balance discrepancies)
- [ ] Admin tools functional
- [ ] Documentation complete
- [ ] Team trained

### Performance Targets
- Quote calculation: < 500ms
- Design request submission: < 2s
- File upload: < 30s (100MB)
- Job status check: < 200ms
- Token transactions: < 100ms
- Webhook processing: < 1s

---

## Deployment & Launch

### Staging Environment
- Deploy to Vercel preview environment
- Use Supabase staging database
- Test with real Meshy API (limited quota)
- Internal team testing (1 week)

### Production Deployment
- Create Supabase production tables
- Migrate pricing configurations
- Set Meshy production API key
- Deploy to Vercel production
- Monitor for 24-48 hours
- Enable feature flag for gradual rollout

### Rollout Strategy
1. **Week 1:** Beta access to 10 trusted users
2. **Week 2:** Open to all users (opt-in)
3. **Week 3+:** Monitor and optimize

---

## Timeline

| Week | Component | Status |
|------|-----------|--------|
| 1-2 | Token System | [ ] |
| 2-3 | Design Requests | [ ] |
| 3-4 | Meshy Integration | [ ] |
| 4-5 | Pricing Engine | [ ] |
| 5-6 | File Management | [ ] |
| 6 | Testing & Bugfixes | [ ] |
| 7 | Staging & QA | [ ] |
| 8 | Production Launch | [ ] |

**Target Completion:** June 15, 2026 (6 weeks from May 16)

---

## Next Steps

1. **Setup Meshy Account**
   - [ ] Create account at meshy.ai
   - [ ] Get API key
   - [ ] Review API documentation
   - [ ] Set up webhook URL

2. **Database Migration**
   - [ ] Create Phase 2 tables in production Supabase
   - [ ] Set up RLS policies
   - [ ] Create indexes

3. **Start Phase 2.1**
   - [ ] Implement token wallet system
   - [ ] Write unit tests
   - [ ] Create admin interface

---

## Questions & Support

**Email:** techcraftlab.bkk@gmail.com  
**Project Location:** `/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab/`

---

**Created:** May 2, 2026  
**Status:** 🚀 Ready for Implementation
