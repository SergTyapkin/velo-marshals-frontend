export interface User {
  id: string,
  tgUsername: string,
  tgId: string,
  email: string,
  isConfirmedEmail: boolean,
  tel: string,
  avatarUrl: string,
  familyName: string,
  givenName: string,
  middleName: string,
  joinedDate: Date,
  level: number,

  isSignedIn: boolean,
}
