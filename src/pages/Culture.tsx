
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Leaf, Info, ChevronRight, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

// Données fictives pour les régions
interface RegionData {
  name: string;
  crops: string[];
  climate: string;
  soil: string;
  recommendations: string[];
}

const regionDatabase: Record<string, RegionData> = {
  'paris': {
    name: 'Île-de-France',
    crops: ['Blé', 'Colza', 'Betterave sucrière', 'Orge'],
    climate: 'Tempéré océanique avec des hivers doux et des étés modérés. Précipitations régulières tout au long de l\'année.',
    soil: 'Sols majoritairement limoneux et argilo-calcaires, fertiles et adaptés à la grande culture.',
    recommendations: [
      'Optimisation des rotations culturales pour maintenir la fertilité des sols',
      'Favoriser les couverts végétaux en hiver pour limiter l\'érosion',
      'Adapter les dates de semis en fonction des conditions météorologiques',
      'Surveillance des adventices résistantes aux herbicides'
    ]
  },
  'lyon': {
    name: 'Rhône-Alpes',
    crops: ['Vigne', 'Maïs', 'Blé', 'Fruits à noyau'],
    climate: 'Continental modéré avec des influences méditerranéennes. Étés chauds et hivers froids.',
    soil: 'Variés, allant des sols alluviaux dans les vallées aux sols plus pauvres en montagne.',
    recommendations: [
      'Protection des vignobles contre les gelées tardives',
      'Gestion de l\'irrigation pour les cultures fruitières',
      'Diversification des cultures pour réduire les risques climatiques',
      'Adoption de pratiques agroécologiques pour préserver les sols'
    ]
  },
  'bordeaux': {
    name: 'Nouvelle-Aquitaine',
    crops: ['Vigne', 'Maïs', 'Tournesol', 'Fruits à coque'],
    climate: 'Océanique tempéré avec des étés chauds et des hivers doux. Précipitations modérées bien réparties.',
    soil: 'Sols variés incluant des terres viticoles prestigieuses, des sols sableux et des terres arables.',
    recommendations: [
      'Adaptation des pratiques viticoles face au changement climatique',
      'Gestion durable de l\'eau pour les cultures de maïs',
      'Développement de l\'agroforesterie pour diversifier les revenus',
      'Protection des vignobles contre les maladies fongiques'
    ]
  },
  'marseille': {
    name: 'Provence-Alpes-Côte d\'Azur',
    crops: ['Olive', 'Lavande', 'Vigne', 'Fruits méditerranéens'],
    climate: 'Méditerranéen avec des étés chauds et secs, des hivers doux. Précipitations irrégulières.',
    soil: 'Sols calcaires, parfois caillouteux, adaptés aux cultures méditerranéennes.',
    recommendations: [
      'Optimisation des systèmes d\'irrigation goutte-à-goutte',
      'Adaptation des variétés aux conditions de sécheresse croissante',
      'Protection contre le mistral par des haies brise-vent',
      'Diversification avec des cultures résistantes à la sécheresse'
    ]
  },
  'toulouse': {
    name: 'Occitanie',
    crops: ['Tournesol', 'Blé dur', 'Vigne', 'Maïs'],
    climate: 'Varié, avec des influences méditerranéennes et atlantiques. Étés chauds et secs.',
    soil: 'Diversifiés, des plaines fertiles aux sols plus pauvres des zones montagneuses.',
    recommendations: [
      'Adoption de variétés de blé dur adaptées aux périodes de sécheresse',
      'Développement de l\'agriculture de conservation pour préserver les sols',
      'Gestion des ressources en eau face aux sécheresses récurrentes',
      'Diversification des productions pour répartir les risques'
    ]
  }
};

