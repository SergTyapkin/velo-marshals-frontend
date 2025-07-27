import { ArrayType, validateModel } from '@sergtyapkin/models-validator';

export const UserModel = {
  id: String,
  tgUsername: {
    type: String,
    from: 'tgusername',
    optional: true,
  },
  tgId: {
    type: String,
    from: 'tgid',
  },
  email: {
    type: String,
    from: 'email',
  },
  isConfirmedEmail: {
    type: Boolean,
    from: 'isconfirmedemail',
  },
  tel: {
    type: String,
    from: 'tel',
  },
  avatarUrl: {
    type: String,
    from: 'avatarurl',
    optional: true,
  },
  familyName: {
    type: String,
    from: 'familyname',
  },
  givenName: {
    type: String,
    from: 'givenname',
  },
  middleName: {
    type: String,
    from: 'middlename',
    optional: true,
  },
  joinedDate: {
    type: Date,
    from: 'joineddate',
  },
  level: {
    type: Number,
    from: 'level',
  },
  canEditAchievements: {
    type: Boolean,
    from: 'caneditachievements',
  },
  canAssignAchievements: {
    type: Boolean,
    from: 'canassignachievements',
  },
  canEditRegistrations: {
    type: Boolean,
    from: 'caneditregistrations',
  },
  canEditEvents: {
    type: Boolean,
    from: 'caneditevents',
  },
  canEditUsersData: {
    type: Boolean,
    from: 'caneditusersdata',
  },
  canEditDocs: {
    type: Boolean,
    from: 'caneditdocs',
  },
  canExecuteSQL: {
    type: Boolean,
    from: 'canexecutesql',
  },
  canEditHistory: {
    type: Boolean,
    from: 'canedithistory',
  },
};

export const UserModelMockData = validateModel(UserModel, {
  id: 'USER_ID_1',
  tgusername: 'Tyapkin_s',
  tgid: '213412214',
  email: 'Tuapdke293@mail.ru',
  isconfirmedemail: true,
  tel: '8912314122',
  avatarurl: '/images/0',
  familyname: 'Тяпкин',
  givenname: 'Сергей',
  middlename: 'Сергеевич',
  joineddate: '03-02-2018 14:30',
  level: 2,

  caneditachievements: true,
  canassignachievements: true,
  caneditregistrations: true,
  caneditevents: true,
  caneditusersdata: true,
  caneditdocs: true,
  canexecutesql: true,
  canedithistory: true,
});


// ------------------------------

export const EventModel = {
  id: String,
  title: String,
  description: String,
  routeDescription: {
    type: String,
    from: 'routedescription',
  },
  createdDate: {
    type: Date,
    from: 'createddate',
  },
  startDate: {
    type: Date,
    from: 'startdate',
    optional: true,
  },
  cameDate: {
    type: Date,
    from: 'camedate',
    optional: true,
  },
  previewUrl: {
    type: String,
    from: 'previewurl',
    optional: true,
  },
  customCSS: {
    type: String,
    from: 'customcss',
    optional: true,
  },
  lapDistanceKm: {
    type: Number,
    from: 'lapdistancekm',
  },
  medalPreviewUrl: {
    type: String,
    from: 'medalpreviewurl',
    optional: true,
  },
  authorId: {
    type: String,
    from: 'authorid',
  },
  isYouRegistered: {
    type: Boolean,
    from: 'isyouregistered',
  },
  isYourRegistrationConfirmed: {
    type: Boolean,
    from: 'isyourregistrationconfirmed',
    optional: true,
  },
  yourComment: {
    type: String,
    from: 'yourcomment',
    optional: true,
  },
  registrationsCount: {
    type: Number,
    from: 'registrationscount',
  },
};

