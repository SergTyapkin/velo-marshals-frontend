export interface User {
  id: string,
  tgUsername?: string,
  tgId: string,
  email?: string,
  isConfirmedEmail: boolean,
  tel?: string,
  avatarUrl?: string,
  familyName?: string,
  givenName?: string,
  middleName?: string,
  joinedDate: Date,
  level: string,
  completedEvents: Event[],

  canEditAchievements: boolean,
  canAssignAchievements: boolean,
  canEditRegistrations: boolean,
  canEditEvents: boolean,
  canEditUsersData: boolean,
  canEditDocs: boolean,
  canExecuteSQL: boolean,
  canEditHistory: boolean,
  canEditGlobals: boolean,

  isFilledFullData: boolean,
  isSignedIn: boolean,
}

export interface Globals {
  isOnMaintenance: boolean,
  globalEvent?: Event,
  globalRegistration?: Registration,
}

export interface Event {
  id: string,
  title: string,
  description: string,
  fullDescription: string,
  routeDescription: string,
  createdDate: Date,
  startDate?: Date,
  cameDate?: Date,
  previewUrl?: boolean,
  customCSS?: string,
  lapDistanceKm: number,
  medalPreviewUrl: string,
  isRegistrationOpened: boolean,
  authorId?: string,
  isYouRegistered: boolean,
  isYourRegistrationConfirmed?: boolean,
  yourComment?: string,
  registrationsCount: number,
}

export interface Registration {
  id: string,
  userId: string,
  eventId: string,
  isConfirmed?: boolean,
  userComment?: string,
  adminComment?: string,
  level?: number,
  salary?: number,
  taskText?: string,
  cameDate?: string,
  leaveDate?: Date,
  lapsPassed: number,
  userFamilyName?: string,
  userGivenName?: string,
  userMiddleName?: string,
  userTel?: string,
  userTgUsername?: string,
  userAvatarUrl?: string,
  userLevel: string,
}

export interface SQLHistory {
  id: string,
  userId: string,
  text: string,
  date: Date,
}
export interface EquipmentGroup {
  title: string,
  description?: string,
  previewUrl?: string,
  amountLeft?: number,
  amountTotal?: number,
  isNeedsToReturn: boolean,
}
export interface Equipment extends EquipmentGroup {
  id: string,
  amountHolds?: number,
  takenDate?: Date,
  updatedDate?: Date,
}

