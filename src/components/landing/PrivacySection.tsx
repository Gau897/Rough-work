import React from 'react';
import { Shield, Eye, Mic, Lock, UserCheck } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { SectionHeading } from '../ui/SectionHeading';

export const PrivacySection: React.FC = () => {
  const controls = [
    {
      icon: Eye,
      title: 'Choose your availability',
      description: 'Set your presence to Open, Private Bubble, or Do Not Disturb whenever you need deep focus.',
    },
    {
      icon: Lock,
      title: 'Control room access',
      description: 'Generate private 6-character room codes or share direct invite links. Lock rooms when sessions conclude.',
    },
    {
      icon: UserCheck,
      title: 'Start private conversations',
      description: 'Lock your immediate circle into a private conversation. Colleagues must knock to request joining.',
    },
    {
      icon: Mic,
      title: 'Browser-governed audio',
      description: 'Microphone permissions are requested strictly when entering live rooms, never on marketing pages.',
    },
    {
      icon: Shield,
      title: 'Leader room permissions',
      description: 'Designated room leaders govern office layouts, broadcasting announcements, and room membership.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F4F6F9]">
      <Container>
        <SectionHeading
          eyebrow="Privacy & Safety"
          title="Your workspace. Your boundaries."
          subtitle="Real collaboration requires clear boundaries. You stay in full control over when you are heard."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {controls.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-6">
                <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h4 className="text-base font-bold text-navy mb-2">
                  {item.title}
                </h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Clear Notice Banner */}
        <div className="max-w-3xl mx-auto rounded-xl bg-white border border-border p-4 text-xs text-text-muted text-center shadow-xs">
          <strong>Audio Transparency:</strong> ProxiSpeak requests browser microphone permission only upon actively entering a live virtual office room. Visiting this landing page never accesses your microphone or transmits audio.
        </div>
      </Container>
    </section>
  );
};
