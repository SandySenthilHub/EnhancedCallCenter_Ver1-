import { executeQuery } from './sqlUtils';
import { Request, Response, NextFunction } from 'express';

// Middleware to extract tenant ID from request
export function tenantExtractor(req: Request, res: Response, next: NextFunction) {
  // Check for tenant ID in query parameters
  let tenantId = req.query.tenantId || req.body.tenantId;
  
  // If not found in query or body, check in headers
  if (!tenantId) {
    tenantId = req.headers['x-tenant-id'];
  }
  
  // Convert to number if possible
  if (tenantId) {
    const numericTenantId = Number(tenantId);
    if (!isNaN(numericTenantId)) {
      // Set tenant ID in SQL session context
      setTenantContext(numericTenantId).catch(error => {
        console.error('Failed to set tenant context:', error);
      });
      
      // Also store in request object for convenience
      req.tenantId = numericTenantId;
    }
  }
  
  next();
}

// Function to set tenant context in SQL Server
export async function setTenantContext(tenantId: number): Promise<void> {
  try {
    await executeQuery('EXEC SetTenantContext @tenantId', { tenantId });
    console.log(`Tenant context set to ${tenantId}`);
  } catch (error) {
    console.error('Error setting tenant context:', error);
    throw error;
  }
}

// Extend Express Request type to include tenantId
declare global {
  namespace Express {
    interface Request {
      tenantId?: number;
    }
  }
}