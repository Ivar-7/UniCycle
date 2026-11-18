export interface StudentSignInCredentials {
  readonly email: string;
  readonly password: string;
}

export interface StudentRegisterCredentials extends StudentSignInCredentials {
  readonly fullName: string;
}

export interface AuthSessionSummary {
  readonly uid: string;
  readonly email: string;
  readonly fullName: string;
  readonly verifiedCampusDomain: boolean;
}
