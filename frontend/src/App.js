import { useState } from 'react';
import '@/App.css';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowLeft, Home, Calendar, Clock, MapPin, Star, Award } from 'lucide-react';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [symptomInput, setSymptomInput] = useState('');
  const [currentPage, setCurrentPage] = useState('home'); // home, results, doctors, pathway
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिंदी' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
    { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  ];

  const commonSymptoms = [
    'Headache',
    'Fever',
    'Cough',
    'Chest pain',
    'Fatigue',
    'Dizziness',
    'Abdominal pain',
    'Back pain',
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Maria Rodriguez',
      specialty: 'Neurologist',
      experience: 18,
      rating: 4.7,
      distance: 4.5,
      availability: 'Available Today',
      hospital: 'Neuro Wellness Institute',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Dr. James Chen',
      specialty: 'Internal Medicine',
      experience: 22,
      rating: 4.9,
      distance: 2.3,
      availability: 'Available Tomorrow',
      hospital: 'City Medical Center',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
    }
  ];

  const handleSymptomClick = (symptom) => {
    setSelectedSymptom(symptom);
    setSymptomInput(symptom);
    setCurrentPage('results');
  };

  const handleFindCare = () => {
    if (symptomInput.trim()) {
      setSelectedSymptom(symptomInput);
      setCurrentPage('results');
    }
  };

  const handleViewDoctors = () => {
    setCurrentPage('doctors');
  };

  const handleBackToResults = () => {
    setCurrentPage('results');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSymptomInput('');
    setSelectedSymptom(null);
  };

  // Language Selection Screen
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-5xl w-full text-center space-y-12">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white text-6xl mb-4">
                🌍
              </div>
            </div>
            <h1 className="text-6xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
              CarePath
            </h1>
            <p className="text-2xl text-gray-600">What language do you prefer?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className="bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-4"
                data-testid={`language-${lang.code}-btn`}
              >
                <div className="text-7xl">{lang.flag}</div>
                <div className="text-2xl font-semibold text-gray-800">{lang.native}</div>
                <div className="text-lg text-gray-500">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Recommended Doctors Page
  if (currentPage === 'doctors') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white" data-testid="doctors-page">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl text-green-600">❤️</span>
              <span className="text-2xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>CarePath</span>
            </div>
            <Button
              onClick={handleBackToResults}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
              data-testid="back-to-results-btn"
            >
              Back to Results
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
              Recommended Doctors
            </h1>
            <p className="text-xl text-gray-600">
              Based on your symptoms, these specialists can help
            </p>
          </div>

          {/* Specialization Explanation */}
          <Card className="bg-green-50 border-2 border-green-200" data-testid="specialization-info">
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Why These Specialists?</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                For symptoms like headache and dizziness, neurologists and internal medicine specialists are best equipped to diagnose and treat underlying conditions. They can perform comprehensive evaluations and recommend appropriate tests and treatments.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden shadow-lg" data-testid={`doctor-card-${doctor.id}`}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Doctor Photo */}
                    <div className="flex-shrink-0">
                      <img
                        src={doctor.photo}
                        alt={doctor.name}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-3xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                          {doctor.name}
                        </h2>
                        <p className="text-xl text-gray-600 mt-1">{doctor.specialty}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-green-600" />
                          <span>{doctor.experience} years exp.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span>{doctor.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-red-500" />
                          <span>{doctor.distance} km</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-green-700">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">{doctor.availability}</span>
                      </div>

                      <p className="text-gray-600">{doctor.hospital}</p>

                      <Button
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-6 text-lg"
                        data-testid={`book-appointment-${doctor.id}`}
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (currentPage === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white" data-testid="results-page">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl text-green-600">❤️</span>
              <span className="text-2xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>CarePath</span>
            </div>
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              data-testid="home-btn"
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Urgency Level Card */}
          <Card className="border-2 border-orange-300 bg-orange-50 shadow-lg" data-testid="urgency-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-serif text-gray-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                    Urgency Level: Consult Soon
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    Based on your symptoms, this is our recommendation for how soon you should seek care.
                  </p>
                  <p className="text-lg text-orange-700 font-medium">
                    Confidence: Medium
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Possible Related Conditions */}
          <div className="space-y-6">
            <h2 className="text-4xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
              Possible Related Conditions
            </h2>

            {/* Condition Card 1 */}
            <Card className="shadow-lg" data-testid="condition-card-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-gray-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                      Migraine or tension-type headache
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Common causes of persistent headache, often associated with sensitivity to light/sound, stress, or muscle tension; dizziness can sometimes accompany these.
                    </p>
                  </div>
                  <Badge className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-base" data-testid="severity-badge-high">
                    high
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Condition Card 2 */}
            <Card className="shadow-lg" data-testid="condition-card-2">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-gray-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                      Vestibular disorder (e.g., vestibular migraine or inner ear issue)
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Inner ear or balance system problems can cause dizziness or a spinning sensation (vertigo), often with headache, nausea, or imbalance.
                    </p>
                  </div>
                  <Badge className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-base" data-testid="severity-badge-medium">
                    medium
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Care Pathway */}
          <Card className="shadow-lg" data-testid="care-pathway-card">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                Your Care Pathway
              </CardTitle>
              <CardDescription className="text-lg">
                Step-by-step guidance for managing your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">Consult Recommended Specialist</h4>
                  <p className="text-gray-700 text-lg">
                    Schedule an appointment with a neurologist or primary care physician to evaluate your symptoms
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">Diagnostic Tests</h4>
                  <p className="text-gray-700 text-lg">
                    Your doctor may order tests such as imaging (MRI/CT scan) or balance function tests to determine the cause
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">Treatment Plan</h4>
                  <p className="text-gray-700 text-lg">
                    Follow prescribed treatment which may include medication, physical therapy, or lifestyle modifications
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">Follow-up Care</h4>
                  <p className="text-gray-700 text-lg">
                    Schedule follow-up appointments to monitor progress and adjust treatment as needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Disclaimer */}
          <Card className="border-2 border-gray-400 bg-gray-50 shadow-lg" data-testid="disclaimer-card">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Important Medical Disclaimer</h3>
                  <p className="text-lg text-gray-800 leading-relaxed mb-3">
                    <strong>This is not a medical diagnosis.</strong> The information provided here is for educational and guidance purposes only.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Always consult with a qualified healthcare professional for proper diagnosis and treatment. If you are experiencing severe symptoms or a medical emergency, please call emergency services immediately or visit the nearest emergency room.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Doctors Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleViewDoctors}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-xl"
              data-testid="view-doctors-btn"
            >
              View Recommended Doctors
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Home Page - v1.0 with hover-only Common Symptoms labels
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white" data-testid="home-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl text-green-600">❤️</span>
            <span className="text-2xl font-serif text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>CarePath</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-700">🌍</span>
              <span className="text-sm text-green-700">Language set to English</span>
            </div>
            <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2" data-testid="about-link">
              <AlertCircle className="w-5 h-5" />
              About
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-serif text-gray-800 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Tell us what you're experiencing
          </h1>
          <p className="text-xl text-gray-600">
            We'll help you find the right doctor and care pathway for your health needs
          </p>
        </div>

        {/* Symptom Input Card */}
        <Card className="shadow-xl">
          <CardContent className="p-8 space-y-6">
            <Textarea
              placeholder="Describe your symptoms... (e.g., 'I have a persistent headache and feel dizzy')" 
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-green-400 resize-none"
              data-testid="symptom-input"
            />
            <Button
              onClick={handleFindCare}
              className="w-full h-16 text-xl bg-green-600 hover:bg-green-700"
              disabled={!symptomInput.trim()}
              data-testid="find-care-btn"
            >
              <Calendar className="mr-2 h-6 w-6" />
              Find My Care
            </Button>
          </CardContent>
        </Card>

        {/* Common Symptoms Section - v1.1 with permanently visible labels */}
        <div className="space-y-6">
          <h2 className="text-3xl font-light text-gray-700 text-center">
            Common Symptoms
          </h2>
          <div className="flex flex-wrap justify-center gap-3" data-testid="common-symptoms">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSymptomClick(symptom)}
                className="symptom-pill-v1 px-8 py-4 rounded-full border-2 border-green-300 bg-white hover:bg-green-50 hover:border-green-500 transition-all shadow-sm hover:shadow-md text-lg text-gray-800 min-w-[160px]"
                data-testid={`symptom-${symptom.toLowerCase().replace(' ', '-')}`}
              >
                {/* v1.1: Label is always visible */}
                {symptom}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
