import { BodyNode, DomNode, el } from "skydapp-browser";
import { SkyUtil, View } from "skydapp-common";
import ChatUser from "../ChatUser.js";
import MessageList from "../components/MessageList.js";
import UserList from "../components/UserList.js";
import names from "./names.json" assert { type: "json" };

const win = (window as any);

export default class TestChat extends View {

    private user: ChatUser = {
        chatRoomId: "test",
        name: names[SkyUtil.random(0, names.length - 1)],
        profileImage: `https://noun.pics/${SkyUtil.random(0, 575)}.svg`,
    };

    private container: DomNode;
    private messageList: MessageList;
    private userList: UserList;

    constructor() {
        super();
        BodyNode.append(this.container = el(".test-chat-view",
            el(".chat-room",
                el("header",
                    el("h1", "Test Chat"),
                    el("a.user-list-button", "Users", {
                        click: () => {
                            if (this.userList.checkClass("show") !== true) {
                                this.userList.addClass("show");
                            } else {
                                this.userList.deleteClass("show");
                            }
                        },
                    }),
                ),
                this.messageList = new MessageList(this.user, async (message: string) => {
                    await win.GaiaCommunityChat.sendMessage("test", message);
                }),
            ),
            this.userList = new UserList(),
        ));

        win.GaiaCommunityChat.on("connect", this.enter);
        win.GaiaCommunityChat.on("test/message", this.messageHandler);
        win.GaiaCommunityChat.on("test/users", this.usersHandler);

        if (win.GaiaCommunityChat.connected) {
            this.enter();
        }
    }

    private enter = async () => {

        // 토큰을 가져오는 부분은 서버사이드에서 실행해야 합니다. Readme.md를 참고하세요.
        const result = await fetch(`https://windy-salmon-83.deno.dev?${new URLSearchParams({
            name: this.user.name,
            profileImage: this.user.profileImage!,
        })}`);
        const token = await result.text();

        const initData = await win.GaiaCommunityChat.enter("test", token);
        this.userList.users = initData.users;

        const data: { writer: ChatUser, message: string }[] = [];
        for (const message of initData.messages) {
            data.push({ writer: message.writer, message: message.message });
        }

        this.messageList.data = data;
        this.messageList.focusInput();
    };

    private messageHandler = async (writer: string, messageId: string, message: string) => {
        const user = this.userList.getUser(writer);
        // or
        //const user = await win.GaiaCommunityChat.loadUser("test", writer);
        if (user !== undefined) {
            this.messageList.addMessage(user, message);
        }
    };

    private usersHandler = (users: ChatUser[]) => {
        this.userList.users = users;
    };

    public close(): void {

        win.GaiaCommunityChat.off("connect", this.enter);
        win.GaiaCommunityChat.off("test/message", this.messageHandler);
        win.GaiaCommunityChat.off("test/users", this.usersHandler);

        this.container.delete();
        super.close();
    }
}
