# Back-in-Stock Notifier — Shopify App

A Shopify app that lets customers subscribe to **back-in-stock notifications** for specific products (and optionally variants). When inventory is replenished, the app works alongside **Shopify Flow** and Shopify’s **customer tagging** to automate the notification workflow and keep subscription handling scalable and low-maintenance.

## Purpose of the App
Out-of-stock items create lost revenue and manual follow-ups. This app captures customer intent at the product level and turns it into an automated process: customers subscribe once, your store tracks it reliably, and notifications can be triggered automatically when stock returns.

---

## Key Features
- **Customer opt-in capture** for back-in-stock alerts (email address + product/variant)
- **Product-specific subscriptions** so customers only receive relevant notifications
- **Shopify Flow integration** to trigger automations (tagging, scheduling, sending emails, internal alerts)
- **Customer tagging support** for segmentation, tracking, and downstream workflows
- **Admin-friendly workflow** that reduces manual support effort

---

## How it works (high level)
1. Customer submits their email for a specific product (or variant).
2. The app records the subscription and applies/updates **customer tags** to represent interest.
3. When inventory changes (restock), **Shopify Flow** detects the event and uses tags/subscription data to:
   - trigger email sends via your chosen email provider, and/or
   - notify internal teams, and/or
   - clean up tags after successful notification.

---

## Tagging Strategy (example)
> Adjust these to match your implementation.

- `bis_subscribed` — customer is subscribed to at least one back-in-stock alert  
- `bis_product_<handle-or-id>` — customer subscribed to a specific product  
- `bis_variant_<id>` — customer subscribed to a specific variant (if applicable)  
- `bis_notified_<handle-or-id>` — customer has been notified (optional, for audit/cleanup)

---

## Shopify Flow Setup (example)
Create a Flow that:
- **Trigger:** Inventory quantity changed / Product variant back in stock  
- **Conditions:** Inventory available > 0  
- **Actions (typical):**
  - Find customers by tag (e.g., `bis_variant_<id>` or `bis_product_<handle>`)
  - Send email via your email tool (Klaviyo / Omnisend / Shopify Email / custom endpoint)
  - Remove subscription tags or add `bis_notified_*` tag after sending
  - Optional: Slack/email internal notification for high-demand items

---

## Local Development (template)
> Replace placeholders with your actual setup.

### Prerequisites
- Next.js (LTS recommended)
- Shopify Partner account + development store
- Shopify CLI

### Environment Variables
Create a `.env` file with:
- `SHOPIFY_API_KEY=...`
- `SHOPIFY_API_SECRET=...`
- `SCOPES=...`
- `APP_URL=...`
- `DATABASE_URL=...` (if you store subscriptions)
- `EMAIL_PROVIDER_KEY=...` (if your app sends emails directly)

