class ServiceError extends Error {
  name: string;
  statusCode: number;

  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export default ServiceError;
