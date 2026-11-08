export interface StudentSignInCredentials {
  readonly universityEmail: string;
  readonly password: string;
}

export interface StudentRegisterCredentials extends StudentSignInCredentials {
  readonly fullName: string;
  readonly residenceHall: string;
}

export interface AuthSessionSummary {
  readonly uid: string;
  readonly email: string;
  readonly fullName: string;
  readonly residenceHall: string;
  readonly verifiedCampusDomain: boolean;
  readonly authProvider: 'firebase' | 'campus-seed';
}
