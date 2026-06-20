# KIDORA Quest

**KIDORA Quest** is a GitHub Pages-ready, static Progressive Web App for young learners. It is designed as an AI-integrated, game-based English storyworld where children learn through the cycle **Hear → Move → Say → Read → Create → Share**.

The current version does not require a backend server or external API key. It uses browser `localStorage` for demo data, `SpeechSynthesis` for voice guide/audio prompts, `MediaRecorder` for voice evidence when the browser allows microphone access, and canvas for drawing/writing evidence.

## Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| Young Learner | student@kidora.local | student2026 |
| Teacher | teacher@kidora.local | teacher2026 |
| Parent | parent@kidora.local | parent2026 |
| Admin | admin@kidora.local | admin2026 |

## Main Modules

### Young Learner Workspace
- Quest Map
- SoundQuest AI for listening
- EchoMirror AI for speaking and voice evidence
- GlyphPath AI for reading
- StoryForge AI for drawing, tracing, and writing
- Puzzle Bridge integrated missions
- Living Storybook portfolio
- Treasure Room, badges, points, and certificate print view

### Teacher Workspace
- Teacher Quest Cockpit
- QuestWeaver AI for generating integrated quests
- Safety approval before publishing quests
- Evidence review for voice, drawing, writing, and portfolio artifacts
- AI progress report generator
- AI observation note builder
- Research cockpit and CSV analytics export

### Parent Workspace
- Family Growth Window
- Storybook View
- Home Practice AI cards
- GrowthPath AI summary

### Admin Workspace
- User approval and role management
- Content bank for themes, vocabulary, and sentence frames
- AI Safety Review
- Analytics export
- App settings
- Demo database reset

## Deploy via GitHub Pages

1. Create a GitHub repository, for example: `kidora-quest`.
2. Upload all files in this folder to the repository root:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `assets/icon.svg`
   - `.nojekyll`
3. Open **Repository Settings**.
4. Select **Pages**.
5. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
6. Save.
7. Open the GitHub Pages link after deployment.

## Notes for Production

This ZIP is a complete front-end prototype. For institutional field testing with real children, connect it to a secure backend such as Firebase, Supabase, or a private institutional server. Production deployment should add:

- secure authentication
- encrypted data storage
- parental consent workflow
- child assent workflow
- admin-managed classrooms
- secure file storage for voice and portfolio evidence
- server-side QR verification for certificates
- IRB/ethics documentation

## Browser Requirements

Recommended browsers:
- Chrome
- Edge
- Safari
- Firefox

Microphone recording requires HTTPS, which GitHub Pages provides. If microphone permission is blocked, the app provides a fallback demo voice evidence mode.
