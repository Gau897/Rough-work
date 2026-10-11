import React from 'react';
import { Volume2, Building2, MessageCircle, Lock, Users, ShieldCheck } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { SectionHeading } from '../ui/SectionHeading';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Volume2,
      title: 'Spatial audio',
      description: 'Hear nearby teammates more clearly and let conversations fade naturally as you move away.',
    },
    {
      icon: Building2,
      title: 'A shared virtual office',
      description: 'Give your team a persistent workspace with desks, meeting areas, and room layouts.',
    },
    {
      icon: MessageCircle,
      title: 'Spontaneous conversations',
      description: 'Approach a teammate and start a conversation without organizing a formal meeting first.',
    },
    {
      icon: Lock,
      title: 'Private conversations',
      description: 'Support focused discussions with explicit private-conversation controls.',
    },
    {
      icon: Users,
      title: 'Flexible team meetings',
      description: 'Bring everyone together or invite selected members when a group conversation is needed.',
    },
    {
      icon: ShieldCheck,
      title: 'Room controls and permissions',
      description: 'Manage invitations, membership, access rules, and team roles.',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#F4F6F9] scroll-mt-12">
      <Container>
        <SectionHeading
          eyebrow="Core Capabilities"
          title="Everything you need to feel together."
          subtitle="Designed specifically to replicate the spontaneous warmth of an in-person office."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} hoverEffect className="flex flex-col justify-start">
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-5 shrink-0">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {feat.title}
                </h3>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
