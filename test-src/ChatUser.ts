export default interface ChatUser {
    id?: string,
    chatRoomId: string,
    name: string;
    profileImage: string | undefined;
    url?: string;
    createTime?: number,
}
