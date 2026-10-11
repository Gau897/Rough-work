import React from 'react';
import { CalendarX2, VolumeX, MessageSquareOff, ArrowRight, Check, X } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { SectionHeading } from '../ui/SectionHeading';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: CalendarX2,
      title: 'Too many scheduled calls',
      description: 'Quick questions become calendar events instead of natural conversations.',
    },
    {
      icon: VolumeX,
      title: 'Silent virtual offices',
      description: "Being connected to a workspace doesn't always mean feeling connected to your team.",
    },
    {
      icon: MessageSquareOff,
      title: 'Conversations without context',
      description: "It's harder to notice who's available when everyone is isolated in separate calls.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white border-y border-border">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          eyebrow="The Remote Work Friction"
          title="Remote work shouldn't feel so distant."
          subtitle="Great collaboration happens in the small conversations between meetings."
        />

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {problems.map((prob) => {
            const Icon = prob.icon;
            return (
              <Card key={prob.title} hoverEffect className="bg-surface-bg/50 border-border">
                <div className="w-12 h-12 rounded-xl bg-danger-light text-danger flex items-center justify-center mb-5">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {prob.title}
                </h3>
                <p className="text-text-muted leading-relaxed text-sm md:text-base">
                  {prob.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Contrasting Solution Block */}
        <div className="rounded-2xl bg-gradient-to-br from-surface-bg via-white to-primary-light/30 border border-border p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              The ProxiSpeak Difference
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-navy mt-2 mb-4">
              Bring back the hallway conversation.
            </h3>
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              ProxiSpeak uses a shared spatial workspace and proximity-based audio to make spontaneous interactions effortless. Walk up to a desk, ask a quick question, and carry on with your flow.
            </p>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Traditional Workflow */}
            <div className="rounded-xl border border-border bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-danger-light text-danger flex items-center justify-center shrink-0">
                  <X size={14} />
                </div>
                <h4 className="text-base font-bold text-navy">Traditional Workflow</h4>
              </div>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-text-muted shrink-0">•</span>
                  <span>Schedule calendar invite or write Slack DM</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-text-muted shrink-0">•</span>
                  <span>Generate unique meeting link and wait in lobby</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-text-muted shrink-0">•</span>
                  <span>Rigid room where only one person speaks at once</span>
                </li>
              </ul>
            </div>

            {/* ProxiSpeak Workflow */}
            <div className="rounded-xl border-2 border-primary/40 bg-white p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-md uppercase tracking-wider">
                Natural Flow
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-success-light text-success flex items-center justify-center shrink-0">
                  <Check size={14} />
                </div>
                <h4 className="text-base font-bold text-navy">ProxiSpeak Workflow</h4>
              </div>
              <ul className="space-y-3 text-sm text-navy">
                <li className="flex items-start gap-2.5">
                  <ArrowRight size={14} className="text-primary mt-1 shrink-0" />
                  <span>Glance at the office map to see who is around</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ArrowRight size={14} className="text-primary mt-1 shrink-0" />
                  <span>Walk your avatar toward a teammate’s workstation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ArrowRight size={14} className="text-primary mt-1 shrink-0" />
                  <span>Start talking naturally as audio fades in smoothly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
