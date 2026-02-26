import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { UserProfileService } from 'src/app/services/user/user-profile.service';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { UserProfileUpdateDTO } from 'src/app/models/UserProfileUpdateDTO';

export interface UserProfile {
  id:number;
  fullName: string;
  email: string;
  mobileNo: string;
  address: string;
  city: string;
  district: string;
  userName?: string;
  createdTime?: string;
}

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: UserProfile = {
    id: 0,
    fullName: '',
    email: '',
    mobileNo: '',
    address: '',
    city: '',
    district: ''
  };
  
  isLoading: boolean = true;
  isEditing: boolean = false;
  isSaving: boolean = false;
  originalFormValues: any;

  // District options
  districts = ['kaluthara', 'colombo', 'gampaha'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private toastService: ToastServiceService,
    private userProfileService: UserProfileService
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required]
    });
  }

  loadUserProfile(): void {
    this.isLoading = true;
    const mobileNo = this.storageService.getUser();

    if (!mobileNo) {
      this.toastService.errorMessage('User not found. Please login again.');
      this.router.navigate(['/auth/signin']);
      return;
    }

    // Call your API to get user profile
    this.userProfileService.getUserProfile(mobileNo).subscribe(
      (response: CommonResponse) => {
          this.userProfile = response.records || response.data;
          this.populateForm();
          this.isLoading = false;
      },
      error => {
        console.error('Error loading profile:', error);
        this.toastService.errorMessage('Failed to load user profile');
        this.isLoading = false;
        
        // Load from storage as fallback
        this.loadFromStorage();
      }
    );
  }

  loadFromStorage(): void {
    // Fallback: load basic info from storage
    this.userProfile.fullName = this.storageService.getFullName() || '';
    this.userProfile.email = this.storageService.getUser() || '';
    this.populateForm();
  }

  populateForm(): void {
    console.log(">>>", this.userProfile)
    this.profileForm.patchValue({
      fullName: this.userProfile.fullName || '',
      email: this.userProfile.email || '',
      mobileNo: this.userProfile.mobileNo || '',
      address: this.userProfile.address || '',
      city: this.userProfile.city || '',
      district: this.userProfile.district || ''
    });
    
    // Disable form initially
    this.profileForm.disable();
    
    // Store original values
    this.originalFormValues = this.profileForm.getRawValue();
  }

  enableEditing(): void {
    this.isEditing = true;
    this.profileForm.enable();
    
    // Store current form values before editing
    this.originalFormValues = this.profileForm.getRawValue();
  }

  cancelEditing(): void {
    this.isEditing = false;
    
    // Restore original values
    this.profileForm.patchValue(this.originalFormValues);
    this.profileForm.disable();
    
    // Reset validation states
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      this.toastService.errorMessage('Please fill all required fields correctly');
      return;
    }

    // Check if user ID exists
    // const userId = this.storageService.getUserId();
    // if (!userId) {
    //   this.toastService.errorMessage('User ID not found. Please login again.');
    //   this.router.navigate(['/auth/signin']);
    //   return;
    // }

    this.isSaving = true;

    // Prepare update payload with required id field
    const updateData: UserProfileUpdateDTO = {
      id: this.userProfile.id,
      fullName: this.profileForm.get('fullName')?.value,
      email: this.profileForm.get('email')?.value,
      mobileNo: this.profileForm.get('mobileNo')?.value,
      address: this.profileForm.get('address')?.value,
      city: this.profileForm.get('city')?.value,
      district: this.profileForm.get('district')?.value
    };

    // Call update API
    this.userProfileService.updateUserProfile(updateData).subscribe(
      (response: CommonResponse) => {
        this.isSaving = false;
        
        if (response.status === 'SUCCESS') {
          this.toastService.successMessage('Profile updated successfully!');
          
          // Update storage with new values
          this.storageService.setFullName(updateData.fullName);
          // this.storageService.setMobileNo(updateData.mobileNo);
          
          // Update local user profile
          this.userProfile = { ...this.userProfile, ...updateData };
          
          // Disable editing mode
          this.isEditing = false;
          this.profileForm.disable();
          
          // Update original values
          this.originalFormValues = this.profileForm.getRawValue();
        } else {
          this.toastService.errorMessage(response.responseDescription || 'Failed to update profile');
        }
      },
      error => {
        this.isSaving = false;
        console.error('Error updating profile:', error);
        this.toastService.errorMessage(
          error.error?.errorDescription || 'Failed to update profile. Please try again.'
        );
      }
    );
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getInitial(): string {
    if (this.userProfile.fullName) {
      return this.userProfile.fullName.charAt(0).toUpperCase();
    }
    return 'U';
  }

  getMemberSince(): string {
    if (this.userProfile.createdTime) {
      const date = new Date(this.userProfile.createdTime);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

goBack(): void {
  // Get the stored return URL
  const returnUrl = this.storageService.getItem('returnUrl') || '/delivery/home';
  
  // Clear the stored URL
  this.storageService.removeItem('returnUrl');
  
  // Navigate back with sidebar open flag
  this.router.navigate([returnUrl], { 
    state: { openSidebar: true } 
  });
}
}