export class ServiceNotAvailableError extends Error {
    constructor() {
        super('Service not available');
        this.name = 'ServiceNotAvailable';
    }
}
