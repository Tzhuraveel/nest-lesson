export interface ITokenPayload {
  id: string;
  username: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
