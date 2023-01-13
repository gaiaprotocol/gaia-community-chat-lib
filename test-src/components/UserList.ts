import { DomNode, el } from "skydapp-browser";
import ChatUser from "../ChatUser.js";
import UserItem from "./UserItem.js";

export default class UserList extends DomNode {

    private _users: ChatUser[] = [];
    private userContainer: DomNode;

    constructor() {
        super(".user-list");
        this.append(
            el("a.close-button", el("i.fa-solid.fa-xmark"), { click: () => this.deleteClass("show") }),
            this.userContainer = el(".user-container"),
        );
    }

    public set users(users: ChatUser[]) {
        this._users = users;
        this.userContainer.empty();
        for (const user of users) {
            this.userContainer.append(new UserItem(user));
        }
    }

    public getUser(user: string) {
        return this._users.find((u) => u.id === user);
    }
}
