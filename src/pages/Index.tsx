
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExcuseGenerator } from '@/components/ExcuseGenerator';
import { ProofGenerator } from '@/components/ProofGenerator';
import { EmergencySystem } from '@/components/EmergencySystem';
import { ExcuseHistory } from '@/components/ExcuseHistory';
import { Settings } from '@/components/Settings';
import { 
  Brain, 
  Shield, 
  Clock, 
  Star, 
  Settings as SettingsIcon,
  Zap,
  FileText,
  Phone
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [stats, setStats] = useState({
    totalExcuses: 0,
    successRate: 0,
    favoriteCategory: 'work'
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('excuse-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Excuse Generator
                </h1>
                <p className="text-sm text-gray-600">Intelligent context-aware excuses</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <EmergencySystem />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Excuses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalExcuses}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Category</p>
                  <p className="text-lg font-bold text-purple-600 capitalize">{stats.favoriteCategory}</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-100/50 m-4 mb-0 rounded-lg">
                <TabsTrigger value="generator" className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">Generator</span>
                </TabsTrigger>
                <TabsTrigger value="proof" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Proof</span>
                </TabsTrigger>
                <TabsTrigger value="emergency" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Emergency</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <SettingsIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="generator" className="mt-0">
                  <ExcuseGenerator onStatsUpdate={setStats} />
                </TabsContent>
                
                <TabsContent value="proof" className="mt-0">
                  <ProofGenerator />
                </TabsContent>
                
                <TabsContent value="emergency" className="mt-0">
                  <EmergencySystem expanded />
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <ExcuseHistory />
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <Settings />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
