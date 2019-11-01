import jwt from "jsonwebtoken";

const jwtVerifyPromise = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    jwt.verify(token, process.env.SECRET_KEY, { algorithms: ["HS256"] }, (err: Error, decoded?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export default jwtVerifyPromise;
