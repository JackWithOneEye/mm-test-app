
interface AppPaths {
  readonly [key: string]: string;
}

export const APP_PATHS: AppPaths = {
  home: '/home',
  login: '/login'
};

export type AuthRequestBody = Pick<UserDBEntry, 'eMail' | 'password'>;

export interface AuthResponse {
  status: number;
  userData?: UserData;
}

export interface UserData {
  readonly eMail: string;
  readonly firstName: string;
  readonly image: string;
  readonly lastName: string;
}

export interface UserDBEntry extends UserData {
  readonly password: string;
}

export const extractUserDataFromDBEntry = (entry: UserDBEntry): UserData => {
  return {
    eMail: entry.eMail,
    firstName: entry.firstName,
    image: entry.image,
    lastName: entry.lastName
  };
};

export const MOCK_USER_DB: UserDBEntry[] = [
  {
    eMail: 'he@stadt-kassel.de',
    firstName: 'Hans',
    image: 'https://www.kassel.de/rathausundpolitik/alle-oberbuergermeister-kassels/Hans_Eichel_1980.jpg.scaled/a066810a6a9db550885c375caedef60f.jpg',
    lastName: 'Eichel',
    password: '?!FinanzMinister123'
  },
  {
    eMail: 'jg@stadt-kassel.de',
    firstName: 'Jacob',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Jacob_Grimm.jpg',
    lastName: 'Grimm',
    password: '1000DeutscheMark'
  },
  {
    eMail: 'wg@stadt-kassel.de',
    firstName: 'Wilhelm',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Wilhelm_Grimm_Friedlaender.png',
    lastName: 'Grimm',
    password: 'HierKommtDerWilli!'
  }
];