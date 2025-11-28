import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import EventSubmissionForm from './EventSubmissionForm';

interface EventGalleryItem {
  id: number;
  event_title: string;
  event_type: string;
  event_date: string;
  event_location: string;
  event_description: string;
  event_objectives?: string | null;
  target_audience?: string | null;
  approved_photo_url?: string | null;
  photos?: { url: string | null }[];
  category: string;
}

const GallerySection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState<EventGalleryItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  
  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'conferences', label: 'Conferences' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'awards', label: 'Awards & Recognition' },
    { id: 'members', label: 'Seminars & FDPs' },
    { id: 'research', label: 'Research Activities' }
  ];

  const mapEventTypeToCategory = (type: string) => {
    const normalized = type.toLowerCase();
    if (normalized.includes('conference')) return 'conferences';
    if (normalized.includes('workshop')) return 'workshops';
    if (normalized.includes('award')) return 'awards';
    if (normalized.includes('member')) return 'members';
    if (normalized.includes('research')) return 'research';
    return 'all';
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://www.sme-res.org/api/event-submissions.php?status=approved');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to load events.');
        }

        const normalized: EventGalleryItem[] = (data.data || []).map((event: any) => ({
          ...event,
          category: mapEventTypeToCategory(event.event_type || ''),
        }));
        setEvents(normalized);
        setEventError(null);
      } catch (error) {
        console.error('Failed to load events', error);
        setEventError(error instanceof Error ? error.message : 'Failed to load events.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? events
    : events.filter(item => item.category === selectedCategory);

  return (
    <section className="section-academic bg-gradient-to-b from-white via-blue-50/20 to-white">
      <div className="container-academic">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-heading-1 mb-6 text-slate-900 font-bold">Event Gallery</h2>
          <p className="text-body-lg text-slate-700 font-light">
            Explore highlights from our conferences, workshops, awards ceremonies, and research activities. 
            These moments capture the vibrant community and collaborative spirit of SMER.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'nav-active' : 'nav'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="mb-2 text-base font-medium"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {loadingEvents ? (
            [1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="card-academic p-6 animate-pulse space-y-4">
                <div className="h-48 bg-muted rounded-md" />
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="card-academic p-10 md:col-span-2 lg:col-span-3 text-center">
              <p className="text-body-lg text-muted-foreground">
                {eventError ? eventError : 'Information will be available soon...'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const imageUrl = item.approved_photo_url ?? item.photos?.[0]?.url ?? 'https://placehold.co/600x400?text=SMER';
              const formattedDate = item.event_date ? new Date(item.event_date).toLocaleDateString() : 'TBD';

              return (
                <div key={item.id} className="card-academic overflow-hidden group hover:shadow-medium transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={item.event_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x400?text=SMER';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {item.event_type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                      {item.event_title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {item.event_description}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        {item.event_location}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats Section */}
        {/* <div className="card-academic p-8 bg-gradient-subtle mb-16">
          <h3 className="text-heading-2 text-center mb-8">Event Highlights</h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Annual Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground">Total Attendees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15</div>
              <div className="text-sm text-muted-foreground">Countries Represented</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-sm text-muted-foreground">Distinguished Speakers</div>
            </div>
          </div>
        </div> */}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="card-academic p-8 max-w-3xl mx-auto">
            <h3 className="text-heading-3 mb-4">Share Your Events</h3>
            <p className="text-body text-muted-foreground mb-6">
              We welcome contributions from our SMER members to showcase the breadth of our activities and connections.
              Submit your event using the form below, and once approved, it will appear in this gallery.
            </p>
            <Button variant="membership" size="lg" onClick={() => document.getElementById('member-event-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Go to Submission Form
            </Button>
          </div>
        </div>

        <EventSubmissionForm />
      </div>
    </section>
  );
};

export default GallerySection;