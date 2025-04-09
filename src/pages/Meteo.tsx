
import React, { useState } from 'react';
import { Search, Cloud, CloudRain, CloudSnow, Sunrise, Sunset, Wind, Droplets, ThermometerSun, Info } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

// Types de conditions météo
type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

// Données fictives de prévisions météo
interface WeatherDay {
  day: string;
  date: string;
  condition: WeatherCondition;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  wind: number;
  precipitation: number;
}

// Données fictives pour les prochains jours
const forecastData: WeatherDay[] = [
  {
    day: "Aujourd'hui",
    date: "9 avril",
    condition: "cloudy",
    temperature: { min: 12, max: 18 },
    humidity: 65,
    wind: 15,
    precipitation: 10,
  },
  {
    day: "Demain",
    date: "10 avril",
    condition: "rainy",
    temperature: { min: 10, max: 16 },
    humidity: 80,
    wind: 20,
    precipitation: 60,
  },
  {
    day: "Mercredi",
    date: "11 avril",
    condition: "rainy",
    temperature: { min: 9, max: 15 },
    humidity: 85,
    wind: 25,
    precipitation: 75,
  },
  {
    day: "Jeudi",
    date: "12 avril",
    condition: "cloudy",
    temperature: { min: 11, max: 17 },
    humidity: 70,
    wind: 15,
    precipitation: 20,
  },
  {
    day: "Vendredi",
    date: "13 avril",
    condition: "sunny",
    temperature: { min: 14, max: 22 },
    humidity: 55,
    wind: 10,
    precipitation: 0,
  },
  {
    day: "Samedi",
    date: "14 avril",
    condition: "sunny",
    temperature: { min: 15, max: 24 },
    humidity: 50,
    wind: 8,
    precipitation: 0,
  },
  {
    day: "Dimanche",
    date: "15 avril",
    condition: "cloudy",
    temperature: { min: 14, max: 20 },
    humidity: 65,
    wind: 12,
    precipitation: 5,
  },
];

// Conseils agricoles associés aux conditions météo
const weatherAdvice = {
  sunny: [
    "Conditions idéales pour la récolte de céréales matures.",
    "Pensez à augmenter l'irrigation des cultures sensibles à la chaleur.",
    "Bon moment pour les traitements phytosanitaires (appliquer tôt le matin).",
    "Surveillez les signes de stress hydrique sur vos plantes."
  ],
  cloudy: [
    "Conditions favorables pour le repiquage et la transplantation.",
    "Moment idéal pour l'application d'engrais foliaires.",
    "Réduisez l'irrigation par rapport aux journées ensoleillées.",
    "Profitez de ces conditions pour effectuer des travaux physiques exigeants."
  ],
  rainy: [
    "Évitez de travailler le sol saturé d'eau pour prévenir le compactage.",
    "Vérifiez vos systèmes de drainage pour éviter l'engorgement.",
    "Reportez les applications de produits phytosanitaires.",
    "Soyez vigilant concernant le développement de maladies fongiques."
  ],
  snowy: [
    "Protégez les cultures sensibles au gel avec des bâches ou tunnels.",
    "Dégagez les accès aux bâtiments et structures agricoles.",
    "Vérifiez l'isolation des serres et la résistance des abris.",
    "Assurez un accès adéquat à la nourriture et à l'eau pour le bétail."
  ]
};

// Composant pour afficher l'icône météo
const WeatherIcon: React.FC<{ condition: WeatherCondition; size?: number }> = ({ condition, size = 24 }) => {
  switch (condition) {
    case 'sunny':
      return <ThermometerSun size={size} className="text-yellow-500" />;
    case 'cloudy':
      return <Cloud size={size} className="text-gray-500" />;
    case 'rainy':
      return <CloudRain size={size} className="text-blue-500" />;
    case 'snowy':
      return <CloudSnow size={size} className="text-sky-300" />;
    default:
      return <Cloud size={size} />;
  }
};

