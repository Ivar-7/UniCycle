export interface StudentProfile {
  readonly id: string;
  readonly fullName: string;
  readonly universityEmail: string;
  readonly universityName: string;
  readonly residenceHall: string;
  readonly isVerifiedStudent: boolean;
  readonly itemsReusedCount: number;
  readonly wasteDivertedKg: number;
  readonly rating: number;
  readonly avatarUrl?: string;
}

export interface UpdateProfileInput {
  readonly fullName: string;
  readonly residenceHall: string;
}
