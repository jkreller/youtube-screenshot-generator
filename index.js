const fs = require('fs');
const ytdl = require('ytdl-core');
const { execFile } = require('child_process');
const path = require('path');

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
    execFile(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        file,
      ],
      (err, stdout) => {
        if (err) return reject(err);
        resolve(parseFloat(stdout));
      }
    );
  });
}

async function makeScreenshots(duration) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const tasks = [];
  for (let i = 1; i <= count; i++) {
    const timestamp = (duration * i) / (count + 1);
    const filename = path.join(OUTPUT_DIR, `screenshot${i}.png`);
    tasks.push(
      new Promise((resolve, reject) => {
        execFile(
          'ffmpeg',
          [
            '-y',
            '-loglevel',
            'error',
            '-ss',
            String(timestamp),
            '-i',
            TEMP_FILE,
            '-vframes',
            '1',
            filename,
          ],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      })
    );
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
