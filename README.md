# KIDORA Quest v5 Complete Working Static App

KIDORA Quest is a game-based AI-integrated English storyworld for young learners. This package is ready for GitHub Pages deployment and does not require a backend server or external API key.

## Public Landing Page
The public landing page does not show demo account information. It includes:
- one-screen storyworld landing page
- learner, teacher, family, and Admin PIN entry
- main feature islands
- copyright: © 2026 KIDORA Quest. Copyright Dr. Joko Slamet. All rights reserved.

## Admin Access
Admin access uses PIN only.

Default Admin PIN:

```text
2026
```

The PIN can be changed from Admin Dashboard → Settings.

## Seeded Testing Accounts
These are not displayed on the public landing page. They are included only for owner testing after deployment.

```text
Student: student@kidora.local / student2026
Teacher: teacher@kidora.local / teacher2026
Parent: parent@kidora.local / parent2026
```

## Main Working Features

### Student Workspace
- Quest Map
- SoundQuest AI listening studio
- EchoMirror AI speaking studio
- GlyphPath AI reading studio
- StoryForge AI writing and drawing studio
- Puzzle Bridge integrated mission
- WordSpark Lab game
- Living Storybook portfolio
- Treasure Room and Quest Passport

### Audio and Speaking
- Play story
- Play clue
- Play words
- Play model sentence
- Stop audio
- Start voice recording
- Stop recording
- Play child voice
- Clear child voice
- Save speaking evidence

Voice recording requires HTTPS and browser microphone permission. GitHub Pages uses HTTPS, so the feature works after deployment.

### Teacher Workspace
- Teacher Quest Cockpit
- QuestWeaver AI generator
- Content Studio
- Evidence Review
- AI Reports
- Research Analytics
- CSV exports

### Parent Workspace
- Family Growth Window
- Child Storybook
- Home Practice AI
- Weekly Growth Report

### Admin Workspace
- User approval
- Add/delete users
- Content Bank
- Quest Library
- AI Safety Review
- Analytics and export
- Settings
- Change Admin PIN
- Change copyright text
- Enable/disable recording
- Reset seeded data
- Clear app cache

## GitHub Pages Deployment
1. Create a public GitHub repository, for example `kidoraquest`.
2. Upload all files from this ZIP to the repository root.
3. Go to Settings → Pages.
4. Select Deploy from a branch.
5. Select branch `main` and folder `/root`.
6. Save.
7. Open the generated GitHub Pages URL.

## Important Cache Note
If an older KIDORA Quest version was already deployed, open the new version in an Incognito/Private window first. You can also use Admin Dashboard → Settings → Clear App Cache.

## Files
- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `sw.js`
- `.nojekyll`
- `README.md`
