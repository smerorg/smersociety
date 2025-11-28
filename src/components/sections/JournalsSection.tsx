import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar } from 'lucide-react';

const JournalsSection = () => {
  // No real journal data available yet. Keep layout and show placeholders.
  const journals: any[] = [];

  const hasJournals = journals.length > 0;

  return (
    <section className="section-academic bg-background">
      <div className="container-academic">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-heading-1 mb-6">Our Academic Journal</h2>
          <p className="text-body-lg text-muted-foreground">
            SMER publishes academic journal to advance English language research. Journal details will be
            made available soon.
          </p>
        </div>

        {/* Featured / Placeholder */}
        {!hasJournals ? (
          <div className="card-academic p-8 mb-12 bg-gradient-subtle text-center">
            <h3 className="text-heading-2 mb-4">Journal will be updated soon</h3>
            <p className="text-body text-muted-foreground mb-6">Check back later for featured publications and submission details.</p>

          </div>
        ) : (
          // If journals are later added, preserve the original rendering flow
          <div className="card-academic p-8 mb-12 bg-gradient-subtle">
            {/* This area will render featured journal when data is present */}
          </div>
        )}


        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="card-academic p-8 max-w-2xl mx-auto">
            <h3 className="text-heading-3 mb-4">Submit Your Research</h3>
            <p className="text-body text-muted-foreground mb-6">
              We welcome high-quality research submissions from scholars worldwide. Join our community of leading researchers in English language studies.
            </p>
            <Button variant="membership" size="lg">
              Author Guidelines
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalsSection;
