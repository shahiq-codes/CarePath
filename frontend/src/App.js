import React, { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  Globe, 
  Search, 
  Stethoscope, 
  Heart, 
  Users, 
  MapPin,
  Star,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Home as HomeIcon,
  Info,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language Selection Screen
const LanguageSelection = () => {
  const navigate = useNavigate();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिंदी' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
    { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' }
  ];
  
  const handleLanguageSelect = (langCode) => {
    localStorage.setItem('selectedLanguage', langCode);
    toast.success(`Language set to ${languages.find(l => l.code === langCode).name}`);
    navigate('/home');
  };
  
  return (
    <div data-testid="language-selection-screen" className="min-h-screen bg-secondary flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden noise-bg">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1759593554816-daa272437349')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      
      <div className="relative z-10 w-full max-w-5xl animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Globe className="w-16 h-16 md:w-20 md:h-20 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary mb-4 tracking-tight leading-none">
            CarePath
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            What language do you prefer?
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {languages.map((lang, idx) => (
            <Card
              key={lang.code}
              data-testid={`language-option-${lang.code}`}
              onClick={() => handleLanguageSelect(lang.code)}
              className="language-card cursor-pointer p-8 md:p-10 bg-white border-2 border-border hover:border-primary rounded-3xl shadow-lg"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-center">
                <div className="text-6xl md:text-7xl mb-4">{lang.flag}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {lang.native}
                </h3>
                <p className="text-lg text-muted-foreground">{lang.name}</p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-base md:text-lg text-muted-foreground">
            Select your preferred language to continue
          </p>
        </div>
      </div>
    </div>
  );
};

// Home Page with Symptom Search
const Home = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
  
  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Chest Pain',
    'Fatigue', 'Dizziness', 'Abdominal Pain', 'Back Pain'
  ];
  
  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await axios.post(`${API}/analyze-symptom`, {
        symptoms: symptoms,
        language: selectedLanguage
      });
      
      localStorage.setItem('analysisResult', JSON.stringify(response.data));
      navigate('/results');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleVoiceInput = () => {
    setIsListening(true);
    toast.info('Voice input feature coming soon!');
    setTimeout(() => setIsListening(false), 2000);
  };
  
  return (
    <div data-testid="home-page" className="min-h-screen bg-secondary">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">CarePath</span>
            </div>
            <Button
              data-testid="about-nav-button"
              variant="ghost"
              onClick={() => navigate('/about')}
              className="text-lg font-medium"
            >
              <Info className="w-5 h-5 mr-2" />
              About
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section with Background */}
      <div className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/70 z-10" />
          <img
            src="https://images.unsplash.com/photo-1765896387377-e293914d1e69?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxudXJzZSUyMGNhcmluZyUyMGVsZGVybHklMjBwYXRpZW50JTIwaG9zcGl0YWwlMjBjb21wYXNzaW9uYXRlfGVufDB8fHx8MTc2NjEwMjU4OHww&ixlib=rb-4.1.0&q=85"
            alt="Compassionate healthcare"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20 relative z-20">
          <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-primary mb-6 tracking-tight leading-none">
              Tell us what you're experiencing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              We'll help you find the right doctor and care pathway for your health needs
            </p>
          </div>
          
          {/* Search Box */}
          <Card data-testid="symptom-search-card" className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-2 border-border animate-fade-in">
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  data-testid="symptom-input"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms... (e.g., 'I have a persistent headache and feel dizzy')"
                  className="symptom-input w-full h-32 md:h-40 px-6 py-5 text-xl md:text-2xl bg-secondary rounded-2xl border-2 border-border focus:border-primary focus:outline-none resize-none font-medium"
                  disabled={isAnalyzing}
                />
                <div className="absolute bottom-4 right-4">
                  <Button
                    data-testid="voice-input-button"
                    size="icon"
                    variant="ghost"
                    onClick={handleVoiceInput}
                    className={`w-12 h-12 rounded-full ${isListening ? 'bg-primary text-white' : 'bg-secondary'}`}
                    disabled={isAnalyzing}
                  >
                    <Mic className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              
              <Button
                data-testid="analyze-button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !symptoms.trim()}
                className="btn-primary w-full py-6 md:py-8 px-8 md:px-10 text-lg md:text-xl font-bold rounded-full shadow-lg hover:shadow-xl"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <div className="loading-pulse mr-3">Analyzing...</div>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Search className="w-6 h-6 mr-3" />
                    Find My Care
                  </span>
                )}
              </Button>
            </div>
          </Card>
          
          {/* Common Symptoms */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg font-semibold text-muted-foreground mb-4 text-center">
              Common symptoms:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {commonSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  data-testid={`common-symptom-${symptom.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setSymptoms(symptom)}
                  className="cursor-pointer px-6 py-3 text-base md:text-lg bg-white border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white rounded-full font-medium"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Trust Section */}
      <div className="bg-white py-16 md:py-24 mt-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="text-center" data-testid="trust-feature-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">AI-Powered Guidance</h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Smart symptom analysis to guide you to the right specialist
              </p>
            </div>
            
            <div className="text-center" data-testid="trust-feature-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Elder-Friendly</h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Designed for ease of use by all ages and tech comfort levels
              </p>
            </div>
            
            <div className="text-center" data-testid="trust-feature-3">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Patient-First</h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                No ads, no bias — just honest healthcare navigation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanguageSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/doctors" element={<DoctorSuggestions />} />
          <Route path="/pathway" element={<CarePathway />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

// Results Page
const Results = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  
  useEffect(() => {
    const result = localStorage.getItem('analysisResult');
    if (result) {
      setAnalysis(JSON.parse(result));
    } else {
      navigate('/home');
    }
  }, [navigate]);
  
  if (!analysis) return null;
  
  const getUrgencyColor = (urgency) => {
    if (urgency === 'Emergency') return 'urgency-emergency';
    if (urgency === 'Consult Soon') return 'urgency-soon';
    return 'urgency-routine';
  };
  
  const getConfidenceColor = (confidence) => {
    if (confidence === 'High') return 'confidence-high';
    if (confidence === 'Medium') return 'confidence-medium';
    return 'confidence-low';
  };
  
  return (
    <div data-testid="results-page" className="min-h-screen bg-secondary">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">CarePath</span>
            </div>
            <Button
              data-testid="home-button"
              variant="ghost"
              onClick={() => navigate('/home')}
              className="text-lg font-medium"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Urgency Alert */}
          <Card data-testid="urgency-card" className="bg-white p-8 rounded-3xl shadow-lg border-2 border-border animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className={`p-4 rounded-2xl ${getUrgencyColor(analysis.urgency_level)}`}>
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Urgency Level: {analysis.urgency_level}
                </h2>
                <p className="text-lg text-muted-foreground">
                  Based on your symptoms, this is our recommendation for how soon you should seek care.
                </p>
                <p className={`mt-3 text-lg font-semibold ${getConfidenceColor(analysis.confidence)}`}>
                  Confidence: {analysis.confidence}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Possible Conditions */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Possible Related Conditions</h2>
            <div className="space-y-4">
              {analysis.possible_conditions?.map((condition, idx) => (
                <Card key={idx} data-testid={`condition-card-${idx}`} className="bg-white p-6 rounded-2xl shadow-md border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{condition.name}</h3>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{condition.description}</p>
                    </div>
                    <Badge className={`ml-4 px-4 py-2 text-base font-semibold ${
                      condition.probability === 'high' ? 'bg-primary text-white' :
                      condition.probability === 'medium' ? 'bg-accent text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {condition.probability}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Recommended Specialists */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Recommended Specialists</h2>
            <Card className="bg-white p-8 rounded-3xl shadow-lg border-2 border-border">
              <div className="flex flex-wrap gap-3">
                {analysis.recommended_specialists?.map((specialist, idx) => (
                  <Badge key={idx} data-testid={`specialist-badge-${idx}`} className="px-6 py-3 text-lg font-semibold bg-primary text-white rounded-full">
                    {specialist}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Disclaimer */}
          <Card data-testid="disclaimer-card" className="bg-accent/10 p-6 rounded-2xl border-2 border-accent/30 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <p className="text-base md:text-lg text-foreground leading-relaxed font-medium">
                <strong>Important:</strong> {analysis.disclaimer}
              </p>
            </div>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              data-testid="find-doctors-button"
              onClick={() => {
                navigate('/doctors');
              }}
              className="btn-primary flex-1 py-6 md:py-8 px-8 text-lg md:text-xl font-bold rounded-full shadow-lg"
            >
              <Users className="w-6 h-6 mr-3" />
              Find Doctors
            </Button>
            <Button
              data-testid="view-pathway-button"
              onClick={() => navigate('/pathway')}
              className="btn-accent flex-1 py-6 md:py-8 px-8 text-lg md:text-xl font-bold rounded-full shadow-lg"
            >
              <ArrowRight className="w-6 h-6 mr-3" />
              View Care Pathway
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Doctor Suggestions Page
const DoctorSuggestions = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      const result = localStorage.getItem('analysisResult');
      if (!result) {
        navigate('/home');
        return;
      }
      
      const analysis = JSON.parse(result);
      const specialists = analysis.recommended_specialists?.join(',') || '';
      
      try {
        const response = await axios.get(`${API}/doctors?specialists=${specialists}`);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, [navigate]);
  
  return (
    <div data-testid="doctors-page" className="min-h-screen bg-secondary">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">CarePath</span>
            </div>
            <Button
              data-testid="back-to-results-button"
              variant="ghost"
              onClick={() => navigate('/results')}
              className="text-lg font-medium"
            >
              Back to Results
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-4 tracking-tight leading-none">
              Recommended Doctors
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              Based on your symptoms, these specialists can help
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-pulse text-2xl text-primary">Loading doctors...</div>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {doctors.map((doctor, idx) => (
                <Card
                  key={doctor.id}
                  data-testid={`doctor-card-${idx}`}
                  className="doctor-card bg-white p-8 rounded-3xl shadow-lg border-2 border-border animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={doctor.image_url}
                        alt={doctor.name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-primary/20"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{doctor.name}</h3>
                        <p className="text-xl font-semibold text-primary mb-2">{doctor.specialty}</p>
                        <div className="flex flex-wrap gap-4 text-base md:text-lg text-muted-foreground">
                          <span className="flex items-center">
                            <Stethoscope className="w-5 h-5 mr-2" />
                            {doctor.experience_years} years exp.
                          </span>
                          <span className="flex items-center">
                            <Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
                            {doctor.rating} rating
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            {doctor.distance}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-lg font-medium text-foreground">{doctor.availability}</span>
                      </div>
                      <p className="text-lg text-muted-foreground">
                        {doctor.hospital}
                      </p>
                      <Button
                        data-testid={`book-appointment-${idx}`}
                        className="btn-accent py-4 px-8 text-lg font-bold rounded-full shadow-lg"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Care Pathway Page - Will implement next
const CarePathway = () => {
  const navigate = useNavigate();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPathway = async () => {
      const result = localStorage.getItem('analysisResult');
      if (!result) {
        navigate('/home');
        return;
      }
      
      const analysis = JSON.parse(result);
      const specialists = analysis.recommended_specialists?.join(',') || '';
      
      try {
        const response = await axios.get(`${API}/care-pathway?urgency=${analysis.urgency_level}&specialists=${specialists}`);
        setPathway(response.data);
      } catch (error) {
        console.error('Error fetching pathway:', error);
        toast.error('Failed to load care pathway');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPathway();
  }, [navigate]);
  
  return (
    <div data-testid="pathway-page" className="min-h-screen bg-secondary">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">CarePath</span>
            </div>
            <Button
              data-testid="back-to-results-pathway-button"
              variant="ghost"
              onClick={() => navigate('/results')}
              className="text-lg font-medium"
            >
              Back to Results
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-4 tracking-tight leading-none">
              Your Care Pathway
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              Step-by-step guidance for your healthcare journey
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-pulse text-2xl text-primary">Loading pathway...</div>
            </div>
          ) : pathway ? (
            <div className="space-y-8">
              {/* Timeline Badge */}
              <Card data-testid="timeline-card" className="bg-primary text-white p-6 rounded-2xl shadow-lg text-center animate-fade-in">
                <div className="flex items-center justify-center space-x-3">
                  <Clock className="w-6 h-6" />
                  <span className="text-xl md:text-2xl font-bold">Estimated Timeline: {pathway.estimated_timeline}</span>
                </div>
              </Card>
              
              {/* Steps */}
              <div className="space-y-6">
                {pathway.steps?.map((step, idx) => (
                  <div
                    key={idx}
                    data-testid={`pathway-step-${idx}`}
                    className="pathway-step animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <Card className="bg-white p-8 rounded-3xl shadow-lg border-2 border-border">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center">
                            <span className="text-2xl md:text-3xl font-black text-white">{step.step}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{step.action}</h3>
                          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-primary flex-shrink-0" />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              
              {pathway.follow_up_required && (
                <Card data-testid="follow-up-card" className="bg-accent/10 p-6 rounded-2xl border-2 border-accent/30 animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <Info className="w-6 h-6 text-accent" />
                    <p className="text-lg font-semibold text-foreground">
                      Follow-up appointments will be required to monitor your progress
                    </p>
                  </div>
                </Card>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  data-testid="find-doctors-from-pathway-button"
                  onClick={() => navigate('/doctors')}
                  className="btn-primary flex-1 py-6 md:py-8 px-8 text-lg md:text-xl font-bold rounded-full shadow-lg"
                >
                  <Users className="w-6 h-6 mr-3" />
                  Find Doctors Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No pathway data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// About Page
const About = () => {
  const navigate = useNavigate();
  
  return (
    <div data-testid="about-page" className="min-h-screen bg-secondary">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">CarePath</span>
            </div>
            <Button
              data-testid="back-home-button"
              variant="ghost"
              onClick={() => navigate('/home')}
              className="text-lg font-medium"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-6 tracking-tight leading-none">
              About CarePath
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
              Healthcare navigation made simple, trustworthy, and accessible
            </p>
          </div>
          
          <Card data-testid="mission-card" className="bg-white p-10 rounded-3xl shadow-xl border-2 border-border animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              We believe healthcare should be easy to navigate. Too often, patients don't know which doctor to see or which hospital department to visit. CarePath solves this by letting you search by symptoms or diseases, not doctor names.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Our AI-powered platform guides you from what you're experiencing to the right medical care, with clarity and compassion every step of the way.
            </p>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <Card data-testid="patient-first-card" className="bg-white p-8 rounded-3xl shadow-lg border-2 border-border animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Patient-First Philosophy</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We put patients before profits. No ad-based doctor rankings, no hidden agendas. Just honest, helpful healthcare navigation.
              </p>
            </Card>
            
            <Card data-testid="ai-ethics-card" className="bg-white p-8 rounded-3xl shadow-lg border-2 border-border animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Ethical AI Use</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our AI provides guidance, not diagnosis. We're transparent about confidence levels and always encourage professional medical consultation.
              </p>
            </Card>
          </div>
          
          <Card data-testid="accessibility-card" className="bg-primary text-white p-10 rounded-3xl shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed for Everyone</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-bold mb-2">Elder-Friendly</h4>
                <p className="text-lg opacity-90">Large text, clear icons, and simple language make healthcare accessible to all ages.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Multilingual</h4>
                <p className="text-lg opacity-90">Available in 6 languages to serve diverse communities worldwide.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Low-Tech Friendly</h4>
                <p className="text-lg opacity-90">No complex navigation or medical jargon. Just straightforward guidance.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Privacy First</h4>
                <p className="text-lg opacity-90">Your health information stays private and secure.</p>
              </div>
            </div>
          </Card>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Button
              data-testid="get-started-button"
              onClick={() => navigate('/home')}
              className="btn-accent py-6 md:py-8 px-12 text-xl md:text-2xl font-bold rounded-full shadow-xl"
            >
              Get Started
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};