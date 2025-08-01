import { ArrayType, validateModel } from '@sergtyapkin/models-validator';
import { deepClone } from '~/utils/utils';

// ------------------------------

export const EventModel = {
  id: String,
  title: String,
  description: String,
  fullDescription: {
    type: String,
    from: 'fulldescription',
  },
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
  isRegistrationOpened: {
    type: Boolean,
    from: 'isregistrationopened',
  },
  authorId: {
    type: String,
    from: 'authorid',
    optional: true,
  },
  isYouRegistered: {
    type: Boolean,
    from: 'isyouregistered',
    optional: true,
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
    optional: true,
  },
};

export const EventModelMockData = validateModel(EventModel, {
  id: 'EVENT_ID_1',
  title: 'Фестиваль 2025 лето',
  description: '#Большой и классный фестиваль\n_C markdown_ оформлением\n**Где даже** есть немного `кода`\n```js\nconst a = "some str";\n## Ждем вас!```',
  fulldescription: '#Большой и классный маршрууууууут!\n_C markdown_ оформлением\n**Где даже** есть немного `кода`\n```js\nconst a = "some str";\n## Ждем вас!```',
  routedescription: '#Большой и классный маршрууууууут!\n_C markdown_ оформлением\n**Где даже** есть немного `кода`\n```js\nconst a = "some str";\n## Ждем вас!```',
  createddate: '2025-07-05',
  startdate: '2025-08-02',
  camedate: '2025-07-28',
  previewurl: 'https://i.pinimg.com/originals/9a/ef/3d/9aef3d832f37f9d8435a0a2e3cde238b.jpg',
  customcss: null,
  lapdistancekm: 21.15,
  medalpreviewurl: 'https://wallpaperbat.com/img/47279-3d-cat-wallpaper.jpg',
  authorid: 'USER_ID_1',
  isregistrationopened: true,
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
    optional: true,
  },
  isConfirmedEmail: {
    type: Boolean,
    from: 'isconfirmedemail',
  },
  tel: {
    type: String,
    from: 'tel',
    optional: true,
  },
  avatarUrl: {
    type: String,
    from: 'avatarurl',
    optional: true,
  },
  familyName: {
    type: String,
    from: 'familyname',
    optional: true,
  },
  givenName: {
    type: String,
    from: 'givenname',
    optional: true,
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
    type: String,
    from: 'level',
  },
  completedEvents: {
    type: Array,
    item: {
      type: Object,
      fields: EventModel,
    },
    from: 'completedevents',
    optional: true,
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
  canEditGlobals: {
    type: Boolean,
    from: 'caneditglobals',
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
  completedevents: [],

  caneditachievements: true,
  canassignachievements: true,
  caneditregistrations: true,
  caneditevents: true,
  caneditusersdata: true,
  caneditdocs: true,
  canexecutesql: true,
  canedithistory: true,
  caneditglobals: true,
});



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
  userFamilyName: {
    type: String,
    from: 'userfamilyname',
    optional: true,
  },
  userGivenName: {
    type: String,
    from: 'usergivenname',
    optional: true,
  },
  userMiddleName: {
    type: String,
    from: 'usermiddlename',
    optional: true,
  },
  userTel: {
    type: String,
    from: 'usertel',
    optional: true,
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
  userLevel: {
    type: String,
    from: 'userlevel',
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
  camedate: new Date(),
  leavedate: new Date(),
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


// ------------------------------

export const SQLHistoryModel = {
  id: String,
  date: Date,
  text: String,
  userId: {
    type: String,
    from: 'userid',
  },
};

export const SQLHistoryModelMockData = validateModel(SQLHistoryModel, {
  id: 'HISTORY_ID_1',
  userid: 'USER_ID_1',
  date: '2025-07-29',
  text: 'SELECT * FROM users',
});
export const SQLHistoryListModel = {
  history: ArrayType(SQLHistoryModel),
}
export const SQLHistoryListModelMockData = {
  history: [
    Object.assign({}, SQLHistoryModelMockData, {id: 'HISTORY_ID_1', text: 'SELECT * FROM users'}),
    Object.assign({}, SQLHistoryModelMockData, {id: 'HISTORY_ID_2', text: 'SELECT * FROM events'}),
    Object.assign({}, SQLHistoryModelMockData, {id: 'HISTORY_ID_3', text: 'SELECT * FROM registrations'}),
  ]
}


// ------------------------------

export const GlobalsModel = {
  globalEvent: {
    type: Object,
    fields: EventModel,
    from: 'globalevent',
    optional: true,
  },
  globalRegistration: {
    type: Object,
    fields: RegistrationModel,
    from: 'globalregistration',
    optional: true,
  },
  isOnMaintenance: {
    type: Boolean,
    from: 'isonmaintenance',
  },
};

export const GlobalsModelMockData = {
  globalEvent: EventModelMockData,
  globalRegistration: RegistrationModelMockData,
  isOnMaintenance: false,
};


// ------------------------------

export const EquipmentGroupModel = {
  id: {
    type: String,
    optional: true,
  },
  title: String,
  description: {
    type: String,
    optional: true,
  },
  previewUrl: {
    type: String,
    optional: true,
    from: 'previewurl',
  },
  amountLeft: {
    type: Number,
    from: 'amountleft',
    optional: true,
  },
  amountTotal: {
    type: Number,
    from: 'amounttotal',
    optional: true,
  },
  isNeedsToReturn: {
    type: Boolean,
    from: 'isneedstoreturn',
  },
};

export const EquipmentGroupModelMockData = validateModel(EquipmentGroupModel, {
  id: 'EQUIPMENT_ID_1',
  title: 'Аптечка',
  description: 'Помогает при ранениях',
  amountleft: 32,
  amounttotal: 57,
  isneedstoreturn: true,
});
export const EquipmentGroupListModel = {
  equipmentGroups: ArrayType(EquipmentGroupModel),
}
export const EquipmentGroupListModelMockData = {
  equipmentGroups: [
    Object.assign({}, EquipmentGroupModelMockData, {title: 'Аптечка'}),
    Object.assign({}, EquipmentGroupModelMockData, {title: 'Рация'}),
    Object.assign({}, EquipmentGroupModelMockData, {title: 'Свисток', isNeedsToReturn: false}),
  ]
}

export const EquipmentModel = Object.assign(
  deepClone(EquipmentGroupModel),
  {
    id: {
      type: String,
      optional: false,
    },
    amountHolds: {
      type: Number,
      from: 'amountholds',
      optional: true,
    },
    takenDate: {
      type: Date,
      from: 'takendate',
      optional: true,
    },
    updatedDate: {
      type: Date,
      from: 'updateddate',
      optional: true,
    },
  }
);
export const EquipmentModelMockData = Object.assign(
  deepClone(EquipmentGroupModelMockData),
  {
    id: 'EQUIPMENT_ID_1',
    amountHolds: 3,
    takenDate: new Date(),
    updatedDate: new Date(),
  },
);
export const EquipmentListModel = {
  equipment: ArrayType(EquipmentModel),
}
export const EquipmentListModelMockData = {
  equipment: [
    Object.assign({}, EquipmentModelMockData, {id: 'EQUIPMENT_ID_1', title: 'Аптечка'}),
    Object.assign({}, EquipmentModelMockData, {id: 'EQUIPMENT_ID_2', title: 'Рация'}),
    Object.assign({}, EquipmentModelMockData, {id: 'EQUIPMENT_ID_3', title: 'Свисток', isNeedsToReturn: false}),
  ]
}
