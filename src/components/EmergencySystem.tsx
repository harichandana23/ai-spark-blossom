
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  MessageSquare, 
  AlertTriangle,
  Clock,
  Zap,
  Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencySystemProps {
  expanded?: boolean;
}

export const EmergencySystem: React.FC<EmergencySystemProps> = ({ expanded = false }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  const { toast } = useToast();

  const emergencyScenarios = [
    {
      id: 'medical',
      title: 'Medical Emergency',
      description: 'Sudden illness or medical situation',
      message: "I'm experiencing a medical emergency and need to leave immediately. I'll be in touch as soon as possible.",
      urgency: 'critical'
    },
    {
      id: 'family',
      title: 'Family Emergency',
      description: 'Urgent family situation requiring immediate attention',
      message: "There's been a family emergency that requires my immediate attention. I need to leave right away and will update you when I can.",
      urgency: 'high'
    },
    {
      id: 'transport',
      title: 'Transportation Crisis',
      description: 'Vehicle breakdown or transport failure',
      message: "I'm currently stranded due to a transportation emergency. I'm working on getting alternative transport and will keep you updated.",
      urgency: 'medium'
    },
    {
      id: 'weather',
      title: 'Weather Emergency',
      description: 'Severe weather conditions preventing travel',
      message: "Due to severe weather conditions in my area, it's unsafe for me to travel. I'll monitor the situation and update you shortly.",
      urgency: 'medium'
    }
  ];

  const activateEmergency = (scenarioId: string) => {
    const scenario = emergencyScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setSelectedScenario(scenarioId);
    setIsActivated(true);

    // Simulate emergency actions
    setTimeout(() => {
      toast({
        title: "Emergency Activated!",
        description: "Emergency messages sent and contacts notified.",
      });
    }, 1000);

    // Text-to-speech for the message
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(scenario.message);
      utterance.rate = 1.1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const deactivateEmergency = () => {
    setIsActivated(false);
    setSelectedScenario('');
    toast({
      title: "Emergency Deactivated",
      description: "Emergency mode has been turned off.",
    });
  };

  if (!expanded) {
    // Compact emergency button for header
    return (
      <Button
        variant={isActivated ? "destructive" : "outline"}
        size="sm"
        onClick={() => activateEmergency('family')}
        className={isActivated ? "animate-pulse" : ""}
      >
        <AlertTriangle className="w-4 h-4 mr-1" />
        {isActivated ? "ACTIVE" : "Emergency"}
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency System</h2>
        <p className="text-gray-600">Quick emergency excuse activation with automated messaging</p>
      </div>

      {isActivated && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Emergency mode is currently <strong>ACTIVE</strong>. Emergency contacts have been notified.
          </AlertDescription>
        </Alert>
      )}

      {/* Emergency Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyScenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className={`cursor-pointer transition-all duration-200 ${
              selectedScenario === scenario.id 
                ? 'border-red-500 bg-red-50' 
                : 'hover:border-gray-300'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
                <Badge 
                  variant={scenario.urgency === 'critical' ? 'destructive' : 
                           scenario.urgency === 'high' ? 'default' : 'secondary'}
                >
                  {scenario.urgency}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">{scenario.message}</p>
                </div>
                
                <Button
                  onClick={() => activateEmergency(scenario.id)}
                  disabled={isActivated && selectedScenario !== scenario.id}
                  className={`w-full ${
                    selectedScenario === scenario.id && isActivated
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {selectedScenario === scenario.id && isActivated ? 'ACTIVE' : 'Activate Emergency'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Actions */}
      {isActivated && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Emergency Actions Activated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">Text Messages</p>
                  <p className="text-sm text-gray-600">Sent to 3 contacts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <Phone className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">Emergency Calls</p>
                  <p className="text-sm text-gray-600">Auto-dialing enabled</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <Volume2 className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium">Voice Message</p>
                  <p className="text-sm text-gray-600">Ready to play</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-red-200">
              <Button
                onClick={deactivateEmergency}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
              >
                <Clock className="w-4 h-4 mr-2" />
                Deactivate Emergency Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Work Supervisor', 'Family Contact', 'Backup Contact'].map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{contact}</p>
                  <p className="text-sm text-gray-600">+1 (555) {100 + index * 111}-{1000 + index * 111}</p>
                </div>
                <Badge variant="outline">SMS + Call</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
