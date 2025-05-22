import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Zap,
  BarChart3,
  Target,
  Cpu,
  Database,
  GitBranch
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts';

// ML Model Types from your GitHub repository
interface MLModel {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'automl';
  description: string;
  accuracy: number;
  status: 'training' | 'ready' | 'failed';
  lastTrained: string;
  predictions: number;
}

const AIPlaybook: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('call_volume_predictor');
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // AI/ML Models based on your repository structure
  const mlModels: MLModel[] = [
    {
      id: 'call_volume_predictor',
      name: 'Call Volume Predictor',
      type: 'regression',
      description: 'Predicts daily call volume using historical patterns and business events',
      accuracy: 0.87,
      status: 'ready',
      lastTrained: '2024-01-15',
      predictions: 1247
    },
    {
      id: 'sentiment_classifier',
      name: 'Sentiment Analysis',
      type: 'classification',
      description: 'Classifies customer sentiment from call transcripts',
      accuracy: 0.92,
      status: 'ready',
      lastTrained: '2024-01-14',
      predictions: 3456
    },
    {
      id: 'agent_clustering',
      name: 'Agent Performance Clustering',
      type: 'clustering',
      description: 'Groups agents by performance metrics for targeted coaching',
      accuracy: 0.79,
      status: 'ready',
      lastTrained: '2024-01-13',
      predictions: 234
    },
    {
      id: 'anomaly_detector',
      name: 'KPI Anomaly Detection',
      type: 'classification',
      description: 'Detects unusual patterns in banking KPIs',
      accuracy: 0.84,
      status: 'training',
      lastTrained: '2024-01-12',
      predictions: 567
    },
    {
      id: 'automl_optimizer',
      name: 'AutoML Pipeline',
      type: 'automl',
      description: 'Automatically selects and tunes ML models for banking data',
      accuracy: 0.88,
      status: 'ready',
      lastTrained: '2024-01-16',
      predictions: 89
    }
  ];

  // Generate sample prediction data
  const generatePredictionData = (modelType: string) => {
    const days = Array.from({length: 30}, (_, i) => i + 1);
    return days.map(day => ({
      day: `Day ${day}`,
      actual: Math.floor(Math.random() * 100) + 50,
      predicted: Math.floor(Math.random() * 100) + 45,
      confidence: 0.7 + Math.random() * 0.25
    }));
  };

  // Simulate ML prediction
  const runPrediction = async (modelId: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const model = mlModels.find(m => m.id === modelId);
    const sampleData = generatePredictionData(model?.type || 'regression');
    
    const result = {
      modelId,
      prediction: model?.type === 'classification' ? 'Positive Sentiment' : '127 calls',
      confidence: 0.87,
      explanation: {
        keyFactors: ['Historical patterns', 'Seasonal trends', 'Business events'],
        dataPoints: sampleData,
        featureImportance: {
          'Previous Volume': 0.35,
          'Day of Week': 0.25,
          'Holidays': 0.20,
          'Weather': 0.10,
          'Promotions': 0.10
        }
      }
    };
    
    setPredictionResult(result);
    setIsLoading(false);
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'regression': return <TrendingUp className="h-5 w-5" />;
      case 'classification': return <Target className="h-5 w-5" />;
      case 'clustering': return <Users className="h-5 w-5" />;
      case 'automl': return <Cpu className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          AI/ML Playbook
        </h1>
        <p className="text-muted-foreground">
          Production-ready machine learning models for banking analytics
        </p>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="automl">AutoML</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mlModels.map((model) => (
              <Card 
                key={model.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedModel === model.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.type)}
                      <CardTitle className="text-sm">{model.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    {model.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Accuracy:</span>
                      <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Predictions:</span>
                      <span className="font-medium">{model.predictions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Last Trained:</span>
                      <span className="font-medium">{model.lastTrained}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Model Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button 
                  onClick={() => runPrediction(selectedModel)}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      Run Prediction
                    </>
                  )}
                </Button>
                
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {mlModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              {predictionResult && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Prediction Result</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Prediction:</span>
                        <span className="font-bold text-blue-600">
                          {predictionResult.prediction}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium">
                          {(predictionResult.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Feature Importance</h4>
                      <div className="space-y-1">
                        {Object.entries(predictionResult.explanation.featureImportance).map(([feature, importance]) => (
                          <div key={feature} className="flex justify-between text-sm">
                            <span>{feature}:</span>
                            <span>{((importance as number) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Prediction vs Actual</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={predictionResult.explanation.dataPoints}>
                          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            name="Actual"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="predicted" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            name="Predicted"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automl" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                AutoML Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Data Ingestion</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automated feature extraction from banking data
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Model Selection</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatic algorithm selection and hyperparameter tuning
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Performance</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Continuous monitoring and retraining
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Recent AutoML Experiments</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Call Volume Optimization', accuracy: 0.89, duration: '15 min' },
                    { name: 'Sentiment Classification', accuracy: 0.93, duration: '22 min' },
                    { name: 'Customer Churn Prediction', accuracy: 0.81, duration: '18 min' }
                  ].map((experiment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{experiment.name}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Accuracy: {(experiment.accuracy * 100).toFixed(1)}%</span>
                        <span>Duration: {experiment.duration}</span>
                        <Badge variant="outline">Complete</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Models</p>
                    <p className="text-2xl font-bold">{mlModels.length}</p>
                  </div>
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                    <p className="text-2xl font-bold">
                      {(mlModels.reduce((acc, model) => acc + model.accuracy, 0) / mlModels.length * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Predictions</p>
                    <p className="text-2xl font-bold">
                      {mlModels.reduce((acc, model) => acc + model.predictions, 0).toLocaleString()}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Models</p>
                    <p className="text-2xl font-bold">
                      {mlModels.filter(m => m.status === 'ready').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPlaybook;