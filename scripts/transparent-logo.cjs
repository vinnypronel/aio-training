const sharp = require("sharp");
const path = require("path");

async function makeTransparent(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.from(data);
  const thresholdHard = 22;
  const thresholdSoft = 80;

  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    const max = Math.max(r, g, b);

    if (max <= thresholdHard) {
      buf[i + 3] = 0;
    } else if (max < thresholdSoft) {
      buf[i + 3] = Math.round(
        ((max - thresholdHard) / (thresholdSoft - thresholdHard)) * 255,
      );
    }
  }

  await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(output);

  console.log("wrote", output);
}

const dir = path.join(__dirname, "..", "public", "assets", "images");
makeTransparent(
  path.join(dir, "aio-logo-reverse.webp"),
  path.join(dir, "aio-logo-reverse.png"),
).catch((err) => {
  console.error(err);
  process.exit(1);
});
