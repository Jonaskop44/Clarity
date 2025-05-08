export type AuthJwtPayload = {
  id: string;
  sub: {
    username: string;
    email: string;
  };
  iat?: number;
  exp?: number;
};
