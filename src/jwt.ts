import jwt from 'jsonwebtoken';

export function verifyJWT(param: {
  token: string;
  secretKey: string;
  algorithm?: jwt.Algorithm[];
}): any {
  const options: any = {};
  if (param.algorithm) options.algorithms = param.algorithm;

  return jwt.verify(param.token, param.secretKey, options);
}

export function generateJWt(
  payload: Record<string, unknown>,
  options: {
    secretKey: string;
    expiresIn?: string | number;
    algorithm?: jwt.Algorithm;
  }
): string {
  const _options: any = {};
  if (options.expiresIn) _options.expiresIn = options.expiresIn;
  if (options.algorithm) _options.algorithm = options.algorithm;

  return jwt.sign(payload, options.secretKey, _options);
}
