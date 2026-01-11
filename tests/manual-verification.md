# Sun AI Agency — Manual Verification Checklist

Use this guide to verify the implementation of the "Live Analysis" feature (Frontend -> Edge Function -> Database).

## 1. Prerequisites
- [ ] Frontend running (`npm run dev`)
- [ ] Supabase Edge Function deployed (`supabase functions deploy analyze-business`) OR served locally (`supabase functions serve`)
- [ ] `.env` or Supabase Secrets configured with `API_KEY` (Gemini)

## 2. Verification Steps

### A. Edge Function Security
1. **Test:** Send a POST request to the function URL without an `Authorization` header.
   - **Expected:** Status `401 Unauthorized` with body `{ "error": "Unauthorized: Missing Authorization header" }`.
   - **Method:** `curl -X POST http://localhost:54321/functions/v1/analyze-business`

### B. Live Analysis Trigger (Frontend)
1. **Test:** Navigate to `/app/wizard/step-1`.
2. **Action:** Enter "Tesla" as Business Name and "https://tesla.com" as Website.
3. **Action:** Click outside the input field (Blur) or wait 2 seconds.
4. **Expected:** 
   - Right panel status changes to "Processing signals..." (Pulse animation).
   - After ~3-5 seconds, markdown text appears in the Right Panel.
   - The text references specific details about Tesla (verifying `googleSearch` tool worked).

### C. Data Persistence
1. **Test:** After the analysis loads, check the Supabase Database Console.
2. **Action:** Query the `context_snapshots` table.
   ```sql
   SELECT * FROM context_snapshots ORDER BY created_at DESC LIMIT 1;
   ```
3. **Expected:**
   - A new row exists.
   - `summary` column contains "Business Analysis: Tesla - ..."
   - `metrics` column is a JSON object containing the full analysis text.
   - `is_active` is `true`.

### D. Session & Guest Mode
1. **Test:** Open the app in an Incognito window (Guest Mode).
2. **Action:** Fill out the Step 1 form.
3. **Expected:**
   - Analysis still triggers and displays in the UI.
   - **Database Check:** No new rows in `context_snapshots` (Guest mode skips DB writes).
   - Console logs: "Guest/Offline Mode: Snapshot not saved to database."

### E. Error Handling (Offline)
1. **Test:** Stop the Edge Function server (or disconnect internet).
2. **Action:** Trigger analysis in the UI.
3. **Expected:**
   - UI does NOT crash.
   - Right panel displays "**Offline Analysis Mode**" fallback text.
   - Console logs "Failed to analyze business via Edge Function".

## 3. Common Issues & Fixes
- **Deno Error (API_KEY):** If the function logs `API_KEY not set`, ensure you ran `supabase secrets set API_KEY=...`.
- **CORS Error:** If browser console shows CORS issues, ensure the `OPTIONS` handler in `index.ts` is active.
- **Empty Response:** If Gemini returns empty text, check if `googleSearch` is supported in your region/model tier.
