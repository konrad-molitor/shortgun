import jwt from "jsonwebtoken";

const jwtSignPromise = (payload: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    jwt.sign(payload, process.env.SECRET_KEY, { algorithm: "HS256"}, (err: Error, token?: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export default jwtSignPromise;