export const EventModelMockData = validateModel(EventModel, {
  id: 'EVENT_ID_1',
  title: 'Фестиваль 2025 лето',
  description: '#Большой и классный фестиваль\n_C markdown_ оформлением\n**Где даже** есть немного `кода`\n```js\nconst a = "some str";\n## Ждем вас!```',
  routedescription: '#Большой и классный маршрууууууут!\n_C markdown_ оформлением\n**Где даже** есть немного `кода`\n```js\nconst a = "some str";\n## Ждем вас!```',
  createddate: '2025-07-05',
  startdate: '2025-08-02',
  camedate: '2025-07-28',
  previewurl: 'https://i.pinimg.com/originals/9a/ef/3d/9aef3d832f37f9d8435a0a2e3cde238b.jpg',
  customcss: null,
  lapdistancekm: 21.15,
  medalpreviewurl: 'https://wallpaperbat.com/img/47279-3d-cat-wallpaper.jpg',
  authorid: 'USER_ID_1',
  isyouregistered: false,
  yourcomment: 'Путите пж',
  isyourregistrationconfirmed: null,
  registrationscount: 40,
});

export const EventListModel = {
  events: ArrayType(EventModel),
}

export const EventListModelMockData = {
  events: [
    Object.assign({}, EventModelMockData, {id: 'EVENT_ID_1'}),
    Object.assign({}, EventModelMockData, {id: 'EVENT_ID_2', title: 'Фестиваль 2'}),
    Object.assign({}, EventModelMockData, {id: 'EVENT_ID_3', title: 'Фестиваль 3'}),
  ]
}


// ------------------------------

export const RegistrationModel = {
  id: String,
  userId: {
    type: String,
    from: 'userid',
  },
  eventId: {
    type: String,
    from: 'eventid',
  },
  isConfirmed: {
    type: Boolean,
    from: 'isconfirmed',
    optional: true,
  },
  userComment: {
    type: String,
    from: 'usercomment',
    optional: true,
  },
  adminComment: {
    type: String,
    from: 'admincomment',
    optional: true,
  },
  level: {
    type: Number,
    optional: true,
  },
  salary: {
    type: Number,
    optional: true,
  },
  taskText: {
    type: String,
    from: 'tasktext',
    optional: true,
  },
  cameDate: {
    type: Date,
    from: 'camedate',
    optional: true,
  },
  leaveDate: {
    type: Date,
    from: 'leavedate',
    optional: true,
  },
  lapsPassed: {
    type: Number,
    from: 'lapspassed',
  },
  userName: {
    type: String,
    from: 'username',
  },
  userTel: {
    type: String,
    from: 'usertel',
  },
  userTgUsername: {
    type: String,
    from: 'usertgusername',
    optional: true,
  },
  userAvatarUrl: {
    type: String,
    from: 'useravatarurl',
    optional: true,
  },
};

export const RegistrationModelMockData = validateModel(RegistrationModel, {
  id: 'REG_ID_1',
  userid: 'USER_ID_1',
  eventid: 'EVENT_ID_1',
  isconfirmed: false,
  usercomment: 'Пустите пж',
  admincomment: 'Конч какой-то',
  tasktext: 'Стоит на старте',
  camedate: null,
  leavedate: null,
  level: 2,
  salary: 3000,
  lapspassed: 2.51,
  username: 'Сергей Пилкин',
  usertel: '893428923',
  usertgusername: 'Tyapkin_S',
  useravatarurl: 'https://t.me/i/userpic/320/VAi-EEjunOcTgZG36icSc6982Znc9mfEUNrphVxV4J4.jpg',
});

export const RegistrationListModel = {
  registrations: ArrayType(RegistrationModel),
}

export const RegistrationListModelMockData = {
  registrations: [
    Object.assign({}, RegistrationModelMockData, {id: 'REG_ID_1'}),
    Object.assign({}, RegistrationModelMockData, {id: 'REG_ID_2'}),
    Object.assign({}, RegistrationModelMockData, {id: 'REG_ID_3'}),
  ]
}

