import { useState } from 'react';
import '@/App.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowLeft } from 'lucide-react';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [symptomInput, setSymptomInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
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

  const handleSymptomClick = (symptom) => {
    setSelectedSymptom(symptom);
    setSymptomInput(symptom);
    setShowResults(true);
  };

  const handleSearch = () => {
    if (symptomInput.trim()) {
      setSelectedSymptom(symptomInput);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    setShowResults(false);
    setSymptomInput('');
    setSelectedSymptom(null);
  };

  // Language Selection Screen
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-light text-gray-800">
              What language do you prefer?
            </h1>
            <p className="text-xl text-gray-600">Select your language to continue</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className="h-20 text-2xl bg-white hover:bg-green-50 text-gray-800 border-2 border-green-200 hover:border-green-400 shadow-md hover:shadow-lg transition-all"
                data-testid={`language-${lang.code}-btn`}
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white" data-testid="results-page">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
            data-testid="back-btn"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Search
          </Button>

          {/* Symptom Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800">
              {selectedSymptom}
            </h1>
          </div>

          {/* Urgency Level */}
          <Card className="border-2 border-amber-200 bg-amber-50" data-testid="urgency-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <CardTitle className="text-2xl text-amber-800">Urgency Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="text-lg px-4 py-2 bg-amber-600 hover:bg-amber-700" data-testid="urgency-badge">
                Consult Soon
              </Badge>
              <p className="mt-4 text-gray-700 text-lg">
                We recommend consulting with a healthcare provider within the next few days.
              </p>
            </CardContent>
          </Card>

          {/* Possible Related Conditions */}
          <Card data-testid="conditions-card">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Possible Related Conditions</CardTitle>
              <CardDescription className="text-lg">
                These are common conditions associated with your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 text-xl">•</span>
                  <span>Tension headache or migraine (if Headache)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 text-xl">•</span>
                  <span>Viral or bacterial infection (if Fever)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-green-600 text-xl">•</span>
                  <span>Respiratory condition (if Cough)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Recommended Specialists */}
          <Card data-testid="specialists-card">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Recommended Specialists</CardTitle>
              <CardDescription className="text-lg">
                These healthcare providers can help with your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-xl text-gray-800">Primary Care Physician (PCP)</h3>
                  <p className="text-gray-600 text-lg mt-2">
                    Your first point of contact for most health concerns
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-xl text-gray-800">Neurologist</h3>
                  <p className="text-gray-600 text-lg mt-2">
                    For persistent or severe headaches and neurological symptoms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Care Pathway */}
          <Card data-testid="care-pathway-card">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Your Care Pathway</CardTitle>
              <CardDescription className="text-lg">
                Step-by-step guidance for managing your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl text-gray-800">Schedule Appointment</h4>
                    <p className="text-gray-600 text-lg mt-1">
                      Contact your primary care physician or recommended specialist
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl text-gray-800">Initial Consultation</h4>
                    <p className="text-gray-600 text-lg mt-1">
                      Doctor will assess your symptoms and may order tests
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl text-gray-800">Follow Recommended Treatment</h4>
                    <p className="text-gray-600 text-lg mt-1">
                      Follow your healthcare provider's advice and prescribed treatment plan
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl text-gray-800">Follow-up Care</h4>
                    <p className="text-gray-600 text-lg mt-1">
                      Schedule follow-up appointments as recommended
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-2 border-gray-300 bg-gray-50" data-testid="disclaimer-card">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">Important Disclaimer</h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    This is not a medical diagnosis. The information provided is for guidance only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Home Page (v1.0 with hover-only labels)
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white" data-testid="home-page">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-light text-gray-800">
            Tell us what you're experiencing
          </h1>
          <p className="text-xl text-gray-600">
            Enter your symptoms to find the right healthcare guidance
          </p>
        </div>

        {/* Main Search Input */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Describe your symptoms..."
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="h-16 text-xl border-2 border-green-200 focus:border-green-400 rounded-lg"
              data-testid="symptom-input"
            />
            <Button
              onClick={handleSearch}
              className="h-16 px-8 text-xl bg-green-600 hover:bg-green-700"
              disabled={!symptomInput.trim()}
              data-testid="search-btn"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Common Symptoms Section - v1.1 with permanently visible labels */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-gray-700 text-center">
            Common Symptoms
          </h2>
          <div className="flex flex-wrap justify-center gap-3" data-testid="common-symptoms">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSymptomClick(symptom)}
                className="symptom-pill-v1 px-6 py-3 rounded-full border-2 border-green-300 bg-white hover:bg-green-50 hover:border-green-500 transition-all shadow-sm hover:shadow-md text-lg text-gray-800"
                data-testid={`symptom-${symptom.toLowerCase().replace(' ', '-')}`}
              >
                {/* v1.1: Label is always visible */}
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <Card className="border-2 border-green-200 bg-white" data-testid="about-card">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 text-center">Patient-First Healthcare Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              We help you find the right healthcare provider by understanding your symptoms and concerns. 
              Our guidance is designed to be clear, accessible, and trustworthy for all ages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
