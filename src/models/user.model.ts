export interface User {
    id?: string,
    login: string,
    firstName: string,
    lastName: string,
    email: string,
    imageUrl?: string,
    activated?: boolean,
    langKey?: string,
    createdBy?: string,
    createdDate?: string,
    lastModifiedBy?: string,
    lastModifiedDate?: string,
    authorities: string[]
}