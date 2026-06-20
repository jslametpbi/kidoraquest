# KIDORA Quest v4 – Complete GitHub Pages Deployment

KIDORA Quest is a static, GitHub Pages-ready application for young learners. It integrates listening, speaking, reading, and writing through a game-based storyworld with child-safe local AI-style support, voice evidence, drawing/writing evidence, role dashboards, and admin control.

## Public Landing
- One-screen visual landing page.
- No visible demo-login information.
- Admin access uses PIN only.
- Copyright line: `© 2026 KIDORA Quest. Copyright Dr. Joko Slamet. All rights reserved.`

## Admin PIN
Default PIN: `2026`

The PIN can be changed inside Admin → Settings.

## Built-in Demo Credentials
These are provided here for private testing only and are not displayed on the landing page.

Student: `student@kidora.local` / `student2026`

Teacher: `teacher@kidora.local` / `teacher2026`

Parent: `parent@kidora.local` / `parent2026`

Additional student accounts are included for class analytics.

## Working Feature Areas

### Student Workspace
- Quest Map
- SoundQuest AI: play story, stop audio, play clue, play target word, listening choices, save listening evidence
- EchoMirror AI: play target, stop target, start recording, stop recording, play own voice, clear voice, save voice evidence
- GlyphPath AI: phonics, word cards, play/read sentence, read mini story, save reading evidence
- StoryForge AI: working drawing/tracing canvas, sentence train builder, read built sentence, save writing and drawing evidence
- Puzzle Bridge: integrated four-skill mission
- Living Storybook: voice, writing, drawing, reading and listening evidence
- Treasure Room: points, badges, printable certificate

### Teacher Workspace
- Teacher Quest Cockpit
- QuestWeaver AI local quest generator
- Content Studio
- Evidence Review
- Reports AI
- Research Cockpit with CSV export

### Parent Workspace
- Family Growth Window
- Storybook View
- Home Practice AI
- Growth Report

### Admin Workspace
- PIN-only admin login
- User management: add, approve/toggle, delete
- Content management: add/delete themes
- Quest management: approve/toggle/delete
- AI Safety review
- Analytics export
- Settings: admin PIN, school/lab name, copyright, voice recording enabled/disabled
- Reset demo data

## GitHub Pages Deployment
1. Create a GitHub repository, for example `kidoraquest`.
2. Upload all files from this folder to the repository root.
3. Go to Settings → Pages.
4. Source: Deploy from a branch.
5. Branch: `main`; Folder: `/root`.
6. Save and open the GitHub Pages URL.
7. Open the site in an incognito/private window after updating, because older service workers may cache previous versions.

## Browser Notes
- Voice recording requires HTTPS and microphone permission. GitHub Pages uses HTTPS, so it works after deployment.
- Audio playback uses browser speech synthesis, so no external audio files are needed.
- All data is stored locally in the browser via localStorage for a static deployment.

## Version
v4.0.0 complete rebuild.
