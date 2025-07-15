import REST_API from '@sergtyapkin/rest-api';
import { validateModel, type Model } from '@sergtyapkin/models-validator';
import { UserModel, UserModelMockData } from '~/utils/APIModels';
import { User } from '~/utils/models';

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
  // deleteAnotherSessions = () => this.delete('/user/sessions/another');
  // getAllSessions = () => this.get('/user/sessions/all');

  // getAllUsers = () => this.get(`/user/all`);
  // getUsersBySearch = (search) => this.get(`/user/all`, {search});
  //
  // updateUserAvatarImageId = (userId, avatarUrl) => this.put(`/user`, {userId, avatarUrl});
  //
  // confirmEmailSendMessage = () => this.post(`/user/email/confirm`);
  // confirmEmailByCode = (code) => this.put(`/user/email/confirm`, {code});

  getUser = () => this.#GET(`/user`, {}, UserModel, Response200(UserModelMockData)) as MyResponse<User>;
  // getAnotherUser = (id) => this.#GET(`/user`, {id}, UserModel, Response200(UserModelMockData)) as MyResponse<User>;
  checkUserTgIdExisting = (tgId: string) =>
    this.#GET(`/user`, { tgId }, { id: String }, Response200({ id: 'USER_ID' })) as MyResponse<{ id: string }>;
  updateUser = (userData: User) =>
    this.#PUT(`/user`, userData, UserModel, Response200(UserModelMockData)) as MyResponse<User>;

  signIn = (
    tgId: string, tgUsername: string, tgHash: string, tgAuthDate: string,
    tgPhotoUrl: string, tgFirstName: string, tgLastName: string, clientBrowser: string, clientOS: string,
  ) =>
    this.#POST(
      `/user/auth`,
      {
        tgId, tgUsername, tgHash, tgAuthDate, tgPhotoUrl,
        tgFirstName, tgLastName, clientBrowser, clientOS
      },
      UserModel,
    ) as MyResponse<User>;
  signUp = (
    tgId: string, tgUsername: string, tgHash: string, tgAuthDate: string,
    tgPhotoUrl: string, tgFirstName: string, tgLastName: string, email: string, tel: string,
    avatarUrl: string, familyName: string, givenName: string, middleName: string, clientBrowser: string, clientOS: string,
  ) =>
    this.#POST(
      `/user`,
      {
        tgId, tgUsername, tgHash, tgAuthDate,
        tgPhotoUrl, tgFirstName, tgLastName, email, tel,
        avatarUrl, familyName, givenName, middleName, clientBrowser, clientOS,
      },
      UserModel,
    ) as MyResponse<User>;
  signOut = () => this.#DELETE(`/user/session`) as MyResponse<unknown>;

  // getEvents = (filters: object) => this.get(`/event`, filters); // filters: any of {date, placeId, participantId, type, search}; type = one of ['all', 'past', 'next'];
  // getEventById = (id: string) => this.get(`/event`, {id});
  // createEvent = (name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy) => this.post(`/event`, {name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy});
  // editEvent = (id, name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy) => this.put(`/event`, {id, name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy});
  // deleteEventById = (id) => this.delete(`/event`, {id});
  //
  // registerToEvent = (eventId, userId, positionId, comment) => this.post(`/registration/event`, {eventId, userId, positionId, comment});
  // notRegisterToEvent = (eventId, userId) => this.delete(`/registration/event`, {eventId, userId});
  // updateRegistrationScore = (id, score) => this.put(`/registration/event`, {id, score});
  // updateRegistrationCommentAdmin = (id, comment) => this.put(`/registration/event`, {id, comment});
  // updateRegistrationCommentSelf = (id, comment) => this.put(`/registration/event/comment`, {id, comment});
  // getUnvotedRegistrations = () => this.get(`/registration/unvoted`);
  //
  // getRegistrationRatingWithDates = (dateStart, dateEnd) => this.get(`/ratings`, {dateStart, dateEnd});
  // getRegistrationRating = () => this.get(`/ratings`);
  // getRegistrationsExtract = () => this.get(`/registration/extract`);
  //
  // getDocs = (filters) => this.get(`/docs`, filters); // filters: any of {placeId, positionId, search}
  // getDocById = (id) => this.get(`/docs`, {id});
  // editDoc = (id, title, text, placeId, positionId) => this.put(`/docs`, {id, title, text, placeId, positionId});
  // createDoc = (title, text, placeId, positionId) => this.post(`/docs`, {title, text, placeId, positionId});
  // deleteDoc = (id) => this.delete(`/docs`, {id});
  //
  // getAchievements = () => this.get(`/achievements`);
  // getAchievementById = (id) => this.get(`/achievements`, {id});
  // createAchievement = (name, description, levels, special) => this.post(`/achievements`, {name, description, levels, special});
  // editAchievement = (id, name, description, levels, special) => this.put(`/achievements`, {id, name, description, levels, special});
  // updateAchievementImage = (id, imageId) => this.put(`/achievements`, {id, imageId});
  // deleteAchievement = (id) => this.delete(`/achievements`, {id});
  //
  // getUserAchievements = (userId) => this.get(`/achievements/user`, {userId});
  // addUserAchievement = (userId, achievementId, level) => this.post(`/achievements/user`, {userId, achievementId, level});
  // editUserAchievement = (id, userId, achievementId, level) => this.put(`/achievements/user`, {id, userId, achievementId, level});
  // deleteUserAchievement = (id) => this.delete(`/achievements/user`, {id});
  //
  // uploadImage = (dataUrl) => this.post(`/image`, {dataUrl});
  // deleteImage = (imageId) => this.delete(`/image`, {imageId});
  //
  // executeSql = (sql) => this.post(`/sql`, {sql});
  // getSqlHistory = () => this.get(`/sql/history`);
}
