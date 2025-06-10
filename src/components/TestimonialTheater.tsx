
import { useState } from 'react';

const TestimonialTheater = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Carlos Silva",
      role: "CEO TechUnicorn",
      company: "TechUnicorn",
      video: "🎬",
      quote: "De startup a unicórnio em 18 meses. A Workflow não apenas criou nossa landing page, criou nossa máquina de crescimento.",
      rating: 5,
      result: "Captação de R$ 50M",
      color: "from-blue-500 to-purple-500"
    },
    {
      id: 2,
      name: "Ana Costa",
      role: "CMO RetailGiant",
      company: "RetailGiant",
      video: "🎬",
      quote: "ROI de 1,247% no primeiro trimestre. Nunca vi resultados tão impressionantes em 15 anos de marketing.",
      rating: 5,
      result: "R$ 12M em vendas",
      color: "from-green-500 to-teal-500"
    },
    {
      id: 3,
      name: "Dr. Roberto Lima",
      role: "Founder HealthTech",
      company: "HealthTech Pro",
      video: "🎬",
      quote: "50M de investimento após o lançamento. A página da Workflow foi decisiva para convencer os investidores.",
      rating: 5,
      result: "Series A de R$ 50M",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-workflow-glow">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-workflow-deep mb-4">
            Testimonial <span className="text-gradient">Theater</span>
          </h2>
          <p className="text-xl text-workflow-deep/70">
            Vozes dos líderes que transformaram seus negócios conosco
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="card-workflow relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${testimonials[selectedTestimonial].color} opacity-10`}></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Video Preview */}
                <div className="relative">
                  <div className={`aspect-video bg-gradient-to-br ${testimonials[selectedTestimonial].color} rounded-xl flex items-center justify-center text-6xl text-white relative overflow-hidden`}>
                    {testimonials[selectedTestimonial].video}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-workflow-deep text-2xl hover:bg-white transition-colors">
                        ▶
                      </button>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div>
                  <div className="flex mb-4">
                    {[...Array(testimonials[selectedTestimonial].rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  
                  <blockquote className="text-xl text-workflow-deep mb-6 italic">
                    "{testimonials[selectedTestimonial].quote}"
                  </blockquote>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-workflow-energy rounded-full flex items-center justify-center text-white font-bold">
                      {testimonials[selectedTestimonial].name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-workflow-deep">
                        {testimonials[selectedTestimonial].name}
                      </div>
                      <div className="text-workflow-deep/70">
                        {testimonials[selectedTestimonial].role}
                      </div>
                      <div className="text-workflow-energy font-medium">
                        {testimonials[selectedTestimonial].company}
                      </div>
                    </div>
                  </div>

                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="text-success font-semibold">Resultado:</div>
                    <div className="text-workflow-deep font-bold text-lg">
                      {testimonials[selectedTestimonial].result}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Selector */}
        <div className="flex justify-center gap-4 mb-12">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => setSelectedTestimonial(index)}
              className={`p-4 rounded-xl transition-all duration-300 ${
                selectedTestimonial === index
                  ? 'bg-workflow-energy text-white shadow-workflow'
                  : 'bg-white text-workflow-deep hover:bg-workflow-zen/20'
              }`}
            >
              <div className="text-2xl mb-2">{testimonial.video}</div>
              <div className="text-sm font-medium">{testimonial.name}</div>
              <div className="text-xs opacity-70">{testimonial.company}</div>
            </button>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <div className="text-2xl font-bold text-workflow-energy mb-2">147</div>
            <div className="text-workflow-deep/70">Reviews 5 estrelas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-2xl font-bold text-workflow-energy mb-2">98%</div>
            <div className="text-workflow-deep/70">Taxa de recomendação</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <div className="text-2xl font-bold text-workflow-energy mb-2">15 dias</div>
            <div className="text-workflow-deep/70">Tempo médio entrega</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialTheater;
