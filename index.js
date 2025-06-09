const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const url = process.argv[2];
const count = parseInt(process.argv[3], 10) || 1;

if (!url) {
  console.error('Usage: node index.js <YouTubeURL> <screenshot_count>');
  process.exit(1);
}

const OUTPUT_DIR = 'screenshots';
const TEMP_FILE = 'temp_video.mp4';

async function downloadVideo(videoUrl) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(videoUrl, { quality: 'highestvideo' })
      .pipe(fs.createWriteStream(TEMP_FILE));
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function getDuration(file) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, data) => {
      if (err) return reject(err);
      resolve(data.format.duration);
    });
  });
}

async function makeScreenshots(duration) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const tasks = [];
  for (let i = 1; i <= count; i++) {
    const timestamp = (duration * i) / (count + 1);
    tasks.push(new Promise((resolve, reject) => {
      ffmpeg(TEMP_FILE)
        .on('end', resolve)
        .on('error', reject)
        .screenshots({
          timestamps: [timestamp],
          filename: `screenshot${i}.png`,
          folder: OUTPUT_DIR,
        });
    }));
  }
  await Promise.all(tasks);
}

async function run() {
  try {
    console.log('Downloading video...');
    await downloadVideo(url);
    const duration = await getDuration(TEMP_FILE);
    console.log(`Video duration: ${duration}s`);
    console.log('Generating screenshots...');
    await makeScreenshots(duration);
    fs.unlinkSync(TEMP_FILE);
    console.log(`Generated ${count} screenshot(s) in ${OUTPUT_DIR}/`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
