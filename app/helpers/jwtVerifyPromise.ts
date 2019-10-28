import jwt from "jsonwebtoken";

const jwtVerifyPromise = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "supersecret", { algorithms: ["HS256"] }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export default jwtVerifyPromise;
