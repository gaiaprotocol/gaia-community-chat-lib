import ChatUser from "./ChatUser.js";
export default interface ChatMessage {
    room: string;
    writer: ChatUser;
    message: string;
    deleted?: boolean;
}
//# sourceMappingURL=ChatMessage.d.ts.map