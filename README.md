# gaia-community-chat-lib

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
