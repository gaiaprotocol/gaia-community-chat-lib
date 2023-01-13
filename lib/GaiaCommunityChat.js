import { EventContainer } from "skydapp-common";
import WebSocketClient from "./WebSocketClient.js";
class GaiaCommunityChat extends EventContainer {
    client;
    get connected() {
        return this.client.connected;
    }
    connect() {
        this.client = new WebSocketClient("wss://backend.gaiaprotocol.com?key=community-chat");
        this.client.on("connect", () => {
            console.log("connected to gaia protocol server.");
            this.fireEvent("connect");
        });
        this.client.on("disconnect", () => {
            console.log("disconnected from gaia protocol server.");
            this.fireEvent("disconnect");
            setTimeout(() => {
                this.client.reconnect();
            }, 1000);
        });
        this.client.on("realtime/message", (chatRoomId, token, messageId, message) => this.fireEvent(`${chatRoomId}/message`, token, messageId, message));
        this.client.on("realtime/users", async (chatRoomId) => this.fireEvent(`${chatRoomId}/users`, await this.loadUsers(chatRoomId)));
    }
    async enter(chatRoomId, token) {
        return await this.client.send("community/chat/enter-room", chatRoomId, token);
    }
    async loadUsers(chatRoomId) {
        return await this.client.send("community/chat/users", chatRoomId);
    }
    async loadUser(chatRoomId, user) {
        return await this.client.send("community/chat/user", chatRoomId, user);
    }
    async sendMessage(room, message) {
        await this.client.send(`realtime/${room}/message`, message);
    }
}
export default new GaiaCommunityChat();
//# sourceMappingURL=GaiaCommunityChat.js.map