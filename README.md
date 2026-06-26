# Samridhi Dental Super Speciality Clinic — Website Demo

A warm, mobile-first single-page website for **Samridhi Dental Super Speciality Clinic**, Sector 21, Kharghar, Navi Mumbai. Built to win Dr. Puja Chadha as a client and to turn local searches into booked appointments.

## How to open it

Just double-click **`index.html`** — it opens in any browser, no setup or install needed.

- Best viewed with an internet connection (loads the web fonts and the live Google Map).
- All clinic photos are stored locally in `assets/`, so the page still looks complete offline.
- Try it on a phone: the **Call** and **Book on WhatsApp** buttons work instantly.

## What's inside

```
index.html        – the whole page
styles.css        – all styling (warm beige + lotus-rose + sage palette)
script.js         – menu, scroll reveals, "open today" hours, smooth scroll
assets/brand/     – the lotus + tooth logo (SVG)
assets/img/       – clinic & patient photos
PRODUCT.md        – strategy notes (who it's for, brand personality)
```

Sections: Hero · Trust strip · Dr. Puja Chadha · Services · Our Care · First-visit steps · Clinic gallery · Patient reviews · Hours & map · FAQ · Booking call-to-action · Footer.

## Before going live — quick swaps

Everything below is real except a few placeholders to replace with the clinic's own content:

1. **Doctor's photo** — replace `assets/img/doctor.jpg` with Dr. Chadha's real photo, then delete the small "Demo note" line in the About section of `index.html`.
2. **Clinic photos** — swap any `assets/img/*.jpg` with real photos of this clinic for maximum authenticity (keep the same file names to avoid editing code).
3. **Reviews** — the three testimonials are sample copy. Replace with real Google reviews and patient names.
4. **WhatsApp / phone** — currently set to **+91 85911 41204**. Search `918591141204` in `index.html` if the number ever changes.
5. **Map** — already points at Tulsi Gagan Building, Sector 21, Kharghar. Fine-tune by replacing the address in the map `<iframe src>` if needed.

## Going online

Drag the whole folder onto **Netlify Drop** (app.netlify.com/drop) or any static host (GitHub Pages, Vercel, Cloudflare Pages) and it's live — no server or database required. A custom domain like `samridhidental.in` can be pointed at it afterwards.

## Credits

Stock photography from Unsplash (free to use). Fonts: Spectral + Hanken Grotesk (Google Fonts, free). Logo mark drawn as scalable SVG.
