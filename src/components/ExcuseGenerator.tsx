
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  Home,
  RefreshCw,
  Heart,
  Volume2,
  Copy,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExcuseGeneratorProps {
  onStatsUpdate: (stats: any) => void;
}

export const ExcuseGenerator: React.FC<ExcuseGeneratorProps> = ({ onStatsUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [urgencyLevel, setUrgencyLevel] = useState([3]);
  const [believabilityLevel, setBelievabilityLevel] = useState([7]);
  const [customContext, setCustomContext] = useState('');
  const [generatedExcuse, setGeneratedExcuse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeProof, setIncludeProof] = useState(false);
  const [enableVoice, setEnableVoice] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: 'work', name: 'Work', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'school', name: 'School', icon: GraduationCap, color: 'bg-green-500' },
    { id: 'social', name: 'Social', icon: Users, color: 'bg-purple-500' },
    { id: 'family', name: 'Family', icon: Home, color: 'bg-orange-500' }
  ];

  const excuseTemplates = {
    work: [
      "I'm experiencing unexpected technical difficulties with my internet connection that's preventing me from accessing our systems effectively.",
      "I have a family emergency that requires my immediate attention and I need to handle some urgent arrangements.",
      "I'm feeling quite unwell with symptoms that could be contagious, so I want to avoid spreading anything to the team.",
      "There's been a transportation issue that's significantly delayed my commute this morning.",
      "I have an important medical appointment that was rescheduled last minute and I couldn't find an alternative time."
    ],
    school: [
      "I'm dealing with a family situation that requires my presence at home today.",
      "I'm experiencing severe technical issues with my computer that's preventing me from completing assignments.",
      "I have a medical appointment that couldn't be scheduled outside of school hours.",
      "There's been a transportation problem that's making it impossible for me to get to campus today.",
      "I'm feeling quite unwell and don't want to risk getting other students sick."
    ],
    social: [
      "Something unexpected came up with work that I need to handle urgently.",
      "I'm not feeling well and think it's best if I stay home and rest.",
      "I have a family commitment that I forgot about and can't reschedule.",
      "I'm having car trouble and can't find reliable transportation.",
      "I have to help a friend with an emergency situation."
    ],
    family: [
      "I have an important work commitment that came up unexpectedly.",
      "I'm not feeling well and don't want to risk getting anyone else sick.",
      "I have a prior engagement that I completely forgot about and can't cancel.",
      "I'm having transportation issues that are preventing me from coming over.",
      "Something urgent has come up that I need to take care of immediately."
    ]
  };

  const generateExcuse = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const templates = excuseTemplates[selectedCategory as keyof typeof excuseTemplates];
      let excuse = templates[Math.floor(Math.random() * templates.length)];
      
      // Modify excuse based on urgency and believability
      if (urgencyLevel[0] >= 8) {
        excuse = excuse.replace(/I'm/, "I'm urgently").replace(/There's/, "There's an extremely urgent");
      }
      
      if (believabilityLevel[0] <= 3) {
        excuse += " This situation is quite unusual but unfortunately unavoidable.";
      }
      
      if (customContext) {
        excuse += ` Additional context: ${customContext}`;
      }
      
      setGeneratedExcuse(excuse);
      
      // Save to history
      const history = JSON.parse(localStorage.getItem('excuse-history') || '[]');
      const newExcuse = {
        id: Date.now(),
        text: excuse,
        category: selectedCategory,
        urgency: urgencyLevel[0],
        believability: believabilityLevel[0],
        timestamp: new Date().toISOString(),
        isFavorite: false
      };
      history.unshift(newExcuse);
      localStorage.setItem('excuse-history', JSON.stringify(history.slice(0, 50)));
      
      // Update stats
      const currentStats = JSON.parse(localStorage.getItem('excuse-stats') || '{"totalExcuses":0,"successRate":85,"favoriteCategory":"work"}');
      currentStats.totalExcuses += 1;
      currentStats.favoriteCategory = selectedCategory;
      localStorage.setItem('excuse-stats', JSON.stringify(currentStats));
      onStatsUpdate(currentStats);
      
      toast({
        title: "Excuse Generated!",
        description: "Your AI-powered excuse is ready to use.",
      });
      
      // Text-to-speech if enabled
      if (enableVoice && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(excuse);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate excuse. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedExcuse);
    toast({
      title: "Copied!",
      description: "Excuse copied to clipboard.",
    });
  };

  const saveToFavorites = () => {
    const history = JSON.parse(localStorage.getItem('excuse-history') || '[]');
    if (history.length > 0) {
      history[0].isFavorite = true;
      localStorage.setItem('excuse-history', JSON.stringify(history));
      toast({
        title: "Saved to Favorites!",
        description: "This excuse has been added to your favorites.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Excuse Generator</h2>
        <p className="text-gray-600">Generate contextually aware, believable excuses for any situation</p>
      </div>

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Select Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Customization Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Urgency Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={urgencyLevel}
              onValueChange={setUrgencyLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Low</span>
              <span className="font-medium">Level {urgencyLevel[0]}</span>
              <span>Critical</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Believability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Slider
              value={believabilityLevel}
              onValueChange={setBelievabilityLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Creative</span>
              <span className="font-medium">Level {believabilityLevel[0]}</span>
              <span>Realistic</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Add any specific details or context for your excuse..."
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            className="resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="include-proof"
                checked={includeProof}
                onCheckedChange={setIncludeProof}
              />
              <Label htmlFor="include-proof">Include proof generation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-voice"
                checked={enableVoice}
                onCheckedChange={setEnableVoice}
              />
              <Label htmlFor="enable-voice">Enable text-to-speech</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={generateExcuse}
        disabled={isGenerating}
        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Generating AI Excuse...
          </>
        ) : (
          <>
            <RefreshCw className="w-5 h-5 mr-2" />
            Generate Excuse
          </>
        )}
      </Button>

      {/* Generated Excuse */}
      {generatedExcuse && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Your AI-Generated Excuse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-800 leading-relaxed">{generatedExcuse}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-green-200">
              <div className="flex space-x-2">
                <Badge variant="secondary">{selectedCategory}</Badge>
                <Badge variant="outline">Urgency: {urgencyLevel[0]}/10</Badge>
                <Badge variant="outline">Believability: {believabilityLevel[0]}/10</Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={saveToFavorites}>
                  <Star className="w-4 h-4 mr-1" />
                  Favorite
                </Button>
                {enableVoice && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(generatedExcuse);
                      speechSynthesis.speak(utterance);
                    }}
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Listen
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
