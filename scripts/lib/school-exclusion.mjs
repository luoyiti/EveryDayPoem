import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const genericTitles = new Set([
  "赤壁", "饮酒", "行路难", "无题", "相见欢", "渔家傲", "浣溪沙", "江城子",
  "水调歌头", "己亥杂诗", "满江红", "过秦论", "离骚", "归园田居", "拟行路难",
  "菩萨蛮", "虞美人", "望海潮", "桂枝香", "念奴娇", "鹊桥仙", "苏幕遮",
  "声声慢", "书愤", "永遇乐", "青玉案", "贺新郎", "扬州慢", "朝天子",
  "南乡子", "破阵子"
].map(normalizeText));

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFKC")
    .replace(/[《》〈〉「」『』【】\[\]()（）·•，。！？、；：:“”‘’'"\s\-—]/g, "")
    .replace(/曾皙/g, "曾晳")
    .replace(/陶潜/g, "陶渊明")
    .trim();
}

export async function loadSchoolExclusions(root) {
  const file = resolve(root, "data/school-curriculum-exclusions.json");
  return JSON.parse(await readFile(file, "utf8"));
}

function authorMatches(candidateAuthor, entryAuthor) {
  const candidate = normalizeText(candidateAuthor);
  const official = normalizeText(entryAuthor);
  if (!candidate) return false;
  if (official === "多作者") return true;
  return candidate === official || candidate.includes(official) || official.includes(candidate);
}

function incipitMatches(candidateIncipit, entryIncipit) {
  const candidate = normalizeText(candidateIncipit);
  const official = normalizeText(entryIncipit);
  if (!candidate || !official) return false;
  return candidate === official || (Math.min(candidate.length, official.length) >= 4 && (candidate.startsWith(official) || official.startsWith(candidate)));
}

export function findSchoolExclusion(entries, candidate) {
  const title = normalizeText(candidate.title);
  const author = candidate.author || "";
  const incipit = candidate.incipit || "";
  if (!title && !incipit) return null;

  for (const entry of entries) {
    const forms = [entry.title, ...(entry.aliases || [])].map(normalizeText);
    const matchingForm = forms.find((form) => title && form === title);
    const firstLineMatch = incipitMatches(incipit, entry.incipit);
    if (!matchingForm && !firstLineMatch) continue;

    const baseTitle = normalizeText((entry.aliases || []).find((alias) => genericTitles.has(normalizeText(alias))) || entry.title);
    const needsIdentityCheck = genericTitles.has(baseTitle) || genericTitles.has(title);
    if (!needsIdentityCheck || !author || authorMatches(author, entry.author) || firstLineMatch) {
      return { entry, matchedBy: firstLineMatch ? "incipit" : "title-or-alias" };
    }
  }

  return null;
}
