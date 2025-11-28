import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Clock, Users, Search, Filter, ExternalLink } from 'lucide-react';

const WebinarsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const webinars = [
    {
      id: 1,
      title: "Digital Methods in Corpus Linguistics",
      presenter: "Dr. Sarah Johnson",
      date: "2024-01-15",
      duration: "90 minutes",
      category: "methodology",
      description: "Explore cutting-edge digital tools and techniques for corpus analysis in modern English research.",
      thumbnail: "/api/placeholder/480/270",
      views: 1250,
      featured: true
    },
    {
      id: 2,
      title: "Contemporary English Grammar: New Perspectives",
      presenter: "Prof. Michael Chen",
      date: "2023-12-10",
      duration: "75 minutes",
      category: "grammar",
      description: "Recent developments in English grammatical analysis and their implications for linguistic theory.",
      thumbnail: "/api/placeholder/480/270",
      views: 980
    },
    {
      id: 3,
      title: "Sociolinguistic Variation in Global English",
      presenter: "Dr. Amelia Rodriguez",
      date: "2023-11-22",
      duration: "85 minutes",
      category: "sociolinguistics",
      description: "Understanding regional and social variations in English across different global contexts.",
      thumbnail: "/api/placeholder/480/270",
      views: 1420
    },
    {
      id: 4,
      title: "AI and Natural Language Processing",
      presenter: "Dr. Robert Kim",
      date: "2023-10-18",
      duration: "95 minutes",
      category: "technology",
      description: "Applications of artificial intelligence in English language research and analysis.",
      thumbnail: "/api/placeholder/480/270",
      views: 1650
    },
    {
      id: 5,
      title: "Literary Stylistics in the Digital Age",
      presenter: "Prof. Emma Thompson",
      date: "2023-09-14",
      duration: "80 minutes",
      category: "literature",
      description: "Modern approaches to stylistic analysis using computational methods.",
      thumbnail: "/api/placeholder/480/270",
      views: 890
    },
    {
      id: 6,
      title: "Pragmatics and Discourse Analysis",
      presenter: "Dr. Ahmed Hassan",
      date: "2023-08-20",
      duration: "70 minutes",
      category: "pragmatics",
      description: "Advanced techniques in analyzing spoken and written discourse.",
      thumbnail: "/api/placeholder/480/270",
      views: 1100
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'methodology', label: 'Research Methods' },
    { id: 'grammar', label: 'Grammar & Syntax' },
    { id: 'sociolinguistics', label: 'Sociolinguistics' },
    { id: 'technology', label: 'Technology & AI' },
    { id: 'literature', label: 'Literature & Style' },
    { id: 'pragmatics', label: 'Pragmatics' }
  ];

  const filteredWebinars = webinars.filter(webinar => {
    const matchesSearch = searchTerm === '' || 
      webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webinar.presenter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || webinar.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="section-academic bg-background">
      <div className="container-academic">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-heading-1 mb-6">Webinar Videos</h2>
          <p className="text-body-lg text-muted-foreground">
            Access our extensive library of recorded webinars featuring renowned scholars, 
            cutting-edge research presentations, and professional development sessions.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 p-6 bg-card rounded-lg shadow-soft">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Search Webinars</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title or presenter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          
          <div className="md:w-64">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Webinar */}
        {filteredWebinars.filter(webinar => webinar.featured).map((webinar) => (
          <div key={webinar.id} className="card-academic p-8 mb-12 bg-gradient-subtle border border-primary/20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Featured Webinar
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {categories.find(cat => cat.id === webinar.category)?.label}
                  </span>
                </div>
                
                <h3 className="text-heading-2 mb-4">{webinar.title}</h3>
                <p className="text-body text-muted-foreground mb-6">{webinar.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Recorded: {new Date(webinar.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{webinar.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{webinar.views} views</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button variant="membership" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                  <Button variant="outline" size="lg">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Download Materials
                  </Button>
                </div>
              </div>
              
              <div className="aspect-video bg-gradient-hero rounded-lg flex items-center justify-center text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60"></div>
                <div className="relative text-center z-10">
                  <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-primary-foreground ml-1" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{webinar.title}</h4>
                  <p className="text-primary-foreground/80">By {webinar.presenter}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Webinar Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredWebinars.filter(webinar => !webinar.featured).map((webinar) => (
            <div key={webinar.id} className="card-academic overflow-hidden group hover:shadow-medium transition-all duration-300">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gradient-hero overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                    <p className="text-sm opacity-90">{webinar.duration}</p>
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    {categories.find(cat => cat.id === webinar.category)?.label}
                  </span>
                </div>
                {/* Views Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {webinar.views} views
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {webinar.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  By {webinar.presenter}
                </p>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {webinar.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(webinar.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {webinar.duration}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Webinar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="card-academic p-8 bg-gradient-subtle mb-16">
          <h3 className="text-heading-2 text-center mb-8">Webinar Library Statistics</h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">120+</div>
              <div className="text-sm text-muted-foreground">Total Webinars</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">80+</div>
              <div className="text-sm text-muted-foreground">Expert Presenters</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15</div>
              <div className="text-sm text-muted-foreground">Subject Areas</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card-academic p-8 max-w-2xl mx-auto">
            <h3 className="text-heading-3 mb-4">Suggest a Webinar Topic</h3>
            <p className="text-body text-muted-foreground mb-6">
              Have an idea for a webinar topic or want to present your research? 
              We welcome suggestions and proposals from our community members.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="membership">
                Propose a Topic
              </Button>
              <Button variant="outline">
                Become a Presenter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarsSection;