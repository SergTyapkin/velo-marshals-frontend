import REST_API from '@sergtyapkin/rest-api';
import { validateModel, type Model } from '@sergtyapkin/models-validator';
import {
  EventListModel,
  EventListModelMockData,
  EventModel,
  EventModelMockData,
  RegistrationListModel,
  RegistrationListModelMockData,
  SQLHistoryListModel, SQLHistoryListModelMockData,
  UserModel,
  UserModelMockData,
} from '~/utils/APIModels';
import { User, Event, Registration, SQLHistory } from '~/utils/models';

type RequestFunc = (url: string, data?: object) => Promise<{ data: object; status: number; ok: boolean }>;
type MyResponse<T> = Promise<{ data: T; status: number; ok: boolean }> | { data: T; status: number; ok: boolean };

const Response200 = (data: any) => ({
  status: 200,
  ok: true,
  data: data,
});

export default class API extends REST_API {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  async modelParsedRequest(
    requestFunc: RequestFunc,
    path: string,
    data = {},
    model?: Model,
    mockData?: MyResponse<object>,
  ): Promise<{ ok: boolean; data: object; status: number }> {
    if (mockData && import.meta.env.MODE !== 'production') {
      console.info(`Request mocked: ${requestFunc.name}, ${path},`, mockData);
      return mockData;
    }

    data = Object.assign({}, data);
    const { ok, data: dataRes, status } = await requestFunc.bind(this)(path, data);
    if (!ok) {
      return { ok, data: dataRes as object, status };
    }

    if (!model) {
      return { ok, data: dataRes, status };
    }
    return { ok, data: validateModel(model, dataRes), status };
  }

  #POST(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.post, path, data, model, mockData);
  }

  #GET(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.get, path, data, model, mockData);
  }

  #PUT(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.put, path, data, model, mockData);
  }

  #DELETE(path: string, data = {}, model?: Model, mockData?: MyResponse<object>) {
    return this.modelParsedRequest(super.delete, path, data, model, mockData);
  }

  // Api configuration
  // User
  // deleteAnotherSessions = () => this.#DELETE'/user/sessions/another');
  // getAllSessions = () => this.#GET'/user/sessions/all');

  // getAllUsers = () => this.#GET(`/user/all`);
  // getUsersBySearch = (search) => this.#GET(`/user/all`, {search});
  //
  // updateUserAvatarImageId = (userId, avatarUrl) => this.#PUT(`/user`, {userId, avatarUrl});
  //
  // confirmEmailSendMessage = () => this.#POST(`/user/email/confirm`);
  // confirmEmailByCode = (code) => this.#PUT(`/user/email/confirm`, {code});

  getUser = () => this.#GET(`/user`, {}, UserModel, Response200(UserModelMockData)) as MyResponse<User>;
  // getAnotherUser = (id) => this.#GET(`/user`, {id}, UserModel, Response200(UserModelMockData)) as MyResponse<User>;
  checkUserTgExisting = (tgUsername: string, tgId: string) =>
    this.#GET(`/user`, { tgUsername, tgId }, { id: String }, Response200({ id: 'USER_ID' })) as MyResponse<{
      id: string;
    }>;
  updateUser = (userData: User) =>
    this.#PUT(`/user`, userData, UserModel, Response200(UserModelMockData)) as MyResponse<User>;

  signIn = (
    tgId: string,
    tgUsername: string,
    tgHash: string,
    tgAuthDate: string,
    tgPhotoUrl: string,
    tgFirstName: string,
    tgLastName: string,
    clientBrowser: string,
    clientOS: string,
  ) =>
    this.#POST(
      `/user/auth`,
      {
        tgId,
        tgUsername,
        tgHash,
        tgAuthDate,
        tgPhotoUrl,
        tgFirstName,
        tgLastName,
        clientBrowser,
        clientOS,
      },
      {},
    ) as MyResponse<unknown>;
  signInByCode = (code: string, clientBrowser: string, clientOS: string) =>
    this.#POST(
      `/user/auth/code`,
      {code, clientBrowser, clientOS},
      {},
    ) as MyResponse<unknown>;
  signUp = (
    tgId: string,
    tgUsername: string,
    tgHash: string,
    tgAuthDate: string,
    tgPhotoUrl: string,
    tgFirstName: string,
    tgLastName: string,
    email: string,
    tel: string,
    avatarUrl: string,
    familyName: string,
    givenName: string,
    middleName: string,
    clientBrowser: string,
    clientOS: string,
  ) =>
    this.#POST(
      `/user`,
      {
        tgId,
        tgUsername,
        tgHash,
        tgAuthDate,
        tgPhotoUrl,
        tgFirstName,
        tgLastName,
        email,
        tel,
        avatarUrl,
        familyName,
        givenName,
        middleName,
        clientBrowser,
        clientOS,
      },
      UserModel,
    ) as MyResponse<User>;
  signOut = () => this.#DELETE(`/user/session`) as MyResponse<unknown>;

  getEvents = (filters?: {
    dateStart?: Date;
    dateEnd?: Date;
    search?: string;
    registrationId?: string;
    type?: 'future' | 'past' | 'all';
  }) =>
    this.#GET(`/event`, filters, EventListModel, Response200(EventListModelMockData)) as MyResponse<{
      events: Event[];
    }>;
  getEventById = (id: string) =>
    this.#GET(`/event`, { id }, EventModel, Response200(EventModelMockData)) as MyResponse<Event>;
  // createEvent = (name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy) => this.#POST(`/event`, {name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy});
  // editEvent = (id, name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy) => this.#PUT(`/event`, {id, name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy});
  // deleteEventById = (id) => this.#DELETE(`/event`, {id});

  registerToEvent = (eventId: string, userId: string, userComment: string) =>
    this.#POST(`/registration/event`, { eventId, userId, userComment }, {}, Response200({})) as MyResponse<unknown>;
  unregisterToEvent = (eventId: string, userId: string) =>
    this.#DELETE(`/registration/event`, { eventId, userId }, {}, Response200({})) as MyResponse<unknown>;
  // updateRegistrationScore = (id, score) => this.#PUT(`/registration/event`, {id, score});
  // updateRegistrationCommentAdmin = (id, comment) => this.#PUT(`/registration/event`, {id, comment});
  // updateRegistrationCommentSelf = (id, comment) => this.#PUT(`/registration/event/comment`, {id, comment});

  getRegistrations = (eventId: string) =>
    this.#GET(
      `/registration/event`,
      { eventId },
      RegistrationListModel,
      Response200(RegistrationListModelMockData),
    ) as MyResponse<{
      registrations: Registration[];
    }>;
  updateRegistration = (registration: Registration) =>
    this.#PUT(`/registration`, registration, {}, Response200({})) as MyResponse<unknown>;
  // getRegistrationRatingWithDates = (dateStart, dateEnd) => this.#GET(`/ratings`, {dateStart, dateEnd});
  // getRegistrationRating = () => this.#GET(`/ratings`);
  // getRegistrationsExtract = () => this.#GET(`/registration/extract`);
  //
  // getDocs = (filters) => this.#GET(`/docs`, filters); // filters: any of {placeId, positionId, search}
  // getDocById = (id) => this.#GET(`/docs`, {id});
  // editDoc = (id, title, text, placeId, positionId) => this.#PUT(`/docs`, {id, title, text, placeId, positionId});
  // createDoc = (title, text, placeId, positionId) => this.#POST(`/docs`, {title, text, placeId, positionId});
  // deleteDoc = (id) => this.#DELETE(`/docs`, {id});
  //
  // getAchievements = () => this.#GET(`/achievements`);
  // getAchievementById = (id) => this.#GET(`/achievements`, {id});
  // createAchievement = (name, description, levels, special) => this.#POST(`/achievements`, {name, description, levels, special});
  // editAchievement = (id, name, description, levels, special) => this.#PUT(`/achievements`, {id, name, description, levels, special});
  // updateAchievementImage = (id, imageId) => this.#PUT(`/achievements`, {id, imageId});
  // deleteAchievement = (id) => this.#DELETE(`/achievements`, {id});
  //
  // getUserAchievements = (userId) => this.#GET(`/achievements/user`, {userId});
  // addUserAchievement = (userId, achievementId, level) => this.#POST(`/achievements/user`, {userId, achievementId, level});
  // editUserAchievement = (id, userId, achievementId, level) => this.#PUT(`/achievements/user`, {id, userId, achievementId, level});
  // deleteUserAchievement = (id) => this.#DELETE(`/achievements/user`, {id});
  //
  // uploadImage = (dataUrl) => this.#POST(`/image`, {dataUrl});
  // deleteImage = (imageId) => this.#DELETE(`/image`, {imageId});

  executeAdminSql = (sql: string) => this.#POST(`/sql`, { sql });
  getSQLHistory = (filters: {limit?: number} = {}) =>
    this.#GET(`/sql/history`, filters, SQLHistoryListModel, Response200(SQLHistoryListModelMockData)) as MyResponse<{
      history: SQLHistory[];
    }>;
}
