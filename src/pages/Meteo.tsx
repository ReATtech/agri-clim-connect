
import React, { useState, useEffect } from 'react';
import { Search, Thermometer, Droplets, Wind, Compass, Calendar, Info, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { supabase } from '@/integrations/supabase/client';

// Cameroon cities
const popularCities = [
  "Yaoundé", "Douala", "Garoua", "Bamenda", "Maroua", 
  "Nkongsamba", "Bafoussam", "Ngaoundéré", "Bertoua", "Loum"
];

// Placeholder for weather data type - will be replaced with actual API response type
type WeatherData = {
  location: string;
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    day: {
      maxTemp: number;
      minTemp: number;
      condition: string;
      icon: string;
    }
  }>;
  agricultural: {
    recommendations: string[];
    alerts: string[];
  }
};

const MeteoPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Simulated weather data for demonstration
  const demoWeatherData: WeatherData = {
    location: "Yaoundé",
    current: {
      temp: 28,
      humidity: 75,
      windSpeed: 8,
      windDirection: "NE",
      condition: "Partiellement nuageux",
      icon: "partly-cloudy"
    },
    forecast: [
      {
        date: "Aujourd'hui",
        day: {
          maxTemp: 29,
          minTemp: 22,
          condition: "Partiellement nuageux",
          icon: "partly-cloudy"
        }
      },
      {
        date: "Demain",
        day: {
          maxTemp: 30,
          minTemp: 23,
          condition: "Ensoleillé",
          icon: "sunny"
        }
      },
      {
        date: "Mercredi",
        day: {
          maxTemp: 28,
          minTemp: 22,
          condition: "Pluie légère",
          icon: "rain"
        }
      },
      {
        date: "Jeudi",
        day: {
          maxTemp: 27,
          minTemp: 21,
          condition: "Orageux",
          icon: "storm"
        }
      },
      {
        date: "Vendredi",
        day: {
          maxTemp: 29,
          minTemp: 22,
          condition: "Partiellement nuageux",
          icon: "partly-cloudy"
        }
      }
    ],
    agricultural: {
      recommendations: [
        "Conditions idéales pour la croissance du maïs et du plantain",
        "L'humidité élevée favorise la croissance du manioc et de l'igname",
        "Bon moment pour la plantation du cacao",
        "Surveillez les signes de mildiou sur les cultures de tomates"
      ],
      alerts: [
        "Risque modéré de précipitations intenses jeudi",
        "Taux d'humidité élevé - surveillez les maladies fongiques"
      ]
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    try {
      // This would be replaced with an actual API call to get weather data
      // const response = await fetchWeatherData(searchQuery);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        setWeatherData({
          ...demoWeatherData,
          location: searchQuery
        });
        setLocation(searchQuery);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setIsLoading(false);
    }
  };

  const handlePopularCityClick = (city: string) => {
    setSearchQuery(city);
    setWeatherData({
      ...demoWeatherData,
      location: city
    });
    setLocation(city);
  };

  // Initial load with default city
  useEffect(() => {
    handlePopularCityClick("Yaoundé");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Météo Agricole</h1>
          <p className="text-center text-gray-600 mb-8">
            Prévisions météorologiques et recommandations agricoles adaptées
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Rechercher une ville ou région..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                className="bg-agrigreen-600 hover:bg-agrigreen-700"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Popular cities */}
            <div className="mt-4 flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handlePopularCityClick(city)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    location === city 
                      ? 'bg-agrigreen-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          
          {weatherData && (
            <>
              {/* Current Weather */}
              <div className="mb-8">
                <Card className="overflow-hidden border-none shadow-md">
                  <CardHeader className="pb-2 bg-agrigreen-600 text-white">
                    <CardTitle className="text-2xl flex justify-between items-center">
                      <span>{weatherData.location}</span>
                      <span>{weatherData.current.temp}°C</span>
                    </CardTitle>
                    <CardDescription className="text-agrigreen-100">
                      {weatherData.current.condition} • Mise à jour à l'instant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-50 p-3 rounded-full">
                          <Droplets className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Humidité</p>
                          <p className="text-xl font-semibold">{weatherData.current.humidity}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-50 p-3 rounded-full">
                          <Wind className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Vent</p>
                          <p className="text-xl font-semibold">{weatherData.current.windSpeed} km/h</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-50 p-3 rounded-full">
                          <Compass className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Direction</p>
                          <p className="text-xl font-semibold">{weatherData.current.windDirection}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Weather Tabs */}
              <Tabs defaultValue="forecast" className="mb-8">
                <TabsList className="mb-4 w-full grid grid-cols-2">
                  <TabsTrigger value="forecast">Prévisions à 5 jours</TabsTrigger>
                  <TabsTrigger value="agricultural">Conseils agricoles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="forecast">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <Card key={index} className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-center">{day.date}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pt-0">
                          <p className="text-2xl font-bold">{day.day.maxTemp}°</p>
                          <p className="text-gray-500 text-sm">{day.day.minTemp}°</p>
                          <p className="mt-2 text-sm">{day.day.condition}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="agricultural">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-agrigreen-700">
                        Recommandations pour {weatherData.location}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium text-lg mb-2 flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-agrigreen-600" />
                        Conseils saisonniers
                      </h3>
                      <ul className="list-disc pl-6 mb-4 space-y-1">
                        {weatherData.agricultural.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-gray-700">{rec}</li>
                        ))}
                      </ul>
                      
                      <h3 className="font-medium text-lg mb-2 flex items-center">
                        <Info className="mr-2 h-5 w-5 text-amber-500" />
                        Alertes
                      </h3>
                      <ul className="pl-6 mb-4 space-y-1">
                        {weatherData.agricultural.alerts.map((alert, idx) => (
                          <li key={idx} className="text-amber-700 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{alert}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default MeteoPage;
