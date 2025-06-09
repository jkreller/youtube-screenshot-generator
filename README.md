# YouTube Screenshot Generator

This project provides a simple Node.js script for generating screenshots from YouTube videos.

## Requirements

- Node.js (v18 or later)
- ffmpeg (available on most package managers)

The script downloads the video using `ytdl-core` and captures screenshots with `ffmpeg`.

## Installation

```bash
npm install
```

## Usage

```bash
node index.js <YouTube URL> <number of screenshots>
```

Screenshots will be saved in the `screenshots/` directory. The number of screenshots defaults to `1` if not specified.

**Example**

```bash
node index.js https://www.youtube.com/watch?v=dQw4w9WgXcQ 3
```

This command generates three screenshots from the video.
