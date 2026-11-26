// Some flowers for my flower — a home screen widget for Scriptable.
// To: Hargun   Love: Divij
//
// Shows the tulip bouquet and turns it a little every 15 minutes,
// one full spin every 6 hours. Tapping the widget opens the live bouquet.

const BASE = "https://divijsinghkohli.github.io/f10wer/";
const FRAMES = 24;
const MINUTES_PER_FRAME = 15;

const family = config.widgetFamily || "large";
const kind = family === "small" ? "small" : family === "medium" ? "medium" : "large";

const now = new Date();
const index = Math.floor((now.getHours() * 60 + now.getMinutes()) / MINUTES_PER_FRAME) % FRAMES;
const file = `${kind}-${String(index).padStart(2, "0")}.png`;

// Keep a copy of each picture on the phone so the widget still works offline.
const fm = FileManager.local();
const dir = fm.joinPath(fm.documentsDirectory(), "f10wer");
if (!fm.fileExists(dir)) fm.createDirectory(dir);
const saved = fm.joinPath(dir, file);

let image = null;
try {
  image = await new Request(BASE + "frames/" + file).loadImage();
  fm.writeImage(saved, image);
} catch (e) {
  if (fm.fileExists(saved)) {
    image = fm.readImage(saved);
  } else {
    const any = fm.listContents(dir).filter(f => f.startsWith(kind));
    if (any.length) image = fm.readImage(fm.joinPath(dir, any[0]));
  }
}

const widget = new ListWidget();
widget.backgroundColor = new Color("#0d0a12");
widget.url = BASE;
if (image) {
  widget.backgroundImage = image;
} else {
  const t = widget.addText("some flowers for my flower");
  t.textColor = new Color("#ff86b0");
  t.font = Font.boldMonospacedSystemFont(14);
}
widget.refreshAfterDate = new Date(Date.now() + MINUTES_PER_FRAME * 60 * 1000);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else if (kind === "small") {
  await widget.presentSmall();
} else if (kind === "medium") {
  await widget.presentMedium();
} else {
  await widget.presentLarge();
}
Script.complete();
