/**
 * Arabic presentation-form shaper for the @react-pdf PDF pipeline.
 *
 * Why this exists:
 * The react-pdf text stack (textkit -> @react-pdf/font -> pdfkit -> fontkit)
 * cannot reliably position the OpenType GSUB/GPOS output of modern Arabic
 * fonts: Noto Naskh Arabic decomposes every dotted letter into a dotless
 * tooth plus a zero-advance combining dot whose mark offsets are dropped
 * before rendering, producing fragmented letters and floating dots.
 *
 * This module pre-resolves the Unicode joining context and emits the legacy
 * Arabic Presentation Forms codepoints (U+FB50..U+FEFF), which are stored in
 * the font as single, precomposed, connected glyphs (verified 1:1 against
 * public/fonts/NotoNaskhArabic-Regular.ttf / -Bold.ttf at authoring time).
 * Output stays in logical (input) order — textkit's bidi engine performs the
 * visual reordering itself. Isolated positions use the final form, which is
 * the standard typographic equivalence in Naskh.
 *
 * It changes no scores, no content, no benchmark data — pure typography.
 */

const AR_FORMS: Record<number, [number, number, number]> = {
  0x622: [0xfe82, 0, 0],
  0x623: [0xfe84, 0, 0],
  0x624: [0xfe86, 0, 0],
  0x625: [0xfe88, 0, 0],
  0x626: [0xfe8a, 0xfe8b, 0xfe8c],
  0x627: [0xfe8e, 0, 0],
  0x628: [0xfe90, 0xfe91, 0xfe92],
  0x629: [0xfe94, 0, 0],
  0x62a: [0xfe96, 0xfe97, 0xfe98],
  0x62b: [0xfe9a, 0xfe9b, 0xfe9c],
  0x62c: [0xfe9e, 0xfe9f, 0xfea0],
  0x62d: [0xfea2, 0xfea3, 0xfea4],
  0x62e: [0xfea6, 0xfea7, 0xfea8],
  0x62f: [0xfeaa, 0, 0],
  0x630: [0xfeac, 0, 0],
  0x631: [0xfeae, 0, 0],
  0x632: [0xfeb0, 0, 0],
  0x633: [0xfeb2, 0xfeb3, 0xfeb4],
  0x634: [0xfeb6, 0xfeb7, 0xfeb8],
  0x635: [0xfeba, 0xfebb, 0xfebc],
  0x636: [0xfebe, 0xfebf, 0xfec0],
  0x637: [0xfec2, 0xfec3, 0xfec4],
  0x638: [0xfec6, 0xfec7, 0xfec8],
  0x639: [0xfeca, 0xfecb, 0xfecc],
  0x63a: [0xfece, 0xfecf, 0xfed0],
  0x641: [0xfed2, 0xfed3, 0xfed4],
  0x642: [0xfed6, 0xfed7, 0xfed8],
  0x643: [0xfeda, 0xfedb, 0xfedc],
  0x644: [0xfede, 0xfedf, 0xfee0],
  0x645: [0xfee2, 0xfee3, 0xfee4],
  0x646: [0xfee6, 0xfee7, 0xfee8],
  0x647: [0xfeea, 0xfeeb, 0xfeec],
  0x648: [0xfeee, 0, 0],
  0x649: [0xfef0, 0, 0],
  0x64a: [0xfef2, 0xfef3, 0xfef4],
  0x671: [0xfb51, 0, 0],
  0x679: [0xfb67, 0xfb68, 0xfb69],
  0x67a: [0xfb5f, 0xfb60, 0xfb61],
  0x67b: [0xfb53, 0xfb54, 0xfb55],
  0x67e: [0xfb57, 0xfb58, 0xfb59],
  0x67f: [0xfb63, 0xfb64, 0xfb65],
  0x680: [0xfb5b, 0xfb5c, 0xfb5d],
  0x683: [0xfb77, 0xfb78, 0xfb79],
  0x684: [0xfb73, 0xfb74, 0xfb75],
  0x686: [0xfb7b, 0xfb7c, 0xfb7d],
  0x687: [0xfb7f, 0xfb80, 0xfb81],
  0x688: [0xfb89, 0, 0],
  0x68c: [0xfb85, 0, 0],
  0x68d: [0xfb83, 0, 0],
  0x68e: [0xfb87, 0, 0],
  0x691: [0xfb8d, 0, 0],
  0x698: [0xfb8b, 0, 0],
  0x6a4: [0xfb6b, 0xfb6c, 0xfb6d],
  0x6a6: [0xfb6f, 0xfb70, 0xfb71],
  0x6a9: [0xfb8f, 0xfb90, 0xfb91],
  0x6ad: [0xfbd4, 0xfbd5, 0xfbd6],
  0x6af: [0xfb93, 0xfb94, 0xfb95],
  0x6b1: [0xfb9b, 0xfb9c, 0xfb9d],
  0x6b3: [0xfb97, 0xfb98, 0xfb99],
  0x6ba: [0xfb9f, 0, 0],
  0x6bb: [0xfba1, 0xfba2, 0xfba3],
  0x6be: [0xfbab, 0xfbac, 0xfbad],
  0x6c0: [0xfba5, 0, 0],
  0x6c1: [0xfba7, 0xfba8, 0xfba9],
  0x6c5: [0xfbe1, 0, 0],
  0x6c6: [0xfbda, 0, 0],
  0x6c7: [0xfbd8, 0, 0],
  0x6c8: [0xfbdc, 0, 0],
  0x6c9: [0xfbe3, 0, 0],
  0x6cb: [0xfbdf, 0, 0],
  0x6cc: [0xfbfd, 0xfbfe, 0xfbff],
  0x6d0: [0xfbe5, 0xfbe6, 0xfbe7],
  0x6d2: [0xfbaf, 0, 0],
  0x6d3: [0xfbb1, 0, 0],
};

