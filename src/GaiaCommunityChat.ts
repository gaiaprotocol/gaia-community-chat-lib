import { EventContainer } from "skydapp-common";
import ChatMessage from "./ChatMessage.js";
import ChatUser from "./ChatUser.js";
import WebSocketClient from "./WebSocketClient.js";

class GaiaCommunityChat extends EventContainer {

    public client!: WebSocketClient;
    public get connected() {
        return this.client.connected;
    }

    public connect() {
        this.client = new WebSocketClient("wss://backend.gaiaprotocol.com?key=community-chat");

        this.client.on("connect", () => {
            console.log("connected to gaia protocol server.");
            this.fireEvent("connect");
        });

        this.client.on("disconnect", () => {
            console.log("disconnected from gaia protocol server.");
            this.fireEvent("disconnect");
            setTimeout(() => {
                // 접속이 끊어지면 자동으로 재접속
                this.client.reconnect();
            }, 1000);
        });

        this.client.on("realtime/message", (chatRoomId: string, token: string, messageId: string, message: string) => this.fireEvent(`${chatRoomId}/message`, token, messageId, message));
        this.client.on("realtime/users", async (chatRoomId: string) => this.fireEvent(`${chatRoomId}/users`, await this.loadUsers(chatRoomId)));
    }

    public async enter(chatRoomId: string, token?: string): Promise<{ messages: ChatMessage[], users: string[] }> {
        return await this.client.send("community/chat/enter-room", chatRoomId, token);
    }

    public async setUser(chatRoomId: string, token: string): Promise<void> {
        return await this.client.send("community/chat/set-user", chatRoomId, token);
    }

    public async loadUsers(chatRoomId: string): Promise<ChatUser[]> {
        return await this.client.send("community/chat/users", chatRoomId);
    }

    public async loadUser(chatRoomId: string, user: string): Promise<ChatUser | undefined> {
        return await this.client.send("community/chat/user", chatRoomId, user);
    }

    public async sendMessage(room: string, message: string) {
        await this.client.send(`realtime/${room}/message`, message);
    }
}

export default new GaiaCommunityChat();
