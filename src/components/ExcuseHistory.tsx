
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Star, 
  Search, 
  Filter,
  Copy,
  Trash2,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Excuse {
  id: number;
  text: string;
  category: string;
  urgency: number;
  believability: number;
  timestamp: string;
  isFavorite: boolean;
  successRate?: number;
}

export const ExcuseHistory: React.FC = () => {
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [filteredExcuses, setFilteredExcuses] = useState<Excuse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const { toast } = useToast();

  useEffect(() => {
    loadExcuses();
  }, []);

  useEffect(() => {
    filterAndSortExcuses();
  }, [excuses, searchTerm, filterCategory, sortBy]);

  const loadExcuses = () => {
    const history = JSON.parse(localStorage.getItem('excuse-history') || '[]');
    // Add mock success rates for demonstration
    const excusesWithRates = history.map((excuse: Excuse) => ({
      ...excuse,
      successRate: Math.floor(Math.random() * 30) + 70 // 70-100% success rate
    }));
    setExcuses(excusesWithRates);
  };

  const filterAndSortExcuses = () => {
    let filtered = excuses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(excuse => 
        excuse.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        excuse.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      if (filterCategory === 'favorites') {
        filtered = filtered.filter(excuse => excuse.isFavorite);
      } else {
        filtered = filtered.filter(excuse => excuse.category === filterCategory);
      }
    }

    // Sort excuses
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case 'success':
        filtered.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
        break;
      case 'urgency':
        filtered.sort((a, b) => b.urgency - a.urgency);
        break;
      case 'believability':
        filtered.sort((a, b) => b.believability - a.believability);
        break;
    }

    setFilteredExcuses(filtered);
  };

  const toggleFavorite = (id: number) => {
    const updatedExcuses = excuses.map(excuse => 
      excuse.id === id ? { ...excuse, isFavorite: !excuse.isFavorite } : excuse
    );
    setExcuses(updatedExcuses);
    
    // Update localStorage
    const history = updatedExcuses.map(excuse => ({
      id: excuse.id,
      text: excuse.text,
      category: excuse.category,
      urgency: excuse.urgency,
      believability: excuse.believability,
      timestamp: excuse.timestamp,
      isFavorite: excuse.isFavorite
    }));
    localStorage.setItem('excuse-history', JSON.stringify(history));
    
    toast({
      title: updatedExcuses.find(e => e.id === id)?.isFavorite ? "Added to Favorites" : "Removed from Favorites",
      description: "Excuse favorite status updated.",
    });
  };

  const copyExcuse = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Excuse copied to clipboard.",
    });
  };

  const deleteExcuse = (id: number) => {
    const updatedExcuses = excuses.filter(excuse => excuse.id !== id);
    setExcuses(updatedExcuses);
    
    // Update localStorage
    const history = updatedExcuses.map(excuse => ({
      id: excuse.id,
      text: excuse.text,
      category: excuse.category,
      urgency: excuse.urgency,
      believability: excuse.believability,
      timestamp: excuse.timestamp,
      isFavorite: excuse.isFavorite
    }));
    localStorage.setItem('excuse-history', JSON.stringify(history));
    
    toast({
      title: "Excuse Deleted",
      description: "Excuse has been removed from history.",
    });
  };

  const clearAllHistory = () => {
    setExcuses([]);
    localStorage.removeItem('excuse-history');
    toast({
      title: "History Cleared",
      description: "All excuse history has been deleted.",
    });
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'school': return '🎓';
      case 'social': return '👥';
      case 'family': return '🏠';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Excuse History & Analytics</h2>
        <p className="text-gray-600">Track your excuses and their effectiveness over time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{excuses.length}</div>
            <div className="text-sm text-gray-600">Total Excuses</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {excuses.length > 0 ? Math.round(excuses.reduce((acc, e) => acc + (e.successRate || 0), 0) / excuses.length) : 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Success Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{excuses.filter(e => e.isFavorite).length}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {excuses.length > 0 ? Object.keys(excuses.reduce((acc: any, e) => {
                acc[e.category] = (acc[e.category] || 0) + 1;
                return acc;
              }, {})).length : 0}
            </div>
            <div className="text-sm text-gray-600">Categories Used</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search excuses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="favorites">⭐ Favorites</SelectItem>
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="school">🎓 School</SelectItem>
                <SelectItem value="social">👥 Social</SelectItem>
                <SelectItem value="family">🏠 Family</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="success">Success Rate</SelectItem>
                <SelectItem value="urgency">Urgency Level</SelectItem>
                <SelectItem value="believability">Believability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Excuse List */}
      <div className="space-y-4">
        {filteredExcuses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Excuses Found</h3>
              <p className="text-gray-600">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start generating excuses to see them appear here.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredExcuses.map((excuse) => (
            <Card key={excuse.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(excuse.category)}</span>
                      <Badge variant="outline" className="capitalize">
                        {excuse.category}
                      </Badge>
                      <Badge variant="secondary">
                        Urgency: {excuse.urgency}/10
                      </Badge>
                      <Badge variant="secondary">
                        Believability: {excuse.believability}/10
                      </Badge>
                      {excuse.successRate && (
                        <Badge variant="outline" className={getSuccessRateColor(excuse.successRate)}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {excuse.successRate}% Success
                        </Badge>
                      )}
                      {excuse.isFavorite && (
                        <Badge variant="default" className="bg-yellow-500">
                          <Star className="w-3 h-3 mr-1" />
                          Favorite
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-800 mb-3 leading-relaxed">{excuse.text}</p>
                    
                    <div className="text-sm text-gray-500">
                      {new Date(excuse.timestamp).toLocaleDateString()} at {new Date(excuse.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(excuse.id)}
                      className={excuse.isFavorite ? 'text-yellow-600 border-yellow-600' : ''}
                    >
                      <Star className={`w-4 h-4 ${excuse.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyExcuse(excuse.text)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteExcuse(excuse.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Clear History */}
      {excuses.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Clear All History</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={clearAllHistory}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
