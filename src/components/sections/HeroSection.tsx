import heroBackground from '@/assets/hero-background.jpg';

const HeroSection = () => {
  return (
    <>
      {/* Overview of SMER Section */}
      <section className="relative py-16 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBackground})` }}>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/90"></div>
        
        <div className="container-academic relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Overview of SMER
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 mx-auto"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-6 text-slate-700 leading-relaxed text-base">
                <p className="text-justify">
                  The Society for Modern English Research (SMER) is a distinguished non-profit academic society that unites researchers, educators, and professionals in modern English studies, encompassing language, linguistics, and literature from around the world. Scholars from diverse countries and academic traditions are active members of SMER, and researchers worldwide are warmly invited to join this dynamic and inclusive scholarly community.
                </p>

                <p className="text-justify">
                  Founded with the vision of promoting excellence and innovation in modern English research, SMER serves as a premier platform for academic collaboration, dedicated to advancing scholarship, fostering interdisciplinary inquiry, and bridging the gap between theoretical insights and practical applications across English language and literary studies.
                </p>

                <p className="text-justify">
                  In today's interconnected and digitally driven world, English continues to evolve as a global medium of communication, creativity, and knowledge exchange. Recognizing this dynamic landscape, SMER provides a scholarly nexus that brings together experts and emerging scholars to engage in meaningful academic dialogue, collaborative research, and the dissemination of new knowledge in modern English scholarship.
                </p>

                <p className="text-justify">
                  The society also functions as a bridge between experienced scholars and young researchers, offering mentorship, professional networking, and research opportunities. Through international conferences, seminars, and workshops, SMER fosters intellectual exchange and nurtures a culture of responsible and inclusive research in English studies.
                </p>

                <p className="text-justify">
                  SMER upholds the values of academic integrity, collaboration, and accessibility. While operating as a non-profit organization, profit is not its goal; however, it is essential to cover relevant expenses to sustain its academic and organizational activities. Therefore, the society may strives to maintain reasonable membership and publication costs to support its operations and ensure open participation. At the same time, recognizing global disparities in research resources, SMER provides full or partial fee exemptions for researchers and research communities from underdeveloped countries who are unable to bear the associated costs of membership or publication. This policy reflects the society's commitment to inclusivity, equity, and the promotion of scholarly exchange without financial barriers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;