import { DomNode, el } from "skydapp-browser";
import ChatUser from "../ChatUser.js";
import MessageItem from "./MessageItem.js";

export default class MessageList extends DomNode {

    private itemContainer: DomNode;
    private input: DomNode<HTMLInputElement>;

    constructor(user: ChatUser, sendMessage: (message: string) => Promise<void>) {
        super(".message-list");
        this.append(
            this.itemContainer = el(".message-item-container"),
            el("form.message-form",
                this.input = el("input", { placeholder: "메시지 입력", autocomplete: "off" }),
                {
                    submit: async (event) => {
                        event.preventDefault();
                        const message = this.input.domElement.value;
                        this.input.domElement.value = "";
                        this.addMessage(user, message);
                        await sendMessage(message);
                    },
                }
            ),
        );
    }

    private scrollToBottom() {
        this.itemContainer.domElement.scrollTop = 999999;
    }

    public set data(data: { writer: ChatUser, message: string }[]) {
        this.itemContainer.empty();
        for (const d of data) {
            this.itemContainer.append(new MessageItem(d.writer, d.message));
        }
        this.scrollToBottom();
    }

    public addMessage(writer: ChatUser, message: string) {
        this.itemContainer.append(new MessageItem(writer, message));
        this.scrollToBottom();
    }

    public focusInput() {
        this.input.domElement.focus();
    }
}