const LAM_ALEF: Record<number, [number, number]> = {
  0x0622: [0xfef5, 0xfef6],
  0x0623: [0xfef7, 0xfef8],
  0x0625: [0xfef9, 0xfefa],
  0x0627: [0xfefb, 0xfefc],
};

const TATWEEL = 0x0640;
const DIACRITICS = new Set<number>([
  0x0610, 0x0611, 0x0612, 0x0613, 0x0614, 0x0615,
  0x064b, 0x064c, 0x064d, 0x064e, 0x064f, 0x0650, 0x0651, 0x0652,
  0x0653, 0x0654, 0x0655, 0x0656, 0x0657, 0x0658, 0x0659, 0x065a,
  0x065b, 0x065c, 0x065d, 0x065e, 0x065f, 0x0670,
]);
const JOIN_CONTROLS = new Set<number>([0x0640, 0x200b, 0x200c, 0x200d]);

function joinsToNext(cp: number): boolean {
  const slot = AR_FORMS[cp];
  return !!slot && (slot[1] !== 0 || slot[2] !== 0);
}
function joinsToPrev(cp: number): boolean {
  const slot = AR_FORMS[cp];
  return !!slot && (slot[0] !== 0 || slot[2] !== 0);
}
function isLetter(cp: number): boolean {
  return cp >= 0x0621 && cp <= 0x06d3 && AR_FORMS[cp] !== undefined;
}

/** Nearest joining neighbor, skipping transparent marks; 0 at string edge. */
function neighbor(cps: number[], start: number, step: number): number {
  let j = start;
  while (j >= 0 && j < cps.length && (DIACRITICS.has(cps[j]) || (JOIN_CONTROLS.has(cps[j]) && cps[j] !== TATWEEL))) {
    j += step;
  }
  if (j < 0 || j >= cps.length) return 0;
  if (cps[j] === TATWEEL) return 0xdead; // sentinel: tatweel joins both ways
  return cps[j];
}

/**
 * Maps logical-order text with Arabic letters to logical-order Arabic
 * Presentation Forms. Any run with no Arabic letters is returned untouched.
 */
const AN_DIGITS: Record<number, string> = {};
for (let d = 0; d <= 9; d++) AN_DIGITS[0x0660 + d] = String(d);

export function shapeArabicForPdf(input: string): string {
  if (!input || !/[\u0621-\u06d3\u0660-\u0669]/.test(input)) return input;
  const cps: number[] = [];
  for (const ch of input) cps.push(ch.codePointAt(0) as number);
  const skip = new Set<number>();
  let out = "";
  for (let i = 0; i < cps.length; i++) {
    const cp = cps[i];
    if (AN_DIGITS[cp]) { out += AN_DIGITS[cp]; continue; }
    if (cp === 0x066a) { out += "%"; continue; }
    if (cp === 0x066b) { out += "."; continue; }
    if (DIACRITICS.has(cp)) {
      out += String.fromCodePoint(cp);
      continue;
    }
    if (cp === 0x200b || cp === 0x200c || cp === 0x200d) continue;
    if (cp === TATWEEL) {
      out += "\uFE7B";
      continue;
    }
    if (!isLetter(cp)) {
      out += String.fromCodePoint(cp);
      continue;
    }
    let prev = neighbor(cps, i - 1, -1);
    let next = neighbor(cps, i + 1, +1);
    if (skip.has(i)) continue;
    const joinPrev = prev === 0xdead || (prev !== 0 && joinsToNext(prev));
    const joinNext = next === 0xdead || (next !== 0 && joinsToPrev(next));
    // required lam-alef ligature when lam does not join backwards
    if (!joinPrev && cp === 0x0644 && LAM_ALEF[next]) {
      // ligature joins whatever follows the alef
      const after = neighbor(cps, i + 2, +1);
      const nextNext = LAM_ALEF[next];
      const ligFinal = after === 0xdead || (after !== 0 && joinsToPrev(after));
      out += String.fromCodePoint(ligFinal ? nextNext[1] : nextNext[0]);
      skip.add(i + 1 + (cps[i + 1] === next ? 0 : 0));
      // also skip any diacritics before the alef that we are inside of
      for (let j = i + 1; j < cps.length; j++) {
        if (cps[j] === next) { skip.add(j); break; }
        skip.add(j);
      }
      continue;
    }
    const slot = AR_FORMS[cp];
    let form: number;
    if (joinPrev && joinNext) form = slot[2] || slot[0];
    else if (joinPrev) form = slot[0];
    else if (joinNext) form = slot[1] || slot[0];
    else form = slot[0]; // isolated -> final (naskh equivalence)
    out += String.fromCodePoint(form);
  }
  return out;
}
