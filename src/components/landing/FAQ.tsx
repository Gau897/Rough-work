import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FAQItem } from '../../types/landing';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'What is ProxiSpeak?',
      answer:
        'ProxiSpeak is a spatial audio virtual office platform designed for distributed teams. Instead of sitting in static, fatigue-inducing video calls, teammates move around a persistent 2D floor plan where audio dynamically crossfades based on distance—just like walking up to a desk in a real office.',
    },
    {
      id: 'faq-2',
      question: 'How does proximity-based audio work?',
      answer:
        'In our live office rooms, the audio engine computes the Euclidean distance between avatars. Teammates within your 100-pixel conversational perimeter sound louder and clearer, with natural stereo panning. As you walk away, voices fade to quietness. Note that the demonstration on this landing page is an interactive visual simulation and does not capture real audio.',
    },
    {
      id: 'faq-3',
      question: 'Do I need to download anything?',
      answer:
        'No. ProxiSpeak runs entirely in standard modern web browsers (Chrome, Firefox, Safari, Edge) utilizing WebRTC and HTML5 Canvas. There are zero desktop installers, extensions, or administrative permissions required.',
    },
    {
      id: 'faq-4',
      question: 'Can I create a private virtual office?',
      answer:
        'Yes. When you create an office, you receive a unique 6-character room code and a shareable invitation link. Room creators have full leader permissions to set room access rules, configure layouts, or lock rooms when sessions conclude.',
    },
    {
      id: 'faq-5',
      question: 'Can I use ProxiSpeak with my college project team?',
      answer:
        'Absolutely. ProxiSpeak is built for student hackathon teams, university study pods, and project groups who want to co-work together online without leaving constant video links open.',
    },
    {
      id: 'faq-6',
      question: 'Do I need a microphone?',
      answer:
        'To speak with teammates in a live office room, you will need a microphone and must grant standard browser microphone permission upon entering. However, you can explore the landing page demonstration, listen in as an attendee, or navigate without a microphone.',
    },
    {
      id: 'faq-7',
      question: 'Can I control who enters my room?',
      answer:
        'Yes. Rooms can be shared selectively via unique codes, and room leaders can lock the space to prevent new entrants. Furthermore, inside the office, you can toggle into a Private Bubble that requires outsiders to knock before joining your conversation.',
    },
    {
      id: 'faq-8',
      question: 'Does ProxiSpeak replace traditional video meetings?',
      answer:
        'ProxiSpeak complements scheduled meetings by handling the spontaneous conversations, quick syncs, and ambient co-working that calendar tools overlook. For all-hands broadcasts, room leaders can trigger meeting broadcast mode to address the entire floor at once.',
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#F4F6F9] scroll-mt-12">
      <Container>
        <SectionHeading
          eyebrow="Got Questions?"
          title="Frequently asked questions"
          subtitle="Everything you need to know about ProxiSpeak's spatial virtual office."
        />

        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-border bg-white transition-shadow duration-150 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  id={`header-${faq.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${faq.id}`}
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <span className="text-base sm:text-lg font-bold text-navy">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`panel-${faq.id}`}
                    role="region"
                    aria-labelledby={`header-${faq.id}`}
                    className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-text-muted leading-relaxed border-t border-border/50"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
