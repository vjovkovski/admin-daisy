// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPermissions: string[] = ['admin', 'view_dashboard']; // Example user permissions

  // Method to check if the user has the required permissions
  hasPermissions(permissions: string[]): boolean {
    if (!permissions || permissions.length === 0) {
      return true; // No specific permissions required, allow access
    }
    return permissions.every((perm) => this.userPermissions.includes(perm));
  }
}
