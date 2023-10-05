import {StatusCodes} from 'http-status-codes';

export class RouteError extends Error {
  public status: StatusCodes;

  public constructor(status: StatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}
