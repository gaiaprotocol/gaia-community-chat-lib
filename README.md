# gaia-community-chat-lib
가이아 메시징 프로토콜을 사용하여 웹 사이트에 채팅방을 구현할 수 있는 라이브러리입니다. `chatRoomId`와 `secretKey`를 발급받고자 하시는 분들께서는 [Gaia Protocol Contact](https://gaiaprotocol.com/contact) 페이지를 통해 연락을 부탁드립니다.

```ts
import { GaiaCommunityChat, ChatMessage, ChatUser } from "gaia-community-chat-lib";

GaiaCommunityChat.connect();
```

## Installation
```
$ yarn add gaia-community-chat-lib
```
```
$ npm install gaia-community-chat-lib
```

## 토큰 취득 예시
서버사이드에서 실행
```ts
const chatRoomId = "test";
const secretKey = "1b295164-9c66-4627-b08b-683ace4a4fea";

const result = await fetch(`https://backend.gaiaprotocol.com/community/chat/${chatRoomId}/token?${new URLSearchParams({
    name: "YJ",
    profileImage: "https://noun.pics/123.svg",
})}`, {
    headers: {
        "Authorization": `Bearer ${secretKey}`,
    },
});

const token = await result.text();
```

## 사용방법
1. gaia-community-chat-lib-0.0.1.js 파일을 HTML에서 불러옵니다.
2. 위 `토큰 취득 예시`를 참고해 "서버사이드"에서 로그인한 유저의 정보를 가이아 서버로 보내고 토큰을 받아옵니다.
3. 받아온 토큰으로 웹 사이트에서 채팅방을 엽니다. (1회용 토큰입니다. 한번 사용되면 더 이상 쓸 수 없습니다.)

## Showcase
https://gaia-community-chat-lib-test.gaiaprotocol.com/

## License
© 2023 [Gaia Protocol](https://github.com/gaiaprotocol)