const Culture: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Simulation de recherche
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const matchedRegion = Object.keys(regionDatabase).find(key => 
        key.includes(query) || regionDatabase[key].name.toLowerCase().includes(query)
      );
      
      setSelectedRegion(matchedRegion || null);
      setIsLoading(false);
    }, 1000);
  };
  
  // Placeholder pour une future intégration de carte réelle
  useEffect(() => {
    if (mapContainerRef.current) {
      // Ici, nous simulons une carte avec une div colorée
      // Dans une implémentation réelle, on initialiserait Mapbox GL JS ici
      const mapElement = mapContainerRef.current;
      mapElement.style.backgroundImage = 'url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/2.3522,48.8566,5/800x500?access_token=pk.placeholder")';
      mapElement.style.backgroundSize = 'cover';
      mapElement.style.backgroundPosition = 'center';
      
      // Ajouter un marqueur si une région est sélectionnée
      if (selectedRegion) {
        const marker = document.createElement('div');
        marker.className = 'absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2';
        marker.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-agrigreen-600">
          <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" fill="#2B593F" />
          <path d="M12 21L12 3" stroke="#2B593F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`;
        
        // Positionnement fictif du marqueur
        marker.style.top = '50%';
        marker.style.left = '50%';
        
        mapElement.appendChild(marker);
        
        // Ajouter un popup
        const popup = document.createElement('div');
        popup.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-2 rounded shadow-md text-sm';
        popup.style.width = '120px';
        popup.textContent = regionDatabase[selectedRegion].name;
        marker.appendChild(popup);
      }
    }
  }, [selectedRegion]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="bg-gradient-to-b from-agrigreen-700 to-agrigreen-800 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Cultures et données climatiques
              </h1>
              <p className="text-agrigreen-100 max-w-2xl mx-auto">
                Explorez les cultures adaptées à chaque région et obtenez des recommandations personnalisées basées sur les conditions locales
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-white border-none shadow-md sticky top-24">
                  <CardHeader>
                    <CardTitle>Recherche de région</CardTitle>
                    <CardDescription>
                      Entrez une ville ou une région pour découvrir les cultures adaptées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Search Input */}
                      <div className="space-y-2">
                        <div className="flex">
                          <Input
                            type="text"
                            placeholder="Paris, Lyon, Bordeaux..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="rounded-r-none focus-visible:ring-agrigreen-500"
                          />
                          <Button 
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="rounded-l-none bg-agrigreen-600 hover:bg-agrigreen-700"
                          >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                          </Button>
                        </div>
                        {!selectedRegion && !isLoading && (
                          <p className="text-sm text-gray-500">
                            Exemples: Paris, Lyon, Bordeaux, Marseille, Toulouse
                          </p>
                        )}
                      </div>
                      
                      {/* Popular Regions */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Régions populaires</h3>
                        <div className="space-y-2">
                          {Object.keys(regionDatabase).map((region) => (
                            <Button
                              key={region}
                              variant="outline"
                              className="w-full justify-start text-left"
                              onClick={() => {
                                setSearchQuery(region);
                                setSelectedRegion(region);
                              }}
                            >
                              <MapPin size={16} className="mr-2 text-agrigreen-600" />
                              {regionDatabase[region].name}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Additional Information */}
                      <div className="bg-agrigreen-50 rounded-lg p-4 border border-agrigreen-100">
                        <h3 className="flex items-center text-agrigreen-800 font-medium mb-2">
                          <Info size={16} className="mr-2" />
                          Comment utiliser cet outil
                        </h3>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li className="flex items-start">
                            <ChevronRight size={16} className="mr-1 text-agrigreen-600 flex-shrink-0 mt-0.5" />
                            <span>Recherchez une région ou une ville</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight size={16} className="mr-1 text-agrigreen-600 flex-shrink-0 mt-0.5" />
                            <span>Explorez les cultures adaptées au climat local</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight size={16} className="mr-1 text-agrigreen-600 flex-shrink-0 mt-0.5" />
                            <span>Obtenez des recommandations personnalisées</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Map */}
                <Card className="bg-white border-none shadow-md mb-6 overflow-hidden">
                  <CardContent className="p-0">
                    <div 
                      ref={mapContainerRef}
                      className="w-full h-[400px] bg-gray-200 relative"
                    >
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                          <Loader2 className="animate-spin text-agrigreen-600" size={40} />
                        </div>
                      )}
                      {!selectedRegion && !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-6">
                            <MapPin size={40} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">
                              Recherchez une région pour afficher les données correspondantes
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Region Data */}
                {selectedRegion && (
                  <Card className="bg-white border-none shadow-md">
                    <CardHeader>
                      <CardTitle>{regionDatabase[selectedRegion].name}</CardTitle>
                      <CardDescription>
                        Informations agricoles et climatiques
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="crops">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger 
                            value="crops"
                            className="data-[state=active]:bg-agrigreen-600 data-[state=active]:text-white"
                          >
                            Cultures
                          </TabsTrigger>
                          <TabsTrigger 
                            value="climate"
                            className="data-[state=active]:bg-agrigreen-600 data-[state=active]:text-white"
                          >
                            Climat
                          </TabsTrigger>
                          <TabsTrigger 
                            value="soil"
                            className="data-[state=active]:bg-agrigreen-600 data-[state=active]:text-white"
                          >
                            Sols
                          </TabsTrigger>
                          <TabsTrigger 
                            value="recommendations"
                            className="data-[state=active]:bg-agrigreen-600 data-[state=active]:text-white"
                          >
                            Conseils
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* Crops Tab */}
                        <TabsContent value="crops" className="mt-6">
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Leaf size={20} className="mr-2 text-agrigreen-600" />
                            Cultures adaptées à la région
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {regionDatabase[selectedRegion].crops.map((crop, index) => (
                              <div 
                                key={index}
                                className="bg-agrigreen-50 rounded-lg p-4 text-center border border-agrigreen-100 hover:border-agrigreen-300 transition-colors"
                              >
                                <span className="font-medium text-agrigreen-800">{crop}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Calendrier cultural</h4>
                            <p className="text-gray-600 mb-4">
                              Périodes optimales de semis et de récolte pour les principales cultures de la région :
                            </p>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Culture</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semis</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Récolte</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {regionDatabase[selectedRegion].crops.map((crop, index) => (
                                    <tr key={index}>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">{crop}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">{
                                        ['Janvier-Mars', 'Mars-Avril', 'Octobre-Novembre', 'Février-Avril'][index % 4]
                                      }</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">{
                                        ['Juillet-Août', 'Septembre-Octobre', 'Juillet-Août', 'Août-Septembre'][index % 4]
                                      }</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </TabsContent>
                        
                        {/* Climate Tab */}
                        <TabsContent value="climate" className="mt-6">
                          <div className="bg-sky-50 rounded-lg p-4 border border-sky-100 mb-6">
                            <h3 className="text-lg font-medium mb-2 text-sky-800">
                              Caractéristiques climatiques
                            </h3>
                            <p className="text-gray-700">
                              {regionDatabase[selectedRegion].climate}
                            </p>
                          </div>
                          
                          <h3 className="text-lg font-medium mb-4">Données climatiques moyennes</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h4 className="font-medium mb-2 text-gray-700">Températures (°C)</h4>
                              <div className="h-40 bg-gray-100 rounded-lg flex items-end justify-between p-2">
                                {Array.from({ length: 12 }).map((_, i) => {
                                  const height = Math.floor(Math.random() * 30) + 50;
                                  return (
                                    <div key={i} className="flex flex-col items-center">
                                      <div 
                                        className="w-4 bg-red-500 rounded-t"
                                        style={{ height: `${height}%` }}
                                      ></div>
                                      <span className="text-xs mt-1">{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h4 className="font-medium mb-2 text-gray-700">Précipitations (mm)</h4>
                              <div className="h-40 bg-gray-100 rounded-lg flex items-end justify-between p-2">
                                {Array.from({ length: 12 }).map((_, i) => {
                                  const height = Math.floor(Math.random() * 30) + 50;
                                  return (
                                    <div key={i} className="flex flex-col items-center">
                                      <div 
                                        className="w-4 bg-blue-500 rounded-t"
                                        style={{ height: `${height}%` }}
                                      ></div>
                                      <span className="text-xs mt-1">{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        {/* Soil Tab */}
                        <TabsContent value="soil" className="mt-6">
                          <div className="bg-soil-50 rounded-lg p-4 border border-soil-200 mb-6">
                            <h3 className="text-lg font-medium mb-2 text-soil-800">
                              Caractéristiques des sols
                            </h3>
                            <p className="text-gray-700">
                              {regionDatabase[selectedRegion].soil}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h4 className="font-medium mb-2 text-gray-700">Gestion recommandée</h4>
                              <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                  <span className="inline-block bg-soil-700 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                  <span>Analyse de sol régulière pour ajuster les amendements</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="inline-block bg-soil-700 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                  <span>Maintien du couvert végétal pour limiter l'érosion</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="inline-block bg-soil-700 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                  <span>Rotation des cultures pour maintenir la fertilité</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="inline-block bg-soil-700 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                  <span>Travail du sol adapté à sa structure spécifique</span>
                                </li>
                              </ul>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <h4 className="font-medium mb-2 text-gray-700">Fertilité et amendements</h4>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Matière organique</p>
                                  <div className="h-4 bg-gray-200 rounded-full">
                                    <div className="h-full bg-soil-600 rounded-full" style={{ width: "65%" }}></div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Teneur en phosphore</p>
                                  <div className="h-4 bg-gray-200 rounded-full">
                                    <div className="h-full bg-soil-600 rounded-full" style={{ width: "48%" }}></div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Teneur en potassium</p>
                                  <div className="h-4 bg-gray-200 rounded-full">
                                    <div className="h-full bg-soil-600 rounded-full" style={{ width: "72%" }}></div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">pH</p>
                                  <div className="h-4 bg-gray-200 rounded-full">
                                    <div className="h-full bg-soil-600 rounded-full" style={{ width: "55%" }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        {/* Recommendations Tab */}
                        <TabsContent value="recommendations" className="mt-6">
                          <div className="space-y-6">
                            <div className="bg-agrigreen-50 rounded-lg p-4 border border-agrigreen-200">
                              <h3 className="text-lg font-medium mb-3 text-agrigreen-800">
                                Recommandations agricoles
                              </h3>
                              <ul className="space-y-3">
                                {regionDatabase[selectedRegion].recommendations.map((recommendation, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="inline-block bg-agrigreen-600 rounded-full w-4 h-4 mt-1 mr-2 flex-shrink-0"></span>
                                    <span className="text-gray-700">{recommendation}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card className="bg-sky-50 border-sky-200">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base text-sky-800">Impact du changement climatique</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2 text-gray-700">
                                    <li>• Augmentation des températures moyennes</li>
                                    <li>• Multiplication des événements extrêmes</li>
                                    <li>• Modification des cycles de précipitations</li>
                                    <li>• Nouvelles pressions parasitaires</li>
                                  </ul>
                                </CardContent>
                              </Card>
                              
                              <Card className="bg-soil-50 border-soil-200">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base text-soil-800">Stratégies d'adaptation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2 text-gray-700">
                                    <li>• Diversification des cultures et des variétés</li>
                                    <li>• Optimisation de la gestion de l'eau</li>
                                    <li>• Adoption de pratiques agroécologiques</li>
                                    <li>• Développement de l'agroforesterie</li>
                                  </ul>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Opportunités de marché</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <p className="text-gray-700">
                                    Les productions agricoles de la région {regionDatabase[selectedRegion].name} bénéficient d'une demande croissante sur les marchés locaux et internationaux, notamment :
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                                      <h4 className="font-medium mb-2 text-gray-700">Marchés porteurs</h4>
                                      <ul className="space-y-1 text-gray-600">
                                        <li>• Circuits courts et vente directe</li>
                                        <li>• Productions biologiques certifiées</li>
                                        <li>• Exportation de produits de qualité</li>
                                        <li>• Produits transformés à forte valeur ajoutée</li>
                                      </ul>
                                    </div>
                                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                                      <h4 className="font-medium mb-2 text-gray-700">Tendances de consommation</h4>
                                      <ul className="space-y-1 text-gray-600">
                                        <li>• Préférence pour les produits locaux</li>
                                        <li>• Intérêt pour la traçabilité</li>
                                        <li>• Demande de produits respectueux de l'environnement</li>
                                        <li>• Recherche de qualités nutritionnelles</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Culture;
