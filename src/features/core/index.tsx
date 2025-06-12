export const baseUrl = 'gateconfigserver.onrender.com';

export const getLogger: (tag : string) => (...args: any) => void =
        tag  => (...args) => console.log(tag, ...args);

const log = getLogger('api');

export interface IResponseProps<T> {
    data: T;
}

export function withLogs<T>(promise: Promise<IResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`, err);
            return Promise.reject(err);
        });
}

export const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const authConfig = (token?: string) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
});
