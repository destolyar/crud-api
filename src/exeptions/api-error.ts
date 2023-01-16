class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface ErrorInterface {
  status: number,
  message: string
}

export default ApiError
