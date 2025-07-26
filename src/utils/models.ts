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

export interface Event {
  id: string,
  title: string,
  description: string,
  routeDescription: string,
  createdDate: Date,
  startDate: Date,
  cameDate: Date,
  previewUrl?: boolean,
  customCSS?: string,
  lapDistanceKm: number,
  medalPreviewUrl: string,
  authorId: string,
  isYouRegistered: boolean,
  registrationsCount: number,
}
