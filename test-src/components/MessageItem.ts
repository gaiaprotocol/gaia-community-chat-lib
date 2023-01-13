import { DomNode, el } from "skydapp-browser";
import ChatUser from "../ChatUser.js";

export default class MessageItem extends DomNode {

    constructor(user: ChatUser, message: string) {
        super(".message-item");
        this.append(
            el("img.profile-image", { src: user.profileImage }),
            el("span.name", user.name),
            el("span.message", message),
        );
    }
}
