import ApiError from '../errorConstructor';

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    next(res);
  } else {
    throw new ApiError(401, "Unauthorized")
  }
}
