export default interface ChatUser {
    chatRoomId: string,
    name: string;
    profileImage: string | undefined;
    url?: string;
    createTime: number,
}
