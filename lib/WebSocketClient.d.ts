import { EventContainer } from "skydapp-common";
export default class WebSocketClient extends EventContainer {
    private url;
    private webSocket;
    private sendKey;
    connected: boolean;
    constructor(url: string);
    reconnect(): void;
    disconnect(): void;
    private _send;
    send(method: string, ...params: any[]): Promise<any>;
}
//# sourceMappingURL=WebSocketClient.d.ts.map