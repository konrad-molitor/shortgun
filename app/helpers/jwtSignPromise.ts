import jwt from "jsonwebtoken";

const jwtSignPromise = (payload: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, "supersecret", { algorithm: "HS256"}, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export default jwtSignPromise;
