import { RES_STATUS } from './server-response.interface';

export function checkServerErrors<T>(response) {
  if (response.status === RES_STATUS.ERROR) {
    throw new Error(response.message)
  } else if (response.status === RES_STATUS.SUCCESS) return response;
  else throw new Error(response.message)
}

