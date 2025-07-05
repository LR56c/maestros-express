
export function removeDoubleEscape(str: string): string {
  return str.replace(/\\{2,}/g, '\\');
}

export function ensureRegexAnchors(regex: string): string {
  let anchored = regex;
  if (!anchored.startsWith('^')) anchored = '^' + anchored;
  if (!anchored.endsWith('$')) anchored = anchored + '$';
  return anchored;
}
