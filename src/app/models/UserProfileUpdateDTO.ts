export interface UserProfileUpdateDTO {
  id: number;          // Required - user ID
  fullName: string;
  email: string;
  mobileNo: string;
  address: string;
  city: string;
  district: string;
}