const Meteo: React.FC = () => {
  const [location, setLocation] = useState("Paris, France");
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("forecast");
  
  // Simuler une recherche de lieu
  const handleSearch = () => {
    if (searchInput.trim()) {
      setLocation(searchInput);
      setSearchInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header Section with Search */}
        <section className="bg-gradient-to-b from-agrigreen-700 to-agrigreen-800 py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Météo et conseils agricoles
              </h1>
              <p className="text-agrigreen-100 max-w-2xl mx-auto">
                Obtenez des prévisions précises et des recommandations personnalisées pour optimiser vos activités agricoles.
              </p>
            </div>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Rechercher une ville ou une région..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="rounded-r-none focus-visible:ring-agrigreen-500"
                />
                <Button 
                  onClick={handleSearch}
                  className="rounded-l-none bg-agrigreen-600 hover:bg-agrigreen-700"
                >
                  <Search size={20} />
                </Button>
              </div>
            </div>
            
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold">{location}</h2>
              <p className="text-agrigreen-100">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </section>
        
        {/* Weather Content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs 
              defaultValue="forecast" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="max-w-5xl mx-auto"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger 
                  value="forecast"
                  className="data-[state=active]:bg-agrigreen-600 data-[state=active]:text-white"
                >
                  Prévisions
                </TabsTrigger>
                <TabsTrigger 
                  value="advice"
                  className="data-[state=active]:bg-agrigreen-600 data-[state=active]:text-white"
                >
                  Conseils agricoles
                </TabsTrigger>
              </TabsList>
              
              {/* Forecast Tab */}
              <TabsContent value="forecast" className="space-y-8">
                {/* Current Weather Card */}
                <Card className="bg-white border-none shadow-md overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      {/* Current Conditions */}
                      <div className="bg-agrigreen-600 text-white p-6 flex flex-col justify-center items-center">
                        <div className="text-center mb-4">
                          <WeatherIcon condition={forecastData[0].condition} size={64} />
                          <h3 className="text-2xl font-bold mt-2">
                            {forecastData[0].temperature.max}°C
                          </h3>
                          <p className="text-agrigreen-100">
                            {forecastData[0].condition === 'sunny' ? 'Ensoleillé' : 
                             forecastData[0].condition === 'cloudy' ? 'Nuageux' : 
                             forecastData[0].condition === 'rainy' ? 'Pluvieux' : 'Neigeux'}
                          </p>
                        </div>
                        <div className="text-sm text-agrigreen-100">
                          <p>Min: {forecastData[0].temperature.min}°C | Max: {forecastData[0].temperature.max}°C</p>
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="col-span-2 p-6">
                        <h3 className="text-lg font-semibold mb-4">Détails</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Wind className="text-agrigreen-600 mr-2" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Vent</p>
                              <p className="font-medium">{forecastData[0].wind} km/h</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Droplets className="text-agrigreen-600 mr-2" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Humidité</p>
                              <p className="font-medium">{forecastData[0].humidity}%</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Sunrise className="text-agrigreen-600 mr-2" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Lever du soleil</p>
                              <p className="font-medium">06:45</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Sunset className="text-agrigreen-600 mr-2" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Coucher du soleil</p>
                              <p className="font-medium">20:15</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-2">Précipitations</h3>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${forecastData[0].precipitation}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Probabilité de précipitation: {forecastData[0].precipitation}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 7-Day Forecast */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Prévisions sur 7 jours</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {forecastData.map((day, index) => (
                      <Card key={index} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">{day.day}</CardTitle>
                          <CardDescription>{day.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-center">
                          <WeatherIcon condition={day.condition} size={36} />
                          <div className="mt-2">
                            <p className="font-medium">{day.temperature.max}°C</p>
                            <p className="text-sm text-gray-500">{day.temperature.min}°C</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between text-xs text-gray-500">
                          <span>{day.wind} km/h</span>
                          <span>{day.precipitation}%</span>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Advice Tab */}
              <TabsContent value="advice">
                <Card className="bg-white border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Conseils agricoles pour {location}</CardTitle>
                    <CardDescription>
                      Recommandations basées sur les conditions météorologiques prévues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Current Day Advice */}
                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-3">
                          <Info className="mr-2 text-agrigreen-600" size={20} />
                          Recommandations pour aujourd'hui
                        </h3>
                        <div className="bg-agrigreen-50 rounded-lg p-4 border border-agrigreen-100">
                          <div className="flex items-start mb-4">
                            <WeatherIcon condition={forecastData[0].condition} size={24} />
                            <div className="ml-3">
                              <p className="font-medium">
                                {forecastData[0].condition === 'sunny' ? 'Journée ensoleillée' : 
                                 forecastData[0].condition === 'cloudy' ? 'Journée nuageuse' : 
                                 forecastData[0].condition === 'rainy' ? 'Journée pluvieuse' : 
                                 'Journée neigeuse'}
                                {' '} ({forecastData[0].temperature.min}°C - {forecastData[0].temperature.max}°C)
                              </p>
                            </div>
                          </div>
                          
                          <ul className="space-y-2">
                            {weatherAdvice[forecastData[0].condition].map((advice, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block bg-agrigreen-600 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                <span>{advice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Weekly Overview */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Aperçu hebdomadaire</h3>
                        <div className="space-y-4">
                          <p className="text-gray-700">
                            Pour la semaine à venir, prévoyez des conditions généralement {forecastData.some(d => d.condition === 'rainy') ? 'humides' : 'sèches'} 
                            avec des températures variant de {Math.min(...forecastData.map(d => d.temperature.min))}°C à {Math.max(...forecastData.map(d => d.temperature.max))}°C.
                          </p>
                          
                          <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
                            <h4 className="font-medium text-sky-800 mb-2">Recommandations générales</h4>
                            <ul className="space-y-2 text-gray-700">
                              {forecastData.some(d => d.condition === 'rainy') && (
                                <li className="flex items-start">
                                  <span className="inline-block bg-sky-600 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                  <span>Prévoyez des travaux d'intérieur pendant les jours pluvieux (maintenance du matériel, planification, etc.).</span>
                                </li>
                              )}
                              {forecastData.some(d => d.condition === 'sunny') && (
                                <li className="flex items-start">
                                  <span className="inline-block bg-sky-600 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                  <span>Profitez des journées ensoleillées pour les travaux nécessitant du beau temps (récolte, séchage, etc.).</span>
                                </li>
                              )}
                              <li className="flex items-start">
                                <span className="inline-block bg-sky-600 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                <span>Adaptez votre programme d'irrigation en fonction des précipitations prévues.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="inline-block bg-sky-600 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                <span>Restez vigilant aux variations de température pour protéger les cultures sensibles.</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Seasonal Tips */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Conseils saisonniers (Printemps)</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-soil-50 rounded-lg p-4 border border-soil-200">
                            <h4 className="font-medium text-soil-800 mb-2">Cultures recommandées</h4>
                            <ul className="space-y-1 text-gray-700">
                              <li>• Légumes de saison : radis, carottes, épinards</li>
                              <li>• Céréales de printemps : orge, avoine</li>
                              <li>• Fourrages : luzerne, trèfle</li>
                            </ul>
                          </div>
                          <div className="bg-soil-50 rounded-lg p-4 border border-soil-200">
                            <h4 className="font-medium text-soil-800 mb-2">Pratiques agricoles</h4>
                            <ul className="space-y-1 text-gray-700">
                              <li>• Préparer les sols pour les semis</li>
                              <li>• Débuter les traitements préventifs</li>
                              <li>• Planifier les rotations culturales</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Meteo;
