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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentPDFReportArabic = exports.AssessmentPDFReport = void 0;
exports.generatePDF = generatePDF;
const jsx_runtime_1 = require("react/jsx-runtime");
const renderer_1 = require("@react-pdf/renderer");
const content_1 = require("./content");
const benchmark_ar_1 = require("./translations/benchmark-ar");
const arabic_pdf_shaper_1 = require("./arabic-pdf-shaper");
const site_config_1 = require("./site-config");
const COLORS = {
    primary: "#003D3C",
    dark: "#121212",
    accent: "#ADDFB3",
    soft: "#D5EBD6",
    white: "#FFFFFF",
    muted: "#6B7280",
    border: "#E5E7EB",
    track: "#F3F4F6",
};
const resolveAsset = (path) => {
    if (typeof window !== "undefined") {
        try {
            return new URL(path, window.location.origin).href;
        }
        catch (_a) {
            return path;
        }
    }
    return path;
};
const LOGO_ICON = resolveAsset("/trennt-logo.png");
const LOGO_WORDMARK = resolveAsset("/trennt-logo.png");
// ---------------------------------------------------------------------------
// Arabic font registration
// ---------------------------------------------------------------------------
// Using Noto Naskh Arabic — an open-licence SIL OFL font designed for long
// document / book-style Arabic text with excellent ligature and vowel support.
//
// The font files are bundled under public/fonts so PDF generation does not
// depend on runtime CDN access from the browser.
try {
    renderer_1.Font.register({
        family: "NotoNaskhArabic",
        fonts: [
            {
                src: "/fonts/NotoNaskhArabic-Regular.ttf",
                fontWeight: "normal",
            },
            {
                src: "/fonts/NotoNaskhArabic-Bold.ttf",
                fontWeight: "bold",
            },
        ],
    });
}
catch (e) {
    console.warn("[PDF] Arabic font registration failed (non-critical for EN flow):", e);
}
const AR_FONT = "NotoNaskhArabic";
// Recursively apply Arabic presentation-form shaping to Text content so the
// react-pdf pipeline never has to perform GSUB shaping itself.
const shapeChildren = (node) => {
    if (typeof node === "string")
        return (0, arabic_pdf_shaper_1.shapeArabicForPdf)(node);
    if (Array.isArray(node))
        return node.map(shapeChildren);
    return node;
};
const ArabicText = (_a) => {
    var { children, render } = _a, props = __rest(_a, ["children", "render"]);
    const safeContent = children === undefined || children === null ? "" : children;
    return ((0, jsx_runtime_1.jsx)(renderer_1.Text, Object.assign({}, props, (typeof render === "function"
        ? { render: (args) => String((0, arabic_pdf_shaper_1.shapeArabicForPdf)(String(render(args)))) }
        : {}), { children: shapeChildren(safeContent) })));
};
// ---------------------------------------------------------------------------
// English styles (unchanged, preserve exact PDF output)
// ---------------------------------------------------------------------------
const styles = renderer_1.StyleSheet.create({
    page: {
        paddingTop: 36,
        paddingBottom: 48,
        paddingHorizontal: 46,
        backgroundColor: COLORS.white,
        fontFamily: "Helvetica",
        fontSize: 8.5,
        color: COLORS.dark,
        position: "relative",
    },
    coverPage: {
        paddingTop: 34,
        paddingBottom: 48,
        paddingHorizontal: 46,
        backgroundColor: COLORS.white,
        fontFamily: "Helvetica",
        color: COLORS.dark,
        position: "relative",
    },
    pageHeader: {
        position: "absolute",
        top: 20,
        left: 46,
        right: 46,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    headerLogo: {
        width: 26,
        height: 26,
    },
    headerRule: {
        position: "absolute",
        top: 42,
        left: 46,
        right: 46,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    footer: {
        position: "absolute",
        bottom: 24,
        left: 46,
        right: 46,
    },
    footerRule: {
        borderTopWidth: 0.5,
        borderTopColor: COLORS.primary,
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    footerLogo: {
        width: 17,
        height: 17,
    },
    footerText: {
        fontSize: 6,
        color: COLORS.muted,
    },
    footerPage: {
        fontSize: 6,
        color: COLORS.muted,
    },
    coverLogo: {
        width: 52,
        height: 52,
        marginBottom: 14,
    },
    coverEyebrow: {
        fontSize: 7,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        color: COLORS.primary,
        marginBottom: 10,
    },
    coverTitle: {
        fontSize: 23,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
        marginBottom: 7,
        letterSpacing: -0.3,
        lineHeight: 1.15,
    },
    coverSubtitle: {
        fontSize: 10.5,
        color: COLORS.muted,
        marginBottom: 26,
        lineHeight: 1.4,
    },
    coverMetaBlock: {
        borderTopWidth: 1,
        borderTopColor: COLORS.primary,
        paddingTop: 14,
        maxWidth: 320,
    },
    coverMetaRow: {
        flexDirection: "row",
        marginBottom: 7,
    },
    coverMetaLabel: {
        width: 96,
        fontSize: 6.5,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: COLORS.muted,
    },
    coverMetaValue: {
        flex: 1,
        fontSize: 10.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.dark,
    },
    coverDate: {
        marginTop: 14,
        fontSize: 7.5,
        color: COLORS.muted,
    },
    preparedForLine: {
        marginTop: 14,
        fontSize: 7.5,
        color: COLORS.muted,
        fontStyle: "italic",
    },
    sectionHeading: {
        fontSize: 10.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
        marginBottom: 3,
    },
    sectionRule: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        marginBottom: 10,
        paddingBottom: 4,
    },
    sectionSubheading: {
        fontSize: 7.5,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: COLORS.muted,
        marginBottom: 6,
        marginTop: 8,
    },
    execMetricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    execBlock: {
        borderTopWidth: 1,
        borderTopColor: COLORS.primary,
        paddingTop: 16,
        marginTop: 16,
    },
    metricBlock: {
        flex: 1,
    },
    metricLabel: {
        fontSize: 6,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color: COLORS.muted,
        marginBottom: 3,
    },
    metricValueLarge: {
        fontSize: 28,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
        letterSpacing: -0.8,
    },
    metricValueMedium: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
    },
    metricSuffix: {
        fontSize: 11,
        color: COLORS.muted,
        fontFamily: "Helvetica",
    },
    summaryQuote: {
        fontSize: 8.5,
        lineHeight: 1.45,
        color: COLORS.dark,
        borderLeftWidth: 2,
        borderLeftColor: COLORS.accent,
        paddingLeft: 10,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        paddingBottom: 3,
        marginBottom: 1,
    },
    tableHeaderCell: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color: COLORS.primary,
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    tableRowAlt: {
        backgroundColor: "#F4F9F4",
    },
    tableCell: {
        fontSize: 7.5,
        color: COLORS.dark,
    },
    tableCellScore: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
        textAlign: "right",
    },
    barTrack: {
        height: 5,
        backgroundColor: COLORS.track,
        flex: 1,
        marginHorizontal: 6,
    },
    barFill: {
        height: 5,
        backgroundColor: COLORS.primary,
    },
    dimTwoCol: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 6,
    },
    dimCard: {
        width: "48%",
        paddingVertical: 2,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    dimHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 1,
    },
    dimTitle: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
    },
    dimScore: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
    },
    dimDetail: {
        fontSize: 7.5,
        color: COLORS.muted,
        lineHeight: 1.25,
        marginTop: 1,
    },
    dimLabel: {
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
    },
    chartCaption: {
        fontSize: 6,
        color: COLORS.muted,
        marginTop: 6,
        textAlign: "center",
    },
    benchmarkSection: {
        marginTop: 6,
        paddingTop: 4,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
    },
    peerMetricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    peerBlock: {
        flex: 1,
    },
    peerValue: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
    },
    peerSuffix: {
        fontSize: 6,
        color: COLORS.muted,
    },
    compactBar: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    compactBarLabel: {
        width: 88,
        fontSize: 6,
        color: COLORS.dark,
    },
    listsRow: {
        flexDirection: "row",
        gap: 16,
        marginTop: 6,
    },
    listColumn: {
        flex: 1,
    },
    listTitle: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color: COLORS.primary,
        marginBottom: 4,
        paddingBottom: 3,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 2,
        fontSize: 7,
        lineHeight: 1.25,
    },
    bullet: {
        width: 10,
        color: COLORS.primary,
        fontFamily: "Helvetica-Bold",
    },
    roadmapSection: {
        marginBottom: 10,
        padding: 9,
        backgroundColor: "#F8FAFC",
        borderRadius: 6,
        borderRightWidth: 4,
        borderRightColor: COLORS.primary,
    },
    roadmapHeaderBox: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.soft,
        paddingBottom: 6,
        marginBottom: 10,
    },
    roadmapTitle: {
        fontSize: 10.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
        textAlign: "left",
    },
    roadmapBody: {
        paddingRight: 2,
    },
    roadmapText: {
        fontSize: 11,
        lineHeight: 1.6,
        color: COLORS.dark,
        marginBottom: 8,
        textAlign: "right",
    },
    confidentiality: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
        fontSize: 7.5,
        color: COLORS.muted,
        lineHeight: 1.4,
        textAlign: "center",
    },
    preparedByRow: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    metaLabelSmall: {
        fontSize: 7,
        color: COLORS.muted,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    metaValueSmall: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
    },
});
// ---------------------------------------------------------------------------
// Arabic styles (mirrored RTL layout + Arabic font)
// ---------------------------------------------------------------------------
const arStyles = renderer_1.StyleSheet.create({
    page: {
        paddingTop: 36,
        paddingBottom: 48,
        paddingHorizontal: 46,
        backgroundColor: COLORS.white,
        fontFamily: AR_FONT,
        fontSize: 9,
        color: COLORS.dark,
        position: "relative",
        direction: "rtl",
    },
    coverPage: {
        paddingTop: 34,
        paddingBottom: 48,
        paddingHorizontal: 46,
        backgroundColor: COLORS.white,
        fontFamily: AR_FONT,
        color: COLORS.dark,
        position: "relative",
        direction: "rtl",
    },
    pageHeader: {
        position: "absolute",
        top: 20,
        left: 46,
        right: 46,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    headerLogo: {
        width: 26,
        height: 26,
    },
    headerRule: {
        position: "absolute",
        top: 42,
        left: 46,
        right: 46,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    footer: {
        position: "absolute",
        bottom: 24,
        left: 46,
        right: 46,
    },
    footerRule: {
        borderTopWidth: 0.5,
        borderTopColor: COLORS.primary,
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    footerLogo: {
        width: 17,
        height: 17,
    },
    footerText: {
        fontSize: 7.5,
        color: COLORS.muted,
    },
    footerPage: {
        fontSize: 7.5,
        color: COLORS.muted,
    },
    coverLogo: {
        width: 52,
        height: 52,
        marginBottom: 14,
    },
    coverEyebrow: {
        fontSize: 8,
        color: COLORS.primary,
        marginBottom: 10,
        textAlign: "right",
    },
    coverTitle: {
        fontSize: 23,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 7,
        lineHeight: 1.25,
        textAlign: "right",
    },
    coverSubtitle: {
        fontSize: 11,
        color: COLORS.muted,
        marginBottom: 20,
        lineHeight: 1.5,
        textAlign: "right",
    },
    coverMetaBlock: {
        borderTopWidth: 1,
        borderTopColor: COLORS.primary,
        paddingTop: 12,
        maxWidth: 340,
    },
    coverMetaRow: {
        flexDirection: "row-reverse",
        marginBottom: 5,
    },
    coverMetaLabel: {
        width: 105,
        fontSize: 8,
        color: COLORS.muted,
        fontWeight: "bold",
        textAlign: "right",
    },
    coverMetaValue: {
        flex: 1,
        fontSize: 10,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.dark,
    },
    coverDate: {
        marginTop: 10,
        fontSize: 8.5,
        color: COLORS.muted,
        textAlign: "right",
    },
    preparedForLine: {
        marginTop: 10,
        fontSize: 8.5,
        color: COLORS.muted,
        textAlign: "right",
    },
    sectionHeading: {
        fontSize: 15.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 4,
        marginTop: 0,
        textAlign: "right",
    },
    sectionRule: {
        borderBottomWidth: 1.5,
        borderBottomColor: COLORS.primary,
        marginBottom: 10,
        paddingBottom: 2,
    },
    execMetricsRow: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    execBlock: {
        borderTopWidth: 1,
        borderTopColor: COLORS.primary,
        paddingTop: 14,
        marginTop: 14,
    },
    metricBlock: {
        flex: 1,
    },
    metricLabel: {
        fontSize: 7.5,
        color: COLORS.muted,
        fontWeight: "bold",
        marginBottom: 3,
        textAlign: "right",
    },
    metricValueLarge: {
        fontSize: 28,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    metricValueMedium: {
        fontSize: 13,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    metricSuffix: {
        fontSize: 11,
        color: COLORS.muted,
        fontFamily: AR_FONT,
    },
    summaryQuote: {
        fontSize: 9.5,
        lineHeight: 1.5,
        color: COLORS.dark,
        borderRightWidth: 2,
        borderRightColor: COLORS.accent,
        paddingRight: 10,
        textAlign: "right",
    },
    tableHeader: {
        flexDirection: "row-reverse",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        paddingBottom: 3,
        marginBottom: 1,
    },
    tableHeaderCell: {
        fontSize: 8,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    tableRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    tableCell: {
        fontSize: 8.5,
        color: COLORS.dark,
    },
    tableCellScore: {
        fontSize: 8.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "left",
    },
    dimTwoCol: {
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 6,
        marginBottom: 10,
    },
    dimCard: {
        width: "48%",
        padding: 7,
        backgroundColor: "#F8FAFC",
        borderRadius: 6,
        borderRightWidth: 3,
        borderRightColor: COLORS.primary,
        marginBottom: 6,
    },
    dimHeader: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        paddingBottom: 3,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    dimTitle: {
        fontSize: 12,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    dimScore: {
        fontSize: 12,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    dimDetail: {
        fontSize: 11,
        color: COLORS.dark,
        lineHeight: 1.5,
        marginTop: 3,
        textAlign: "right",
    },
    dimLabel: {
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    chartCaption: {
        fontSize: 8.5,
        color: COLORS.muted,
        marginTop: 6,
        textAlign: "center",
    },
    benchmarkSection: {
        marginTop: 6,
        paddingTop: 4,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
    },
    peerMetricsRow: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        gap: 10,
        marginVertical: 12,
    },
    peerBlock: {
        flex: 1,
        padding: 8,
        backgroundColor: "#F8FAFC",
        borderRadius: 5,
        borderRightWidth: 2.5,
        borderRightColor: COLORS.accent,
    },
    peerValue: {
        fontSize: 12.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "right",
    },
    peerSuffix: {
        fontSize: 8.5,
        color: COLORS.muted,
    },
    compactBar: {
        flexDirection: "row-reverse",
        alignItems: "center",
        marginBottom: 6,
    },
    compactBarLabel: {
        width: 110,
        fontSize: 9.5,
        color: COLORS.dark,
        textAlign: "right",
    },
    listsRow: {
        flexDirection: "row-reverse",
        gap: 12,
        marginTop: 8,
    },
    listColumn: {
        flex: 1,
    },
    listTitle: {
        fontSize: 11.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 6,
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        textAlign: "right",
    },
    listItem: {
        flexDirection: "row-reverse",
        marginBottom: 4,
        fontSize: 10.5,
        lineHeight: 1.45,
    },
    bullet: {
        width: 10,
        color: COLORS.primary,
        fontFamily: AR_FONT,
        fontWeight: "bold",
    },
    roadmapSection: {
        marginBottom: 10,
        padding: 9,
        backgroundColor: "#F8FAFC",
        borderRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    roadmapTitle: {
        fontSize: 15.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 6,
        textAlign: "right",
    },
    roadmapBody: {
        paddingLeft: 2,
    },
    confidentiality: {
        marginTop: 12,
        paddingTop: 6,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
        fontSize: 7.5,
        color: COLORS.muted,
        lineHeight: 1.35,
        textAlign: "center",
    },
    preparedByRow: {
        marginTop: 10,
        flexDirection: "row-reverse",
        justifyContent: "space-between",
    },
    metaLabelSmall: {
        fontSize: 7,
        color: COLORS.muted,
        fontWeight: "bold",
        marginBottom: 2,
        textAlign: "right",
    },
    metaValueSmall: {
        fontSize: 9,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "right",
    },
    p3HeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        marginTop: 4,
    },
    p3Logo: {
        width: 54,
        height: 24,
    },
    p3HeaderTitle: {
        fontSize: 18,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    p3HeaderRule: {
        borderBottomWidth: 1.5,
        borderBottomColor: COLORS.primary,
        marginBottom: 20,
    },
    p3PhaseBlock: {
        marginBottom: 10,
    },
    p3PhaseHeading: {
        fontSize: 15.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 10,
        textAlign: "right",
    },
    p3PhaseBody: {
        paddingRight: 2,
    },
    p3RecParagraph: {
        fontSize: 13.5,
        lineHeight: 1.6,
        color: COLORS.dark,
        marginBottom: 14,
        textAlign: "right",
    },
    p3PhaseDivider: {
        borderBottomWidth: 0.5,
        borderBottomColor: "#CBD5E1",
        marginVertical: 14,
    },
    p3FooterContainer: {
        marginTop: "auto",
        paddingTop: 16,
    },
    p3FooterRule: {
        borderTopWidth: 1,
        borderTopColor: COLORS.primary,
        marginBottom: 12,
    },
    p3FooterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    p3FooterLabel: {
        fontSize: 8.5,
        color: COLORS.muted,
        fontWeight: "bold",
        marginBottom: 2,
    },
    p3FooterValue: {
        fontSize: 10.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    p3Confidentiality: {
        fontSize: 8.5,
        color: COLORS.muted,
        lineHeight: 1.45,
        textAlign: "center",
        marginTop: 4,
        marginBottom: 6,
    },
    p3PageNumber: {
        fontSize: 8.5,
        color: COLORS.muted,
        textAlign: "center",
    },
});
// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const computeComparison = (result, respondent, stats) => {
    var _a, _b, _c;
    const total = (_a = stats === null || stats === void 0 ? void 0 : stats.totalAssessments) !== null && _a !== void 0 ? _a : 0;
    let industryAvg = null;
    if ((respondent === null || respondent === void 0 ? void 0 : respondent.industry) && stats && Array.isArray(stats.byIndustry) && total > 0) {
        const needle = respondent.industry.trim().toLowerCase();
        const match = stats.byIndustry.find((r) => (r === null || r === void 0 ? void 0 : r.label) && r.label.toLowerCase() === needle);
        industryAvg = match ? match.average : ((_b = stats.averageOverall) !== null && _b !== void 0 ? _b : null);
    }
    const globalAvg = total > 0 ? ((_c = stats === null || stats === void 0 ? void 0 : stats.averageOverall) !== null && _c !== void 0 ? _c : null) : null;
    return { industryAvg, globalAvg, total };
};
const EN_DIMENSION_DATA = {
    governance: {
        strength: "Clear reporting line to the Audit Committee or Board, with a formally approved and regularly reviewed charter.",
        improvement: "Strengthen independence safeguards and formalise governing-body evaluation of the CAE.",
    },
    risk: {
        strength: "Independently developed, risk-based audit planning aligned to the organisation's key risks.",
        improvement: "Update the risk assessment continuously and strengthen coordination with other assurance providers.",
    },
    execution: {
        strength: "Risk-based scope setting, documented supervisory review, and consistent delivery against deadlines.",
        improvement: "Standardise engagement methodology and deepen engagement-level risk assessments.",
    },
    reporting: {
        strength: "On-time reporting with action tracking against defined due dates and clear escalation criteria.",
        improvement: "Formalise follow-up discipline and define audit performance measures beyond plan completion.",
    },
    capability: {
        strength: "Structured competency assessment with development plans linked to identified gaps.",
        improvement: "Mature the QAIP toward external assessment readiness and expand specialist expertise access.",
    },
};
const bandFor = (score) => {
    if (score < 40)
        return "low";
    if (score < 70)
        return "mid";
    return "high";
};
// ---------------------------------------------------------------------------
// ENGLISH chart + layout components (preserved exactly)
// ---------------------------------------------------------------------------
const DimensionBarChart = ({ scores }) => {
    const trackWidth = 150;
    const rowHeight = 17;
    return ((0, jsx_runtime_1.jsx)(renderer_1.View, { children: content_1.DIMENSIONS.map((d) => {
            const score = scores[d.key];
            const fillWidth = Math.max(0, Math.min(trackWidth, (score / 100) * trackWidth));
            return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { flexDirection: "row", alignItems: "center", height: rowHeight }, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { width: 60, fontSize: 6.5, color: COLORS.dark }, children: d.short }), (0, jsx_runtime_1.jsxs)(renderer_1.Svg, { width: trackWidth + 2, height: 7, children: [(0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: 0, y: 1, width: trackWidth, height: 5, fill: COLORS.track }), (0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: 0, y: 1, width: fillWidth, height: 5, fill: COLORS.primary })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { width: 26, fontSize: 7, fontFamily: "Helvetica-Bold", color: COLORS.primary, textAlign: "right", marginLeft: 5 }, children: score })] }, d.key));
        }) }));
};
const CompactBenchmarkBars = ({ score, industryAvg, globalAvg, }) => {
    const trackWidth = 170;
    const bars = [{ label: "Your Org", value: score }];
    if (industryAvg !== null)
        bars.push({ label: "Industry Avg", value: industryAvg });
    if (globalAvg !== null)
        bars.push({ label: "Global Avg", value: globalAvg });
    return ((0, jsx_runtime_1.jsx)(renderer_1.View, { children: bars.map((bar) => {
            const fillWidth = Math.max(0, Math.min(trackWidth, (bar.value / 100) * trackWidth));
            return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.compactBar, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.compactBarLabel, children: bar.label }), (0, jsx_runtime_1.jsxs)(renderer_1.Svg, { width: trackWidth + 2, height: 7, children: [(0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: 0, y: 1, width: trackWidth, height: 5, fill: COLORS.track }), (0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: 0, y: 1, width: fillWidth, height: 5, fill: COLORS.primary })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { width: 26, fontSize: 7, fontFamily: "Helvetica-Bold", color: COLORS.primary, textAlign: "right", marginLeft: 5 }, children: bar.value })] }, bar.label));
        }) }));
};
const PageHeader = () => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { children: [(0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.pageHeader, fixed: true, children: (0, jsx_runtime_1.jsx)(renderer_1.Image, { src: LOGO_ICON, style: styles.headerLogo }) }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.headerRule, fixed: true })] }));
const PageFooter = () => ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.footer, fixed: true, children: (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.footerRule, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.footerLeft, children: [(0, jsx_runtime_1.jsx)(renderer_1.Image, { src: LOGO_ICON, style: styles.footerLogo }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.footerText, children: `Prepared by TRENNT — Internal Audit Specialists · ${(0, site_config_1.getSiteDomain)()}` })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.footerPage, render: ({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}` })] }) }));
// ---------------------------------------------------------------------------
// ARABIC chart + layout components (RTL + Arabic labels)
// ---------------------------------------------------------------------------
const DimensionBarChartArabic = ({ scores }) => {
    const trackWidth = 200;
    const rowHeight = 22;
    return ((0, jsx_runtime_1.jsx)(renderer_1.View, { children: content_1.DIMENSIONS.map((d) => {
            var _a;
            const score = (_a = scores[d.key]) !== null && _a !== void 0 ? _a : 50;
            const fillWidth = Math.max(0, Math.min(trackWidth, (score / 100) * trackWidth));
            const dim = benchmark_ar_1.BENCHMARK_ARABIC_DIMENSIONS[d.key] || { label: d.label, short: d.short };
            return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { flexDirection: "row-reverse", alignItems: "center", height: rowHeight, marginBottom: 2 }, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: { width: 110, fontSize: 9.5, color: COLORS.dark, textAlign: "right", fontFamily: AR_FONT }, children: dim.short }), (0, jsx_runtime_1.jsxs)(renderer_1.Svg, { width: trackWidth + 2, height: 9, children: [(0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: 0, y: 1, width: trackWidth, height: 7, fill: COLORS.track, rx: 2 }), (0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: trackWidth - fillWidth, y: 1, width: fillWidth, height: 7, fill: COLORS.primary, rx: 2 })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { width: 32, fontSize: 9.5, fontFamily: AR_FONT, fontWeight: "bold", color: COLORS.primary, textAlign: "left", marginRight: 6 }, children: score })] }, d.key));
        }) }));
};
const CompactBenchmarkBarsArabic = ({ score, industryAvg, globalAvg, }) => {
    const trackWidth = 220;
    const shapedBars = [
        { label: "منظمتك", value: score, isAvailable: true },
        { label: "متوسط القطاع", value: industryAvg, isAvailable: industryAvg !== null },
        { label: "المتوسط العام", value: globalAvg, isAvailable: globalAvg !== null },
    ];
    return ((0, jsx_runtime_1.jsx)(renderer_1.View, { children: shapedBars.map((bar) => {
            var _a;
            const val = (_a = bar.value) !== null && _a !== void 0 ? _a : 0;
            const fillWidth = Math.max(0, Math.min(trackWidth, (val / 100) * trackWidth));
            return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.compactBar, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.compactBarLabel, children: bar.label }), bar.isAvailable ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(renderer_1.Svg, { width: trackWidth + 2, height: 9, children: [(0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: 0, y: 1, width: trackWidth, height: 7, fill: COLORS.track, rx: 2 }), (0, jsx_runtime_1.jsx)(renderer_1.Rect, { x: trackWidth - fillWidth, y: 1, width: fillWidth, height: 7, fill: COLORS.primary, rx: 2 })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { width: 32, fontSize: 9.5, fontFamily: AR_FONT, fontWeight: "bold", color: COLORS.primary, textAlign: "left", marginRight: 6 }, children: val })] })) : ((0, jsx_runtime_1.jsx)(ArabicText, { style: { fontSize: 9, color: COLORS.muted, textAlign: "right" }, children: "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D" }))] }, bar.label));
        }) }));
};
const PageHeaderArabic = () => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { children: [(0, jsx_runtime_1.jsx)(renderer_1.View, { style: arStyles.pageHeader, fixed: true, children: (0, jsx_runtime_1.jsx)(renderer_1.Image, { src: LOGO_ICON, style: arStyles.headerLogo }) }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: arStyles.headerRule, fixed: true })] }));
const PageFooterArabicClean = () => ((0, jsx_runtime_1.jsx)(renderer_1.View, { style: arStyles.footer, fixed: true, children: (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.footerRule, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.footerPage, render: ({ pageNumber, totalPages }) => `صفحة ${pageNumber} من ${totalPages}` }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.footerLeft, children: [(0, jsx_runtime_1.jsx)(renderer_1.Image, { src: LOGO_ICON, style: arStyles.footerLogo }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.footerText, children: `أعده: ترينت — متخصصو المراجعة الداخلية · ${(0, site_config_1.getSiteDomain)()}` })] })] }) }));
// ---------------------------------------------------------------------------
// ENGLISH report (untouched — keep it 100% identical)
// ---------------------------------------------------------------------------
const AssessmentPDFReport = ({ result, respondent, stats, }) => {
    var _a;
    const tierMeta = content_1.TIER_META[result.tier];
    const recs = content_1.TIER_RECOMMENDATIONS[result.tier];
    const dateStr = new Date(result.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const sortedDim = content_1.DIMENSIONS.map((d) => ({ key: d.key, label: d.label, score: result.scores[d.key] }))
        .sort((a, b) => b.score - a.score);
    const topStrengths = sortedDim.slice(0, 3);
    const topOpportunities = sortedDim.slice(-3).reverse();
    const { industryAvg, globalAvg } = computeComparison(result, respondent, stats);
    const preparedForText = (respondent === null || respondent === void 0 ? void 0 : respondent.name) && (respondent === null || respondent === void 0 ? void 0 : respondent.company)
        ? `Prepared for: ${respondent.name}, ${respondent.company}`
        : (respondent === null || respondent === void 0 ? void 0 : respondent.company)
            ? `Prepared for: ${respondent.company}`
            : (respondent === null || respondent === void 0 ? void 0 : respondent.name)
                ? `Prepared for: ${respondent.name}`
                : "";
    return ((0, jsx_runtime_1.jsxs)(renderer_1.Document, { title: `TRENNT Executive Report - ${(respondent === null || respondent === void 0 ? void 0 : respondent.company) || "Confidential"}`, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.coverPage, children: [(0, jsx_runtime_1.jsx)(renderer_1.Image, { src: LOGO_WORDMARK, style: styles.coverLogo }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverEyebrow, children: "Confidential \u00B7 Executive Assessment" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.coverTitle, children: ["Internal Audit Maturity", "\n", "Benchmark Report"] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaBlock, children: [(respondent === null || respondent === void 0 ? void 0 : respondent.company) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Organisation" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: respondent.company })] })), (respondent === null || respondent === void 0 ? void 0 : respondent.industry) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Industry" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: respondent.industry })] })), (respondent === null || respondent === void 0 ? void 0 : respondent.companySize) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Company Size" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: respondent.companySize })] })), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Maturity Tier" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: result.tier })] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.coverDate, children: ["Report Date \u00B7 ", dateStr] }), preparedForText && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.preparedForLine, children: preparedForText }))] }), (0, jsx_runtime_1.jsx)(PageFooter, {})] }), (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.execBlock, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.execMetricsRow, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.metricBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Overall Maturity Score" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.metricValueLarge, children: [result.overall, (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricSuffix, children: "/100" })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.metricBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Maturity Tier" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricValueMedium, children: result.tier })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.metricBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Benchmark Percentile" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.metricValueMedium, children: [result.percentile, "th"] })] })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.summaryQuote, children: tierMeta.summary })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionHeading, children: "Dimension Analysis" }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.sectionRule }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { marginTop: 6, marginBottom: 4, alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(DimensionBarChart, { scores: result.scores }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.chartCaption, children: "Figure 1 \u2014 Maturity Score by Dimension" })] }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.dimTwoCol, wrap: false, children: content_1.DIMENSIONS.map((d) => {
                            const data = EN_DIMENSION_DATA[d.key];
                            return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.dimCard, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.dimHeader, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.dimTitle, children: d.label }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.dimScore, children: [result.scores[d.key], "/100"] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.dimDetail, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.dimLabel, children: "Strength: " }), data.strength] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.dimDetail, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.dimLabel, children: "Improvement: " }), data.improvement] })] }, d.key));
                        }) }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.benchmarkSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionHeading, children: "Benchmark & Peer Comparison" }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.sectionRule }), (0, jsx_runtime_1.jsx)(CompactBenchmarkBars, { score: result.overall, industryAvg: industryAvg, globalAvg: globalAvg }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.peerMetricsRow, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.peerBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Industry Avg" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.peerValue, children: [industryAvg !== null && industryAvg !== void 0 ? industryAvg : "—", (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.peerSuffix, children: " / 100" })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.peerBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Benchmarked Organisations" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.peerValue, children: [((_a = stats === null || stats === void 0 ? void 0 : stats.totalAssessments) !== null && _a !== void 0 ? _a : 0), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.peerSuffix, children: " total" })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.peerBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Global Percentile" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.peerValue, children: [result.percentile, (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.peerSuffix, children: "th" })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listsRow, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listColumn, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.listTitle, children: "Top 3 Strengths" }), topStrengths.map((s, idx) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { children: [s.label, " (", s.score, "/100)"] })] }, idx)))] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listColumn, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.listTitle, children: "Top 3 Focus Areas" }), topOpportunities.map((s, idx) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { children: [s.label, " (", s.score, "/100)"] })] }, idx)))] })] })] }), (0, jsx_runtime_1.jsx)(PageFooter, {})] }), (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.sectionHeading, children: "Strategic Recommendations" }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: styles.sectionRule }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.roadmapSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.roadmapTitle, children: "Phase 1: Immediate Priorities (0\u201330 Days)" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { paddingLeft: 2 }, wrap: false, children: [recs.slice(0, 1).map((r, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { fontSize: 8, lineHeight: 1.35 }, children: r })] }, i))), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: { fontSize: 8, lineHeight: 1.35 }, children: ["Assess current control environment maturity in the ", topOpportunities[0].label, " dimension and establish a remediation plan with clear ownership and timelines."] })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.roadmapSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.roadmapTitle, children: "Phase 2: Medium-Term Enhancement (30\u201390 Days)" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { paddingLeft: 2 }, wrap: false, children: [recs.slice(1, 2).map((r, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { fontSize: 8, lineHeight: 1.35 }, children: r })] }, i))), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: { fontSize: 8, lineHeight: 1.35 }, children: ["Formalise governance and quality assurance frameworks for ", topOpportunities[1].label, " to ensure consistent methodology, control evidence integrity, and audit standard conformance."] })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.roadmapSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.roadmapTitle, children: "Phase 3: Long-Term Operationalisation (90\u2013180 Days)" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { paddingLeft: 2 }, wrap: false, children: [recs.slice(2, 3).map((r, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: { fontSize: 8, lineHeight: 1.35 }, children: r })] }, i))), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.bullet, children: "\u2014" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: { fontSize: 8, lineHeight: 1.35 }, children: ["Embed ", topStrengths[0].label, " capabilities into the broader internal audit operating model to drive compounded assurance coverage and risk insight value for the Audit Committee."] })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.preparedByRow, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metaLabelSmall, children: "Prepared by" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metaValueSmall, children: "TRENNT \u2014 Internal Audit Specialists" })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { textAlign: "right" }, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metaLabelSmall, children: "Assessment Framework" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metaValueSmall, children: "TRENNT Internal Audit Maturity Framework" })] })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.confidentiality, children: "This report contains proprietary and confidential information. All assessments and recommendations are based on the TRENNT Internal Audit Maturity Framework and are subject to the terms of your engagement." }), (0, jsx_runtime_1.jsx)(PageFooter, {})] })] }));
};
exports.AssessmentPDFReport = AssessmentPDFReport;
const AssessmentPDFReportFallback = ({ result, respondent, stats, }) => {
    const safeTier = (content_1.TIER_META[result === null || result === void 0 ? void 0 : result.tier] ? result.tier : "defined");
    const tierMeta = content_1.TIER_META[safeTier];
    const recs = content_1.TIER_RECOMMENDATIONS[safeTier];
    const dateStr = new Date(result.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const sortedDim = content_1.DIMENSIONS.map((d) => ({ key: d.key, label: d.label, score: result.scores[d.key] }))
        .sort((a, b) => b.score - a.score);
    const topStrengths = sortedDim.slice(0, 3);
    const topOpportunities = sortedDim.slice(-3).reverse();
    const { industryAvg, globalAvg } = computeComparison(result, respondent, stats);
    const preparedForText = (respondent === null || respondent === void 0 ? void 0 : respondent.name) && (respondent === null || respondent === void 0 ? void 0 : respondent.company)
        ? `Prepared for: ${respondent.name}, ${respondent.company}`
        : (respondent === null || respondent === void 0 ? void 0 : respondent.company)
            ? `Prepared for: ${respondent.company}`
            : (respondent === null || respondent === void 0 ? void 0 : respondent.name)
                ? `Prepared for: ${respondent.name}`
                : "";
    return ((0, jsx_runtime_1.jsxs)(renderer_1.Document, { title: `TRENNT Executive Report - ${(respondent === null || respondent === void 0 ? void 0 : respondent.company) || "Confidential"}`, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.coverPage, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverEyebrow, children: "Confidential \u00B7 Executive Assessment" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.coverTitle, children: ["Internal Audit Maturity", "\n", "Benchmark Report"] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverSubtitle, children: "Confidential Executive Assessment" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaBlock, children: [(respondent === null || respondent === void 0 ? void 0 : respondent.company) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Organisation" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: respondent.company })] })), (respondent === null || respondent === void 0 ? void 0 : respondent.industry) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Industry" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: respondent.industry })] })), (respondent === null || respondent === void 0 ? void 0 : respondent.companySize) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Company Size" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: respondent.companySize })] })), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaLabel, children: "Maturity Tier" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.coverMetaValue, children: result.tier })] }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.coverDate, children: ["Report Date \u00B7 ", dateStr] }), preparedForText && ((0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.preparedForLine, children: preparedForText }))] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.execBlock, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.execMetricsRow, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.metricBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Overall Maturity Score" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.metricValueLarge, children: [result.overall, (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricSuffix, children: "/100" })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.metricBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Maturity Tier" }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricValueMedium, children: result.tier })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: styles.metricBlock, children: [(0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.metricLabel, children: "Benchmark Percentile" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: styles.metricValueMedium, children: [result.percentile, "th"] })] })] }), (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: styles.summaryQuote, children: tierMeta.summary })] }), (0, jsx_runtime_1.jsx)(PageFooter, {})] }), (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsx)(PageHeader, {}), (0, jsx_runtime_1.jsx)(PageFooter, {})] }), (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: styles.page, children: [(0, jsx_runtime_1.jsx)(PageHeader, {}), (0, jsx_runtime_1.jsx)(PageFooter, {})] })] }));
};
const cleanArText = (text) => {
    if (!text)
        return "";
    let s = text.trim();
    if (s.endsWith("."))
        s = s.slice(0, -1);
    return s;
};
// ---------------------------------------------------------------------------
// ARABIC report (3 pages, RTL, Arabic font, mirroring)
// ---------------------------------------------------------------------------
const AssessmentPDFReportArabic = ({ result, respondent, stats, }) => {
    var _a, _b, _c, _d, _e;
    const rawTier = String((result === null || result === void 0 ? void 0 : result.tier) || "defined").toLowerCase();
    const tierKey = (benchmark_ar_1.BENCHMARK_ARABIC_TIERS[rawTier] ? rawTier : "defined");
    const tierAr = benchmark_ar_1.BENCHMARK_ARABIC_TIERS[tierKey] || benchmark_ar_1.BENCHMARK_ARABIC_TIERS.defined;
    const recsAr = benchmark_ar_1.BENCHMARK_ARABIC_TIER_RECOMMENDATIONS[tierKey] || benchmark_ar_1.BENCHMARK_ARABIC_TIER_RECOMMENDATIONS.defined;
    const dateVal = (result === null || result === void 0 ? void 0 : result.createdAt) ? new Date(result.createdAt) : new Date();
    const dateStr = !isNaN(dateVal.getTime())
        ? dateVal.toLocaleDateString("ar-SA", {
            day: "numeric", month: "long", year: "numeric",
            calendar: "gregory", numberingSystem: "latn",
        })
        : new Date().toLocaleDateString("ar-SA", {
            day: "numeric", month: "long", year: "numeric",
            calendar: "gregory", numberingSystem: "latn",
        });
    const scores = (result === null || result === void 0 ? void 0 : result.scores) || {
        governance: 50,
        risk: 50,
        execution: 50,
        reporting: 50,
        capability: 50,
    };
    const sortedDim = content_1.DIMENSIONS.map((d) => {
        var _a, _b;
        return ({
            key: d.key,
            label: ((_a = benchmark_ar_1.BENCHMARK_ARABIC_DIMENSIONS[d.key]) === null || _a === void 0 ? void 0 : _a.label) || d.label,
            score: (_b = scores[d.key]) !== null && _b !== void 0 ? _b : 50,
        });
    }).sort((a, b) => b.score - a.score);
    const topStrengths = sortedDim.slice(0, 3);
    const topOpportunities = sortedDim.slice(-3).reverse();
    const { industryAvg, globalAvg } = computeComparison(result, respondent, stats);
    const arIndustry = (respondent === null || respondent === void 0 ? void 0 : respondent.industry) ? (0, benchmark_ar_1.translateIndustryToArabic)(respondent.industry) : null;
    const arCompanySize = (respondent === null || respondent === void 0 ? void 0 : respondent.companySize) ? (_a = benchmark_ar_1.COMPANY_SIZE_ARABIC_LABELS[respondent.companySize]) !== null && _a !== void 0 ? _a : respondent.companySize : null;
    const preparedForText = (respondent === null || respondent === void 0 ? void 0 : respondent.name) && (respondent === null || respondent === void 0 ? void 0 : respondent.company)
        ? `معد لصالح: ${respondent.name}، ${respondent.company}`
        : (respondent === null || respondent === void 0 ? void 0 : respondent.company)
            ? `معد لصالح: ${respondent.company}`
            : (respondent === null || respondent === void 0 ? void 0 : respondent.name)
                ? `معد لصالح: ${respondent.name}`
                : "";
    return ((0, jsx_runtime_1.jsxs)(renderer_1.Document, { title: `تقرير ترينت التنفيذي - ${(respondent === null || respondent === void 0 ? void 0 : respondent.company) || "سري"}`, children: [(0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: arStyles.coverPage, children: [(0, jsx_runtime_1.jsx)(renderer_1.Image, { src: LOGO_WORDMARK, style: arStyles.coverLogo }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverEyebrow, children: "\u0633\u0631\u064A \u00B7 \u062A\u0642\u064A\u064A\u0645 \u062A\u0646\u0641\u064A\u0630\u064A" }), (0, jsx_runtime_1.jsxs)(ArabicText, { style: arStyles.coverTitle, children: ["تقرير معيار نضج المراجعة الداخلية", "\n", "ترينت"] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.coverMetaBlock, children: [(respondent === null || respondent === void 0 ? void 0 : respondent.name) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverMetaLabel, children: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062C\u0644" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverMetaValue, children: respondent.name })] })), (respondent === null || respondent === void 0 ? void 0 : respondent.email) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverMetaLabel, children: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverMetaValue, children: respondent.email })] })), (respondent === null || respondent === void 0 ? void 0 : respondent.company) && ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.coverMetaRow, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverMetaLabel, children: "\u0627\u0644\u0645\u0646\u0638\u0645\u0629" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverMetaValue, children: respondent.company })] })), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.coverDate, children: `تقرير بتاريخ · ${dateStr}` })] }), (0, jsx_runtime_1.jsx)(PageFooterArabicClean, {})] }), (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: arStyles.page, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.execBlock, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.execMetricsRow, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.metricBlock, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricLabel, children: "\u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A\u0629 \u0644\u0644\u0646\u0636\u062C" }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: arStyles.metricValueLarge, children: [result.overall, (0, jsx_runtime_1.jsx)(renderer_1.Text, { style: arStyles.metricSuffix, children: "/100" })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.metricBlock, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricLabel, children: "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0646\u0636\u062C" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricValueMedium, children: tierAr.label })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.metricBlock, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricLabel, children: "\u0627\u0644\u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u0626\u0648\u064A\u0629 \u0641\u064A \u0627\u0644\u0645\u0639\u064A\u0627\u0631" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricValueMedium, children: `أعلى من ${result.percentile}%` })] })] }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.summaryQuote, children: tierAr.summary })] }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.sectionHeading, children: "\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0623\u0628\u0639\u0627\u062F \u0627\u0644\u062E\u0645\u0633\u0629 \u0644\u0644\u0646\u0636\u062C" }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: arStyles.sectionRule }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: { marginTop: 6, marginBottom: 8, alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(DimensionBarChartArabic, { scores: scores }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.chartCaption, children: "\u0627\u0644\u0634\u0643\u0644 \u0661 - \u062F\u0631\u062C\u0627\u062A \u0627\u0644\u0646\u0636\u062C \u062D\u0633\u0628 \u0627\u0644\u0628\u0639\u062F" })] }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: arStyles.dimTwoCol, wrap: false, children: content_1.DIMENSIONS.map((d) => {
                            var _a;
                            const arDim = benchmark_ar_1.BENCHMARK_ARABIC_DIMENSIONS[d.key] || { label: d.label, short: d.short };
                            const score = (_a = scores[d.key]) !== null && _a !== void 0 ? _a : 50;
                            const band = bandFor(score);
                            const domainInterp = benchmark_ar_1.BENCHMARK_ARABIC_DOMAIN_INTERPRETATION[d.key] || { high: "", mid: "", low: "" };
                            const interpret = domainInterp[band] || "";
                            const detailObj = (benchmark_ar_1.AR_DIMENSION_DETAIL_TEXTS && benchmark_ar_1.AR_DIMENSION_DETAIL_TEXTS[d.key])
                                ? benchmark_ar_1.AR_DIMENSION_DETAIL_TEXTS[d.key]
                                : (EN_DIMENSION_DATA[d.key] || { strength: "", improvement: "" });
                            return ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.dimCard, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.dimHeader, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.dimTitle, children: arDim.label }), (0, jsx_runtime_1.jsxs)(renderer_1.Text, { style: arStyles.dimScore, children: [score, "/100"] })] }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.dimDetail, children: `نقطة القوة: ${cleanArText(detailObj.strength)}` }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.dimDetail, children: `المسار التحسيني: ${cleanArText(detailObj.improvement)}` }), interpret ? ((0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.dimDetail, children: `قراءة النتيجة: ${cleanArText(interpret)}` })) : null] }, d.key));
                        }) }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.benchmarkSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.sectionHeading, children: "\u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0629 \u0645\u0639 \u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0648\u0627\u0644\u0645\u0646\u0638\u0645\u0627\u062A \u0627\u0644\u0646\u0638\u064A\u0631\u0629" }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: arStyles.sectionRule }), (0, jsx_runtime_1.jsx)(CompactBenchmarkBarsArabic, { score: result.overall, industryAvg: industryAvg, globalAvg: globalAvg }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.peerMetricsRow, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.peerBlock, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricLabel, children: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0642\u0637\u0627\u0639" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.peerValue, children: industryAvg !== null ? `${industryAvg} / 100` : "غير متاح" })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.peerBlock, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricLabel, children: "\u0639\u062F\u062F \u0627\u0644\u0645\u0646\u0638\u0645\u0627\u062A \u0627\u0644\u0645\u0642\u064A\u0645\u0629" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.peerValue, children: `${(_b = stats === null || stats === void 0 ? void 0 : stats.totalAssessments) !== null && _b !== void 0 ? _b : 0} منظمة` })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.peerBlock, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metricLabel, children: "\u0627\u0644\u0646\u0633\u0628\u0629 \u0627\u0644\u0645\u0626\u0648\u064A\u0629 \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.peerValue, children: `أعلى من ${result.percentile}%` })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listsRow, wrap: false, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listColumn, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.listTitle, children: "\u0623\u0628\u0631\u0632 \u0663 \u0646\u0642\u0627\u0637 \u0642\u0648\u0629" }), topStrengths.map((s, idx) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { children: `${s.label} (${s.score}/100)` })] }, idx)))] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listColumn, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.listTitle, children: "\u0623\u0647\u0645 \u0663 \u0645\u062C\u0627\u0644\u0627\u062A \u0644\u0644\u062A\u0631\u0643\u064A\u0632" }), topOpportunities.map((s, idx) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { children: `${s.label} (${s.score}/100)` })] }, idx)))] })] })] }), (0, jsx_runtime_1.jsx)(PageFooterArabicClean, {})] }), (0, jsx_runtime_1.jsxs)(renderer_1.Page, { size: "A4", style: arStyles.page, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.sectionHeading, children: "\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0629" }), (0, jsx_runtime_1.jsx)(renderer_1.View, { style: arStyles.sectionRule }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.roadmapSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.roadmapTitle, children: "\u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u0623\u0648\u0644\u0649: \u0627\u0644\u0623\u0648\u0644\u0648\u064A\u0627\u062A \u0627\u0644\u0639\u0627\u062C\u0644\u0629 \u2014 \u062E\u0644\u0627\u0644 \u0663\u0660 \u064A\u0648\u0645\u0627\u064B" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.roadmapBody, children: [recsAr.slice(0, 1).map((r, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: { fontSize: 9, lineHeight: 1.45 }, children: cleanArText(r) })] }, i))), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: { fontSize: 9, lineHeight: 1.45 }, children: cleanArText(`إجراء تقييم سريع لنضج بيئة الرقابة الحالية في بعد «${((_c = topOpportunities[0]) === null || _c === void 0 ? void 0 : _c.label) || ""}» ووضع خطة معالجة ذات ملكية وجداول زمنية واضحة`) })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.roadmapSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.roadmapTitle, children: "\u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062B\u0627\u0646\u064A\u0629: \u0627\u0644\u062A\u062D\u0633\u064A\u0646\u0627\u062A \u0645\u062A\u0648\u0633\u0637\u0629 \u0627\u0644\u0645\u062F\u0649 \u2014 \u0645\u0646 \u0663\u0660 \u0625\u0644\u0649 \u0669\u0660 \u064A\u0648\u0645\u0627\u064B" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.roadmapBody, children: [recsAr.slice(1, 2).map((r, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: { fontSize: 9, lineHeight: 1.45 }, children: cleanArText(r) })] }, i))), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: { fontSize: 9, lineHeight: 1.45 }, children: cleanArText(`تشكيل أطر حوكمة وضمان جودة منضبطة لبعد «${((_d = topOpportunities[1]) === null || _d === void 0 ? void 0 : _d.label) || ""}» يضمنان منهجية متسقة وسلامة دليلات الرقابة واتساق تنفيذ معايير المراجعة`) })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.roadmapSection, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.roadmapTitle, children: "\u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062B\u0627\u0644\u062B\u0629: \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0637\u0648\u064A\u0644 \u0627\u0644\u0645\u062F\u0649 \u2014 \u0645\u0646 \u0669\u0660 \u0625\u0644\u0649 \u0661\u0668\u0660 \u064A\u0648\u0645\u0627\u064B" }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.roadmapBody, children: [recsAr.slice(2, 3).map((r, i) => ((0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: { fontSize: 9, lineHeight: 1.45 }, children: cleanArText(r) })] }, i))), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.listItem, wrap: false, children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.bullet, children: "\u2022" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: { fontSize: 9, lineHeight: 1.45 }, children: cleanArText(`إدماج قدرات بعد «${((_e = topStrengths[0]) === null || _e === void 0 ? void 0 : _e.label) || ""}» في نموذج تشغيل المراجعة الداخلية الأوسع لدفع تغطية تأكيدية متكاملة وقيمة رؤى مخاطر إضافية للجنة المراجعة`) })] })] })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { style: arStyles.preparedByRow, children: [(0, jsx_runtime_1.jsxs)(renderer_1.View, { children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metaLabelSmall, children: "\u062A\u0645 \u0627\u0644\u0625\u0639\u062F\u0627\u062F \u0645\u0646 \u0642\u0628\u0644" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metaValueSmall, children: "\u062A\u0631\u064A\u0646\u062A \u2014 \u0645\u062A\u062E\u0635\u0635\u0648 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u062F\u0627\u062E\u0644\u064A\u0629" })] }), (0, jsx_runtime_1.jsxs)(renderer_1.View, { children: [(0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metaLabelSmall, children: "\u0625\u0637\u0627\u0631 \u0627\u0644\u062A\u0642\u064A\u064A\u0645" }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.metaValueSmall, children: "\u0625\u0637\u0627\u0631 \u062A\u0631\u064A\u0646\u062A \u0644\u0646\u0636\u062C \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u062F\u0627\u062E\u0644\u064A\u0629" })] })] }), (0, jsx_runtime_1.jsx)(ArabicText, { style: arStyles.confidentiality, children: "\u064A\u062D\u062A\u0648\u064A \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0639\u0644\u0649 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062D\u0635\u0631\u064A\u0629 \u0648\u0633\u0631\u064A\u0629. \u062A\u0633\u062A\u0646\u062F \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A \u0625\u0644\u0649 \u0625\u0637\u0627\u0631 \u062A\u0631\u064A\u0646\u062A \u0644\u0646\u0636\u062C \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u062F\u0627\u062E\u0644\u064A\u0629 \u0648\u062A\u062E\u0636\u0639 \u0644\u0634\u0631\u0648\u0637 \u0648\u0623\u062D\u0643\u0627\u0645 \u062A\u0639\u0627\u0642\u062F \u0627\u0644\u062E\u062F\u0645\u0629." }), (0, jsx_runtime_1.jsx)(PageFooterArabicClean, {})] })] }));
};
exports.AssessmentPDFReportArabic = AssessmentPDFReportArabic;
const AssessmentPDFReportFallbackArabic = ({ result, respondent, stats = null, }) => {
    return (0, jsx_runtime_1.jsx)(exports.AssessmentPDFReportArabic, { result: result, respondent: respondent, stats: stats || null });
};
// ---------------------------------------------------------------------------
// generatePDF() — language-aware entry point (backward-compatible default)
// ---------------------------------------------------------------------------
async function generatePDF(result, respondent, stats = null, lang = "en") {
    var _a, _b, _c, _d, _e;
    if (!result) {
        console.error("[PDF] generatePDF called with missing result object");
        throw new Error("Missing assessment result data for PDF generation");
    }
    const rawTier = String((result === null || result === void 0 ? void 0 : result.tier) || "defined").toLowerCase();
    const safeTier = (content_1.TIER_META[rawTier] ? rawTier : "defined");
    const safeResult = {
        id: (result === null || result === void 0 ? void 0 : result.id) || `bench-${Date.now()}`,
        overall: typeof (result === null || result === void 0 ? void 0 : result.overall) === "number" && !isNaN(result.overall) ? result.overall : 50,
        scores: {
            governance: typeof ((_a = result === null || result === void 0 ? void 0 : result.scores) === null || _a === void 0 ? void 0 : _a.governance) === "number" ? result.scores.governance : 50,
            risk: typeof ((_b = result === null || result === void 0 ? void 0 : result.scores) === null || _b === void 0 ? void 0 : _b.risk) === "number" ? result.scores.risk : 50,
            execution: typeof ((_c = result === null || result === void 0 ? void 0 : result.scores) === null || _c === void 0 ? void 0 : _c.execution) === "number" ? result.scores.execution : 50,
            reporting: typeof ((_d = result === null || result === void 0 ? void 0 : result.scores) === null || _d === void 0 ? void 0 : _d.reporting) === "number" ? result.scores.reporting : 50,
            capability: typeof ((_e = result === null || result === void 0 ? void 0 : result.scores) === null || _e === void 0 ? void 0 : _e.capability) === "number" ? result.scores.capability : 50,
        },
        tier: safeTier,
        percentile: typeof (result === null || result === void 0 ? void 0 : result.percentile) === "number" && !isNaN(result.percentile) ? result.percentile : 50,
        questionCount: typeof (result === null || result === void 0 ? void 0 : result.questionCount) === "number" ? result.questionCount : 26,
        createdAt: (result === null || result === void 0 ? void 0 : result.createdAt) || new Date().toISOString(),
    };
    const { pdf } = await Promise.resolve().then(() => __importStar(require("@react-pdf/renderer")));
    const isAr = lang === "ar";
    const Main = isAr ? exports.AssessmentPDFReportArabic : exports.AssessmentPDFReport;
    const Fallback = isAr ? AssessmentPDFReportFallbackArabic : AssessmentPDFReportFallback;
    let blob;
    try {
        blob = await pdf((0, jsx_runtime_1.jsx)(Main, { result: safeResult, respondent: respondent, stats: stats })).toBlob();
    }
    catch (mainError) {
        console.warn("[PDF] Main report rendering failed, attempting fallback:", mainError);
        try {
            blob = await pdf((0, jsx_runtime_1.jsx)(Fallback, { result: safeResult, respondent: respondent, stats: stats })).toBlob();
        }
        catch (fallbackError) {
            console.error("[PDF] Fallback report also failed:", fallbackError);
            throw fallbackError;
        }
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const company = ((respondent === null || respondent === void 0 ? void 0 : respondent.company) || "TRENNT").replace(/[^a-z0-9\u0600-\u06FF]/gi, "_");
    const suffix = isAr ? "-AR" : "-EN";
    link.download = `TRENNT${suffix}-Executive-Report-${company}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
}
