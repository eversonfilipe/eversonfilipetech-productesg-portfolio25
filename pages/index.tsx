import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Inter, Playfair_Display } from 'next/font/google';

// Dynamic import for Spline to avoid SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="spline-loading flex items-center justify-center h-full">
    <div className="loading-spinner"></div>
  </div>
});

// Font configuration
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

// Types
type Language = 'pt' | 'en';

interface Translation {
  [key: string]: string;
}

interface Translations {
  [key: string]: Translation;
}

// Translation data
const translations: Translations = {
  pt: {
    'nav.home': 'Início',
    'nav.manifesto': 'Manifesto', 
    'nav.laboratory': 'Laboratório',
    'nav.impact': 'Lógica de Impacto',
    'nav.recommendations': 'Recomendações',
    'nav.collaborate': 'Colabore',
    'hero.subtitle': 'Arquitetando o Futuro da América Latina com Lógica, IA e Impacto.',
    'hero.cta': 'Descubra a Tese',
    'manifesto.title': 'Uma Nova Lógica para o Progresso',
    'language.switching': 'Alterando idioma...',
    'language.switched': 'Idioma alterado com sucesso!'
  },
  en: {
    'nav.home': 'Home',
    'nav.manifesto': 'Manifesto',
    'nav.laboratory': 'Laboratory', 
    'nav.impact': 'Impact Logic',
    'nav.recommendations': 'Recommendations',
    'nav.collaborate': 'Collaborate',
    'hero.subtitle': 'Architecting Latin America\'s Future with Logic, AI and Impact.',
    'hero.cta': 'Discover the Thesis',
    'manifesto.title': 'A New Logic for Progress',
    'manifesto.problem.title': 'The Problem',
    'manifesto.problem.text': 'Latin America faces unprecedented complexity challenges: governmental inefficiency, transparency gaps and systems that don\'t serve citizens. While other regions advance with technology, we remain trapped in last century\'s structures.',
    'manifesto.thesis.title': 'The Thesis',
    'manifesto.thesis.text': 'I believe that Artificial Intelligence applied to citizen-centered product design is the key to unlocking our region\'s potential. It\'s not just about automating processes, but reimagining how governments, companies and civil society can collaborate to generate prosperity, transparency and sustainability.',
    'manifesto.commitment.title': 'The Commitment',
    'manifesto.commitment.text': 'I dedicate my career to building these solutions. Every project, every line of code, every strategy I develop serves a greater mission: to decode Latin America\'s most complex social problems and transform them into exponential growth opportunities.',
    'laboratory.title': 'Experiments in Progress',
    'impact.title': 'Impact Logic',
    'recommendations.title': 'Recommendations',
    'recommendations.subtitle': 'Social proof that validates the transformation journey. Each recommendation represents real connections, delivered projects and generated impacts.',
    'recommendations.verified': 'LinkedIn Verified',
    'recommendations.professional': 'Professional Relationships',
    'recommendations.more.title': 'More Recommendations Available',
    'recommendations.more.text': 'This is just a sample of recommendations that reflect my professional journey. To see the complete portfolio of testimonials and validations, visit my LinkedIn profile.',
    'recommendations.more.cta': 'View All on LinkedIn',
    'recommendations.verified.badge': 'All verified and authentic',
    'collaborate.title': 'Let\'s Build Together',
    'language.switching': 'Switching language...',
    'language.switched': 'Language switched successfully!'
  }
};

// Custom hooks
const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  const reset = useCallback(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, []);

  return { displayText, reset, isComplete: currentIndex >= text.length };
};

const useIntersectionObserver = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

