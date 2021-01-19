


export interface IPhoto {
  path: string
};

export interface IPhotographer {
  name: string,
  birth: {
    day: number,
    month: number, 
    year: number
  },
  country: string,
  style: String[],
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
  contacts: string[],
  password: string
}

export interface IPost {
  photos: String[],
  tags: String[],
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