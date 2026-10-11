import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { OfficePreview } from './OfficePreview';

export const HeroSection: React.FC = () => {
  const handleScrollToExplore = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const element = document.querySelector('#how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28 bg-[#F4F6F9] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Eyebrow */}
            <span className="inline-block text-xs font-bold tracking-wider text-primary uppercase mb-4 bg-primary-light/60 px-3 py-1 rounded-full border border-primary/20">
              The Virtual Office That Feels Human
            </span>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-[1.12] mb-6">
              Work together.{' '}
              <span className="text-primary font-extrabold">Just walk closer.</span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8 max-w-xl">
              Bring the natural flow of office conversations to your remote team. Move around your virtual workspace, hear teammates as you approach, and collaborate without scheduling every little conversation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-4">
              <Button to="/signup" variant="primary" size="lg" className="gap-2">
                Create your free room
                <ArrowRight size={18} />
              </Button>
              <Button
                href="#how-it-works"
                onClick={handleScrollToExplore}
                variant="secondary"
                size="lg"
              >
                Explore how it works
              </Button>
            </div>

            {/* Small reassurance */}
            <p className="text-xs text-text-muted mb-8">
              No downloads required · Works in your browser
            </p>

            {/* Three Trust Indicators */}
            <div className="pt-6 border-t border-border/80 w-full flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-navy">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span>Designed for remote teams</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span>Spatial voice conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span>Browser-based collaboration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Office Preview Component */}
          <div className="lg:col-span-6 w-full">
            <OfficePreview />
          </div>
        </div>
      </Container>
    </section>
  );
};
