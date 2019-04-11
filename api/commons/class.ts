export class DefaultResponse {

  code: number;
  description: string;
  item: any;

  constructor(item?: any, description?: string, code?: number){
    this.code = code || 200;
    this.description = description || 'OK';
    this.item = item || undefined;
  }

}

export class APIError {

  code: number;
  description: string;

  constructor(description?: string, code?: number){
    this.code = code || 500;
    this.description = description || 'Internal Server Error';
  }

}

export class ServerError extends Error{

  status: number;
  description: string;

  constructor(description?: string, status?: number){
    super();
    Error.captureStackTrace(this, this.constructor);
    this.message = description || 'Something went wrong. Please try again.';
    this.description = description || 'Something went wrong. Please try again.';
    this.status = status || 500;
  }

}
