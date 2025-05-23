import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Search, Edit2, Languages, Globe, Type, ToggleLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
  isActive: boolean;
  translationCount: number;
  userCount: number;
  createdAt: string;
}

const LanguageManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample language data with international coverage
  const sampleLanguages: Language[] = [
    {
      id: 1,
      code: 'en-US',
      name: 'English (United States)',
      nativeName: 'English',
      isRTL: false,
      isActive: true,
      translationCount: 2456,
      userCount: 1250,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      code: 'ar-AE',
      name: 'Arabic (United Arab Emirates)',
      nativeName: 'العربية',
      isRTL: true,
      isActive: true,
      translationCount: 1834,
      userCount: 890,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 3,
      code: 'es-ES',
      name: 'Spanish (Spain)',
      nativeName: 'Español',
      isRTL: false,
      isActive: true,
      translationCount: 2198,
      userCount: 567,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 4,
      code: 'fr-FR',
      name: 'French (France)',
      nativeName: 'Français',
      isRTL: false,
      isActive: true,
      translationCount: 1923,
      userCount: 423,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 5,
      code: 'de-DE',
      name: 'German (Germany)',
      nativeName: 'Deutsch',
      isRTL: false,
      isActive: true,
      translationCount: 2087,
      userCount: 345,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 6,
      code: 'ja-JP',
      name: 'Japanese (Japan)',
      nativeName: '日本語',
      isRTL: false,
      isActive: true,
      translationCount: 1567,
      userCount: 278,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 7,
      code: 'zh-CN',
      name: 'Chinese (Simplified)',
      nativeName: '简体中文',
      isRTL: false,
      isActive: true,
      translationCount: 1789,
      userCount: 456,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 8,
      code: 'hi-IN',
      name: 'Hindi (India)',
      nativeName: 'हिन्दी',
      isRTL: false,
      isActive: true,
      translationCount: 1234,
      userCount: 234,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 9,
      code: 'pt-BR',
      name: 'Portuguese (Brazil)',
      nativeName: 'Português',
      isRTL: false,
      isActive: false,
      translationCount: 867,
      userCount: 123,
      createdAt: '2024-01-15T09:00:00Z'
    }
  ];

  const filteredLanguages = sampleLanguages.filter((language) => {
    const matchesSearch = language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && language.isActive) ||
                         (selectedStatus === 'inactive' && !language.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRTLBadgeColor = (isRTL: boolean) => {
    return isRTL ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const languageStats = {
    total: sampleLanguages.length,
    active: sampleLanguages.filter(l => l.isActive).length,
    rtlLanguages: sampleLanguages.filter(l => l.isRTL).length,
    totalTranslations: sampleLanguages.reduce((sum, l) => sum + l.translationCount, 0),
    totalUsers: sampleLanguages.reduce((sum, l) => sum + l.userCount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Language Management</h1>
          <p className="text-gray-600">Manage internationalization and localization support</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Language
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Languages className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Languages</p>
                <p className="text-2xl font-bold text-gray-900">{languageStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Languages</p>
                <p className="text-2xl font-bold text-gray-900">{languageStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ToggleLeft className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">RTL Languages</p>
                <p className="text-2xl font-bold text-gray-900">{languageStats.rtlLanguages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Type className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Translations</p>
                <p className="text-2xl font-bold text-gray-900">{languageStats.totalTranslations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Users Served</p>
                <p className="text-2xl font-bold text-gray-900">{languageStats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Languages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Language Configuration ({filteredLanguages.length})</CardTitle>
          <CardDescription>
            Manage language settings, translations, and localization options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search languages by name, native name, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Languages</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Language</th>
                  <th className="text-left p-4 font-medium text-gray-900">Code</th>
                  <th className="text-left p-4 font-medium text-gray-900">Direction</th>
                  <th className="text-left p-4 font-medium text-gray-900">Translations</th>
                  <th className="text-left p-4 font-medium text-gray-900">Users</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLanguages.map((language) => (
                  <tr key={language.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Languages className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{language.name}</div>
                          <div className="text-sm text-gray-500" style={{ 
                            direction: language.isRTL ? 'rtl' : 'ltr' 
                          }}>
                            {language.nativeName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {language.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={getRTLBadgeColor(language.isRTL)}>
                        {language.isRTL ? 'RTL' : 'LTR'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Type className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {language.translationCount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {language.userCount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusBadgeColor(language.isActive)}>
                        {language.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Type className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageManagement;