import { ArrayType, validateModel } from '@sergtyapkin/models-validator';

export const UserModel = {
  id: String,
  tgUsername: {
    type: String,
    from: 'tgusername',
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
});


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
  },
  cameDate: {
    type: Date,
    from: 'camedate',
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

