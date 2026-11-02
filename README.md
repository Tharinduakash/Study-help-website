# Study Help

The website and admin dashboard for Study Help – Academic & Digital Solutions.

Built with Next.js 16, TypeScript, Tailwind CSS, Framer Motion, PostgreSQL (Drizzle ORM) and Supabase Storage. Use Node.js 20 or later and pnpm.

## First-time setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Create your environment file:** copy `.env.example` to `.env.local` and fill in the values. Each one says where to find it.
3. **Install and prepare everything:**

   ```bash
   pnpm install
   pnpm db:migrate       # creates the tables
   pnpm db:seed          # loads the starter content, once only
   pnpm storage:setup    # creates the private and public file buckets
   ```

4. **Create your admin login.** Use a password of at least 12 characters:

   ```bash
   # macOS, Linux or Git Bash
   ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSWORD="..." pnpm admin:create

   # PowerShell
   $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_NAME="Your Name"; $env:ADMIN_PASSWORD="..."; pnpm admin:create
   ```

   Run it again with the same email to reset a forgotten password, or with a new email to add another admin.

5. **Start the site** with `pnpm dev`, then open [localhost:3000](http://localhost:3000). The dashboard is at [/admin](http://localhost:3000/admin).

## Deploying to Vercel

1. Push this project to its own GitHub repository and import it into Vercel.
2. Add every variable from `.env.example` in the Vercel project settings, with `NEXT_PUBLIC_SITE_URL` set to your live address.
3. Run `pnpm db:migrate` against the live database before the first deploy: public pages read from the database while building.
4. Add your domain in Vercel, and turn on Web Analytics there to record visits.

## Managing content

Everything public is edited at `/admin`: services and pricing, portfolio, team, testimonials, FAQs, contact details and homepage text. Saving refreshes the public site straight away. Customers can submit reviews at `/review`; they stay hidden until approved.

The sample portfolio projects and unnamed team rows come from `pnpm db:seed`. Replace them before launch. `lib/content` is only used by that seed.

## Team page

The team page is hidden for now. To bring it back, set `showTeam` to `true` in `lib/site-config.ts`. Profiles can be prepared at `/admin/team` while it is hidden.

## Photo credits

The starter photos in `public/images/stock` come from Wikimedia Commons, marked CC0 (no copyright restrictions). Replace them with your own work when you can.

- [Statistics on a laptop](https://commons.wikimedia.org/wiki/File:Statistics_on_a_laptop_(Unsplash).jpg)
- [White work table with notes](https://commons.wikimedia.org/wiki/File:White_work_table_with_notes,_smartphone_and_laptop_(Unsplash).jpg)
- [Laptop coding programs](https://commons.wikimedia.org/wiki/File:Laptop_coding_programs_(Unsplash).jpg)
- [Minimalist meeting room](https://commons.wikimedia.org/wiki/File:Minimalist_meeting_room_(Unsplash).jpg)
- [Camera operator](https://commons.wikimedia.org/wiki/File:Camera_Operator_At_Construction_Site.jpg)
- [Typing on a laptop](https://commons.wikimedia.org/wiki/File:Typing_on_a_laptop_(Unsplash).jpg)
- [Hand on a laptop](https://commons.wikimedia.org/wiki/File:Hand-laptop-notebook-typing_(23698140194).jpg)
- [Coder at a desk](https://commons.wikimedia.org/wiki/File:Apple-blogging-coder-36990.jpg)
- [Chart on a laptop](https://commons.wikimedia.org/wiki/File:Blur-chart-data-69760.jpg)
- [Laptop on desk with book stacks](https://commons.wikimedia.org/wiki/File:Laptop_on_desk_book_stacks_(Unsplash).jpg)
- [Chairs in a meeting room](https://commons.wikimedia.org/wiki/File:Chairs_in_a_meeting_room_(Unsplash).jpg)
- [Programmer at work](https://commons.wikimedia.org/wiki/File:Programmer_at_work_(Unsplash).jpg)
- [Laptop and books](https://commons.wikimedia.org/wiki/File:Laptop_and_books_(Unsplash).jpg)
- [Action camera on a tripod](https://commons.wikimedia.org/wiki/File:Tiny_video_camera_(Unsplash).jpg)
- [Analytics graphs on a laptop](https://commons.wikimedia.org/wiki/File:Analytics_graphs_on_a_MacBook_screen.jpg)
- [Online store on a laptop](https://commons.wikimedia.org/wiki/File:Online_store_on_a_screen_(Unsplash).jpg)
- [Designing with markers](https://commons.wikimedia.org/wiki/File:Design_work_(Unsplash).jpg)
- [Two people working through notebooks](https://commons.wikimedia.org/wiki/File:Students_learning_together_(Unsplash).jpg)
- [Creative workspace](https://commons.wikimedia.org/wiki/File:Notepad_on_a_busy_workspace_(Unsplash).jpg)
- [Finance analytics over coffee](https://commons.wikimedia.org/wiki/File:Finance_analytics_over_coffee_(Unsplash).jpg)
- [Man with smartphone and laptop](https://commons.wikimedia.org/wiki/File:Man_with_smartphone_and_laptop_(Unsplash).jpg)
- [Laptop on a neat desk](https://commons.wikimedia.org/wiki/File:Laptop_on_a_neat_desk_(Unsplash).jpg)
- [Ruler and laptop on a desk](https://commons.wikimedia.org/wiki/File:Ruler_and_laptop_on_a_desk_(Unsplash).jpg)
- [Laptop and a mug](https://commons.wikimedia.org/wiki/File:Laptop_and_a_mug_(Unsplash).jpg)
- [Plants and books](https://commons.wikimedia.org/wiki/File:Plants_and_Books_(Unsplash).jpg)

## How it fits together

| Path | Purpose |
| --- | --- |
| `app/(site)` | Public pages, prerendered and refreshed when an admin saves |
| `app/admin` | Dashboard. Every page, query and action calls `requireAdmin()` |
| `proxy.ts` | Convenience redirect for signed-out visitors, not the security check |
| `db` | Schema, migration, seed and setup scripts |
| `drizzle` | Generated SQL migrations |
| `lib/data.ts` | Public reads, published and approved content only |
| `lib/admin` | Admin queries, actions and validation |
| `lib/storage.ts` | File storage, using the server-only service role key |

**Customer files** upload straight from the browser to the private `inquiry-files` bucket through one-time signed URLs, because Vercel functions cannot accept files this large. Admins download them through a session-checked route that issues a link lasting 60 seconds.

## Changing the database

Edit `db/schema.ts`, run `pnpm db:generate`, commit the new file in `drizzle`, then run `pnpm db:migrate`.
