import { Button } from '@/components/ui/button';
import { Award, Users, BookOpen, Globe, Target, Heart, Lightbulb } from 'lucide-react';

const AboutSection = () => {
  const milestones = [
    { year: '2025', title: 'Formal Establishment', description: 'Society for Modern English Research (SMER) officially established' },
    { year: '2025', title: 'Vision Realization', description: 'Launch of a dedicated platform for global English research collaboration' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Academic Excellence',
      description: 'Maintaining the highest standards in scholarly research and publication'
    },
    {
      icon: Users,
      title: 'Collaborative Community',
      description: 'Fostering connections between researchers, institutions, and practitioners'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'Embracing diverse viewpoints and international collaboration'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Advancing methodology and embracing new technologies in research'
    },
    {
      icon: Heart,
      title: 'Inclusivity',
      description: 'Creating an accessible and welcoming environment for all scholars'
    },
    {
      icon: BookOpen,
      title: 'Knowledge Sharing',
      description: 'Promoting open access to research and educational resources'
    }
  ];

  const sections = [
    { id: 'vision-mission', title: 'Vision & Mission' },
    { id: 'history', title: 'History & Establishment' },
    { id: 'leadership', title: 'Leadership & Governance' },
    { id: 'collaborators', title: 'Our Institutional Collaborators' },
    { id: 'advisory-board', title: 'Advisory Board & Scientific Committee' },
    { id: 'members', title: 'Our Active Members' }
  ];

  return (
    <section className="section-academic bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container-academic">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left navigation */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 tracking-wide">About</h3>
              <nav className="space-y-2">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right content (scrollable) */}
          <div className="lg:col-span-3">
            <div className="space-y-12 lg:pr-8">
              {/* Vision & Mission */}
              <section id="vision-mission" className="scroll-mt-24">
                <h3 className="text-heading-2 mb-6">Vision and Mission</h3>
                
                <div className="mb-8">
                  <h4 className="text-heading-3 mb-4 text-slate-900">Vision</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    The Society for Modern English Research (SMER) envisions itself as a global leader in modern English studies, driving cutting-edge interdisciplinary research, academic excellence, and intellectual innovation across language, linguistics, and literature. The society aims to build a vibrant, inclusive, and collaborative platform that unites researchers, educators, and professionals across disciplines to explore and advance contemporary developments in the English language, literature, linguistics, translation, communication, and media studies.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    SMER is committed to integrating modern English literary theories, sociolinguistics, computational linguistics, discourse analysis, translation studies, and digital communication, while also embracing emerging trends such as artificial intelligence, intercultural communication, and rhetoric. Through fostering knowledge exchange, pedagogical innovation, and interdisciplinary collaboration, SMER aspires to shape the future of global scholarship and educational practice in modern English research.
                  </p>
                </div>

                <div>
                  <h4 className="text-heading-3 mb-4 text-slate-900">Mission</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    The mission of the Society for Modern English Research (SMER) is to advance innovative, high-impact research and scholarship in modern English language, linguistics, and literature by promoting interdisciplinary collaboration and global engagement. The society seeks to deepen the understanding and appreciation of contemporary linguistic, literary, and theoretical developments, fostering scholarly exchange through conferences, publications, workshops, and academic partnerships.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    A central objective of SMER is to empower educators and researchers by developing and promoting novel methodologies in English Language Teaching (ELT) and contributing to evidence-based policies for language learning, assessment, and curriculum design. SMER is equally devoted to advancing inquiry in modern English literary studies, sociolinguistics, computational linguistics, discourse analysis, translation studies, and digital communication.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    By facilitating international networking and collaboration, SMER encourages the exchange of ideas, innovation, and expertise among researchers, educators, and professionals, ensuring that modern English studies remain at the forefront of global academic and pedagogical progress.
                  </p>
                </div>
              </section>

              {/* History */}
              <section id="history" className="scroll-mt-24">
                <h3 className="text-heading-2 mb-6 text-slate-900">History & Establishment</h3>
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p>
                    Although the Society for Modern English Research (SMER) was formally established in 2025, the spark that ignited its formation had been smoldering for many years in the minds of visionary scholars devoted to advancing modern English studies. The idea emerged from a collective realization that, despite significant progress in global research on language, linguistics, and literature, there remained a pressing need for a dedicated platform that could unify diverse voices, foster interdisciplinary collaboration, and bridge cultural and academic boundaries across continents.
                  </p>

                  <p>
                    The founders envisioned an organization that would not only encourage innovative research but also ensure that scholarly insights in modern English-language linguistics and literature are translated into meaningful academic and social contributions. Over time, this vision evolved through informal collaborations, international dialogues, and shared academic endeavors, gradually crystallizing into a structured global initiative—SMER.
                  </p>

                  <p>
                    Its establishment in 2025 marks the realization of that long-nurtured dream: to create a non-profit scholarly society that embodies inclusivity, intellectual freedom, and cross-border collaboration. Built upon the foundation of academic integrity and accessibility, SMER represents a new era in modern English research—one that connects researchers across nations, celebrates cultural diversity, and champions the transformative power of language and literature in an ever-evolving world.
                  </p>
                </div>
              </section>

              {/* Leadership */}
              <section id="leadership" className="scroll-mt-24">
                <h3 className="text-heading-2 mb-4">Leadership & Governance</h3>
                <div className="prose mb-6">
                  <p className="text-muted-foreground italic">Information about SMER's leadership and governance structure will be updated soon.</p>
                </div>
              </section>

              {/* Collaborators */}
              <section id="collaborators" className="scroll-mt-24">
                <h3 className="text-heading-2 mb-4">Our Institutional Collaborators</h3>
                <div className="prose mb-6">
                  <p className="text-muted-foreground italic">Information about SMER's institutional collaborators will be updated soon.</p>
                </div>
              </section>

              {/* Advisory Board */}
              <section id="advisory-board" className="scroll-mt-24">
                <h3 className="text-heading-2 mb-4">Advisory Board & Scientific Committee</h3>
                <div className="prose mb-6">
                  <p className="text-muted-foreground italic">Information about SMER's Advisory Board and Scientific Committee members will be updated soon.</p>
                </div>
              </section>

              {/* Members */}
              <section id="members" className="scroll-mt-24">
                <h3 className="text-heading-2 mb-4">Our Active Members</h3>
                <div className="prose mb-6">
                  <p className="text-muted-foreground italic">Information about SMER's active members will be updated soon.</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;