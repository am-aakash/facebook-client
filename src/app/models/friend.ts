export class FriendEntity {
    friendId: string = "";
    category: string = "";
    unfollowed?: boolean;
    blocked?: boolean;
}

export class RequestEntity {
    senderId: string = "";
    recieverId: string = "";
    status: string = "";
    timestampSent: string = "";
    timestampAccepted: string = "";
}