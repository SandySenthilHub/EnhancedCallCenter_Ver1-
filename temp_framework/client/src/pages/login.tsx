import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">EnterprisePlatform</h1>
          </div>
          <p className="text-slate-600">
            Multi-tenant enterprise management platform
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-blue-700"
            size="lg"
          >
            Sign In to Continue
          </Button>
          <p className="text-xs text-slate-500 text-center mt-4">
            Access your organization's data and manage entities, users, and workflows
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
