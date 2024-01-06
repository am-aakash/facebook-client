export class Profile {
    userId: string = "";
    username: string = "";
    firstName: string = "";
    lastName: string = "";
    emailId: string = "";
    dateOfBirth: string = "";
    gender: string = "";
    createdAt: string = "";
    profileImage?: ArrayBuffer;
    coverImage?: ArrayBuffer;
    bio?: String;
    city?: String;
    country?: String;
    designation?: String;
    company?: String;
    updatedAt?: String;

    friends: number = 0;
    isFriend: boolean = false;
    requestSent: boolean = false;
    requestRecieved: boolean = false;
}