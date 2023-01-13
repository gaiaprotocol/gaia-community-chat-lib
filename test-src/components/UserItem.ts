import { DomNode, el } from "skydapp-browser";
import ChatUser from "../ChatUser.js";

export default class UserItem extends DomNode {

    constructor(user: ChatUser) {
        super(".user-item");
        this.append(
            el("img.profile-image", { src: user.profileImage }),
            el("span.name", user.name),
        );
    }
}
