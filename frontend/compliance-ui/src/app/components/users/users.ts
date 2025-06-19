import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  lastLogin: Date;
  status: 'Active' | 'Inactive';
  createdDate: Date;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showCreateUserModal = false;
  showImportModal = false;
  userForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      role: ['Employee', [Validators.required]],
      department: ['General', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Try to load users from localStorage first
    const savedUsers = localStorage.getItem('compliance_users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers).map((user: any) => ({
        ...user,
        lastLogin: new Date(user.lastLogin),
        createdDate: new Date(user.createdDate)
      }));
    } else {
      // Load default mock users for demonstration
      this.users = [
        {
          id: '1',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          fullName: 'Admin User',
          email: 'admin@company.com',
          role: 'Administrator',
          department: 'IT',
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'Active',
          createdDate: new Date('2024-01-01')
        },
        {
          id: '2',
          username: 'john.smith',
          firstName: 'John',
          lastName: 'Smith',
          fullName: 'John Smith',
          email: 'john.smith@company.com',
          role: 'Security Manager',
          department: 'Security',
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          status: 'Active',
          createdDate: new Date('2024-01-02')
        },
        {
          id: '3',
          username: 'sarah.johnson',
          firstName: 'Sarah',
          lastName: 'Johnson',
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'Compliance Officer',
          department: 'Legal',
          lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          status: 'Active',
          createdDate: new Date('2024-01-03')
        },
        {
          id: '4',
          username: 'mike.wilson',
          firstName: 'Mike',
          lastName: 'Wilson',
          fullName: 'Mike Wilson',
          email: 'mike.wilson@company.com',
          role: 'Employee',
          department: 'General',
          lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          status: 'Active',
          createdDate: new Date('2024-01-04')
        }
      ];
      this.saveUsers();
    }
  }

  saveUsers() {
    localStorage.setItem('compliance_users', JSON.stringify(this.users));
  }

  // Modal Controls
  openCreateUserModal() {
    this.showCreateUserModal = true;
    this.userForm.reset({
      role: 'Employee',
      department: 'General'
    });
  }

  closeCreateUserModal() {
    this.showCreateUserModal = false;
    this.userForm.reset();
  }

  openImportModal() {
    this.showImportModal = true;
  }

  closeImportModal() {
    this.showImportModal = false;
  }

  // User Operations
  createUser() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      // Check for duplicate email or username
      const existingUser = this.users.find(u => 
        u.email.toLowerCase() === formValue.email.toLowerCase() ||
        u.username.toLowerCase() === formValue.username.toLowerCase()
      );
      
      if (existingUser) {
        alert('A user with this email or username already exists.');
        return;
      }
      
      const newUser: User = {
        id: (Date.now()).toString(),
        username: formValue.username,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        fullName: `${formValue.firstName} ${formValue.lastName}`,
        email: formValue.email.toLowerCase(),
        role: formValue.role,
        department: formValue.department,
        lastLogin: new Date(), // New user, set to now
        status: 'Active',
        createdDate: new Date()
      };

      this.users.unshift(newUser);
      this.saveUsers();
      this.closeCreateUserModal();
      alert(`User "${newUser.fullName}" created successfully!`);
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  editUser(user: User) {
    // In a real app, this would open an edit modal
    const newRole = prompt(`Edit role for ${user.fullName}:`, user.role);
    if (newRole && newRole !== user.role) {
      user.role = newRole;
      this.saveUsers();
      alert(`User role updated to "${newRole}"`);
    }
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    this.saveUsers();
    alert(`User ${user.fullName} is now ${user.status}`);
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.fullName}"?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.saveUsers();
      alert(`User "${user.fullName}" has been deleted.`);
    }
  }

  // Import/Export Functions
  importUsers() {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.parseUserFile(file);
      }
    };
    input.click();
  }

  parseUserFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const content = e.target.result;
        let newUsers: User[] = [];

        if (file.name.endsWith('.csv')) {
          newUsers = this.parseCSV(content);
        } else {
          alert('Excel files not yet supported. Please use CSV format.');
          return;
        }

        if (newUsers.length > 0) {
          // Check for duplicates and add new users
          const existingEmails = this.users.map(u => u.email.toLowerCase());
          const validNewUsers = newUsers.filter(user => 
            !existingEmails.includes(user.email.toLowerCase())
          );

          if (validNewUsers.length > 0) {
            this.users = [...validNewUsers, ...this.users];
            this.saveUsers();
            alert(`Successfully imported ${validNewUsers.length} users. ${newUsers.length - validNewUsers.length} duplicates were skipped.`);
          } else {
            alert('No new users found. All users in the file already exist.');
          }
        } else {
          alert('No valid users found in the file. Please check the format.');
        }

        this.closeImportModal();
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check the format and try again.');
      }
    };

    reader.readAsText(file);
  }

  parseCSV(content: string): User[] {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const users: User[] = [];

    // Expected headers (flexible matching)
    const requiredFields = {
      firstName: ['first name', 'firstname', 'first_name'],
      lastName: ['last name', 'lastname', 'last_name'],
      email: ['email', 'email address', 'e-mail'],
      username: ['username', 'user name', 'login'],
      role: ['role', 'position', 'job title'],
      department: ['department', 'dept', 'division']
    };

    // Find column indices
    const columnMap: Record<string, number> = {};
    Object.keys(requiredFields).forEach(field => {
      const fieldOptions = (requiredFields as any)[field];
      const columnIndex = headers.findIndex(h => fieldOptions.includes(h));
      if (columnIndex !== -1) {
        columnMap[field] = columnIndex;
      }
    });

    // Validate required columns
    const missingFields = Object.keys(requiredFields).filter(field => 
      columnMap[field] === undefined
    );

    if (missingFields.length > 0) {
      alert(`Missing required columns: ${missingFields.join(', ')}. Please check your CSV format.`);
      return [];
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const maxColumnIndex = Math.max(...Object.values(columnMap));
      if (values.length < maxColumnIndex + 1) continue;

      try {
        const user: User = {
          id: (Date.now() + i).toString(),
          firstName: values[columnMap['firstName']]?.trim() || '',
          lastName: values[columnMap['lastName']]?.trim() || '',
          fullName: '',
          email: values[columnMap['email']]?.trim().toLowerCase() || '',
          username: values[columnMap['username']]?.trim() || '',
          role: values[columnMap['role']]?.trim() || 'Employee',
          department: values[columnMap['department']]?.trim() || 'General',
          lastLogin: new Date(), // Set to current date for imported users
          status: 'Active',
          createdDate: new Date()
        };

        // Validate required fields
        if (!user.firstName || !user.lastName || !user.email || !user.username) {
          console.warn(`Skipping invalid user at line ${i + 1}`);
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
          console.warn(`Skipping user with invalid email at line ${i + 1}: ${user.email}`);
          continue;
        }

        user.fullName = `${user.firstName} ${user.lastName}`;
        users.push(user);
      } catch (error) {
        console.warn(`Error parsing line ${i + 1}:`, error);
      }
    }

    return users;
  }

  parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values.map(v => v.replace(/^"|"$/g, ''));
  }

  exportUserList() {
    // Create CSV content
    const headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Last Login', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...this.users.map(user => [
        `"${user.fullName}"`,
        user.email,
        user.role,
        user.department,
        user.status,
        user.lastLogin.toISOString().split('T')[0],
        user.createdDate.toISOString().split('T')[0]
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    alert('User list exported successfully!');
  }

  downloadSampleCSV() {
    const sampleData = [
      'First Name,Last Name,Email,Username,Role,Department',
      'John,Doe,john.doe@company.com,john.doe,Employee,IT',
      'Jane,Smith,jane.smith@company.com,jane.smith,Compliance Officer,Legal',
      'Mike,Johnson,mike.johnson@company.com,mike.johnson,Security Manager,Security'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_users_import.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Utility methods
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  }
}
