import { Linkedin, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeamSection = () => {
  const leadership = [
    {
      name: "Dr. Margaret Thompson",
      title: "President & Director of Research",
      affiliation: "University of Cambridge",
      specialization: "Corpus Linguistics, Digital Humanities",
      email: "m.thompson@smer.org",
      linkedin: "#",
      bio: "Leading expert in computational linguistics with over 20 years of research experience.",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Prof. James Mitchell",
      title: "Vice President & Publications Director",
      affiliation: "Oxford University",
      specialization: "Sociolinguistics, Language Variation",
      email: "j.mitchell@smer.org",
      linkedin: "#",
      bio: "Renowned scholar in English language variation and social linguistics.",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Dr. Sarah Chen",
      title: "Secretary-Treasurer",
      affiliation: "King's College London",
      specialization: "Applied Linguistics, Language Education",
      email: "s.chen@smer.org",
      linkedin: "#",
      bio: "Expert in language pedagogy and second language acquisition research.",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Prof. Robert Williams",
      title: "Conference Committee Chair",
      affiliation: "University of Edinburgh",
      specialization: "Historical Linguistics, Etymology",
      email: "r.williams@smer.org",
      linkedin: "#",
      bio: "Distinguished historian of the English language with extensive publication record.",
      image: "/api/placeholder/300/300"
    }
  ];

  const boardMembers = [
    {
      name: "Dr. Emily Parker",
      title: "Board Member",
      affiliation: "University of Manchester",
      specialization: "Pragmatics, Discourse Analysis",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Prof. David Lee",
      title: "Board Member", 
      affiliation: "University of Birmingham",
      specialization: "Psycholinguistics, Cognitive Science",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Dr. Rachel Green",
      title: "Board Member",
      affiliation: "University of Bristol",
      specialization: "Phonetics, Speech Technology",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Prof. Michael Brown",
      title: "Board Member",
      affiliation: "University of Leeds",
      specialization: "Syntax, Grammaticalization",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Dr. Lisa Johnson",
      title: "Board Member",
      affiliation: "University of York",
      specialization: "Corpus Linguistics, Lexicography",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Prof. Andrew Wilson",
      title: "Board Member",
      affiliation: "University of Warwick",
      specialization: "Computational Linguistics, NLP",
      image: "/api/placeholder/200/200"
    }
  ];

  return (
    <section className="section-academic bg-background">
      <div className="container-academic">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-heading-1 mb-6">Our Leadership Team</h2>
          <p className="text-body-lg text-muted-foreground">
            SMER is led by distinguished scholars and researchers who are committed to advancing 
            the field of English language studies through collaborative research and academic excellence.
          </p>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <h3 className="text-heading-2 text-center mb-12">Executive Committee</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((member, index) => (
              <div key={index} className="card-academic p-6 text-center group hover:shadow-medium transition-all duration-300">
                <div className="mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                <p className="text-sm font-medium text-primary mb-2">{member.title}</p>
                <p className="text-sm text-muted-foreground mb-1">{member.affiliation}</p>
                <p className="text-xs text-muted-foreground mb-4">{member.specialization}</p>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {member.bio}
                </p>
                
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board of Directors */}
        <div className="mb-16">
          <h3 className="text-heading-2 text-center mb-12">Board of Directors</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {boardMembers.map((member, index) => (
              <div key={index} className="card-academic p-4 text-center group hover:shadow-medium transition-all duration-300">
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-lg font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <h4 className="text-sm font-semibold mb-1">{member.name}</h4>
                <p className="text-xs text-primary font-medium mb-1">{member.title}</p>
                <p className="text-xs text-muted-foreground mb-1">{member.affiliation}</p>
                <p className="text-xs text-muted-foreground">{member.specialization}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Board */}
        <div className="card-academic p-8 bg-gradient-subtle">
          <div className="text-center mb-8">
            <h3 className="text-heading-2 mb-4">International Advisory Board</h3>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Our international advisory board consists of leading scholars from prestigious 
              institutions worldwide, providing strategic guidance and expertise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Prof. Jennifer Anderson", institution: "Harvard University", country: "USA" },
              { name: "Dr. Hiroshi Tanaka", institution: "University of Tokyo", country: "Japan" },
              { name: "Prof. Maria Gonzalez", institution: "Universidad Complutense Madrid", country: "Spain" },
              { name: "Dr. Klaus Mueller", institution: "University of Heidelberg", country: "Germany" },
              { name: "Prof. Fatima Al-Rashid", institution: "American University of Beirut", country: "Lebanon" },
              { name: "Dr. Priya Sharma", institution: "Jawaharlal Nehru University", country: "India" }
            ].map((advisor, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-card rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                  {advisor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-medium">{advisor.name}</h4>
                  <p className="text-sm text-muted-foreground">{advisor.institution}</p>
                  <p className="text-xs text-muted-foreground">{advisor.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16">
          <div className="card-academic p-8 max-w-2xl mx-auto">
            <h3 className="text-heading-3 mb-4">Join Our Team</h3>
            <p className="text-body text-muted-foreground mb-6">
              Interested in contributing to SMER's mission? We welcome applications for 
              committee positions and volunteer opportunities from qualified members.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="membership">
                Committee Applications
              </Button>
              <Button variant="outline">
                Volunteer Opportunities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;