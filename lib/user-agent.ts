/** Tiny user-agent classifier: enough for dashboard breakdowns, no dependency. */

const BOT = /bot|crawl|spider|slurp|preview|scrape|fetch|monitor|lighthouse|headless|phantom|puppeteer|playwright|selenium|curl|wget|python|axios|node-fetch|go-http|java\/|httpclient|facebookexternalhit|embedly|whatsapp|telegram|discord|vercel/i;

export function isBot(ua: string) {
  return !ua || BOT.test(ua);
}

export function parseUserAgent(ua: string) {
  return { device: device(ua), browser: browser(ua), os: os(ua) };
}

function device(ua: string) {
  if (/ipad|tablet|kindle|silk|playbook|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function browser(ua: string) {
  if (/edg(e|a|ios)?\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/ucbrowser/i.test(ua)) return "UC Browser";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios|chromium/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

function os(ua: string) {
  if (/windows/i.test(ua)) return "Windows";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/cros/i.test(ua)) return "ChromeOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}
