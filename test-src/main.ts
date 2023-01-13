import { SkyRouter } from "skydapp-browser";
import TestChat from "./view/TestChat.js";

(window as any).GaiaCommunityChat.connect();

SkyRouter.route("", TestChat);
