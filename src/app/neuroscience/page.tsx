"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { Brain, Zap, FlaskConical, HeartPulse, Lightbulb, Users, Dumbbell, Sun, Heart, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

const stepAccentColors = [
  "var(--accent-sage)",
  "var(--accent-serenity)",
  "var(--accent-amber)",
  "var(--accent-sage)",
  "var(--accent-serenity)",
  "var(--accent-amber)",
  "var(--accent-sage)",
];

const scienceIcons = [
  <Zap className="w-4 h-4" key="zap" />,
  <HeartPulse className="w-4 h-4" key="heart" />,
  <Brain className="w-4 h-4" key="brain" />,
  <FlaskConical className="w-4 h-4" key="flask" />,
  <Lightbulb className="w-4 h-4" key="light" />,
];

const rebuildIcons = [
  <Users className="w-5 h-5" key="users" />,
  <Dumbbell className="w-5 h-5" key="dumbbell" />,
  <Sun className="w-5 h-5" key="sun" />,
  <Heart className="w-5 h-5" key="heart" />,
  <Sparkles className="w-5 h-5" key="sparkles" />,
];

export default function NeurosciencePage() {
  const { t } = useT();
  const n = t.neuroscience;

  const scienceItems = n.science.map((item, i) => ({
    id: item.id,
    title: item.title,
    icon: scienceIcons[i],
    content: <p className="leading-relaxed">{item.content}</p>,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

      {/* Hero */}
      <div className="mb-10">
        <Badge variant="sage" className="mb-4">{n.badge}</Badge>
        <h1 className="text-4xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          {n.titlePrefix}{" "}
          <em className="not-italic text-[var(--accent-sage)]">{n.titleEm}</em>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-2xl">
          {n.subtitle}
        </p>
      </div>

      {/* Infographic */}
      <div className="mb-14 rounded-2xl overflow-hidden border border-[var(--border-soft)] shadow-calm-md">
        <Image
          src="/how-memory-forms.png"
          alt={n.imageAlt}
          width={1456}
          height={816}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* 7 Steps */}
      <section aria-labelledby="steps-heading" className="mb-14">
        <h2 id="steps-heading" className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          {n.stepsTitle}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">{n.stepsSubtitle}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {n.steps.slice(0, 6).map((step, i) => (
            <div
              key={step.number}
              className="flex gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)]"
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: stepAccentColors[i] }}
                aria-hidden
              >
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}

          {/* Step 7 — full width, visually closes the loop */}
          <div className="sm:col-span-2 flex gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--accent-sage)]/40">
            <span
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: stepAccentColors[6] }}
              aria-hidden
            >
              {n.steps[6].number}
            </span>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{n.steps[6].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{n.steps[6].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Science accordion */}
      <section aria-labelledby="science-heading" className="mb-14">
        <h2 id="science-heading" className="text-xl font-semibold text-[var(--text-primary)] mb-5">
          {n.scienceTitle}
        </h2>
        <Accordion items={scienceItems} allowMultiple />
      </section>

      {/* ── HOPE: Recovery as memory-building ────────────────────────────────── */}
      <section aria-labelledby="rebuild-heading" className="mb-14">
        <div className="mb-6">
          <h2
            id="rebuild-heading"
            className="text-2xl font-semibold text-[var(--text-primary)] mb-3"
          >
            {n.rebuildTitle}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">{n.rebuildSubtitle}</p>
        </div>

        {/* Core insight card */}
        <Card variant="sage" padding="lg" className="mb-6">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-[var(--accent-sage)] flex-shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{n.rebuildInsight}</p>
          </div>
        </Card>

        {/* 5 pathways */}
        <div className="grid sm:grid-cols-2 gap-4">
          {n.rebuildPaths.map((path, i) => (
            <div
              key={path.title}
              className="flex gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)]"
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--accent-sage-light)] text-[var(--accent-sage)]"
                aria-hidden
              >
                {rebuildIcons[i]}
              </span>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{path.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{path.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-[var(--accent-sage)] font-medium italic px-1">
          {n.rebuildNote}
        </p>
      </section>

      {/* Research facts */}
      <section aria-labelledby="facts-heading" className="mb-14">
        <h2 id="facts-heading" className="text-xl font-semibold text-[var(--text-primary)] mb-5">
          {n.factsTitle}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {n.facts.map((fact) => (
            <Card key={fact.stat} variant="sage" padding="md" className="text-center">
              <p className="text-2xl font-bold text-[var(--accent-sage)] mb-2">{fact.stat}</p>
              <p className="text-xs text-[var(--text-secondary)] leading-snug">{fact.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing statement */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--accent-sage)]/30 p-8 mb-10 text-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{n.closingTitle}</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">{n.closingText}</p>
      </div>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/meetings"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-calm"
        >
          {n.backLink}
        </Link>
      </div>
    </div>
  );
}
