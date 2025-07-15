import { validateModel } from '@sergtyapkin/models-validator';

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
