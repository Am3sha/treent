"use strict";
// ============================================================
// TRENNT — Internal Audit Capability Benchmark (shared scoring)
// Score math and constants ONLY — no question data here.
// The 26 client-approved questions live in benchmark-questions.ts
// so they can be code-split and loaded on-demand only when a
// user actually starts the benchmark, not on every page load.
// Front and back end: import questions from benchmark-questions.ts
// and import scoring math from this file as needed.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATURITY_LEVELS = exports.TOTAL_MAX_POINTS = exports.DOMAIN_MAX_POINTS = exports.DOMAIN_ORDER = void 0;
exports.calculateDomainScore = calculateDomainScore;
exports.calculateOverallScore = calculateOverallScore;
exports.getMaturityLevel = getMaturityLevel;
exports.getRecommendationBand = getRecommendationBand;
exports.calculateAllScores = calculateAllScores;
exports.computeResult = computeResult;
// ---------- Domain constants ----------
// Canonical ordering + membership used by every consumer (content.ts derives
// its DIMENSIONS array from DOMAIN_ORDER, the API validates against it).
// Display labels/descriptions live once, in content.ts DIMENSIONS.
exports.DOMAIN_ORDER = [
    "governance",
    "risk",
    "execution",
    "reporting",
    "capability",
];
exports.DOMAIN_MAX_POINTS = {
    governance: 15,
    risk: 15,
    execution: 18,
    reporting: 15,
    capability: 15,
};
exports.TOTAL_MAX_POINTS = 78;
function calculateDomainScore(answers, domain) {
    const maxPoints = exports.DOMAIN_MAX_POINTS[domain];
    const earned = answers
        .filter((a) => a.domain === domain)
        .reduce((sum, a) => sum + a.score, 0);
    if (maxPoints === 0)
        return 0;
    return (earned / maxPoints) * 100;
}
function calculateOverallScore(answers) {
    const earned = answers.reduce((sum, a) => sum + a.score, 0);
    return (earned / exports.TOTAL_MAX_POINTS) * 100;
}
exports.MATURITY_LEVELS = [
    { level: "initial", label: "Initial" },
    { level: "developing", label: "Developing" },
    { level: "defined", label: "Defined" },
    { level: "established", label: "Established" },
    { level: "advanced", label: "Advanced" },
];
function getMaturityLevel(score) {
    const clamped = Math.min(100, Math.max(0, Math.round(score)));
    if (clamped <= 20)
        return exports.MATURITY_LEVELS[0];
    if (clamped <= 40)
        return exports.MATURITY_LEVELS[1];
    if (clamped <= 60)
        return exports.MATURITY_LEVELS[2];
    if (clamped <= 80)
        return exports.MATURITY_LEVELS[3];
    return exports.MATURITY_LEVELS[4];
}
function getRecommendationBand(score) {
    const clamped = Math.min(100, Math.max(0, Math.round(score)));
    if (clamped <= 40)
        return "low";
    if (clamped <= 70)
        return "mid";
    return "high";
}
function calculateAllScores(answers) {
    return {
        overall: calculateOverallScore(answers),
        domains: Object.fromEntries(exports.DOMAIN_ORDER.map((d) => [d, calculateDomainScore(answers, d)])),
        maturity: getMaturityLevel(calculateOverallScore(answers)),
        band: getRecommendationBand(calculateOverallScore(answers)),
    };
}
function computeResult(answers) {
    const overall = Math.round(calculateOverallScore(answers));
    return {
        overall,
        scores: Object.fromEntries(exports.DOMAIN_ORDER.map((d) => [d, Math.round(calculateDomainScore(answers, d))])),
        tier: getMaturityLevel(overall).level,
        band: getRecommendationBand(overall),
    };
}
