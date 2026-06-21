"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Calendar,
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";
import { useNav } from "@/lib/store";
import { ARTICLES, ARTICLE_CATEGORIES, COMPANY } from "@/lib/content";
import type { Article, ArticleBlock } from "@/lib/types";
import { Reveal, Eyebrow, SectionHeading } from "@/components/site/reveal";
import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CATEGORY_ACCENT: Record<string, string> = {
  Strategy: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  "Data & AI": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Operations: "bg-teal-500/10 text-teal-700 border-teal-500/20",
  Culture: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Perspective: "bg-orange-500/10 text-orange-700 border-orange-500/20",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ResourcesView() {
  const navigate = useNav((s) => s.navigate);
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string>("All");

  // If there's a hash like #/resources/article-slug, read it.
  React.useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      const parts = hash.split("/");
      if (parts[0] === "resources" && parts[1]) {
        const found = ARTICLES.find((a) => a.slug === parts[1]);
        if (found) {
          setActiveSlug(found.slug);
          return;
        }
      }
      setActiveSlug(null);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const activeArticle = React.useMemo(
    () => ARTICLES.find((a) => a.slug === activeSlug) ?? null,
    [activeSlug]
  );

  const filtered = React.useMemo(() => {
    const list = category === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === category);
    return [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const openArticle = (slug: string) => {
    window.location.hash = `/resources/${slug}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToList = () => {
    window.location.hash = "/resources";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeArticle) {
    return (
      <ArticleReader
        article={activeArticle}
        onBack={backToList}
        onNavigate={(slug) => openArticle(slug)}
      />
    );
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-secondary/30">
        <div className="absolute inset-0 bg-radial-fade opacity-70" />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Reveal>
            <Eyebrow>Resources · Field notes</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.02]">
              Field notes from the work,{" "}
              <span className="text-primary">not the keynote circuit.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Short, opinionated essays from Trennt partners — drawn from active
              engagements, not recycled frameworks. We publish when we have something
              to say, not on a content calendar.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {ARTICLE_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-all " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground")
                  }
                >
                  {cat}
                </button>
              );
            })}
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </span>
          </div>
        </div>
      </section>

      {/* Featured + list */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              No articles in this category yet.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <Reveal>
                <button
                  onClick={() => openArticle(featured.slug)}
                  className="group block w-full text-left"
                >
                  <Card className="overflow-hidden rounded-2xl border-border/70 transition-all hover:border-primary/30 hover:shadow-lg">
                    <div className="grid gap-0 md:grid-cols-2">
                      <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden bg-secondary/40 p-8 md:p-12">
                        <div className="absolute inset-0 bg-grid opacity-30" />
                        <div className="absolute inset-0 bg-radial-fade opacity-60" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon name={featured.icon} className="h-10 w-10" />
                        </div>
                      </div>
                      <div className="p-8 md:p-10">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={
                              "border " + (CATEGORY_ACCENT[featured.category] ?? "")
                            }
                          >
                            {featured.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Featured
                          </span>
                        </div>
                        <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                          {featured.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {featured.excerpt}
                        </p>
                        <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {featured.author}
                          </span>
                          <span>·</span>
                          <span>{featured.authorRole}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {featured.readMinutes} min
                          </span>
                        </div>
                        <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                          Read the article
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </button>
              </Reveal>
            )}

            {/* Grid of remaining articles */}
            {rest.length > 0 && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, i) => (
                  <Reveal key={article.slug} delay={Math.min(i * 0.05, 0.2)}>
                    <ArticleCard article={article} onOpen={() => openArticle(article.slug)} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-border/70 bg-background p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight">
                  Get the next field note in your inbox.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The Trennt Quarterly — four issues a year, no filler. Unsubscribe anytime.
                </p>
              </div>
              <Button
                onClick={() => navigate("contact")}
                className="shrink-0 gap-1.5 rounded-full"
              >
                Subscribe
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article card
// ---------------------------------------------------------------------------

function ArticleCard({
  article,
  onOpen,
}: {
  article: Article;
  onOpen: () => void;
}) {
  return (
    <button onClick={onOpen} className="group block h-full text-left">
      <Card className="flex h-full flex-col rounded-xl border-border/70 p-6 transition-all hover:border-primary/30 hover:shadow-md">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={"border " + (CATEGORY_ACCENT[article.category] ?? "")}
          >
            {article.category}
          </Badge>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <Icon name={article.icon} className="h-4 w-4" />
          </span>
        </div>
        <h3 className="mt-4 text-balance text-lg font-semibold leading-snug tracking-tight">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(article.date)}
            <span>·</span>
            <Clock className="h-3 w-3" />
            {article.readMinutes} min
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Read
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Card>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Article reader
// ---------------------------------------------------------------------------

function ArticleReader({
  article,
  onBack,
  onNavigate,
}: {
  article: Article;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}) {
  const navigate = useNav((s) => s.navigate);
  // Related articles: same category, excluding current, max 3.
  const related = React.useMemo(() => {
    return ARTICLES.filter(
      (a) => a.category === article.category && a.slug !== article.slug
    )
      .slice(0, 3)
      .concat(
        ARTICLES.filter(
          (a) => a.category !== article.category && a.slug !== article.slug
        ).slice(0, Math.max(0, 3 - ARTICLES.filter((a) => a.category === article.category && a.slug !== article.slug).length))
      )
      .slice(0, 3);
  }, [article]);

  return (
    <div className="bg-background">
      {/* Article header */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All field notes
        </button>

        <div className="mt-8 flex items-center gap-3">
          <Badge
            variant="outline"
            className={"border " + (CATEGORY_ACCENT[article.category] ?? "")}
          >
            {article.category}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {article.readMinutes} min read
          </span>
        </div>

        <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
          {article.title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>

        <div className="mt-8 flex items-center gap-3 border-y border-border/60 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {article.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{article.author}</p>
            <p className="text-xs text-muted-foreground">
              {article.authorRole} · {formatDate(article.date)}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="mt-10 space-y-6">
          {article.body.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </div>

        {/* Article footer */}
        <div className="mt-12 rounded-2xl border border-border/70 bg-secondary/30 p-6">
          <p className="text-sm font-medium text-foreground">
            Want to pressure-test this with someone who&apos;s done it?
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We&apos;re always happy to talk through the specifics of your situation —
            no pitch, no obligation.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("contact")}
              size="sm"
              className="gap-1.5 rounded-full"
            >
              Talk to a partner
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => navigate("benchmark-landing")}
              size="sm"
              variant="outline"
              className="rounded-full"
            >
              Take the benchmark
            </Button>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
            <SectionHeading
              eyebrow="Keep reading"
              title="Related field notes"
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard
                  key={a.slug}
                  article={a}
                  onOpen={() => onNavigate(a.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block renderer
// ---------------------------------------------------------------------------

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-base leading-[1.75] text-foreground/90">
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h2 className="pt-4 text-2xl font-semibold tracking-tight">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-primary/50 pl-6">
          <Quote className="h-5 w-5 text-primary/60" />
          <p className="mt-2 text-lg font-medium italic leading-relaxed text-foreground">
            {block.text}
          </p>
          {block.attribution && (
            <footer className="mt-2 text-sm text-muted-foreground">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {block.title}
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground/90">
            {block.text}
          </p>
        </div>
      );
    default:
      return null;
  }
}
