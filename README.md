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

## Showcase
https://gaia-community-chat-lib-test.gaiaprotocol.com/

## License
© 2023 [Gaia Protocol](https://github.com/gaiaprotocol)
