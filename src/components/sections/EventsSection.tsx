import { Calendar } from 'lucide-react';

const EventsSection = () => {
  return (
    <section className="section-academic bg-muted/20">
      <div className="container-academic">
        <div className="card-academic p-12 text-center space-y-4">
          <h2 className="text-heading-1">Conferences & Events</h2>
          <p className="text-body text-muted-foreground">
            Information will be available soon...
          </p>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            Stay tuned for upcoming announcements.
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
