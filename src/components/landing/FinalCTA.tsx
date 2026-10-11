import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-border">
      <Container>
        <div className="rounded-3xl bg-gradient-to-b from-primary-light/40 to-primary-light/10 border border-primary/20 p-8 sm:p-12 md:p-16 text-center max-w-4xl mx-auto shadow-sm">
          <span className="inline-block text-xs font-bold tracking-wider text-primary uppercase mb-3">
            Start In Under Two Minutes
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight mb-4">
            Make room for better conversations.
          </h2>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Bring your team together in a virtual office that makes it easier to connect naturally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button to="/signup" variant="primary" size="lg" className="gap-2 w-full sm:w-auto shadow-md">
              Get started free
              <ArrowRight size={18} />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <span className="text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </span>
            <span className="hidden sm:inline text-border">•</span>
            <span className="text-text-muted text-xs sm:text-sm">
              No downloads required · Works in your browser
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};
