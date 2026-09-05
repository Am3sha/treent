import * as React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Svg,
    Rect,
    Font,
} from "@react-pdf/renderer";
import type {
    AssessmentResult,
    BenchmarkStats,
    Dimension,
    MaturityTier,
    RespondentProfile,
} from "./types";
import { DIMENSIONS, TIER_META, TIER_RECOMMENDATIONS } from "./content";
import {
    BENCHMARK_ARABIC_DIMENSIONS,
    BENCHMARK_ARABIC_TIERS,
    BENCHMARK_ARABIC_TIER_RECOMMENDATIONS,
    BENCHMARK_ARABIC_DOMAIN_INTERPRETATION,
    AR_DIMENSION_DETAIL_TEXTS,
    translateIndustryToArabic,
    COMPANY_SIZE_ARABIC_LABELS,
} from "./translations/benchmark-ar";
import { shapeArabicForPdf } from "./arabic-pdf-shaper";


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

const resolveAsset = (path: string): string => {
    if (typeof window !== "undefined") {
        try {
            return new URL(path, window.location.origin).href;
        } catch {
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
    Font.register({
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
} catch (e) {
    console.warn("[PDF] Arabic font registration failed (non-critical for EN flow):", e);
}

const AR_FONT = "NotoNaskhArabic";

// Recursively apply Arabic presentation-form shaping to Text content so the
// react-pdf pipeline never has to perform GSUB shaping itself.
const shapeChildren = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") return shapeArabicForPdf(node);
    if (Array.isArray(node)) return node.map(shapeChildren);
    return node;
};

const ArabicText = ({ children, render, ...props }: any) => {
    const safeContent = children === undefined || children === null ? "" : children;
    return (
        <Text
            {...props}
            {...(typeof render === "function"
                ? { render: (args: any) => String(shapeArabicForPdf(String(render(args)))) }
                : {})}
        >
            {shapeChildren(safeContent)}
        </Text>
    );
};

// ---------------------------------------------------------------------------
// English styles (unchanged, preserve exact PDF output)
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
    page: {
        paddingTop: 48,
        paddingBottom: 64,
        paddingHorizontal: 46,
        backgroundColor: COLORS.white,
        fontFamily: "Helvetica",
        fontSize: 8.5,
        color: COLORS.dark,
        position: "relative",
    },
    coverPage: {
        paddingTop: 44,
        paddingBottom: 64,
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
        gap: 8,
        marginTop: 8,
    },
    dimCard: {
        width: "48%",
        paddingVertical: 3,
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
        marginTop: 10,
        paddingTop: 8,
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
        marginBottom: 16,
        padding: 12,
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
        fontSize: 12.5,
        fontFamily: "Helvetica-Bold",
        color: COLORS.primary,
        textAlign: "right",
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
const arStyles = StyleSheet.create({
    page: {
        paddingTop: 48,
        paddingBottom: 64,
        paddingHorizontal: 46,
        backgroundColor: COLORS.white,
        fontFamily: AR_FONT,
        fontSize: 9,
        color: COLORS.dark,
        position: "relative",
        direction: "rtl",
    },
    coverPage: {
        paddingTop: 44,
        paddingBottom: 64,
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
        fontSize: 16,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 4,
        marginTop: 6,
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
        gap: 12,
        marginTop: 10,
        marginBottom: 14,
    },
    dimCard: {
        width: "48%",
        padding: 9,
        backgroundColor: "#F8FAFC",
        borderRadius: 6,
        borderRightWidth: 3,
        borderRightColor: COLORS.primary,
        marginBottom: 8,
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
        marginTop: 14,
        paddingTop: 12,
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
        gap: 16,
        marginTop: 12,
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
    },
    roadmapTitle: {
        fontSize: 9.5,
        fontFamily: AR_FONT,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 4,
        paddingBottom: 2,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.accent,
        textAlign: "right",
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
const computeComparison = (
    result: AssessmentResult,
    respondent: RespondentProfile | null,
    stats: BenchmarkStats | null
) => {
    const total = stats?.totalAssessments ?? 0;
    let industryAvg: number | null = null;
    if (respondent?.industry && stats && Array.isArray(stats.byIndustry) && total > 0) {
        const needle = respondent.industry.trim().toLowerCase();
        const match = stats.byIndustry.find((r) => r?.label && r.label.toLowerCase() === needle);
        industryAvg = match ? match.average : (stats.averageOverall ?? null);
    }
    const globalAvg: number | null = total > 0 ? (stats?.averageOverall ?? null) : null;
    return { industryAvg, globalAvg, total };
};

const EN_DIMENSION_DATA: Record<Dimension, { strength: string; improvement: string }> = {
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

const bandFor = (score: number): "low" | "mid" | "high" => {
    if (score < 40) return "low";
    if (score < 70) return "mid";
    return "high";
};

// ---------------------------------------------------------------------------
// ENGLISH chart + layout components (preserved exactly)
// ---------------------------------------------------------------------------
const DimensionBarChart = ({ scores }: { scores: Record<Dimension, number> }) => {
    const trackWidth = 150;
    const rowHeight = 17;

    return (
        <View>
            {DIMENSIONS.map((d) => {
                const score = scores[d.key];
                const fillWidth = Math.max(0, Math.min(trackWidth, (score / 100) * trackWidth));
                return (
                    <View
                        key={d.key}
                        style={{ flexDirection: "row", alignItems: "center", height: rowHeight }}
                    >
                        <Text style={{ width: 60, fontSize: 6.5, color: COLORS.dark }}>{d.short}</Text>
                        <Svg width={trackWidth + 2} height={7}>
                            <Rect x={0} y={1} width={trackWidth} height={5} fill={COLORS.track} />
                            <Rect x={0} y={1} width={fillWidth} height={5} fill={COLORS.primary} />
                        </Svg>
                        <Text style={{ width: 26, fontSize: 7, fontFamily: "Helvetica-Bold", color: COLORS.primary, textAlign: "right", marginLeft: 5 }}>
                            {score}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const CompactBenchmarkBars = ({
    score,
    industryAvg,
    globalAvg,
}: {
    score: number;
    industryAvg: number | null;
    globalAvg: number | null;
}) => {
    const trackWidth = 170;
    const bars = [{ label: "Your Org", value: score }];
    if (industryAvg !== null) bars.push({ label: "Industry Avg", value: industryAvg });
    if (globalAvg !== null) bars.push({ label: "Global Avg", value: globalAvg });

    return (
        <View>
            {bars.map((bar) => {
                const fillWidth = Math.max(0, Math.min(trackWidth, (bar.value / 100) * trackWidth));
                return (
                    <View key={bar.label} style={styles.compactBar}>
                        <Text style={styles.compactBarLabel}>{bar.label}</Text>
                        <Svg width={trackWidth + 2} height={7}>
                            <Rect x={0} y={1} width={trackWidth} height={5} fill={COLORS.track} />
                            <Rect x={0} y={1} width={fillWidth} height={5} fill={COLORS.primary} />
                        </Svg>
                        <Text style={{ width: 26, fontSize: 7, fontFamily: "Helvetica-Bold", color: COLORS.primary, textAlign: "right", marginLeft: 5 }}>
                            {bar.value}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const PageHeader = () => (
    <View>
        <View style={styles.pageHeader} fixed>
            <Image src={LOGO_ICON} style={styles.headerLogo} />
        </View>
        <View style={styles.headerRule} fixed />
    </View>
);

const PageFooter = () => (
    <View style={styles.footer} fixed>
        <View style={styles.footerRule}>
            <View style={styles.footerLeft}>
                <Image src={LOGO_ICON} style={styles.footerLogo} />
                <Text style={styles.footerText}>
                    Prepared by TRENNT — Internal Audit Specialists · trennt.sa
                </Text>
            </View>
            <Text
                style={styles.footerPage}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
        </View>
    </View>
);

// ---------------------------------------------------------------------------
// ARABIC chart + layout components (RTL + Arabic labels)
// ---------------------------------------------------------------------------
const DimensionBarChartArabic = ({ scores }: { scores: Record<Dimension, number> }) => {
    const trackWidth = 200;
    const rowHeight = 22;

    return (
        <View>
            {DIMENSIONS.map((d) => {
                const score = scores[d.key] ?? 50;
                const fillWidth = Math.max(0, Math.min(trackWidth, (score / 100) * trackWidth));
                const dim = BENCHMARK_ARABIC_DIMENSIONS[d.key] || { label: d.label, short: d.short };
                return (
                    <View
                        key={d.key}
                        style={{ flexDirection: "row-reverse", alignItems: "center", height: rowHeight, marginBottom: 2 }}
                    >
                        <ArabicText style={{ width: 110, fontSize: 9.5, color: COLORS.dark, textAlign: "right", fontFamily: AR_FONT }}>
                            {dim.short}
                        </ArabicText>
                        <Svg width={trackWidth + 2} height={9}>
                            <Rect x={0} y={1} width={trackWidth} height={7} fill={COLORS.track} rx={2} />
                            <Rect x={trackWidth - fillWidth} y={1} width={fillWidth} height={7} fill={COLORS.primary} rx={2} />
                        </Svg>
                        <Text style={{ width: 32, fontSize: 9.5, fontFamily: AR_FONT, fontWeight: "bold", color: COLORS.primary, textAlign: "left", marginRight: 6 }}>
                            {score}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const CompactBenchmarkBarsArabic = ({
    score,
    industryAvg,
    globalAvg,
}: {
    score: number;
    industryAvg: number | null;
    globalAvg: number | null;
}) => {
    const trackWidth = 220;
    const shapedBars = [
        { label: "منظمتك", value: score, isAvailable: true },
        { label: "متوسط القطاع", value: industryAvg, isAvailable: industryAvg !== null },
        { label: "المتوسط العام", value: globalAvg, isAvailable: globalAvg !== null },
    ];

    return (
        <View>
            {shapedBars.map((bar) => {
                const val = bar.value ?? 0;
                const fillWidth = Math.max(0, Math.min(trackWidth, (val / 100) * trackWidth));
                return (
                    <View key={bar.label} style={arStyles.compactBar}>
                        <ArabicText style={arStyles.compactBarLabel}>{bar.label}</ArabicText>
                        {bar.isAvailable ? (
                            <>
                                <Svg width={trackWidth + 2} height={9}>
                                    <Rect x={0} y={1} width={trackWidth} height={7} fill={COLORS.track} rx={2} />
                                    <Rect x={trackWidth - fillWidth} y={1} width={fillWidth} height={7} fill={COLORS.primary} rx={2} />
                                </Svg>
                                <Text style={{ width: 32, fontSize: 9.5, fontFamily: AR_FONT, fontWeight: "bold", color: COLORS.primary, textAlign: "left", marginRight: 6 }}>
                                    {val}
                                </Text>
                            </>
                        ) : (
                            <ArabicText style={{ fontSize: 9, color: COLORS.muted, textAlign: "right" }}>
                                غير متاح
                            </ArabicText>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const PageHeaderArabic = () => (
    <View>
        <View style={arStyles.pageHeader} fixed>
            <Image src={LOGO_ICON} style={arStyles.headerLogo} />
        </View>
        <View style={arStyles.headerRule} fixed />
    </View>
);

const PageFooterArabicClean = () => (
    <View style={arStyles.footer} fixed>
        <View style={arStyles.footerRule}>
            <ArabicText
                style={arStyles.footerPage}
                render={({ pageNumber, totalPages }: any) => `صفحة ${pageNumber} من ${totalPages}`}
            />
            <View style={arStyles.footerLeft}>
                <Image src={LOGO_ICON} style={arStyles.footerLogo} />
                <ArabicText style={arStyles.footerText}>
                    {`أعده: ترينت — متخصصو المراجعة الداخلية · trennt.sa`}
                </ArabicText>
            </View>
        </View>
    </View>
);

// ---------------------------------------------------------------------------
// ENGLISH report (untouched — keep it 100% identical)
// ---------------------------------------------------------------------------
export const AssessmentPDFReport = ({
    result,
    respondent,
    stats,
}: {
    result: AssessmentResult;
    respondent: RespondentProfile | null;
    stats: BenchmarkStats | null;
}) => {
    const tierMeta = TIER_META[result.tier as MaturityTier];
    const recs = TIER_RECOMMENDATIONS[result.tier as MaturityTier];
    const dateStr = new Date(result.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const sortedDim = DIMENSIONS.map((d) => ({ key: d.key, label: d.label, score: result.scores[d.key] }))
        .sort((a, b) => b.score - a.score);

    const topStrengths = sortedDim.slice(0, 3);
    const topOpportunities = sortedDim.slice(-3).reverse();
    const { industryAvg, globalAvg } = computeComparison(result, respondent, stats);

    const preparedForText = respondent?.name && respondent?.company
        ? `Prepared for: ${respondent.name}, ${respondent.company}`
        : respondent?.company
            ? `Prepared for: ${respondent.company}`
            : respondent?.name
                ? `Prepared for: ${respondent.name}`
                : "";

    return (
        <Document title={`TRENNT Executive Report - ${respondent?.company || "Confidential"}`}>
            <Page size="A4" style={styles.coverPage}>
                <Image src={LOGO_WORDMARK} style={styles.coverLogo} />

                <Text style={styles.coverEyebrow}>Confidential · Executive Assessment</Text>
                <Text style={styles.coverTitle}>Internal Audit Maturity{"\n"}Benchmark Report</Text>
                <Text style={styles.coverSubtitle}>Confidential Executive Assessment</Text>

                <View style={styles.coverMetaBlock}>
                    {respondent?.company && (
                        <View style={styles.coverMetaRow}>
                            <Text style={styles.coverMetaLabel}>Organisation</Text>
                            <Text style={styles.coverMetaValue}>{respondent.company}</Text>
                        </View>
                    )}
                    {respondent?.industry && (
                        <View style={styles.coverMetaRow}>
                            <Text style={styles.coverMetaLabel}>Industry</Text>
                            <Text style={styles.coverMetaValue}>{respondent.industry}</Text>
                        </View>
                    )}
                    {respondent?.companySize && (
                        <View style={styles.coverMetaRow}>
                            <Text style={styles.coverMetaLabel}>Company Size</Text>
                            <Text style={styles.coverMetaValue}>{respondent.companySize}</Text>
                        </View>
                    )}
                    <View style={styles.coverMetaRow}>
                        <Text style={styles.coverMetaLabel}>Maturity Tier</Text>
                        <Text style={styles.coverMetaValue}>{result.tier}</Text>
                    </View>
                    <Text style={styles.coverDate}>Report Date · {dateStr}</Text>
                    {preparedForText && (
                        <Text style={styles.preparedForLine}>{preparedForText}</Text>
                    )}
                </View>

                <View style={styles.execBlock}>
                    <View style={styles.execMetricsRow}>
                        <View style={styles.metricBlock}>
                            <Text style={styles.metricLabel}>Overall Maturity Score</Text>
                            <Text style={styles.metricValueLarge}>
                                {result.overall}
                                <Text style={styles.metricSuffix}>/100</Text>
                            </Text>
                        </View>
                        <View style={styles.metricBlock}>
                            <Text style={styles.metricLabel}>Maturity Tier</Text>
                            <Text style={styles.metricValueMedium}>{result.tier}</Text>
                        </View>
                        <View style={styles.metricBlock}>
                            <Text style={styles.metricLabel}>Benchmark Percentile</Text>
                            <Text style={styles.metricValueMedium}>{result.percentile}th</Text>
                        </View>
                    </View>
                    <Text style={styles.summaryQuote}>{tierMeta.summary}</Text>
                </View>

                <PageFooter />
            </Page>

            <Page size="A4" style={styles.page}>
                <PageHeader />

                <Text style={styles.sectionHeading}>Dimension Analysis</Text>
                <View style={styles.sectionRule} />

                <View style={{ marginTop: 6, marginBottom: 4, alignItems: "center" }}>
                    <DimensionBarChart scores={result.scores} />
                    <Text style={styles.chartCaption}>Figure 1 — Maturity Score by Dimension</Text>
                </View>

                <View style={styles.dimTwoCol} wrap={false}>
                    {DIMENSIONS.map((d) => {
                        const data = EN_DIMENSION_DATA[d.key];
                        return (
                            <View key={d.key} style={styles.dimCard} wrap={false}>
                                <View style={styles.dimHeader}>
                                    <Text style={styles.dimTitle}>{d.label}</Text>
                                    <Text style={styles.dimScore}>{result.scores[d.key]}/100</Text>
                                </View>
                                <Text style={styles.dimDetail}>
                                    <Text style={styles.dimLabel}>Strength: </Text>
                                    {data.strength}
                                </Text>
                                <Text style={styles.dimDetail}>
                                    <Text style={styles.dimLabel}>Improvement: </Text>
                                    {data.improvement}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.benchmarkSection} wrap={false}>
                    <Text style={styles.sectionHeading}>Benchmark & Peer Comparison</Text>
                    <View style={styles.sectionRule} />

                    <CompactBenchmarkBars
                        score={result.overall}
                        industryAvg={industryAvg}
                        globalAvg={globalAvg}
                    />

                    <View style={styles.peerMetricsRow}>
                        <View style={styles.peerBlock}>
                            <Text style={styles.metricLabel}>Industry Avg</Text>
                            <Text style={styles.peerValue}>
                                {industryAvg ?? "—"}<Text style={styles.peerSuffix}> / 100</Text>
                            </Text>
                        </View>
                        <View style={styles.peerBlock}>
                            <Text style={styles.metricLabel}>Benchmarked Organisations</Text>
                            <Text style={styles.peerValue}>
                                {(stats?.totalAssessments ?? 0)}<Text style={styles.peerSuffix}> total</Text>
                            </Text>
                        </View>
                        <View style={styles.peerBlock}>
                            <Text style={styles.metricLabel}>Global Percentile</Text>
                            <Text style={styles.peerValue}>{result.percentile}<Text style={styles.peerSuffix}>th</Text></Text>
                        </View>
                    </View>

                    <View style={styles.listsRow} wrap={false}>
                        <View style={styles.listColumn} wrap={false}>
                            <Text style={styles.listTitle}>Top 3 Strengths</Text>
                            {topStrengths.map((s, idx) => (
                                <View key={idx} style={styles.listItem} wrap={false}>
                                    <Text style={styles.bullet}>—</Text>
                                    <Text>{s.label} ({s.score}/100)</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.listColumn} wrap={false}>
                            <Text style={styles.listTitle}>Top 3 Focus Areas</Text>
                            {topOpportunities.map((s, idx) => (
                                <View key={idx} style={styles.listItem} wrap={false}>
                                    <Text style={styles.bullet}>—</Text>
                                    <Text>{s.label} ({s.score}/100)</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <PageFooter />
            </Page>

            <Page size="A4" style={styles.page}>
                <PageHeader />

                <Text style={styles.sectionHeading}>Strategic Recommendations</Text>
                <View style={styles.sectionRule} />

                <View style={styles.roadmapSection} wrap={false}>
                    <Text style={styles.roadmapTitle}>Phase 1: Immediate Priorities (0–30 Days)</Text>
                    <View style={{ paddingLeft: 2 }} wrap={false}>
                        {recs.slice(0, 1).map((r, i) => (
                            <View key={i} style={styles.listItem} wrap={false}>
                                <Text style={styles.bullet}>—</Text>
                                <Text style={{ fontSize: 8, lineHeight: 1.35 }}>{r}</Text>
                            </View>
                        ))}
                        <View style={styles.listItem} wrap={false}>
                            <Text style={styles.bullet}>—</Text>
                            <Text style={{ fontSize: 8, lineHeight: 1.35 }}>
                                Assess current control environment maturity in the {topOpportunities[0].label} dimension and establish a remediation plan with clear ownership and timelines.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.roadmapSection} wrap={false}>
                    <Text style={styles.roadmapTitle}>Phase 2: Medium-Term Enhancement (30–90 Days)</Text>
                    <View style={{ paddingLeft: 2 }} wrap={false}>
                        {recs.slice(1, 2).map((r, i) => (
                            <View key={i} style={styles.listItem} wrap={false}>
                                <Text style={styles.bullet}>—</Text>
                                <Text style={{ fontSize: 8, lineHeight: 1.35 }}>{r}</Text>
                            </View>
                        ))}
                        <View style={styles.listItem} wrap={false}>
                            <Text style={styles.bullet}>—</Text>
                            <Text style={{ fontSize: 8, lineHeight: 1.35 }}>
                                Formalise governance and quality assurance frameworks for {topOpportunities[1].label} to ensure consistent methodology, control evidence integrity, and audit standard conformance.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.roadmapSection} wrap={false}>
                    <Text style={styles.roadmapTitle}>Phase 3: Long-Term Operationalisation (90–180 Days)</Text>
                    <View style={{ paddingLeft: 2 }} wrap={false}>
                        {recs.slice(2, 3).map((r, i) => (
                            <View key={i} style={styles.listItem} wrap={false}>
                                <Text style={styles.bullet}>—</Text>
                                <Text style={{ fontSize: 8, lineHeight: 1.35 }}>{r}</Text>
                            </View>
                        ))}
                        <View style={styles.listItem} wrap={false}>
                            <Text style={styles.bullet}>—</Text>
                            <Text style={{ fontSize: 8, lineHeight: 1.35 }}>
                                Embed {topStrengths[0].label} capabilities into the broader internal audit operating model to drive compounded assurance coverage and risk insight value for the Audit Committee.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.preparedByRow}>
                    <View>
                        <Text style={styles.metaLabelSmall}>Prepared by</Text>
                        <Text style={styles.metaValueSmall}>
                            TRENNT — Internal Audit Specialists
                        </Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text style={styles.metaLabelSmall}>Assessment Framework</Text>
                        <Text style={styles.metaValueSmall}>
                            TRENNT Internal Audit Maturity Framework
                        </Text>
                    </View>
                </View>

                <Text style={styles.confidentiality}>
                    This report contains proprietary and confidential information. All assessments and recommendations are based on the TRENNT Internal Audit Maturity Framework and are subject to the terms of your engagement.
                </Text>

                <PageFooter />
            </Page>
        </Document>
    );
};

const AssessmentPDFReportFallback = ({
    result,
    respondent,
    stats,
}: {
    result: AssessmentResult;
    respondent: RespondentProfile | null;
    stats: BenchmarkStats | null;
}) => {
    const safeTier = (TIER_META[result?.tier as MaturityTier] ? result.tier : "defined") as MaturityTier;
    const tierMeta = TIER_META[safeTier];
    const recs = TIER_RECOMMENDATIONS[safeTier];
    const dateStr = new Date(result.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const sortedDim = DIMENSIONS.map((d) => ({ key: d.key, label: d.label, score: result.scores[d.key] }))
        .sort((a, b) => b.score - a.score);

    const topStrengths = sortedDim.slice(0, 3);
    const topOpportunities = sortedDim.slice(-3).reverse();
    const { industryAvg, globalAvg } = computeComparison(result, respondent, stats);

    const preparedForText = respondent?.name && respondent?.company
        ? `Prepared for: ${respondent.name}, ${respondent.company}`
        : respondent?.company
            ? `Prepared for: ${respondent.company}`
            : respondent?.name
                ? `Prepared for: ${respondent.name}`
                : "";

    return (
        <Document title={`TRENNT Executive Report - ${respondent?.company || "Confidential"}`}>
            <Page size="A4" style={styles.coverPage}>
                <Text style={styles.coverEyebrow}>Confidential · Executive Assessment</Text>
                <Text style={styles.coverTitle}>Internal Audit Maturity{"\n"}Benchmark Report</Text>
                <Text style={styles.coverSubtitle}>Confidential Executive Assessment</Text>

                <View style={styles.coverMetaBlock}>
                    {respondent?.company && (
                        <View style={styles.coverMetaRow}>
                            <Text style={styles.coverMetaLabel}>Organisation</Text>
                            <Text style={styles.coverMetaValue}>{respondent.company}</Text>
                        </View>
                    )}
                    {respondent?.industry && (
                        <View style={styles.coverMetaRow}>
                            <Text style={styles.coverMetaLabel}>Industry</Text>
                            <Text style={styles.coverMetaValue}>{respondent.industry}</Text>
                        </View>
                    )}
                    {respondent?.companySize && (
                        <View style={styles.coverMetaRow}>
                            <Text style={styles.coverMetaLabel}>Company Size</Text>
                            <Text style={styles.coverMetaValue}>{respondent.companySize}</Text>
                        </View>
                    )}
                    <View style={styles.coverMetaRow}>
                        <Text style={styles.coverMetaLabel}>Maturity Tier</Text>
                        <Text style={styles.coverMetaValue}>{result.tier}</Text>
                    </View>
                    <Text style={styles.coverDate}>Report Date · {dateStr}</Text>
                    {preparedForText && (
                        <Text style={styles.preparedForLine}>{preparedForText}</Text>
                    )}
                </View>

                <View style={styles.execBlock}>
                    <View style={styles.execMetricsRow}>
                        <View style={styles.metricBlock}>
                            <Text style={styles.metricLabel}>Overall Maturity Score</Text>
                            <Text style={styles.metricValueLarge}>
                                {result.overall}
                                <Text style={styles.metricSuffix}>/100</Text>
                            </Text>
                        </View>
                        <View style={styles.metricBlock}>
                            <Text style={styles.metricLabel}>Maturity Tier</Text>
                            <Text style={styles.metricValueMedium}>{result.tier}</Text>
                        </View>
                        <View style={styles.metricBlock}>
                            <Text style={styles.metricLabel}>Benchmark Percentile</Text>
                            <Text style={styles.metricValueMedium}>{result.percentile}th</Text>
                        </View>
                    </View>
                    <Text style={styles.summaryQuote}>{tierMeta.summary}</Text>
                </View>

                <PageFooter />
            </Page>

            <Page size="A4" style={styles.page}>
                <PageHeader />
                <PageFooter />
            </Page>

            <Page size="A4" style={styles.page}>
                <PageHeader />
                <PageFooter />
            </Page>
        </Document>
    );
};

const cleanArText = (text: string) => {
    if (!text) return "";
    let s = text.trim();
    if (s.endsWith(".")) s = s.slice(0, -1);
    return s;
};

// ---------------------------------------------------------------------------
// ARABIC report (3 pages, RTL, Arabic font, mirroring)
// ---------------------------------------------------------------------------
export const AssessmentPDFReportArabic = ({
    result,
    respondent,
    stats,
}: {
    result: AssessmentResult;
    respondent: RespondentProfile | null;
    stats: BenchmarkStats | null;
}) => {
    const rawTier = String(result?.tier || "defined").toLowerCase() as MaturityTier;
    const tierKey = (BENCHMARK_ARABIC_TIERS[rawTier] ? rawTier : "defined") as MaturityTier;
    const tierAr = BENCHMARK_ARABIC_TIERS[tierKey] || BENCHMARK_ARABIC_TIERS.defined;
    const recsAr = BENCHMARK_ARABIC_TIER_RECOMMENDATIONS[tierKey] || BENCHMARK_ARABIC_TIER_RECOMMENDATIONS.defined;

    const dateVal = result?.createdAt ? new Date(result.createdAt) : new Date();
    const dateStr = !isNaN(dateVal.getTime())
        ? dateVal.toLocaleDateString("ar-SA", {
            day: "numeric", month: "long", year: "numeric",
            calendar: "gregory", numberingSystem: "latn",
        } as Intl.DateTimeFormatOptions)
        : new Date().toLocaleDateString("ar-SA", {
            day: "numeric", month: "long", year: "numeric",
            calendar: "gregory", numberingSystem: "latn",
        } as Intl.DateTimeFormatOptions);

    const scores = result?.scores || {
        governance: 50,
        risk: 50,
        execution: 50,
        reporting: 50,
        capability: 50,
    };

    const sortedDim = DIMENSIONS.map((d) => ({
        key: d.key,
        label: BENCHMARK_ARABIC_DIMENSIONS[d.key]?.label || d.label,
        score: scores[d.key] ?? 50,
    })).sort((a, b) => b.score - a.score);

    const topStrengths = sortedDim.slice(0, 3);
    const topOpportunities = sortedDim.slice(-3).reverse();
    const { industryAvg, globalAvg } = computeComparison(result, respondent, stats);

    const arIndustry = respondent?.industry ? translateIndustryToArabic(respondent.industry) : null;
    const arCompanySize =
        respondent?.companySize ? COMPANY_SIZE_ARABIC_LABELS[respondent.companySize] ?? respondent.companySize : null;

    const preparedForText = respondent?.name && respondent?.company
        ? `معد لصالح: ${respondent.name}، ${respondent.company}`
        : respondent?.company
            ? `معد لصالح: ${respondent.company}`
            : respondent?.name
                ? `معد لصالح: ${respondent.name}`
                : "";

    return (
        <Document title={`تقرير ترينت التنفيذي - ${respondent?.company || "سري"}`}>
            {/* PAGE 1: COVER + EXECUTIVE SUMMARY */}
            <Page size="A4" style={arStyles.coverPage}>
                <Image src={LOGO_WORDMARK} style={arStyles.coverLogo} />

                <ArabicText style={arStyles.coverEyebrow}>سري · تقييم تنفيذي</ArabicText>
                <ArabicText style={arStyles.coverTitle}>
                    {"تقرير معيار نضج المراجعة الداخلية"}{"\n"}
                    {"ترينت"}
                </ArabicText>
                <ArabicText style={arStyles.coverSubtitle}>التقييم التنفيذي السري للنتائج</ArabicText>

                <View style={arStyles.coverMetaBlock}>
                    {respondent?.name && (
                        <View style={arStyles.coverMetaRow}>
                            <ArabicText style={arStyles.coverMetaLabel}>اسم المسجل</ArabicText>
                            <ArabicText style={arStyles.coverMetaValue}>{respondent.name}</ArabicText>
                        </View>
                    )}
                    {respondent?.email && (
                        <View style={arStyles.coverMetaRow}>
                            <ArabicText style={arStyles.coverMetaLabel}>البريد الإلكتروني</ArabicText>
                            <ArabicText style={arStyles.coverMetaValue}>{respondent.email}</ArabicText>
                        </View>
                    )}
                    {respondent?.company && (
                        <View style={arStyles.coverMetaRow}>
                            <ArabicText style={arStyles.coverMetaLabel}>المنظمة</ArabicText>
                            <ArabicText style={arStyles.coverMetaValue}>{respondent.company}</ArabicText>
                        </View>
                    )}
                    <ArabicText style={arStyles.coverDate}>{`تقرير بتاريخ · ${dateStr}`}</ArabicText>
                </View>

                <View style={arStyles.execBlock}>
                    <View style={arStyles.execMetricsRow}>
                        <View style={arStyles.metricBlock}>
                            <ArabicText style={arStyles.metricLabel}>النتيجة الإجمالية للنضج</ArabicText>
                            <Text style={arStyles.metricValueLarge}>
                                {result.overall}
                                <Text style={arStyles.metricSuffix}>/100</Text>
                            </Text>
                        </View>
                        <View style={arStyles.metricBlock}>
                            <ArabicText style={arStyles.metricLabel}>مستوى النضج</ArabicText>
                            <ArabicText style={arStyles.metricValueMedium}>{tierAr.label}</ArabicText>
                        </View>
                        <View style={arStyles.metricBlock}>
                            <ArabicText style={arStyles.metricLabel}>النسبة المئوية في المعيار</ArabicText>
                            <ArabicText style={arStyles.metricValueMedium}>{`أعلى من ${result.percentile}%`}</ArabicText>
                        </View>
                    </View>
                    <ArabicText style={arStyles.summaryQuote}>{tierAr.summary}</ArabicText>
                </View>

                <PageFooterArabicClean />
            </Page>

            {/* PAGE 2: DIMENSION ANALYSIS + PEER COMPARISON */}
            <Page size="A4" style={arStyles.page}>
                <PageHeaderArabic />

                <ArabicText style={arStyles.sectionHeading}>تحليل الأبعاد الخمسة للنضج</ArabicText>
                <View style={arStyles.sectionRule} />

                <View style={{ marginTop: 6, marginBottom: 8, alignItems: "center" }}>
                    <DimensionBarChartArabic scores={scores} />
                    <ArabicText style={arStyles.chartCaption}>الشكل ١ - درجات النضج حسب البعد</ArabicText>
                </View>

                <View style={arStyles.dimTwoCol} wrap={false}>
                    {DIMENSIONS.map((d) => {
                        const arDim = BENCHMARK_ARABIC_DIMENSIONS[d.key] || { label: d.label, short: d.short };
                        const score = scores[d.key] ?? 50;
                        const band = bandFor(score);
                        const domainInterp = BENCHMARK_ARABIC_DOMAIN_INTERPRETATION[d.key] || { high: "", mid: "", low: "" };
                        const interpret = domainInterp[band] || "";
                        const detailObj = (AR_DIMENSION_DETAIL_TEXTS && AR_DIMENSION_DETAIL_TEXTS[d.key])
                            ? AR_DIMENSION_DETAIL_TEXTS[d.key]
                            : (EN_DIMENSION_DATA[d.key] || { strength: "", improvement: "" });

                        return (
                            <View key={d.key} style={arStyles.dimCard} wrap={false}>
                                <View style={arStyles.dimHeader}>
                                    <ArabicText style={arStyles.dimTitle}>{arDim.label}</ArabicText>
                                    <Text style={arStyles.dimScore}>{score}/100</Text>
                                </View>
                                <ArabicText style={arStyles.dimDetail}>
                                    {`نقطة القوة: ${cleanArText(detailObj.strength)}`}
                                </ArabicText>
                                <ArabicText style={arStyles.dimDetail}>
                                    {`المسار التحسيني: ${cleanArText(detailObj.improvement)}`}
                                </ArabicText>
                                {interpret ? (
                                    <ArabicText style={arStyles.dimDetail}>
                                        {`قراءة النتيجة: ${cleanArText(interpret)}`}
                                    </ArabicText>
                                ) : null}
                            </View>
                        );
                    })}
                </View>

                <View style={arStyles.benchmarkSection} wrap={false}>
                    <ArabicText style={arStyles.sectionHeading}>المقارنة مع المعايير والمنظمات النظيرة</ArabicText>
                    <View style={arStyles.sectionRule} />

                    <CompactBenchmarkBarsArabic
                        score={result.overall}
                        industryAvg={industryAvg}
                        globalAvg={globalAvg}
                    />

                    <View style={arStyles.peerMetricsRow}>
                        <View style={arStyles.peerBlock}>
                            <ArabicText style={arStyles.metricLabel}>متوسط القطاع</ArabicText>
                            <ArabicText style={arStyles.peerValue}>
                                {industryAvg !== null ? `${industryAvg} / 100` : "غير متاح"}
                            </ArabicText>
                        </View>
                        <View style={arStyles.peerBlock}>
                            <ArabicText style={arStyles.metricLabel}>عدد المنظمات المقيمة</ArabicText>
                            <ArabicText style={arStyles.peerValue}>{`${stats?.totalAssessments ?? 0} منظمة`}</ArabicText>
                        </View>
                        <View style={arStyles.peerBlock}>
                            <ArabicText style={arStyles.metricLabel}>النسبة المئوية العالمية</ArabicText>
                            <ArabicText style={arStyles.peerValue}>{`أعلى من ${result.percentile}%`}</ArabicText>
                        </View>
                    </View>

                    <View style={arStyles.listsRow} wrap={false}>
                        <View style={arStyles.listColumn} wrap={false}>
                            <ArabicText style={arStyles.listTitle}>أبرز ٣ نقاط قوة</ArabicText>
                            {topStrengths.map((s, idx) => (
                                <View key={idx} style={arStyles.listItem} wrap={false}>
                                    <ArabicText style={arStyles.bullet}>•</ArabicText>
                                    <ArabicText>{`${s.label} (${s.score}/100)`}</ArabicText>
                                </View>
                            ))}
                        </View>
                        <View style={arStyles.listColumn} wrap={false}>
                            <ArabicText style={arStyles.listTitle}>أهم ٣ مجالات للتركيز</ArabicText>
                            {topOpportunities.map((s, idx) => (
                                <View key={idx} style={arStyles.listItem} wrap={false}>
                                    <ArabicText style={arStyles.bullet}>•</ArabicText>
                                    <ArabicText>{`${s.label} (${s.score}/100)`}</ArabicText>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <PageFooterArabicClean />
            </Page>

            {/* PAGE 3: STRATEGIC RECOMMENDATIONS + FOOTER (EXECUTIVE REDESIGN) */}
            <Page size="A4" style={arStyles.page}>
                {/* 1. HEADER: Logo top-left, Section title top-right, clean divider */}
                <View style={arStyles.p3HeaderRow}>
                    <Image src={LOGO_WORDMARK} style={arStyles.p3Logo} />
                    <ArabicText style={arStyles.p3HeaderTitle}>التوصيات الاستراتيجية</ArabicText>
                </View>
                <View style={arStyles.p3HeaderRule} />

                {/* 2. THREE EDITORIAL PHASES */}
                <View style={arStyles.p3PhaseBlock} wrap={false}>
                    <ArabicText style={arStyles.p3PhaseHeading}>
                        المرحلة الأولى: الأولويات العاجلة — خلال ٣٠ يوماً
                    </ArabicText>
                    <View style={arStyles.p3PhaseBody}>
                        {recsAr.slice(0, 1).map((r, i) => (
                            <ArabicText key={i} style={arStyles.p3RecParagraph}>
                                {cleanArText(r)}
                            </ArabicText>
                        ))}
                        <ArabicText style={arStyles.p3RecParagraph}>
                            {cleanArText(`إجراء تقييم سريع لنضج بيئة الرقابة الحالية في بعد «${topOpportunities[0]?.label || ""}» ووضع خطة معالجة ذات ملكية وجداول زمنية واضحة`)}
                        </ArabicText>
                    </View>
                </View>

                <View style={arStyles.p3PhaseDivider} />

                <View style={arStyles.p3PhaseBlock} wrap={false}>
                    <ArabicText style={arStyles.p3PhaseHeading}>
                        المرحلة الثانية: التحسينات متوسطة المدى — من ٣٠ إلى ٩٠ يوماً
                    </ArabicText>
                    <View style={arStyles.p3PhaseBody}>
                        {recsAr.slice(1, 2).map((r, i) => (
                            <ArabicText key={i} style={arStyles.p3RecParagraph}>
                                {cleanArText(r)}
                            </ArabicText>
                        ))}
                        <ArabicText style={arStyles.p3RecParagraph}>
                            {cleanArText(`تشكيل أطر حوكمة وضمان جودة منضبطة لبعد «${topOpportunities[1]?.label || ""}» يضمنان منهجية متسقة وسلامة دليلات الرقابة واتساق تنفيذ معايير المراجعة`)}
                        </ArabicText>
                    </View>
                </View>

                <View style={arStyles.p3PhaseDivider} />

                <View style={arStyles.p3PhaseBlock} wrap={false}>
                    <ArabicText style={arStyles.p3PhaseHeading}>
                        المرحلة الثالثة: التشغيل طويل المدى — من ٩٠ إلى ١٨٠ يوماً
                    </ArabicText>
                    <View style={arStyles.p3PhaseBody}>
                        {recsAr.slice(2, 3).map((r, i) => (
                            <ArabicText key={i} style={arStyles.p3RecParagraph}>
                                {cleanArText(r)}
                            </ArabicText>
                        ))}
                        <ArabicText style={arStyles.p3RecParagraph}>
                            {cleanArText(`إدماج قدرات بعد «${topStrengths[0]?.label || ""}» في نموذج تشغيل المراجعة الداخلية الأوسع لدفع تغطية تأكيدية متكاملة وقيمة رؤى مخاطر إضافية للجنة المراجعة`)}
                        </ArabicText>
                    </View>
                </View>

                {/* 3. BOTTOM FOOTER AREA */}
                <View style={arStyles.p3FooterContainer}>
                    <View style={arStyles.p3FooterRule} />
                    <View style={arStyles.p3FooterRow}>
                        <View>
                            <ArabicText style={arStyles.p3FooterLabel}>تم الإعداد من قبل</ArabicText>
                            <ArabicText style={arStyles.p3FooterValue}>
                                ترينت — متخصصو المراجعة الداخلية
                            </ArabicText>
                        </View>
                        <View>
                            <ArabicText style={arStyles.p3FooterLabel}>إطار التقييم</ArabicText>
                            <ArabicText style={arStyles.p3FooterValue}>
                                إطار ترينت لنضج المراجعة الداخلية
                            </ArabicText>
                        </View>
                    </View>

                    <ArabicText style={arStyles.p3Confidentiality}>
                        يحتوي هذا التقرير على معلومات حصرية وسرية. تستند جميع التقييمات والتوصيات إلى إطار ترينت لنضج المراجعة الداخلية وتخضع لشروط وأحكام تعاقد الخدمة.
                    </ArabicText>

                    <ArabicText
                        style={arStyles.p3PageNumber}
                        render={({ pageNumber, totalPages }: any) => `صفحة ${pageNumber} من ${totalPages}`}
                    />
                </View>
            </Page>
        </Document>
    );
};

const AssessmentPDFReportFallbackArabic = ({
    result,
    respondent,
    stats = null,
}: {
    result: AssessmentResult;
    respondent: RespondentProfile | null;
    stats?: BenchmarkStats | null;
}) => {
    return <AssessmentPDFReportArabic result={result} respondent={respondent} stats={stats || null} />;
};

// ---------------------------------------------------------------------------
// generatePDF() — language-aware entry point (backward-compatible default)
// ---------------------------------------------------------------------------
export async function generatePDF(
    result: AssessmentResult,
    respondent: RespondentProfile | null,
    stats: BenchmarkStats | null = null,
    lang: "en" | "ar" = "en"
) {
    if (!result) {
        console.error("[PDF] generatePDF called with missing result object");
        throw new Error("Missing assessment result data for PDF generation");
    }

    const rawTier = String(result?.tier || "defined").toLowerCase() as MaturityTier;
    const safeTier = (TIER_META[rawTier] ? rawTier : "defined") as MaturityTier;

    const safeResult: AssessmentResult = {
        id: result?.id || `bench-${Date.now()}`,
        overall: typeof result?.overall === "number" && !isNaN(result.overall) ? result.overall : 50,
        scores: {
            governance: typeof result?.scores?.governance === "number" ? result.scores.governance : 50,
            risk: typeof result?.scores?.risk === "number" ? result.scores.risk : 50,
            execution: typeof result?.scores?.execution === "number" ? result.scores.execution : 50,
            reporting: typeof result?.scores?.reporting === "number" ? result.scores.reporting : 50,
            capability: typeof result?.scores?.capability === "number" ? result.scores.capability : 50,
        },
        tier: safeTier,
        percentile: typeof result?.percentile === "number" && !isNaN(result.percentile) ? result.percentile : 50,
        questionCount: typeof result?.questionCount === "number" ? result.questionCount : 26,
        createdAt: result?.createdAt || new Date().toISOString(),
    };

    const { pdf } = await import("@react-pdf/renderer");
    const isAr = lang === "ar";

    const Main = isAr ? AssessmentPDFReportArabic : AssessmentPDFReport;
    const Fallback = isAr ? (AssessmentPDFReportFallbackArabic as any) : AssessmentPDFReportFallback;

    let blob: Blob;
    try {
        blob = await pdf(
            <Main result={safeResult} respondent={respondent} stats={stats} />
        ).toBlob();
    } catch (mainError) {
        console.warn("[PDF] Main report rendering failed, attempting fallback:", mainError);
        try {
            blob = await pdf(
                <Fallback result={safeResult} respondent={respondent} stats={stats} />
            ).toBlob();
        } catch (fallbackError) {
            console.error("[PDF] Fallback report also failed:", fallbackError);
            throw fallbackError;
        }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const company = (respondent?.company || "TRENNT").replace(/[^a-z0-9\u0600-\u06FF]/gi, "_");
    const suffix = isAr ? "-AR" : "-EN";
    link.download = `TRENNT${suffix}-Executive-Report-${company}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
}
