import { UserDto } from "./user";

export interface ResponseDto<T> {
    userData:UserDto;
    message: string;
    isSuccessed: boolean;
    data: T| null;
}
