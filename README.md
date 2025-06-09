# YouTube Screenshot Generator

This project provides a simple Node.js script for generating screenshots from video files.

## Requirements

- Node.js (v18 or later)
- ffmpeg (includes `ffprobe` and is available on most package managers)

The script requires `ffmpeg` (with `ffprobe`) to determine the video duration and extract frames. It no longer relies on the deprecated `fluent-ffmpeg` library.

## Installation

```bash
npm install
```

## Usage

```bash
node index.js <video file> <number of screenshots>
```

Screenshots will be saved in the `screenshots/` directory. The number of screenshots defaults to `1` if not specified.

**Example**

```bash
node index.js myvideo.mp4 3
```

This command generates three screenshots from the video.
