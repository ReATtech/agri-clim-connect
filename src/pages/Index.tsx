
import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, Users, Check, ExternalLink, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { Helmet } from 'react-helmet-async';

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

const sponsors = [
  { name: "Google", logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" },
  { name: "LinkedIn", logo: "https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg" },
  { name: "Total Énergies", logo: "https://totalenergies.com/themes/custom/total_bs/logo.svg" },
  { name: "Coca-Cola", logo: "https://www.coca-cola.com/content/dam/one/us/en/legal/public-affairs-and-policy/svg/coca-cola-logo-horizontal.svg" },
];

const faqItems = [
  {
    question: "Qu'est-ce qu'AgriClim pour l'agriculture au Cameroun ?",
    answer: "AgriClim est une plateforme innovante spécialisée dans la connexion des agriculteurs camerounais et africains aux données climatiques précises et aux recommandations de cultures adaptées à leurs régions spécifiques. Nous aidons à optimiser les pratiques agricoles locales grâce à des données météorologiques fiables et des conseils personnalisés, particulièrement adaptés au contexte africain et aux conditions uniques du Cameroun."
  },
  {
    question: "Comment AgriClim aide-t-il les agriculteurs camerounais ?",
    answer: "Nous fournissons des prévisions météorologiques localisées pour les différentes régions du Cameroun, des recommandations de cultures adaptées aux conditions climatiques spécifiques, et une communauté d'entraide entre professionnels agricoles africains. Notre plateforme intègre l'intelligence artificielle pour offrir des conseils personnalisés basés sur les conditions particulières de chaque exploitation au Cameroun, prenant en compte les spécificités du sol et du climat local."
  },
  {
    question: "Les données météorologiques sont-elles fiables pour l'agriculture au Cameroun ?",
    answer: "Absolument ! Nous utilisons des sources de données météorologiques de premier ordre et mettons à jour nos prévisions en temps réel pour toutes les régions du Cameroun. Nos algorithmes combinent plusieurs modèles météorologiques pour offrir les prévisions les plus précises possibles pour votre localisation spécifique au Cameroun, avec une attention particulière aux microclimats locaux et aux variations saisonnières propres à l'Afrique centrale."
  },
  {
    question: "Comment fonctionne la recommandation de cultures pour les sols camerounais ?",
    answer: "Notre système analyse les conditions climatiques, le type de sol camerounais (ferralitique, volcanique, alluvial, etc.), et l'historique météorologique de votre région pour suggérer les cultures les plus adaptées. Nous prenons en compte les spécificités agricoles locales, incluant les cultures traditionnelles comme le cacao, le café, la banane plantain, le manioc et les cultures maraîchères populaires au Cameroun, pour optimiser votre rendement et votre rentabilité."
  },
  {
    question: "Puis-je accéder à AgriClim sur mobile dans les zones rurales du Cameroun ?",
    answer: "Absolument ! Notre plateforme est entièrement adaptée aux contraintes de connectivité africaines et fonctionne sur tous les appareils : ordinateurs, tablettes et smartphones, même avec une connexion limitée. L'interface est optimisée pour une faible consommation de données, vous permettant d'accéder à vos informations agricoles essentielles même dans les zones rurales du Cameroun où la couverture réseau peut être limitée."
  },
  {
    question: "Comment rejoindre la communauté d'agriculteurs camerounais sur AgriClim ?",
    answer: "Il suffit de créer un compte gratuit sur notre plateforme. Vous aurez alors accès à notre forum communautaire regroupant des agriculteurs de toutes les régions du Cameroun, aux discussions thématiques sur les cultures locales, et pourrez partager vos expériences avec d'autres agriculteurs camerounais et experts du secteur agricole africain, créant ainsi un réseau de connaissances adapté aux réalités du terrain."
  },
  {
    question: "Proposez-vous des conseils personnalisés pour l'agriculture camerounaise ?",
    answer: "Oui, notre assistant IA intègre des connaissances spécifiques sur l'agriculture camerounaise et peut vous fournir des conseils personnalisés en fonction de vos cultures locales (cacao, café, banane plantain, manioc, etc.), de votre localisation précise dans le pays et des conditions météorologiques actuelles. Plus vous utilisez la plateforme, plus les recommandations deviennent précises et adaptées aux spécificités de votre exploitation au Cameroun."
  },
  {
    question: "Les données de ma ferme camerounaise sont-elles sécurisées ?",
    answer: "La confidentialité et la sécurité de vos données sont notre priorité absolue. Nous utilisons des protocoles de chiffrement avancés conformes aux standards internationaux et ne partageons jamais vos informations sans votre consentement explicite. Vous gardez le contrôle total sur vos données, qui sont stockées de manière sécurisée et conforme aux réglementations de protection des données personnelles."
  },
  {
    question: "Peut-on intégrer AgriClim à d'autres outils agricoles utilisés au Cameroun ?",
    answer: "Oui, nous développons continuellement des API et des intégrations avec les principaux outils de gestion agricole utilisés au Cameroun et en Afrique centrale. Nous travaillons également avec des partenaires locaux pour assurer la compatibilité avec les systèmes existants. N'hésitez pas à nous contacter pour discuter de vos besoins spécifiques d'intégration adaptés au contexte camerounais."
  },
  {
    question: "Comment AgriClim aide-t-il face aux défis climatiques en Afrique centrale ?",
    answer: "AgriClim fournit des alertes précoces pour les événements climatiques extrêmes (sécheresses, inondations, vagues de chaleur) fréquents en Afrique centrale, des recommandations pour l'adaptation aux changements climatiques, et des conseils sur les pratiques agricoles durables adaptées au Cameroun. Notre plateforme vous aide à planifier vos activités agricoles de manière à minimiser les risques liés aux variations climatiques, contribuant ainsi à la résilience des exploitations camerounaises face aux défis environnementaux actuels."
  },
];

const testimonials = [
  {
    id: 1,
    name: "Jean Claude",
    region: "Centre-Cameroun",
    culture: "Cacao",
    avatar: "https://i.pravatar.cc/150?img=11",
    testimonial: "Grâce à AgriClim, j'ai pu anticiper une période de pluie intense et protéger mes plants de cacao. Les prévisions précises m'ont fait gagner une année de récolte. Un outil indispensable pour tout cultivateur consciencieux au Cameroun !"
  },
  {
    id: 2,
    name: "Marie Mballa",
    region: "Littoral-Cameroun",
    culture: "Maraîchage biologique",
    avatar: "https://i.pravatar.cc/150?img=12",
    testimonial: "La communauté AgriClim est une mine d'or de connaissances. J'ai découvert des techniques d'agriculture régénérative qui ont transformé mon exploitation. Mes légumes sont plus résistants et savoureux, et mes clients le remarquent !"
  },
  {
    id: 3,
    name: "Ahmed Nkomo",
    region: "Nord-Cameroun",
    culture: "Céréales",
    avatar: "https://i.pravatar.cc/150?img=13",
    testimonial: "Avec les périodes de sécheresse qui s'intensifient dans notre région, AgriClim m'a permis d'optimiser mon irrigation. J'économise 30% d'eau tout en maintenant la qualité de mes cultures. C'est bon pour la planète et pour mon porte-monnaie !"
  },
  {
    id: 4,
    name: "Sophie Essama",
    region: "Ouest-Cameroun",
    culture: "Café",
    avatar: "https://i.pravatar.cc/150?img=14",
    testimonial: "L'assistant IA d'AgriClim m'a recommandé des variétés résistantes à la sécheresse. Le résultat est bluffant : mon rendement a augmenté de 25% malgré les conditions difficiles de cette année. Un investissement qui paie !"
  },
  {
    id: 5,
    name: "Pierre Tamba",
    region: "Adamaoua-Cameroun",
    culture: "Élevage bovin",
    avatar: "https://i.pravatar.cc/150?img=15",
    testimonial: "J'utilise AgriClim pour planifier mes pâturages. Les prévisions saisonnières m'ont permis d'adapter mes pratiques au changement climatique. Mon bétail ne manque plus de nourriture, même lors des saisons sèches prolongées."
  },
  {
    id: 6,
    name: "Isabelle Nguema",
    region: "Est-Cameroun",
    culture: "Agriculture forestière",
    avatar: "https://i.pravatar.cc/150?img=16",
    testimonial: "En zone forestière, la météo peut changer très vite. AgriClim me donne des alertes précises qui me permettent d'anticiper. C'est comme avoir un météorologue personnel qui connaît parfaitement mon terrain !"
  }
];

const HomePage: React.FC = () => {
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [showMiddleFaqs, setShowMiddleFaqs] = useState(false);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll effect for revealing elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
      el.classList.add('opacity-0');
    });
    
    return () => observer.disconnect();
  }, []);

  const handleFaqToggle = () => {
    if (!showMiddleFaqs) {
      setShowMiddleFaqs(true);
    } else if (!showAllFaqs) {
      setShowAllFaqs(true);
    } else {
      setShowAllFaqs(false);
      setShowMiddleFaqs(false);
    }
  };

  // Get visible FAQs based on current state
  const getVisibleFaqs = () => {
    if (showAllFaqs) {
      return faqItems;
    } else if (showMiddleFaqs) {
      return faqItems.slice(0, 7);
    } else {
      return faqItems.slice(0, 4);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>AgriClim - Solutions Intelligentes pour l'Agriculture au Cameroun et en Afrique</title>
        <meta name="description" content="Optimisez vos cultures au Cameroun avec AgriClim. Accédez à des données climatiques précises, des recommandations personnalisées pour l'agriculture africaine et rejoignez notre communauté d'experts agricoles." />
        <meta name="keywords" content="agriculture Cameroun, météo agricole, cultures Afrique, agriculture intelligente, agritech, conseil agricole, communauté agriculteurs" />
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section pt-28 pb-16 md:pt-40 md:pb-24 relative" id="accueil">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589423045402-6fb5c6e0926c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')" }}
          aria-hidden="true"
        ></div>
        <div className="hero-overlay" aria-hidden="true"></div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              L'Agriculture Intelligente au Cameroun et en Afrique
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Optimisez vos cultures au Cameroun grâce à des données climatiques précises, des recommandations personnalisées et une communauté d'experts africains.
            </p>
            
            {/* Avatar Group & CTA */}
            <div className="flex flex-col md:flex-row items-center justify-center mb-8 space-y-6 md:space-y-0">
              <div className="flex -space-x-4 mr-0 md:mr-6" aria-label="Membres de la communauté">
                {avatars.map((avatar, index) => (
                  <img 
                    key={index}
                    src={avatar}
                    alt={`Agriculteur membre ${index+1}`}
                    className="w-10 h-10 border-2 border-white rounded-full object-cover"
                  />
                ))}
                <div className="flex items-center justify-center w-10 h-10 bg-agrigreen-500 text-white text-xs border-2 border-white rounded-full">
                  +500
                </div>
              </div>
              <p className="text-sm text-gray-200">
                Plus de 1500 agriculteurs camerounais et africains nous ont déjà rejoints
              </p>
            </div>
            
            <Link to="/communaute" aria-label="Rejoindre la communauté d'agriculteurs">
              <Button 
                size="lg" 
                className="bg-agrigreen-500 hover:bg-agrigreen-600 text-white border-2 border-transparent hover:border-white/20 transition-all"
              >
                <Users className="mr-2 h-4 w-4" /> Rejoindre la communauté
              </Button>
            </Link>
            
            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block" aria-hidden="true">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Sponsors Section */}
      <section className="py-12 bg-gray-50" id="partenaires" aria-labelledby="sponsors-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 reveal">
            <h2 id="sponsors-heading" className="text-2xl text-gray-700 font-semibold gradient-text">Ils nous font confiance</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="reveal" style={{ animationDelay: `${index * 100}ms` }}>
                <img 
                  src={sponsor.logo} 
                  alt={`Logo de ${sponsor.name}, partenaire d'AgriClim`} 
                  className="h-8 md:h-12 object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white" id="faq" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Questions fréquentes sur l'agriculture au Cameroun</h2>
              <p className="text-gray-600">Tout ce que vous devez savoir sur AgriClim et l'agriculture intelligente en Afrique</p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {getVisibleFaqs().map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className={`reveal border border-gray-200 rounded-lg overflow-hidden ${
                    index >= 4 ? 'animate-fade-in' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleFaqToggle}
                className="text-agrigreen-600 border-agrigreen-600 hover:bg-agrigreen-50"
                aria-expanded={showAllFaqs || showMiddleFaqs}
                aria-controls="faq-items"
              >
                {showAllFaqs ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" /> Voir moins
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" /> Voir plus
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-agrigreen-50" ref={testimonialRef} id="temoignages" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Ce que disent nos utilisateurs camerounais</h2>
            <p className="text-gray-600">Des agriculteurs africains comme vous partagent leur expérience avec AgriClim</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                aria-live="polite"
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="min-w-full px-4"
                    aria-hidden={currentTestimonial !== testimonial.id - 1}
                  >
                    <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 text-center">
                      <div className="mb-6">
                        <div className="w-20 h-20 mx-auto mb-4">
                          <img 
                            src={testimonial.avatar} 
                            alt={`Photo de ${testimonial.name}, agriculteur au ${testimonial.region}`}
                            className="w-full h-full rounded-full object-cover border-4 border-agrigreen-100"
                          />
                        </div>
                        <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                        <p className="text-gray-500">
                          {testimonial.region} &bull; {testimonial.culture}
                        </p>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2" role="tablist">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonial === index
                      ? "bg-agrigreen-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Témoignage ${index + 1}`}
                  aria-selected={currentTestimonial === index}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Join CTA Section */}
      <section className="py-16 md:py-24 bg-agrigreen-800 relative text-white" id="rejoindre" aria-labelledby="cta-heading">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')" }}
          aria-hidden="true"
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6 reveal">
              Prêt à transformer votre approche agricole au Cameroun ?
            </h2>
            <p className="text-xl mb-8 text-agrigreen-100 reveal">
              Rejoignez notre communauté d'agriculteurs africains et commencez à cultiver plus intelligemment avec des solutions adaptées au climat local.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 reveal">
              <Link to="/culture" aria-label="En savoir plus sur les cultures adaptées au Cameroun">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-agrigreen-800 transition-colors"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> En savoir plus
                </Button>
              </Link>
              <Link to="/communaute" aria-label="Rejoindre la communauté d'agriculteurs africains">
                <Button 
                  size="lg" 
                  className="bg-white text-agrigreen-800 hover:bg-agrigreen-100 hover:text-agrigreen-800 transition-colors"
                >
                  <Users className="mr-2 h-4 w-4" /> Rejoindre la communauté
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default HomePage;