// Components
const Toast: React.FC<{ message: string; type: 'info' | 'success'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast show fixed top-5 right-5 z-50 flex items-center gap-3 bg-gradient-to-r from-steel to-steel-dark text-white px-6 py-4 rounded-xl shadow-lg">
      {type === 'success' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const LanguageSwitcher: React.FC<{ 
  currentLanguage: Language; 
  onLanguageChange: (lang: Language) => void 
}> = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#language-switcher')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" id="language-switcher">
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 bg-steel/20 rounded-full hover:bg-steel hover:text-white transition-all group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
        </svg>
        <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
        <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-midnight/95 backdrop-blur-sm rounded-lg shadow-lg border border-steel/30 z-50 min-w-[120px]">
          <button 
            className={`language-option w-full px-4 py-3 text-left hover:bg-steel/20 transition-colors flex items-center gap-3 text-sm text-steel-light ${currentLanguage === 'pt' ? 'active' : ''}`}
            onClick={() => {
              onLanguageChange('pt');
              setIsOpen(false);
            }}
          >
            <span className="text-lg">🇧🇷</span>
            <span>Português</span>
          </button>
          <button 
            className={`language-option w-full px-4 py-3 text-left hover:bg-steel/20 transition-colors flex items-center gap-3 text-sm border-t border-steel/20 text-steel-light ${currentLanguage === 'en' ? 'active' : ''}`}
            onClick={() => {
              onLanguageChange('en');
              setIsOpen(false);
            }}
          >
            <span className="text-lg">🇺🇸</span>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  );
};

