import { EventContainer } from "skydapp-common";
import ChatMessage from "./ChatMessage.js";
import ChatUser from "./ChatUser.js";
import WebSocketClient from "./WebSocketClient.js";
declare class GaiaCommunityChat extends EventContainer {
    client: WebSocketClient;
    get connected(): boolean;
    connect(): void;
    enter(chatRoomId: string, token?: string): Promise<{
        messages: ChatMessage[];
        users: string[];
    }>;
    loadUsers(chatRoomId: string): Promise<ChatUser[]>;
    loadUser(chatRoomId: string, user: string): Promise<ChatUser | undefined>;
    sendMessage(room: string, message: string): Promise<void>;
}
declare const _default: GaiaCommunityChat;
export default _default;
//# sourceMappingURL=GaiaCommunityChat.d.ts.map