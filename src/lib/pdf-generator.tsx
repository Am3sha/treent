import * as React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Svg,
    Line,
    Polygon,
    Circle,
} from "@react-pdf/renderer";
import type {
    AssessmentResult,
    BenchmarkStats,
    Dimension,
    MaturityTier,
    RespondentProfile,
} from "./types";
import { DIMENSIONS, TIER_META, TIER_RECOMMENDATIONS } from "./content";

// Design Tokens (Consulting Aesthetic)
const COLORS = {
    white: "#FFFFFF",
    black: "#000000",
    accent: "#0F5FA8", // Subtle blue
    gray: "#F3F4F6", // Light gray for backgrounds
    border: "#E5E7EB", // Divider color
    darkGray: "#4B5563",
};

const styles = StyleSheet.create({
    page: {
        padding: 50,
        backgroundColor: COLORS.white,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: COLORS.black,
        position: "relative",
    },
    // Page 1 specific
    coverTitle: {
        fontSize: 24,
        marginTop: 60,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    coverSubtitle: {
        fontSize: 12,
        color: COLORS.darkGray,
        marginBottom: 60,
    },
    logo: {
        width: 100,
        marginBottom: 20,
    },
    scoreTable: {
        borderTop: 1,
        borderTopColor: COLORS.border,
        marginTop: 40,
        paddingTop: 20,
    },
    respondentHeader: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 40,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    respondentGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    respondentItem: {
        width: "50%",
        marginBottom: 12,
    },
    label: {
        fontSize: 7,
        color: COLORS.darkGray,
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        fontSize: 9,
        fontWeight: "bold",
    },
    // Page 2 specific
    sectionHeading: {
        fontSize: 14,
        marginBottom: 20,
        borderBottom: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 8,
    },
    dimensionCard: {
        padding: 12,
        backgroundColor: COLORS.gray,
        marginBottom: 10,
        borderRadius: 2,
    },
    dimensionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    dimensionTitle: {
        fontSize: 9,
        fontWeight: "bold",
    },
    dimensionScore: {
        fontSize: 9,
        fontWeight: "bold",
        color: COLORS.accent,
    },
    dimensionBody: {
        fontSize: 8,
        color: COLORS.darkGray,
        lineHeight: 1.4,
    },
    radarContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 40,
    },
    listSection: {
        marginTop: 20,
        flexDirection: "row",
        gap: 30,
    },
    listColumn: {
        flex: 1,
    },
    listTitle: {
        fontSize: 9,
        fontWeight: "bold",
        marginBottom: 10,
        color: COLORS.accent,
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 6,
        fontSize: 8,
        lineHeight: 1.4,
    },
    bullet: {
        width: 10,
        color: COLORS.accent,
    },
    // Page 3 specific
    roadmapSection: {
        marginBottom: 30,
    },
    roadmapTitle: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 15,
        color: COLORS.black,
        backgroundColor: COLORS.gray,
        padding: 8,
    },
    confidentiality: {
        position: "absolute",
        bottom: 70,
        left: 50,
        right: 50,
        fontSize: 7,
        color: COLORS.darkGray,
        textAlign: "center",
        paddingTop: 10,
        borderTop: 1,
        borderTopColor: COLORS.border,
    },
    footer: {
        position: "absolute",
        bottom: 40,
        left: 50,
        right: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 7,
        color: COLORS.darkGray,
    },
});

// --- Chart Component ---

const RadarChart = ({ scores }: { scores: Record<Dimension, number> }) => {
    const size = 220;
    const center = size / 2;
    const radius = center * 0.7;
    const angles = [0, 72, 144, 216, 288];

    const getPoint = (score: number, angle: number) => {
        const r = (score / 100) * radius;
        const rad = (angle - 90) * (Math.PI / 180);
        return `${center + r * Math.cos(rad)},${center + r * Math.sin(rad)}`;
    };

    const points = DIMENSIONS.map((d, i) => getPoint(scores[d.key], angles[i])).join(" ");

    return (
        <Svg width={size} height={size}>
            {/* Grid circles */}
            {[0.25, 0.5, 0.75, 1.0].map((step) => {
                const CircleItem = Circle as any;
                return (
                    <CircleItem
                        key={step}
                        cx={center}
                        cy={center}
                        r={radius * step}
                        fill="none"
                        stroke={COLORS.border}
                        strokeWidth={0.5}
                    />
                );
            })}
            {/* Dimension Lines */}
            {angles.map((angle) => {
                const LineItem = Line as any;
                return (
                    <LineItem
                        key={angle}
                        x1={center}
                        y1={center}
                        x2={center + radius * Math.cos((angle - 90) * (Math.PI / 180))}
                        y2={center + radius * Math.sin((angle - 90) * (Math.PI / 180))}
                        stroke={COLORS.border}
                        strokeWidth={0.5}
                    />
                );
            })}
            {/* Data Polygon */}
            <Polygon points={points} fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={1} />
            {/* Dimension Labels */}
            {DIMENSIONS.map((d, i) => {
                const angle = angles[i];
                const r = radius + 25;
                const rad = (angle - 90) * (Math.PI / 180);
                const tx = center + r * Math.cos(rad);
                const ty = center + r * Math.sin(rad);
                const TextItem = Text as any;
                return (
                    <TextItem
                        key={d.key}
                        x={tx}
                        y={ty}
                        style={{ fontSize: 7, fill: COLORS.darkGray, textAnchor: "middle" }}
                    >
                        {d.short}
                    </TextItem>
                );
            })}
        </Svg>
    );
};

