import { EventContainer } from "skydapp-common";
export default class WebSocketClient extends EventContainer {
    url;
    webSocket;
    sendKey = 0;
    connected = false;
    constructor(url) {
        super();
        this.url = url;
        this.reconnect();
    }
    reconnect() {
        this.webSocket = new WebSocket(this.url);
        this.webSocket.onopen = () => {
            this.connected = true;
            this.fireEvent("connect");
        };
        this.webSocket.onmessage = async (e) => {
            const data = JSON.parse(e.data, (k, array) => {
                if (Array.isArray(array) === true) {
                    for (const [index, v] of array.entries()) {
                        if (v === null) {
                            array[index] = undefined;
                        }
                    }
                }
                return array;
            });
            try {
                const results = await this.fireEvent(data.method, ...data.params);
                if (data.__send_key !== undefined) {
                    if (results.length === 0) {
                        console.error("메소드를 찾을 수 없음", data);
                        this._send({ method: `__error_${data.__send_key}`, params: ["메소드를 찾을 수 없음"] });
                    }
                    else {
                        for (const result of results) {
                            this._send({ method: `__callback_${data.__send_key}`, params: [result] });
                        }
                    }
                }
            }
            catch (error) {
                if (data.__send_key !== undefined) {
                    this._send({ method: `__error_${data.__send_key}`, params: [error.toString()] });
                }
                else {
                    console.error(error);
                }
            }
        };
        this.webSocket.onclose = () => {
            this.connected = false;
            this.fireEvent("disconnect");
        };
    }
    disconnect() {
        this.webSocket.close();
    }
    _send(data) {
        this.webSocket.send(JSON.stringify(data));
    }
    async send(method, ...params) {
        this._send({ method, params, __send_key: this.sendKey });
        const callbackName = `__callback_${this.sendKey}`;
        const errorkName = `__error_${this.sendKey}`;
        this.sendKey += 1;
        return new Promise((resolve, reject) => {
            this.on(callbackName, resolve);
            this.on(errorkName, (errorMessage) => {
                console.error(`${method}(${params.join(", ")}) ${errorMessage}`);
                reject(new Error(errorMessage));
            });
        });
    }
}
//# sourceMappingURL=WebSocketClient.js.map