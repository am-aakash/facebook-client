import { Profile } from "./profile";

export class Post {
    postId: string = "";
    userId: string = "";
    content: string = "";
    mediaType: string = "";

    mediaUrl: string = "";
    timestamp: string = "";

    dateTime: Date = new Date();
    user?: Profile;
    likes: number = 0;
    isLiked: boolean = false;
}