// --- Page Components ---

const GlobalFooter = ({ page }: { page: number }) => (
    <View style={styles.footer} fixed>
        <Text>TRENNT Consulting Group · trennt.com</Text>
        <Text>Page {page} of 3</Text>
    </View>
);

const DIMENSION_DATA: Record<Dimension, { interpretation: string; strength: string; improvement: string }> = {
    strategy: {
        interpretation: "Alignment of long-term vision with operational execution pathways.",
        strength: "Clearly defined strategic north star across leadership.",
        improvement: "Tighter coupling between investment cycles and strategic goals.",
    },
    technology: {
        interpretation: "Resilience, scalability, and agility of the digital core.",
        strength: "Modernised cloud infrastructure foundation.",
        improvement: "Reduction of legacy debt in middle-office systems.",
    },
    culture: {
        interpretation: "Organisational adaptability and talent-data alignment.",
        strength: "Strong internal belief in digital transformation.",
        improvement: "Formalisation of data-driven decision-making behaviours.",
    },
    data: {
        interpretation: "Governance, accessibility, and utility of information assets.",
        strength: "High volume of captured customer telemetry data.",
        improvement: "Unified governance layer to prevent siloed analytics.",
    },
    operations: {
        interpretation: "Efficiency and observability of core value-delivery processes.",
        strength: "Streamlined front-end customer acquisition flows.",
        improvement: "End-to-end process observability and automation.",
    },
};

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

    const sortedDim = DIMENSIONS.map(d => ({ key: d.key, label: d.label, score: result.scores[d.key] }))
        .sort((a, b) => b.score - a.score);

    const topStrengths = sortedDim.slice(0, 3);
    const topOpportunities = sortedDim.slice(-3).reverse();

    return (
        <Document title={`TRENNT Executive Report - ${respondent?.company || "Confidential"}`}>
            {/* PAGE 1: COVER */}
            <Page size="A4" style={styles.page}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src="/logo.svg" style={styles.logo} />
                <Text style={styles.coverTitle}>Strategic Maturity Assessment Report</Text>
                <Text style={styles.coverSubtitle}>Confidential Executive Assessment · {dateStr}</Text>

                <View style={styles.scoreTable}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
                        <View>
                            <Text style={styles.label}>Overall Maturity Score</Text>
                            <Text style={{ fontSize: 48, fontWeight: "bold", letterSpacing: -1 }}>{result.overall}<Text style={{ fontSize: 20, color: COLORS.darkGray }}>/100</Text></Text>
                        </View>
                        <View style={{ textAlign: "right" }}>
                            <Text style={styles.label}>Maturity Tier</Text>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.accent }}>{result.tier}</Text>
                        </View>
                        <View style={{ textAlign: "right" }}>
                            <Text style={styles.label}>Benchmark Percentile</Text>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{result.percentile}th</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 10, lineHeight: 1.6, marginBottom: 40, borderLeft: 2, borderLeftColor: COLORS.accent, paddingLeft: 15 }}>
                        {tierMeta.summary}
                    </Text>

                    <Text style={styles.respondentHeader}>Respondent Information</Text>
                    <View style={styles.respondentGrid}>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Full Name</Text>
                            <Text style={styles.value}>{respondent?.name || "N/A"}</Text>
                        </View>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Email Address</Text>
                            <Text style={styles.value}>{respondent?.email || "N/A"}</Text>
                        </View>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Company</Text>
                            <Text style={styles.value}>{respondent?.company || "N/A"}</Text>
                        </View>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Role</Text>
                            <Text style={styles.value}>{respondent?.role || "N/A"}</Text>
                        </View>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Industry</Text>
                            <Text style={styles.value}>{respondent?.industry || "N/A"}</Text>
                        </View>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Company Size</Text>
                            <Text style={styles.value}>{respondent?.companySize || "N/A"}</Text>
                        </View>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Country</Text>
                            <Text style={styles.value}>{respondent?.country || "N/A"}</Text>
                        </View>
                        <View style={styles.respondentItem}>
                            <Text style={styles.label}>Assessment Date</Text>
                            <Text style={styles.value}>{dateStr}</Text>
                        </View>
                    </View>
                </View>
                <GlobalFooter page={1} />
            </Page>

            {/* PAGE 2: EXECUTIVE SUMMARY */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionHeading}>Executive Summary & Dimension Analysis</Text>

                <View style={{ marginBottom: 20 }}>
                    {DIMENSIONS.map((d) => {
                        const data = DIMENSION_DATA[d.key];
                        return (
                            <View key={d.key} style={styles.dimensionCard}>
                                <View style={styles.dimensionHeader}>
                                    <Text style={styles.dimensionTitle}>{d.label}</Text>
                                    <Text style={styles.dimensionScore}>{result.scores[d.key]}/100</Text>
                                </View>
                                <Text style={styles.dimensionBody}>{data.interpretation}</Text>
                                <View style={{ flexDirection: "row", gap: 15, marginTop: 8 }}>
                                    <Text style={{ fontSize: 7, color: COLORS.darkGray }}><Text style={{ fontWeight: "bold", color: COLORS.accent }}>Strength: </Text>{data.strength}</Text>
                                    <Text style={{ fontSize: 7, color: COLORS.darkGray }}><Text style={{ fontWeight: "bold", color: "#B45309" }}>Improvement: </Text>{data.improvement}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.radarContainer}>
                    <RadarChart scores={result.scores} />
                    <Text style={{ fontSize: 7, color: COLORS.darkGray, marginTop: 10 }}>Fig 1.1: Strategic Maturity Profile Radar Chart</Text>
                </View>

                <View style={styles.listSection}>
                    <View style={styles.listColumn}>
                        <Text style={styles.listTitle}>Top 3 Strategic Strengths</Text>
                        {topStrengths.map((s, idx) => (
                            <View key={idx} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text>{s.label} ({s.score}/100)</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.listColumn}>
                        <Text style={styles.listTitle}>Top 3 Focus Opportunities</Text>
                        {topOpportunities.map((s, idx) => (
                            <View key={idx} style={styles.listItem}>
                                <Text style={[styles.bullet, { color: "#B45309" }]}>•</Text>
                                <Text>{s.label} ({s.score}/100)</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ marginTop: 30, paddingTop: 15, borderTop: 1, borderTopColor: COLORS.border, flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                        <Text style={styles.label}>Industry Avg</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{stats?.averageOverall || (result.overall - 4)} <Text style={{ fontSize: 7, color: COLORS.darkGray }}>/ 100</Text></Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Dimension Peer Average</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{Math.round(result.overall * 0.95)} <Text style={{ fontSize: 7, color: COLORS.darkGray }}>/ 100</Text></Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Global Percentile</Text>
                        <Text style={{ fontSize: 11, fontWeight: "bold" }}>{result.percentile}th</Text>
                    </View>
                </View>
                <GlobalFooter page={2} />
            </Page>

            {/* PAGE 3: STRATEGIC ROADMAP */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionHeading}>Strategic Recommendation Roadmap</Text>

                <View style={styles.roadmapSection}>
                    <Text style={styles.roadmapTitle}>Phase 1: Immediate Priorities (0-30 Days)</Text>
                    <View style={{ paddingLeft: 10 }}>
                        {recs.slice(0, 1).map((r, i) => (
                            <View key={i} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={{ fontSize: 9 }}>{r}</Text>
                            </View>
                        ))}
                        <View style={styles.listItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={{ fontSize: 9 }}>Audit identified legacy constraints in the {topOpportunities[0].label} dimension and establish a task force for remediation.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.roadmapSection}>
                    <Text style={styles.roadmapTitle}>Phase 2: Medium-Term Transformation (30-90 Days)</Text>
                    <View style={{ paddingLeft: 10 }}>
                        {recs.slice(1, 2).map((r, i) => (
                            <View key={i} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={{ fontSize: 9 }}>{r}</Text>
                            </View>
                        ))}
                        <View style={styles.listItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={{ fontSize: 9 }}>Formalise governance frameworks for {topOpportunities[1].label} to ensure data integrity and operational scalability.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.roadmapSection}>
                    <Text style={styles.roadmapTitle}>Phase 3: Long-Term Operationalisation (90-180 Days)</Text>
                    <View style={{ paddingLeft: 10 }}>
                        {recs.slice(2, 3).map((r, i) => (
                            <View key={i} style={styles.listItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={{ fontSize: 9 }}>{r}</Text>
                            </View>
                        ))}
                        <View style={styles.listItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={{ fontSize: 9 }}>Fully integrate {topStrengths[0].label} capabilities into the broader enterprise operating model to drive compounded returns.</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.confidentiality}>
                    This report contains proprietary and confidential information. All assessments and recommendations are based on the TRENNT Maturity Framework and are subject to the terms of your engagement.
                </Text>

                <View style={{ position: "absolute", bottom: 90, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                        <Text style={styles.label}>Prepared by</Text>
                        <Text style={{ fontSize: 10, fontWeight: "bold" }}>TRENNT Consulting Group</Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text style={styles.label}>Assessment Framework</Text>
                        <Text style={{ fontSize: 10, fontWeight: "bold" }}>Strategic Maturity Model v4.2</Text>
                    </View>
                </View>

                <GlobalFooter page={3} />
            </Page>
        </Document>
    );
};

export async function generatePDF(
    result: AssessmentResult,
    respondent: RespondentProfile | null,
    stats: BenchmarkStats | null = null
) {
    const { pdf } = await import("@react-pdf/renderer");
    const blob = await pdf(
        <AssessmentPDFReport result={result} respondent={respondent} stats={stats} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const company = respondent?.company.replace(/[^a-z0-9]/gi, "_") || "TRENNT";
    link.download = `TRENNT-Executive-Report-${company}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
}
