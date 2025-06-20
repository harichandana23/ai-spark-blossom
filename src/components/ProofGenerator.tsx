
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  MessageSquare, 
  MapPin, 
  Calendar,
  Download,
  Share2,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProofGenerator: React.FC = () => {
  const [proofType, setProofType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProof, setGeneratedProof] = useState<any>(null);
  const [formData, setFormData] = useState({
    doctorName: '',
    hospitalName: '',
    date: '',
    time: '',
    location: '',
    contactName: '',
    reason: ''
  });
  const { toast } = useToast();

  const proofTypes = [
    { id: 'medical', name: 'Medical Certificate', icon: FileText, description: 'Doctor\'s note or medical documentation' },
    { id: 'chat', name: 'Chat Screenshot', icon: MessageSquare, description: 'Fake text conversation or email thread' },
    { id: 'location', name: 'Location Log', icon: MapPin, description: 'GPS location proof or check-in' },
    { id: 'appointment', name: 'Appointment Confirmation', icon: Calendar, description: 'Meeting or appointment verification' }
  ];

  const generateProof = async () => {
    if (!proofType) {
      toast({
        title: "Select Proof Type",
        description: "Please select a type of proof to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let proof;
      const currentDate = new Date();
      const formattedDate = formData.date || currentDate.toISOString().split('T')[0];
      const formattedTime = formData.time || currentDate.toTimeString().split(' ')[0].substring(0, 5);
      
      switch (proofType) {
        case 'medical':
          proof = {
            type: 'Medical Certificate',
            content: `
MEDICAL CERTIFICATE

Patient: [Your Name]
Date: ${formattedDate}
Time: ${formattedTime}

This is to certify that the above-mentioned patient was examined and found to be suffering from acute gastroenteritis with associated symptoms including nausea, vomiting, and severe abdominal discomfort.

The patient is advised to take complete rest for 24-48 hours and avoid strenuous activities.

Dr. ${formData.doctorName || 'Sarah Johnson'}
${formData.hospitalName || 'City Medical Center'}
License No: MD-2024-0847
Contact: (555) 123-4567
            `,
            metadata: {
              hospital: formData.hospitalName || 'City Medical Center',
              doctor: formData.doctorName || 'Dr. Sarah Johnson',
              date: formattedDate,
              time: formattedTime
            }
          };
          break;
          
        case 'chat':
          proof = {
            type: 'Chat Screenshot',
            content: [
              { sender: 'Emergency Contact', message: 'Hey, we have a family emergency. Can you come home ASAP?', time: '9:23 AM' },
              { sender: 'You', message: 'What happened? Is everyone okay?', time: '9:24 AM' },
              { sender: 'Emergency Contact', message: 'Dad fell and we\'re heading to the hospital. Need you here.', time: '9:24 AM' },
              { sender: 'You', message: 'On my way. Will call work and leave immediately.', time: '9:25 AM' }
            ],
            metadata: {
              platform: 'WhatsApp',
              date: formattedDate,
              time: formattedTime
            }
          };
          break;
          
        case 'location':
          proof = {
            type: 'Location Log',
            content: `
Location Check-in Confirmation

Location: ${formData.location || 'City Hospital Emergency Room'}
Address: 123 Medical Center Drive, Downtown
Check-in Time: ${formattedTime} on ${formattedDate}
Duration: 2 hours 15 minutes

GPS Coordinates: 40.7589, -73.9851
Device: iPhone 12 Pro
Accuracy: ±3 meters

This location log was automatically generated by your device's location services.
            `,
            metadata: {
              location: formData.location || 'City Hospital Emergency Room',
              coordinates: '40.7589, -73.9851',
              date: formattedDate,
              time: formattedTime
            }
          };
          break;
          
        case 'appointment':
          proof = {
            type: 'Appointment Confirmation',
            content: `
APPOINTMENT CONFIRMATION

Appointment Details:
Date: ${formattedDate}
Time: ${formattedTime}
Duration: 1 hour

Provider: ${formData.doctorName || 'Dr. Michael Chen'}
Location: ${formData.location || 'Downtown Medical Associates'}
Address: 456 Professional Plaza, Suite 201

Reason: ${formData.reason || 'Routine medical consultation'}

Confirmation #: APT-${Date.now().toString().slice(-6)}

Please arrive 15 minutes early for check-in.
Contact: (555) 987-6543
            `,
            metadata: {
              provider: formData.doctorName || 'Dr. Michael Chen',
              location: formData.location || 'Downtown Medical Associates',
              date: formattedDate,
              time: formattedTime,
              confirmationNumber: `APT-${Date.now().toString().slice(-6)}`
            }
          };
          break;
      }
      
      setGeneratedProof(proof);
      
      toast({
        title: "Proof Generated!",
        description: "Your supporting documentation is ready.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate proof. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadProof = () => {
    if (!generatedProof) return;
    
    const element = document.createElement("a");
    const file = new Blob([typeof generatedProof.content === 'string' ? generatedProof.content : JSON.stringify(generatedProof.content, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${generatedProof.type.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Proof document has been downloaded.",
    });
  };

  const shareProof = () => {
    if (!generatedProof) return;
    
    const text = typeof generatedProof.content === 'string' ? generatedProof.content : JSON.stringify(generatedProof.content, null, 2);
    
    if (navigator.share) {
      navigator.share({
        title: generatedProof.type,
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Proof content copied to clipboard.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Proof Generator</h2>
        <p className="text-gray-600">Generate supporting documentation for your excuses</p>
      </div>

      {/* Proof Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Proof Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proofTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setProofType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    proofType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      {proofType && (
        <Card>
          <CardHeader>
            <CardTitle>Customize Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(proofType === 'medical' || proofType === 'appointment') && (
                <div>
                  <Label htmlFor="doctorName">Doctor/Provider Name</Label>
                  <Input
                    id="doctorName"
                    placeholder="Dr. John Smith"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                  />
                </div>
              )}
              
              {(proofType === 'medical' || proofType === 'appointment' || proofType === 'location') && (
                <div>
                  <Label htmlFor="location">Location/Hospital</Label>
                  <Input
                    id="location"
                    placeholder="City Medical Center"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
              
              {proofType === 'appointment' && (
                <div className="md:col-span-2">
                  <Label htmlFor="reason">Reason for Appointment</Label>
                  <Input
                    id="reason"
                    placeholder="Routine medical consultation"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      {proofType && (
        <Button
          onClick={generateProof}
          disabled={isGenerating}
          className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              Generating Proof...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Generate Proof Document
            </>
          )}
        </Button>
      )}

      {/* Generated Proof */}
      {generatedProof && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">{generatedProof.type}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={downloadProof}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={shareProof}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {generatedProof.type === 'Chat Screenshot' ? (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  {generatedProof.content.map((message: any, index: number) => (
                    <div key={index} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === 'You' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {generatedProof.content}
                </pre>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex flex-wrap gap-2">
                {Object.entries(generatedProof.metadata).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: {value as string}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
