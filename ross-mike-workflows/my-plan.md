# Light Novel Reading Website - PRD

## Overview
A community-driven online platform for reading light novels. Registered users can read, track progress, comment, and rate novels. Guests can browse but must register to read. Admin manages all content uploads.

---

## Feature 1: User Authentication & Accounts
- Email/password registration and login
- User profile page showing reading history, reviews, and followed novels
- Password reset via email
- Test: User can register, log in, log out, and reset password successfully

## Feature 2: Novel & Chapter Management (Admin)
- Admin dashboard to upload novels (title, cover image, description, genre tags, status: ongoing/completed)
- Upload chapters with title, content (rich text or markdown), and chapter number
- Edit/delete novels and chapters
- Mark novels as featured for homepage curation
- Test: Admin can publish a novel with 3 chapters; chapters appear in correct order on the site

## Feature 3: Reading Experience
- Clean chapter reader with customizable settings:
  - Font size (small / medium / large)
  - Background color (white / sepia / dark)
  - Reading width (narrow / wide)
- Previous/next chapter navigation
- Reading settings persist across sessions (saved to user account)
- Test: User can change font size and background; settings are retained after logout and re-login

## Feature 4: Reading History & Progress Tracking
- Full reading history log: each chapter read is recorded with timestamp
- "Continue reading" shortcut on novel page - jumps to last read chapter
- History page showing all novels read, sorted by most recent
- Test: Reading chapter 5 of a novel then returning shows "Continue from Chapter 5"; history log shows correct timestamp

## Feature 5: Search & Discovery
- Search by novel title or author
- Filter by genre tags (fantasy, romance, action, isekai, etc.), status (ongoing/completed), rating
- Homepage layout:
  - Featured/curated section (admin-selected)
  - Trending section (most read in last 7 days)
  - Recently updated section (latest chapter uploads)
- Test: Filtering by "completed + fantasy" returns only completed fantasy novels; homepage sections update within 24 hours of activity

## Feature 6: Ratings & Reviews
- Logged-in users can give a novel a 1-5 star rating
- Optionally write a text review alongside the rating (one review per user per novel)
- Other users can upvote reviews as helpful
- Reviews sorted by: most helpful / most recent
- Average star rating displayed on novel card and detail page
- Test: Submitting a review reflects immediately on the novel page; upvoting a review increments count

## Feature 7: Chapter Comments
- Logged-in users can comment on individual chapters
- Nested replies (one level deep)
- Comments sorted by newest first
- Basic moderation: admin can delete any comment
- Test: Posting a comment appears immediately; reply to a comment threads correctly under the parent

## Feature 8: On-Site Notifications
- Notification bell in navbar for logged-in users
- Notifications triggered when: a followed novel has a new chapter uploaded
- Mark all as read / mark individual as read
- Notification feed page for full history
- Test: Following a novel and admin uploading a new chapter triggers a notification within 5 minutes

## Feature 9: Guest Access & Browse Mode
- Guests can view homepage, novel pages, and chapter lists
- Guests cannot open chapter reader - clicking "Read" prompts a login/register modal
- Novel descriptions, ratings, and reviews are visible to guests
- Test: Guest clicking "Read Chapter 1" sees a modal; after registering, they are redirected to the chapter

---

## UI Decisions
- Community hub style: ratings, reviews, and comments are prominent alongside the reader
- Dark mode available as a reading setting (not site-wide default)
- Novel cards show: cover image, title, genre tags, status badge, average star rating, latest chapter
- Reader page is distraction-free - hide navbar while reading, show on scroll up
- Mobile responsive: reading experience optimized for phone screens

## Technical Decisions
- **Frontend:** Next.js (App Router) - SSR for SEO on novel/chapter pages
- **Database:** PostgreSQL
- **Auth:** NextAuth.js with email/password provider
- **Image storage:** Cloudinary or S3 for novel cover images
- **Ads:** Google AdSense - sidebar and between-chapter placements (non-intrusive in reader)
- **Trending algorithm:** Chapter read count in last 7 days, recalculated every hour via cron job
- **Admin panel:** Custom /admin routes protected by role-based auth (admin role in users table)

## Out of Scope for v1
- User-submitted novels or translations
- Email notifications (on-site only for now)
- Personalized recommendations (trending + curated is sufficient for v1)
- Mobile app
