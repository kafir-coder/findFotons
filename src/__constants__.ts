


export interface IPhoto {
  path: string
};

export interface IPhotographer {
  id: string,
  name: string,
  birth: {
    day: number,
    month: number, 
    year: number
  },
  contact: String,
  password: String,
  country: string,
  styles: String,
  user_photo_url: string,
  employed: boolean,
  employer: string
}

export interface IReacter {
  name: string,
  birth: {
    day: number,
    month: number, 
    year: number
  },
  contacts: string[],
  password: string,
  country: string
}

export interface IAgency {
  name: string,
  location: string,
  contacts: string
  styles: string[],
  password: string
}

export interface ILogin {
  contact: string,
  password: string,
  role: string
}
export interface IPost {
  photos: String[],
  tags: String[],
  owner: String,
  description: string
}

export interface IReactions {
  reactersId: String[]
}

export interface IFollowers {
    followersId: String[]
}

export interface IFollowing {
  followingsId: String[]
}

export interface ITrending {
  followingsId: String[]
}

export const httpReponseMessages = {
  FILE_NOT_FOUND_404: 'Resource doesn\'t exists',
  SERVER_ERROR_500: 'Sorry, Our fault!!',
  ANAUTHORIZED_401: 'Your anauthorized',
  SUCESS_200: 'The request was succeed',
  SUCESS_201: 'The resource was created with success',
};