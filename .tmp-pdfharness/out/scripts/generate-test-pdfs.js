"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const renderer_1 = require("@react-pdf/renderer");
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const OUTPUT_DIR = path.join(PROJECT_ROOT, ".tmp-pdfharness", "output");
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
const FONT_DIR = path.join(PUBLIC_DIR, "fonts");
const LOGO_PATH = path.join(PUBLIC_DIR, "trennt-logo.png");
process.env.NEXT_PUBLIC_SITE_URL = "https://trennt.net";
const publicUrl = process.platform === "win32"
    ? "file:///" + PUBLIC_DIR.replace(/\\/g, "/")
    : "file://" + PUBLIC_DIR;
globalThis.window = {
    location: { origin: publicUrl },
};
globalThis.URL = URL;
try {
    renderer_1.Font.register({
        family: "NotoNaskhArabic",
        fonts: [
            {
                src: path.join(FONT_DIR, "NotoNaskhArabic-Regular.ttf"),
                fontWeight: "normal",
            },
            {
                src: path.join(FONT_DIR, "NotoNaskhArabic-Bold.ttf"),
                fontWeight: "bold",
            },
        ],
    });
    console.log("[harness] Arabic font registered OK");
}
catch (e) {
    console.warn("[harness] Arabic font register warning:", e);
}
const RESOLVED_LOGO = LOGO_PATH;
const RESOLVED_WORDMARK = LOGO_PATH;
globalThis.__pdfHarnessAssets = {
    logo: RESOLVED_LOGO,
    wordmark: RESOLVED_WORDMARK,
};
const pdf_generator_1 = require("../src/lib/pdf-generator");
const sampleResult = {
    id: "bench-test-001",
    overall: 68,
    scores: {
        governance: 72,
        risk: 65,
        execution: 70,
        reporting: 68,
        capability: 63,
    },
    tier: "defined",
    percentile: 58,
    questionCount: 26,
    createdAt: new Date("2026-10-03T10:00:00Z").toISOString(),
};
const sampleRespondent = {
    name: "Ahmed Al-Saud",
    email: "ahmed.alsaud@example.com",
    company: "Riyadh Industrial Holdings Co.",
    companySize: "250-999",
    industry: "Manufacturing",
    country: "Saudi Arabia",
    role: "Chief Audit Executive",
    consentContact: true,
};
const sampleStats = {
    totalAssessments: 342,
    averageOverall: 61,
    dimensionAverages: {
        governance: 63,
        risk: 58,
        execution: 62,
        reporting: 60,
        capability: 59,
    },
    tierDistribution: {
        initial: 12,
        developing: 88,
        defined: 141,
        established: 78,
        advanced: 23,
    },
    byIndustry: [
        { label: "Manufacturing", count: 57, average: 60 },
        { label: "Financial Services", count: 82, average: 67 },
        { label: "Healthcare", count: 41, average: 59 },
        { label: "Construction", count: 33, average: 58 },
        { label: "Retail", count: 48, average: 62 },
        { label: "Technology", count: 39, average: 65 },
    ],
    byCompanySize: [
        { label: "1-49", count: 64, average: 54 },
        { label: "50-249", count: 108, average: 59 },
        { label: "250-999", count: 112, average: 63 },
        { label: "1000+", count: 58, average: 68 },
    ],
    trend: [
        { weekStart: "2026-09-07", count: 38, average: 60 },
        { weekStart: "2026-09-14", count: 45, average: 62 },
        { weekStart: "2026-09-21", count: 52, average: 61 },
        { weekStart: "2026-09-28", count: 47, average: 61 },
    ],
    avgDurationSec: 645,
};
async function renderPdfToFile(element, outPath) {
    const { pdf } = await Promise.resolve().then(() => __importStar(require("@react-pdf/renderer")));
    const buffer = await pdf(element).toBuffer();
    fs.writeFileSync(outPath, buffer);
    const sizeKB = Math.round(buffer.length / 1024);
    console.log(`[harness] Wrote ${outPath} (${sizeKB} KB)`);
}
(async () => {
    try {
        const enPath = path.join(OUTPUT_DIR, "TRENNT-EN-Test-Report.pdf");
        const arPath = path.join(OUTPUT_DIR, "TRENNT-AR-Test-Report.pdf");
        console.log("[harness] Rendering English PDF...");
        await renderPdfToFile(React.createElement(pdf_generator_1.AssessmentPDFReport, {
            result: sampleResult,
            respondent: sampleRespondent,
            stats: sampleStats,
        }), enPath);
        console.log("[harness] Rendering Arabic PDF...");
        await renderPdfToFile(React.createElement(pdf_generator_1.AssessmentPDFReportArabic, {
            result: sampleResult,
            respondent: sampleRespondent,
            stats: sampleStats,
        }), arPath);
        console.log("\n========================================");
        console.log(" PDF Generation Results");
        console.log("========================================");
        console.log(` EN: ${enPath} (${Math.round(fs.statSync(enPath).size / 1024)} KB)`);
        console.log(` AR: ${arPath} (${Math.round(fs.statSync(arPath).size / 1024)} KB)`);
        console.log("========================================");
        process.exit(0);
    }
    catch (err) {
        console.error("[harness] FAILED:", err);
        process.exit(1);
    }
})();
