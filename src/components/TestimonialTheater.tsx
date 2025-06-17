import { useState, useRef, useEffect } from 'react';

const TestimonialTheater = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Carlos Eduardo Silva",
      role: "CEO & Founder",
      company: "TechFlow Solutions",
      image: "/Images/Feedbacks/perfil-cliente-feedback-1.png",
      quote: "A Workflow transformou completamente nossa presença digital. Em até 10 dias, tivemos uma landing page que converteu 340% mais leads que a anterior. O investimento se pagou na primeira semana.",
      rating: 5,
      industry: "SaaS B2B"
    },
    {
      id: 2,
      name: "Marina Costa Ribeiro",
      role: "Diretora de Marketing",
      company: "Innovate Commerce",
      image: "/Images/Feedbacks/perfil-cliente-feedback-2.png", 
      quote: "Trabalhar com a Workflow foi uma experiência excepcional. Eles entenderam nossa visão desde o primeiro briefing e entregaram uma página que superou todas as expectativas. Nosso CPL diminuiu 60%.",
      rating: 5,
      industry: "E-commerce"
    },
    {
      id: 3,
      name: "Dr. Roberto Almeida",
      role: "Diretor Executivo",
      company: "MedTech Innovations",
      image: "/Images/Feedbacks/perfil-cliente-feedback-3.png",
      quote: "A expertise da Workflow em conversão é impressionante. Nossa nova landing page não só ficou visualmente impecável, como também aumentou nossa taxa de conversão em 280%. Recomendo sem hesitação.",
      rating: 5,
      industry: "HealthTech"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-gradient-to-br from-workflow-50 via-white to-workflow-100 relative overflow-hidden"
    >
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-workflow-50 via-white to-workflow-100 opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-workflow-energy to-workflow-zen rounded-full" />
            <span className="text-workflow-energy font-mono text-sm tracking-wider uppercase">Depoimentos</span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-workflow-energy to-workflow-zen rounded-full" />
          </div>
          
          <h2 className="text-responsive-3xl font-display font-bold text-workflow-deep mb-6">
            Feedbacks dos <span className="text-gradient">Líderes</span>
          </h2>
          
          <p className="text-responsive-lg text-workflow-deep/70 mb-8 max-w-3xl mx-auto">
            Feedbacks dos líderes que transformaram seus negócios conosco
          </p>
        </div>

        {/* Testimonials Grid - Todos visíveis juntos */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-glass hover:shadow-workflow-lg transition-shadow duration-300"
            >
              {/* Card Content */}
              <div className="p-4 sm:p-6 md:p-7 lg:p-8">
                {/* Rating Stars */}
                <div className="flex mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg sm:text-xl md:text-2xl">⭐</span>
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-workflow-deep/80 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Client Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-workflow-energy/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-workflow-energy rounded-full flex items-center justify-center">
                      <span className="text-white text-xs md:text-sm">✓</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-workflow-deep text-base sm:text-lg md:text-xl">
                      {testimonial.name}
                    </div>
                    <div className="text-workflow-deep/70 text-xs sm:text-sm md:text-base">
                      {testimonial.role}
                    </div>
                    <div className="text-workflow-energy font-semibold text-xs sm:text-sm md:text-base">
                      {testimonial.company}
                    </div>
                    <div className="text-workflow-deep/50 text-xs md:text-sm mt-1">
                      {testimonial.industry}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Hover Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-workflow-energy/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 px-4 sm:px-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center group">
                          <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6">🏆</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-workflow-energy mb-1 sm:mb-2">98%</div>
            <div className="text-sm sm:text-base md:text-lg text-workflow-deep/70">Taxa de Satisfação</div>
          </div>
                      <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6">💎</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-workflow-energy mb-1 sm:mb-2">150+</div>
            <div className="text-sm sm:text-base md:text-lg text-workflow-deep/70">Projetos Entregues</div>
          </div>
                      <div className="text-center group">
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6">⚡</div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-workflow-energy mb-1 sm:mb-2">até 10 dias</div>
            <div className="text-sm sm:text-base md:text-lg text-workflow-deep/70">Tempo Médio de Entrega</div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default TestimonialTheater;
