import React from 'react';
import { Laptop, GraduationCap, Rocket } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { SectionHeading } from '../ui/SectionHeading';

export const UseCases: React.FC = () => {
  const useCases = [
    {
      icon: Laptop,
      badge: 'Software & Product',
      title: 'Remote product teams',
      description: 'Stay connected throughout the day without turning every question into a meeting.',
      sceneText: 'Engineers pairing across desks, spontaneous design critiques, hallway syncs.',
    },
    {
      icon: GraduationCap,
      badge: 'Academic & Projects',
      title: 'Student project groups',
      description: 'Work on assignments together, ask quick questions, and collaborate from different locations.',
      sceneText: 'Study pods, hackathon team tables, shared sprint war-rooms.',
    },
    {
      icon: Rocket,
      badge: 'Early Stage',
      title: 'Distributed startups',
      description: 'Create a shared digital office that helps teammates feel present and accessible.',
      sceneText: 'Founders and early hires co-working without scheduling fatigue.',
    },
  ];

  return (
    <section id="for-teams" className="py-20 md:py-28 bg-white border-b border-border scroll-mt-12">
      <Container>
        <SectionHeading
          eyebrow="Tailored Experiences"
          title="One workspace. Different ways to work."
          subtitle="Whether shipping software or tackling group projects, natural communication speeds up teamwork."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <Card key={uc.title} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary-light/50 px-2.5 py-1 rounded-full">
                      {uc.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-navy mb-3">
                    {uc.title}
                  </h3>

                  <p className="text-text-muted text-sm md:text-base leading-relaxed mb-6">
                    {uc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/80 text-xs text-navy/80 font-medium">
                  <span className="text-text-muted block text-[11px] mb-1 uppercase tracking-wider">Common Setup:</span>
                  {uc.sceneText}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