const NeuralBackground: React.FC = () => {
  return (
    <div className="neural-background absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {[0, 2, 4, 6].map((delay, index) => (
        <div 
          key={`line-${index}`}
          className="neural-line absolute bg-gradient-to-r from-transparent via-steel to-transparent h-px w-48 opacity-15"
          style={{
            top: `${20 + index * 20}%`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
      {[
        { top: '20%', left: '20%', delay: 1 },
        { top: '30%', left: '70%', delay: 2 },
        { top: '60%', left: '30%', delay: 3 },
        { top: '70%', left: '80%', delay: 4 },
        { top: '40%', left: '50%', delay: 0.5 }
      ].map((node, index) => (
        <div
          key={`node-${index}`}
          className="neural-node absolute w-1 h-1 bg-steel rounded-full opacity-20"
          style={{
            top: node.top,
            left: node.left,
            animationDelay: `${node.delay}s`
          }}
        />
      ))}
    </div>
  );
};

const Navigation: React.FC<{ 
  currentLanguage: Language; 
  onLanguageChange: (lang: Language) => void;
  t: (key: string) => string;
}> = ({ currentLanguage, onLanguageChange, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', key: 'nav.home' },
    { id: 'manifesto', key: 'nav.manifesto' },
    { id: 'laboratorio', key: 'nav.laboratory' },
    { id: 'logica', key: 'nav.impact' },
    { id: 'recomendacoes', key: 'nav.recommendations' },
    { id: 'colabore', key: 'nav.collaborate' }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full bg-midnight/95 backdrop-blur-sm z-50 border-b border-steel/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="font-bold text-xl gradient-text font-playfair">Éverson Filipe</div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-steel-lighter hover:text-steel transition-colors font-glacial"
                >
                  {t(item.key)}
                </button>
              ))}
              <LanguageSwitcher 
                currentLanguage={currentLanguage} 
                onLanguageChange={onLanguageChange} 
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher 
                currentLanguage={currentLanguage} 
                onLanguageChange={onLanguageChange} 
              />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative z-50"
              >
                <svg className={`w-6 h-6 hamburger-icon ${mobileMenuOpen ? 'active' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div 
              className="mobile-menu-overlay fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="mobile-nav-menu fixed top-0 left-0 right-0 bg-midnight/95 backdrop-blur-sm z-40 md:hidden border-b border-steel/20">
              <div className="pt-20 pb-6">
                <nav className="px-6">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="mobile-nav-item block w-full text-left py-4 px-4 text-steel-light hover:text-accent-blue transition-colors border-b border-steel/20"
                    >
                      {t(item.key)}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

const HeroSection: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { ref, isVisible } = useIntersectionObserver();
  const { displayText, reset } = useTypewriter(t('hero.subtitle'), 50);

  useEffect(() => {
    if (isVisible) {
      reset();
    }
  }, [isVisible, reset, t]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      ref={ref}
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight to-steel-darker relative overflow-hidden transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Spline 3D Background */}
      <div className="spline-container spline-hero absolute inset-0 pointer-events-none z-[1] opacity-30">
        <Spline 
          scene="https://prod.spline.design/7TWlzczpjqxs2Er8/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <NeuralBackground />
      
      <div className="hero-content-overlay text-center px-6 relative z-10 max-w-4xl mx-auto bg-midnight/70 backdrop-blur-sm rounded-3xl p-12 border border-steel/15">
        <h1 className="text-6xl md:text-8xl font-light mb-6 gradient-text font-playfair">
          Éverson Filipe
        </h1>
        <div className="text-xl md:text-2xl text-steel-lighter mb-12 h-16">
          <span className="typewriter font-glacial">
            {displayText}
            <span className="border-r-2 border-steel animate-pulse ml-1"></span>
          </span>
        </div>
        <button 
          onClick={() => scrollToSection('manifesto')}
          className="sonar-effect bg-steel text-white px-8 py-4 rounded-full font-medium hover:bg-steel-dark transition-all transform hover:scale-105 font-glacial relative overflow-visible"
        >
          {t('hero.cta')}
        </button>
      </div>
    </section>
  );
};

const ManifestoSection: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section 
      id="manifesto" 
      ref={ref}
      className={`py-20 bg-gradient-to-b from-steel-darker to-midnight transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 gradient-text font-playfair">
          {t('manifesto.title')}
        </h2>
        
        {/* Professional Photo */}
        <div className="flex justify-center mb-16">
          <div className="w-64 h-64 professional-photo overflow-hidden rounded-full">
            <img 
              src="nprOWy7g7eqjS0f5-1COO" 
              alt="Éverson Filipe - Fundador & Estrategista de Produto em IA" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="space-y-12">
          {/* The Problem */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-steel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l8-4v18M9 9h2m-2 4h2m4-4h2m-2 4h2M1 21h22"/>
                <circle cx="12" cy="3" r="1"/>
                <path d="M8 7h8l-4-4z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-medium mb-6 text-steel font-glacial">
              {t('manifesto.problem.title')}
            </h3>
            <p className="text-lg text-steel-lighter leading-relaxed max-w-3xl mx-auto font-glacial">
              {t('manifesto.problem.text')}
            </p>
          </div>
          
          <div className="flex justify-center">
            <svg width="100" height="20" viewBox="0 0 100 20">
              <path d="M0 10 Q25 5 50 10 T100 10" stroke="#34495e" strokeWidth="1" fill="none"/>
              <circle cx="20" cy="10" r="2" fill="#34495e"/>
              <circle cx="50" cy="10" r="2" fill="#34495e"/>
              <circle cx="80" cy="10" r="2" fill="#34495e"/>
            </svg>
          </div>
          
          {/* The Thesis */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-steel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                <path d="M20.5 7.5L16 12l4.5 4.5M3.5 7.5L8 12l-4.5 4.5"/>
              </svg>
            </div>
            <h3 className="text-2xl font-medium mb-6 text-steel font-glacial">
              {t('manifesto.thesis.title')}
            </h3>
            <p className="text-lg text-steel-lighter leading-relaxed max-w-3xl mx-auto font-glacial">
              {t('manifesto.thesis.text')}
            </p>
          </div>
          
          <div className="flex justify-center">
            <svg width="100" height="20" viewBox="0 0 100 20">
              <path d="M0 10 Q25 15 50 10 T100 10" stroke="#34495e" strokeWidth="1" fill="none"/>
              <circle cx="25" cy="10" r="2" fill="#34495e"/>
              <circle cx="50" cy="10" r="2" fill="#34495e"/>
              <circle cx="75" cy="10" r="2" fill="#34495e"/>
            </svg>
          </div>
          
          {/* The Commitment */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-8 h-8 text-steel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                <path d="M8 12v6l4 2 4-2v-6"/>
              </svg>
            </div>
            <h3 className="text-2xl font-medium mb-6 text-steel font-glacial">
              {t('manifesto.commitment.title')}
            </h3>
            <p className="text-lg text-steel-lighter leading-relaxed max-w-3xl mx-auto font-glacial">
              {t('manifesto.commitment.text')}
            </p>
          </div>
        </div>

        {/* Digital Signature */}
        <div className="flex justify-center mt-16">
          <svg className="opacity-70 hover:opacity-100 transition-opacity" width="200" height="60" viewBox="0 0 200 60">
            <path 
              d="M10 40 Q30 20 50 40 T90 40 Q110 20 130 40 T170 40" 
              stroke="#34495e" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
            />
            <text x="10" y="55" fontFamily="Playfair Display" fontSize="12" fill="#5d6d7e">
              Éverson Filipe
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
};

const LaboratorySection: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { ref, isVisible } = useIntersectionObserver();

  const projects = [
    {
      id: 'vaifacil',
      title: 'VaiFácil',
      description: 'Plataforma de transparência governamental ESG que extrai e processa dados públicos para gerar insights sobre gestão municipal. Validou a hipótese de que APIs bem estruturadas podem democratizar o acesso à informação pública.',
      challenge: 'Falta de transparência em dados municipais',
      solution: 'API RESTful com dashboard de visualização',
      tech: ['Python', 'Flask', 'PostgreSQL'],
      gradient: 'from-steel to-steel-dark',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    },
    {
      id: 'futurismo',
      title: 'Futurismo Tropical',
      description: 'Projeto Open Source para "tropicalizar" o conhecimento sobre Futurismo para o público brasileiro e começar a desenvolver o campo do "futurismo à brasileira".',
      objective: 'Desenvolver o futurismo contextualizado ao Brasil',
      collaboration: 'Edmilson Rodrigues (MsC CIn/UFPE) e Éverson Filipe',
      tech: ['Open Source', 'Futurismo', 'Cultura BR'],
      gradient: 'from-green-500 to-green-600',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      )
    },
    {
      id: 'sosriouna',
      title: 'SOS Rio Una',
      description: 'SaaS focado na criação de uma economia circular e sustentável, prezando pela independência e sucesso econômico das comunidades nascentes ao Rio Una.',
      mission: 'Economia circular sustentável no Rio Una',
      recognition: 'Expotech 2024.2 - Interesse de empresas locais',
      tech: ['Sustentabilidade', 'Economia Circular', 'Comunidades'],
      gradient: 'from-blue-500 to-blue-600',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      )
    },
    {
      id: 'proative',
      title: 'Proative',
      description: 'SaaS educacional idealizado durante o Ensino Médio, oferecendo serviços híbridos com mentorias e aulas gratuitas para comunidades em situação de vulnerabilidade.',
      focus: 'ODS e educação financeira para comunidades vulneráveis',
      origin: 'Olímpiadas Jovens de Impacto do Sebrae',
      tech: ['Educação', 'ODS', 'Inclusão'],
      gradient: 'from-purple-500 to-purple-600',
      icon: (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      )
    }
  ];

  return (
    <section 
      id="laboratorio" 
      ref={ref}
      className={`py-20 bg-gradient-to-b from-midnight to-steel-darker relative overflow-hidden transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Spline 3D Background */}
      <div className="spline-container spline-section absolute inset-0 pointer-events-none z-[1] opacity-20">
        <Spline 
          scene="https://prod.spline.design/7TWlzczpjqxs2Er8/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 gradient-text font-playfair">
          {t('laboratory.title')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <div key={project.id} className="card-hover content-overlay bg-white-soft/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-steel/10">
              <div className={`w-full h-48 bg-gradient-to-br ${project.gradient} rounded-lg mb-6 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-20">
                  <div className="w-full h-full opacity-30">
                    {/* Background pattern */}
                    <svg className="w-full h-full" viewBox="0 0 300 180">
                      <defs>
                        <pattern id={`pattern-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#pattern-${index})`}/>
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {project.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-medium mb-4 text-steel font-glacial">{project.title}</h3>
              <p className="text-steel mb-6 leading-relaxed font-glacial text-sm">
                {project.description}
              </p>
              
              <div className="space-y-4">
                {project.challenge && (
                  <div>
                    <h4 className="font-medium text-steel font-glacial text-sm">Desafio:</h4>
                    <p className="text-xs text-steel-light font-glacial">{project.challenge}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <h4 className="font-medium text-steel font-glacial text-sm">Solução:</h4>
                    <p className="text-xs text-steel-light font-glacial">{project.solution}</p>
                  </div>
                )}
                {project.objective && (
                  <div>
                    <h4 className="font-medium text-steel font-glacial text-sm">Objetivo:</h4>
                    <p className="text-xs text-steel-light font-glacial">{project.objective}</p>
                  </div>
                )}
                {project.mission && (
                  <div>
                    <h4 className="font-medium text-steel font-glacial text-sm">Missão:</h4>
                    <p className="text-xs text-steel-light font-glacial">{project.mission}</p>
                  </div>
                )}
                {project.focus && (
                  <div>
                    <h4 className="font-medium text-steel font-glacial text-sm">Foco:</h4>
                    <p className="text-xs text-steel-light font-glacial">{project.focus}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-steel font-glacial text-sm">Tecnologias:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="bg-steel/20 text-steel px-3 py-1 rounded-full text-xs font-glacial">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-steel to-steel-dark p-8 md:p-12 rounded-3xl text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-light mb-6 font-playfair">Quer Fazer Parte da Jornada?</h3>
            <p className="text-xl mb-8 opacity-90 leading-relaxed font-glacial">
              Estes são apenas alguns dos experimentos que validam minha tese. Cada projeto carrega aprendizados únicos sobre como tecnologia, propósito e execução podem transformar realidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://www.linkedin.com/in/eversonfilipe-agile-products-ai/" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-steel px-8 py-4 rounded-full font-medium hover:bg-gray-soft transition-all transform hover:scale-105 active:scale-95 flex items-center font-glacial"
              >
                <span className="mr-2">Ver Mais Projetos</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/eversonfilipe-agile-products-ai/" 
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-steel transition-all transform hover:scale-105 active:scale-95 flex items-center font-glacial"
              >
                <span className="mr-2">Colaborar Comigo</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ImpactLogicSection: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { ref, isVisible } = useIntersectionObserver();

  const topics = [
    {
      title: 'Empoderamento Econômico',
      description: 'Estratégias para democratizar oportunidades e criar ecossistemas prósperos',
      color: 'bg-steel',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      )
    },
    {
      title: 'Economia Circular',
      description: 'Modelos de negócio sustentáveis que regeneram sistemas e comunidades',
      color: 'bg-green-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      )
    },
    {
      title: 'Product Thinking',
      description: 'Metodologias ágeis para construir produtos que realmente importam',
      color: 'bg-purple-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      )
    },
    {
      title: 'ESG & Sustentabilidade',
      description: 'Governança responsável como motor de crescimento e impacto',
      color: 'bg-sky-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
        </svg>
      )
    },
    {
      title: 'Inteligência Artificial',
      description: 'IA ética e explicável para resolver desafios sistêmicos complexos',
      color: 'bg-orange-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
      )
    },
    {
      title: 'Políticas Públicas',
      description: 'GovTech e transparência como catalisadores de mudança social',
      color: 'bg-red-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <section 
      id="logica" 
      ref={ref}
      className={`py-20 bg-gradient-to-b from-steel-darker to-midnight transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-8 gradient-text font-playfair">
            {t('impact.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl font-light text-steel mb-6 leading-tight font-glacial">
              Tecnologia com propósito. Produto com impacto. Estratégia com causa.
            </p>
            <p className="text-lg text-steel-lighter mb-8 leading-relaxed font-glacial">
              Na <strong>Lógica de Impacto</strong>, compartilho reflexões estratégicas sobre empreendedorismo social, inovação tecnológica, Product Thinking e inteligência artificial aplicada à resolução de problemas sistêmicos.
            </p>
            <div className="bg-gradient-to-r from-steel/10 to-steel/10 p-6 rounded-2xl mb-8 border border-steel/20">
              <p className="text-steel font-medium mb-2 font-glacial">📈 O Manifesto que se Tornou Movimento</p>
              <p className="text-steel-lighter leading-relaxed font-glacial">
                <strong>400 assinantes em 9 horas.</strong> <strong>Quase 600 em 24 horas.</strong> Uma geração que constrói com propósito se reconheceu na missão de criar soluções escaláveis que promovam equidade e transformação social.
              </p>
            </div>
            <p className="text-lg text-steel-lighter leading-relaxed">
              Conteúdo estratégico e acessível, conectando empreendedores experientes e líderes emergentes da <strong>Geração Z</strong> na construção do futuro da América Latina.
            </p>
          </div>
        </div>
        
        {/* Topics Grid */}
        <div className="bg-steel/10 backdrop-blur-sm p-8 md:p-12 rounded-3xl mb-12 border border-steel/20">
          <h3 className="text-2xl md:text-3xl font-medium mb-8 text-steel text-center font-playfair">
            Tópicos que Transformam
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <div key={index} className="bg-white-soft/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-steel/10">
                <div className={`w-12 h-12 ${topic.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {topic.icon}
                </div>
                <h4 className="font-medium text-steel mb-3 text-center font-glacial">{topic.title}</h4>
                <p className="text-sm text-steel-light text-center leading-relaxed font-glacial">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTAs */}
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
          <a 
            href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7331001397166944256" 
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-steel to-steel-dark text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center font-glacial"
          >
            <svg className="w-5 h-5 mr-3 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>Assinar no LinkedIn</span>
            <div className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">🔥 600+ leitores</div>
          </a>
          
          <a 
            href="https://eversonfilipe.medium.com/" 
            target="_blank"
            rel="noopener noreferrer"
            className="group border-2 border-steel text-steel px-8 py-4 rounded-full font-medium hover:bg-steel hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center font-glacial"
          >
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
            <span>Arquivo Completo</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
        
        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-sm text-steel-lighter mb-4">Publicado em:</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <span className="font-medium text-steel font-glacial">LinkedIn</span>
            <div className="w-1 h-1 bg-steel-lighter rounded-full"></div>
            <span className="font-medium text-steel-light font-glacial">Medium</span>
            <div className="w-1 h-1 bg-steel-lighter rounded-full"></div>
            <span className="font-medium text-steel font-glacial">Colaborações</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const RecommendationsSection: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { ref, isVisible } = useIntersectionObserver();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const recommendations = [
    {
      author: 'Sebastião Rogério, Ph.D.',
      role: 'PhD em Engenharia da Computação | Cientista de Dados | Professor | Designer Instrucional',
      relationship: 'Professor',
      text: 'Éverson é um aluno muito dedicado, sempre buscando se aperfeiçoar. Além disso, está sempre engajado nas atividades do curso.',
      date: 'Maio 2025',
      initials: 'SR'
    },
    {
      author: 'Fabíola Cavalcanti',
      role: 'Python Developer | AWS Cloud Computing | DevSecOps | Metodologias Ágeis',
      relationship: 'Colega de Equipe',
      text: 'Everson Filipe é um líder de produto estratégico e orientado para resultados com paixão por criar produtos excepcionais que os clientes adoram. Tive o prazer de trabalhar com Everson no Ideathon no Armazém de Ideias. Durante esse tempo, fiquei impressionado com sua capacidade de entender as necessidades dos clientes e traduzi-las em roteiros de produtos claros e concisos. Eu recomendo fortemente Everson para qualquer função de gerenciamento de produto. Ele é um ativo valioso para qualquer equipe.',
      date: 'Fevereiro 2025',
      initials: 'FC'
    },
    {
      author: 'Julia Zultauskas 🏳️‍🌈♀️',
      role: 'Teaching Assistant | Acompanhante Terapêutica | Psicologia Escolar | RH',
      relationship: 'Colega Profissional',
      text: 'Éverson passou por mim no R&S e no Treinamento inicial da empresa, além de termos cruzado caminhos diversas vezes dentro da empresa. É um cara esforçado, comunicativo, responsável e muito competente. Sempre correndo atrás das tarefas que lhe são solicitadas. Tenho certeza que quem o tiver no time, está em boas mãos!',
      date: 'Janeiro 2025',
      initials: 'JZ'
    },
    {
      author: 'Marcos Araújo Torres de Paula',
      role: 'Controller | Financial Planning Manager | Consultant Especialista em Dados Financeiros',
      relationship: 'Cliente',
      text: 'Tive a felicidade de contar com o suporte do Éverson para entender as ferramentas de automação, e a experiência foi incrível. Ele tem um jeito único de explicar coisas complexas de forma simples e prática. Além de dominar o assunto, Éverson é extremamente acessível e proativo. Estava sempre pronto para ajudar e buscava soluções que realmente atendiam às nossas necessidades. Recomendo o Éverson de olhos fechados! Ele é um profissional competente e comprometido.',
      date: 'Janeiro 2025',
      initials: 'MA'
    }
  ];

  const totalSlides = recommendations.length;
  const slidesToShow = 1; // Show one recommendation at a time

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="recomendacoes" 
      ref={ref}
      className={`py-20 bg-gradient-to-br from-midnight to-steel-darker transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-8 gradient-text font-playfair">
            {t('recommendations.title')}
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-steel-lighter mb-6 leading-relaxed font-glacial">
              {t('recommendations.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white-soft/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-steel/10">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm font-medium text-green-600 font-glacial">{t('recommendations.verified')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white-soft/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-steel/10">
                <svg className="w-5 h-5 text-steel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span className="text-sm font-medium text-steel font-glacial">{t('recommendations.professional')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {recommendations.map((rec, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white-soft/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-steel/10 relative">
                    <div className="absolute top-[-10px] right-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-steel/10">
                      <div className="w-16 h-16 bg-gradient-to-br from-steel to-steel-dark rounded-full flex items-center justify-center text-white font-bold text-xl font-glacial">
                        {rec.initials}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-steel mb-1 font-glacial">{rec.author}</h4>
                        <p className="text-sm text-steel-light mb-2 font-glacial">{rec.role}</p>
                        <span className="bg-steel/10 text-steel px-2 py-1 rounded-lg text-xs font-medium font-glacial">
                          {rec.relationship}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-steel leading-relaxed font-glacial">{rec.text}</p>
                    </div>
                    
                    <div className="text-right text-sm text-steel-light border-t border-steel/10 pt-4 font-glacial">
                      {rec.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-steel/90 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-steel transition-all z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-steel/90 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-steel transition-all z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-steel scale-125' : 'bg-steel/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-steel to-steel-dark p-8 md:p-12 rounded-3xl text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-light mb-6 font-playfair">{t('recommendations.more.title')}</h3>
              <p className="text-xl mb-8 opacity-90 leading-relaxed font-glacial">
                {t('recommendations.more.text')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="https://www.linkedin.com/in/eversonfilipe-agile-products-ai/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white text-steel px-8 py-4 rounded-full font-medium hover:bg-gray-soft transition-all transform hover:scale-105 active:scale-95 flex items-center font-glacial"
                >
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>{t('recommendations.more.cta')}</span>
                  <div className="ml-2 bg-steel/20 text-xs px-2 py-1 rounded-full">Completo</div>
                </a>
                
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{t('recommendations.verified.badge')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CollaborateSection: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { ref, isVisible } = useIntersectionObserver();

  const collaborationTypes = [
    {
      title: 'Parcerias Estratégicas',
      description: 'Fellowships, mídia, eventos e oportunidades de colaboração de alto nível que ampliem o impacto.',
      color: 'bg-steel',
      buttonColor: 'bg-steel hover:bg-steel-dark',
      buttonText: 'Vamos Conversar',
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="7" r="4"/>
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
          <circle cx="16" cy="11" r="3"/>
          <path d="M22 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      )
    },
    {
      title: 'Projetos de Consultoria',
      description: 'Análise de dados para impacto, gestão de produto em frações e workshops de inovação.',
      color: 'bg-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      buttonText: 'Agendar Consulta',
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M8 21l4-7 4 7"/>
        </svg>
      )
    },
    {
      title: 'Conversa Aberta',
      description: 'Ideias, feedback ou simplesmente para trocar perspectivas sobre o futuro que estamos construindo.',
      color: 'bg-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      buttonText: 'Enviar Mensagem',
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          <circle cx="9" cy="10" r="1"/>
          <circle cx="15" cy="10" r="1"/>
          <path d="M9 13c0 1.5 1.5 3 3 3s3-1.5 3-3"/>
        </svg>
      )
    }
  ];

  return (
    <section 
      id="colabore" 
      ref={ref}
      className={`py-20 bg-gradient-to-b from-steel-darker to-midnight transition-opacity duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 gradient-text font-playfair">
          {t('collaborate.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {collaborationTypes.map((type, index) => (
            <div key={index} className="card-hover bg-white-soft/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center border border-steel/10">
              <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {type.icon}
              </div>
              <h3 className="text-xl font-medium mb-4 text-steel font-glacial">{type.title}</h3>
              <p className="text-steel mb-6 text-sm leading-relaxed font-glacial">
                {type.description}
              </p>
              <a 
                href="https://www.linkedin.com/in/eversonfilipe-agile-products-ai/" 
                target="_blank"
                rel="noopener noreferrer"
                className={`${type.buttonColor} text-white px-6 py-3 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95 font-glacial inline-flex items-center`}
              >
                <span className="mr-2">{type.buttonText}</span>
                <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Portfolio Component
const Portfolio: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt');
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' } | null>(null);

  // Translation function
  const t = useCallback((key: string): string => {
    return translations[currentLanguage]?.[key] || key;
  }, [currentLanguage]);

  // Language change handler
  const handleLanguageChange = useCallback((lang: Language) => {
    if (lang === currentLanguage) return;
    
    setToast({ message: t('language.switching'), type: 'info' });
    
    setTimeout(() => {
      setCurrentLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
      setToast({ message: translations[lang]['language.switched'], type: 'success' });
    }, 300);
  }, [currentLanguage, t]);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage && savedLanguage !== currentLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return (
    <div className={`${inter.variable} ${playfair.variable} font-glacial bg-midnight text-steel smooth-scroll`}>
      <Head>
        <title>Éverson Filipe - Arquitetando o Futuro da América Latina</title>
        <meta name="description" content="Fundador & Estrategista de Produto em IA. Construindo o futuro da América Latina com GovTech & ESG." />
        <meta name="keywords" content="GovTech, ESG, Inteligência Artificial, América Latina, Fundador, Produto, Inovação" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Éverson Filipe - Fundador & Estrategista de Produto em IA" />
        <meta property="og:description" content="Arquitetando o futuro da América Latina com lógica, IA e impacto." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eversonfilipe.com" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <Navigation 
        currentLanguage={currentLanguage} 
        onLanguageChange={handleLanguageChange}
        t={t}
      />

      <main>
        <HeroSection t={t} />
        <ManifestoSection t={t} />
        <LaboratorySection t={t} />
        <ImpactLogicSection t={t} />
        <RecommendationsSection t={t} />
        <CollaborateSection t={t} />
      </main>

      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Footer */}
      <footer className="bg-midnight text-steel-light py-12 border-t border-steel/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-light mb-4 gradient-text font-playfair">Éverson Filipe</h3>
            <p className="text-steel-lighter mb-6 font-glacial">Arquitetando o futuro da América Latina com lógica, IA e impacto.</p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-8">
              <a href="https://www.linkedin.com/in/eversonfilipe-agile-products-ai/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-steel-lighter hover:text-steel transition-colors group"
                 title="LinkedIn - Éverson Filipe">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a href="https://www.instagram.com/eversonfilipemr" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-steel-lighter hover:text-steel transition-colors group"
                 title="Instagram - @eversonfilipemr">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a href="https://x.com/EversonFilipe_" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-steel-lighter hover:text-steel transition-colors group"
                 title="Twitter/X - @EversonFilipe_">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              <a href="https://linktr.ee/eversonfilipemr" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-steel-lighter hover:text-steel transition-colors group"
                 title="Linktree - Todos os Links">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.953 15.066c-.08 0-.16-.024-.231-.074l-3.11-2.198a.327.327 0 010-.542l3.11-2.198c.16-.113.383-.077.497.083a.327.327 0 01-.083.497l-2.692 1.905 2.692 1.905a.327.327 0 01.083.497.331.331 0 01-.266.125zm8.094 0a.331.331 0 01-.266-.125.327.327 0 01.083-.497l2.692-1.905-2.692-1.905a.327.327 0 01-.083-.497c.114-.16.337-.196.497-.083l3.11 2.198a.327.327 0 010 .542l-3.11 2.198c-.071.05-.151.074-.231.074zM9.449 16.83c-.028 0-.057-.004-.085-.014a.329.329 0 01-.23-.404l2.462-9.282a.329.329 0 01.404-.23.329.329 0 01.23.404l-2.462 9.282a.33.33 0 01-.319.244z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-steel/30 pt-8">
            <p className="text-steel-lighter text-sm mb-4 font-glacial">
              © 2024 Éverson Filipe. Construído com propósito e precisão.
            </p>
            <div className="flex justify-center">
              <span className="text-2xl cursor-pointer hover:scale-125 transition-transform">💡</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
