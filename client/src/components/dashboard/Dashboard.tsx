import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import DashboardGrid from './DashboardGrid';
import { Button } from '@/components/ui/button';
import { Save, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DashboardProps {
  pageType: 'home' | 'contact_center' | 'mobile_banking';
}

const Dashboard: React.FC<DashboardProps> = ({ pageType }) => {
  const { isEditMode, saveDashboard, dashboards, activeDashboard, createDashboard } = useDashboard();
  const { toast } = useToast();
  const [isNewDashboardDialogOpen, setIsNewDashboardDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (!activeDashboard) return;
    
    setIsSaving(true);
    try {
      await saveDashboard();
      toast({
        title: 'Dashboard saved',
        description: 'Your dashboard configuration has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error saving dashboard',
        description: 'There was an error saving your dashboard. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCreateDashboard = () => {
    if (!newDashboardName.trim()) {
      toast({
        title: 'Dashboard name required',
        description: 'Please enter a name for your new dashboard.',
        variant: 'destructive',
      });
      return;
    }
    
    createDashboard(newDashboardName);
    setNewDashboardName('');
    setIsNewDashboardDialogOpen(false);
    
    toast({
      title: 'Dashboard created',
      description: `"${newDashboardName}" dashboard has been created.`,
    });
  };
  
  return (
    <div className="p-4">
      {/* Dashboard Controls */}
      {isEditMode && (
        <div className="mb-4 flex items-center justify-between bg-muted/30 p-3 rounded-md border">
          <div>
            <h2 className="text-lg font-medium">
              {activeDashboard?.name || 'Dashboard'} 
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Edit Mode
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Customize your dashboard by adding, removing, and rearranging widgets
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsNewDashboardDialogOpen(true)}
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Dashboard
            </Button>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
      
      {/* Dashboard Grid */}
      <DashboardGrid />
      
      {/* New Dashboard Dialog */}
      <Dialog open={isNewDashboardDialogOpen} onOpenChange={setIsNewDashboardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              Enter a name for your new dashboard configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="dashboardName">Dashboard Name</Label>
            <Input
              id="dashboardName"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              placeholder="My Custom Dashboard"
              className="mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDashboardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDashboard}>
              Create Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;