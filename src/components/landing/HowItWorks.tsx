import React from 'react';
import { LayoutGrid, UserPlus, Footprints, ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: LayoutGrid,
      title: 'Create your office',
      description: 'Set up a virtual workspace and arrange it around the way your team works.',
      visualText: 'Desks, meeting zones, and quiet pods',
    },
    {
      number: '02',
      icon: UserPlus,
      title: 'Invite your teammates',
      description: 'Share a room code or invitation link and bring everyone into the same space.',
      visualText: 'Instant browser access, zero downloads',
    },
    {
      number: '03',
      icon: Footprints,
      title: 'Walk closer and talk',
      description: 'Move toward your teammates to hear them more clearly, then move away when you need space.',
      visualText: 'Spatial voice with distance-based falloff',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#F4F6F9] scroll-mt-12">
      <Container>
        <SectionHeading
          eyebrow="Simple Setup"
          title="Three steps. More natural teamwork."
          subtitle="Get your entire team collaborating in minutes without IT headaches."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} hoverEffect className="relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-primary/25 font-mono">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-navy mb-3">
                    {step.title}
                  </h3>

                  <p className="text-text-muted text-sm md:text-base leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Step Sub-pill */}
                <div className="pt-4 border-t border-border/70 flex items-center gap-2 text-xs font-medium text-navy/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{step.visualText}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Section CTA */}
        <div className="flex justify-center">
          <Button to="/signup" variant="primary" size="lg" className="gap-2 shadow-md">
            Start building your office
            <ArrowRight size={18} />
          </Button>
        </div>
      </Container>
    </section>
  );
};
