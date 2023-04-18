export interface ITokenPayload {
  id: number;
  username: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
