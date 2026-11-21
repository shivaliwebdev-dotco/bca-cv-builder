# CV Studio — BCA Student CV Builder

A responsive, browser-based CV builder designed for students. Edit your details, see an instant preview, switch between three themes, manage section order and visibility, validate essentials, and print or save as PDF.

## Files
- `index.html` — app structure and editor controls
- `style.css` — responsive interface, three CV themes, and print stylesheet
- `app.js` — editing, live preview, validation, local storage, photo handling, import/export
- `seed-cv.json` — realistic example BCA student CV data

## How to run
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, Firefox or Safari.
3. Start editing. Your CV is saved automatically in your browser's local storage.

No server, framework, database or build step is required.

## Theme system
The preview uses CSS custom properties on `.cv-paper`. Each theme changes its accent colour, font family and spacing:
- **Modern** — expressive purple accent and clean sans-serif type.
- **Classic** — warm neutral accent and serif typography.
- **Minimal** — monochrome accent and restrained layout.

## Print setup
Choose **Print CV** or **Print / Save PDF**. The `@media print` rules hide editor controls and print only the CV preview on A4 paper. In the print dialog, choose **Save as PDF**. Use default scale or 100%; disable browser headers and footers for the cleanest result.

The layout is designed to fit one page with concise student content. If you add extensive content, shorten descriptions or hide less relevant sections to keep it to one page.

## Features
- Live editing for personal details, summary, education, skills, projects, internships, certifications and languages.
- Add, edit and remove repeatable entries.
- Three instant preview themes.
- Drag-and-drop section ordering and show/hide controls.
- Validation for name, email, 10-digit phone, one skill and one project.
- Completion meter for five essentials.
- Profile image upload (stored as a data URL in local storage), circle/square crop and remove action.
- Export and import CV data as JSON.
- Local storage persistence.

## Notes
- The example profile is fictional/demo content. Replace it with accurate information before submitting or applying.
- Photo upload is limited to 2 MB to keep local storage usage reasonable.
- The LinkedIn / portfolio field is shown as contact text in the preview.
