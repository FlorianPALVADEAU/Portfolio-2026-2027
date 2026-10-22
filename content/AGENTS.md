# Content

Typed content for projects and notes. Rules in the root [AGENTS.md](../AGENTS.md).

- Per project: `<slug>/project.ts` (structure, stack, media) and `<slug>/i18n/{fr,en,de}.json` (text). No MDX.
- Blocks are validated with Effect Schema at build; a missing translation or media file fails the build.
- German is Swiss Standard German (no ß). Keep tone and facts identical across locales.
- A cover may carry `depth`, a grayscale depth map (white is near) that enables the hover parallax on pointer devices. Generate it offline with `scripts/generate-depth.mjs`; skip it for flat covers (slides, text), where depth means nothing.
- A project may carry a `teaser`: a `poster` picture shown above the title, and optionally a `video`. Its alt text and the video's accessible name live in the locale files as `teaser.label`. Without `video` the poster is a plain picture.
- Encode a video once before adding it, so that it starts at once and stays light whatever its length. The index must be at the front of the file (`+faststart`) for the browser to play it while it downloads; 720p keeps two minutes around 15 MB:
  `ffmpeg -i source.mov -vf "scale=-2:720" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart public/projects/<slug>/teaser.mp4`
  Take the poster from a frame: `ffmpeg -ss 00:00:08 -i source.mov -frames:v 1 -vf "scale=1920:-2" public/projects/<slug>/teaser-poster.webp`. The player loads nothing until play is pressed. A file much beyond 50 MB belongs on a video host rather than in `public/`.
