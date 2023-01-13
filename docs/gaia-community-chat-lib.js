/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/GaiaCommunityChat.ts":
/*!**********************************!*\
  !*** ./src/GaiaCommunityChat.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var skydapp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! skydapp-common */ \"./node_modules/skydapp-common/lib/index.js\");\n/* harmony import */ var _WebSocketClient_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WebSocketClient.js */ \"./src/WebSocketClient.ts\");\n\n\nclass GaiaCommunityChat extends skydapp_common__WEBPACK_IMPORTED_MODULE_0__.EventContainer {\n    client;\n    get connected() {\n        return this.client.connected;\n    }\n    connect() {\n        this.client = new _WebSocketClient_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"wss://backend.gaiaprotocol.com?key=community-chat\");\n        this.client.on(\"connect\", () => {\n            console.log(\"connected to gaia protocol server.\");\n            this.fireEvent(\"connect\");\n        });\n        this.client.on(\"disconnect\", () => {\n            console.log(\"disconnected from gaia protocol server.\");\n            this.fireEvent(\"disconnect\");\n            setTimeout(() => {\n                this.client.reconnect();\n            }, 1000);\n        });\n        this.client.on(\"realtime/message\", (chatRoomId, token, messageId, message) => this.fireEvent(`${chatRoomId}/message`, token, messageId, message));\n        this.client.on(\"realtime/users\", async (chatRoomId) => this.fireEvent(`${chatRoomId}/users`, await this.loadUsers(chatRoomId)));\n    }\n    async enter(chatRoomId, token) {\n        return await this.client.send(\"community/chat/enter-room\", chatRoomId, token);\n    }\n    async loadUsers(chatRoomId) {\n        return await this.client.send(\"community/chat/users\", chatRoomId);\n    }\n    async loadUser(chatRoomId, user) {\n        return await this.client.send(\"community/chat/user\", chatRoomId, user);\n    }\n    async sendMessage(room, message) {\n        await this.client.send(`realtime/${room}/message`, message);\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new GaiaCommunityChat());\n\n\n//# sourceURL=webpack://gaia-community-chat-lib/./src/GaiaCommunityChat.ts?");

/***/ }),

/***/ "./src/WebSocketClient.ts":
/*!********************************!*\
  !*** ./src/WebSocketClient.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ WebSocketClient)\n/* harmony export */ });\n/* harmony import */ var skydapp_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! skydapp-common */ \"./node_modules/skydapp-common/lib/index.js\");\n\nclass WebSocketClient extends skydapp_common__WEBPACK_IMPORTED_MODULE_0__.EventContainer {\n    url;\n    webSocket;\n    sendKey = 0;\n    connected = false;\n    constructor(url) {\n        super();\n        this.url = url;\n        this.reconnect();\n    }\n    reconnect() {\n        this.webSocket = new WebSocket(this.url);\n        this.webSocket.onopen = () => {\n            this.connected = true;\n            this.fireEvent(\"connect\");\n        };\n        this.webSocket.onmessage = async (e) => {\n            const data = JSON.parse(e.data, (k, array) => {\n                if (Array.isArray(array) === true) {\n                    for (const [index, v] of array.entries()) {\n                        if (v === null) {\n                            array[index] = undefined;\n                        }\n                    }\n                }\n                return array;\n            });\n            try {\n                const results = await this.fireEvent(data.method, ...data.params);\n                if (data.__send_key !== undefined) {\n                    if (results.length === 0) {\n                        console.error(\"메소드를 찾을 수 없음\", data);\n                        this._send({ method: `__error_${data.__send_key}`, params: [\"메소드를 찾을 수 없음\"] });\n                    }\n                    else {\n                        for (const result of results) {\n                            this._send({ method: `__callback_${data.__send_key}`, params: [result] });\n                        }\n                    }\n                }\n            }\n            catch (error) {\n                if (data.__send_key !== undefined) {\n                    this._send({ method: `__error_${data.__send_key}`, params: [error.toString()] });\n                }\n                else {\n                    console.error(error);\n                }\n            }\n        };\n        this.webSocket.onclose = () => {\n            this.connected = false;\n            this.fireEvent(\"disconnect\");\n        };\n    }\n    disconnect() {\n        this.webSocket.close();\n    }\n    _send(data) {\n        this.webSocket.send(JSON.stringify(data));\n    }\n    async send(method, ...params) {\n        this._send({ method, params, __send_key: this.sendKey });\n        const callbackName = `__callback_${this.sendKey}`;\n        const errorkName = `__error_${this.sendKey}`;\n        this.sendKey += 1;\n        return new Promise((resolve, reject) => {\n            this.on(callbackName, resolve);\n            this.on(errorkName, (errorMessage) => {\n                console.error(`${method}(${params.join(\", \")}) ${errorMessage}`);\n                reject(new Error(errorMessage));\n            });\n        });\n    }\n}\n\n\n//# sourceURL=webpack://gaia-community-chat-lib/./src/WebSocketClient.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _GaiaCommunityChat_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GaiaCommunityChat.js */ \"./src/GaiaCommunityChat.ts\");\n\nwindow.GaiaCommunityChat = _GaiaCommunityChat_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n\n\n//# sourceURL=webpack://gaia-community-chat-lib/./src/main.ts?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/Debouncer.js":
/*!******************************************************!*\
  !*** ./node_modules/skydapp-common/lib/Debouncer.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Debouncer)\n/* harmony export */ });\nclass Debouncer {\n    debounceTime;\n    work;\n    debounceTimeout;\n    constructor(debounceTime, work) {\n        this.debounceTime = debounceTime;\n        this.work = work;\n    }\n    run(...params) {\n        if (this.debounceTimeout !== undefined) {\n            clearTimeout(this.debounceTimeout);\n        }\n        this.debounceTimeout = setTimeout(() => {\n            this.work(...params);\n        }, this.debounceTime);\n    }\n}\n//# sourceMappingURL=Debouncer.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/Debouncer.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/EventContainer.js":
/*!***********************************************************!*\
  !*** ./node_modules/skydapp-common/lib/EventContainer.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ EventContainer)\n/* harmony export */ });\n/* harmony import */ var _SkyUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SkyUtil.js */ \"./node_modules/skydapp-common/lib/SkyUtil.js\");\n\nclass EventContainer {\n    eventMap = {};\n    deleted = false;\n    on(eventName, eventHandler) {\n        if (this.eventMap[eventName] === undefined) {\n            this.eventMap[eventName] = [];\n        }\n        this.eventMap[eventName].push(eventHandler);\n    }\n    toss(eventName, to, toEventName) {\n        this.on(eventName, async (...params) => {\n            return await to.fireEvent(toEventName === undefined ? eventName : toEventName, ...params);\n        });\n    }\n    off(eventName, eventHandler) {\n        if (this.eventMap?.[eventName] !== undefined) {\n            _SkyUtil_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].pull(this.eventMap[eventName], eventHandler);\n            if (this.eventMap[eventName].length === 0) {\n                delete this.eventMap[eventName];\n            }\n        }\n    }\n    async fireEvent(eventName, ...params) {\n        const results = [];\n        const promises = [];\n        if (this.eventMap[eventName] !== undefined) {\n            for (const eventHandler of this.eventMap[eventName]) {\n                const result = eventHandler(...params);\n                if (result instanceof Promise) {\n                    promises.push(result);\n                }\n                else {\n                    results.push(result);\n                }\n            }\n        }\n        return results.concat(await Promise.all(promises));\n    }\n    delete() {\n        this.fireEvent(\"delete\");\n        this.eventMap = undefined;\n        this.deleted = true;\n    }\n}\n//# sourceMappingURL=EventContainer.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/EventContainer.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/JobQueue.js":
/*!*****************************************************!*\
  !*** ./node_modules/skydapp-common/lib/JobQueue.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ JobQueue)\n/* harmony export */ });\nclass JobQueue {\n    interval;\n    constructor(interval) {\n        this.interval = interval;\n    }\n    last = 0;\n    jobQeue = [];\n    waiting = false;\n    async nextJob() {\n        const current = Date.now();\n        const diff = current - this.last;\n        if (diff >= this.interval) {\n            const job = this.jobQeue.shift();\n            if (job !== undefined) {\n                this.last = current;\n                await job();\n                this.nextJob();\n            }\n        }\n        else if (this.waiting !== true) {\n            this.waiting = true;\n            setTimeout(() => {\n                this.waiting = false;\n                this.nextJob();\n            }, diff);\n        }\n    }\n    addJob(job) {\n        this.jobQeue.push(job);\n        this.nextJob();\n    }\n    async waitAndGo(p) {\n        return new Promise((resolve) => this.addJob(async () => {\n            await p();\n            resolve();\n        }));\n    }\n}\n//# sourceMappingURL=JobQueue.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/JobQueue.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/SkyDate.js":
/*!****************************************************!*\
  !*** ./node_modules/skydapp-common/lib/SkyDate.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SkyDate)\n/* harmony export */ });\nclass SkyDate {\n    d;\n    constructor(d = new Date()) {\n        this.d = d;\n    }\n    get year() { return this.d.getFullYear(); }\n    get month() { return this.d.getMonth() + 1; }\n    get date() { return this.d.getDate(); }\n    get day() { return this.d.getDay(); }\n    get hours() { return this.d.getHours(); }\n    get minutes() { return this.d.getMinutes(); }\n    get seconds() { return this.d.getSeconds(); }\n    get time() { return this.d.getTime(); }\n    set year(year) { this.d.setFullYear(year); }\n    set month(month) { this.d.setMonth(month - 1); }\n    set date(date) { this.d.setDate(date); }\n    set hours(hours) { this.d.setHours(hours); }\n    set minutes(minutes) { this.d.setMinutes(minutes); }\n    set seconds(seconds) { this.d.setSeconds(seconds); }\n    get monthFormal() {\n        const month = this.d.getMonth() + 1;\n        return `${month < 10 ? 0 : \"\"}${month}`;\n    }\n    get dateFormal() {\n        const date = this.d.getDate();\n        return `${date < 10 ? 0 : \"\"}${date}`;\n    }\n    get hoursFormal() {\n        const hours = this.d.getHours();\n        return `${hours < 10 ? 0 : \"\"}${hours}`;\n    }\n    get minutesFormal() {\n        const minutes = this.d.getMinutes();\n        return `${minutes < 10 ? 0 : \"\"}${minutes}`;\n    }\n    get secondsFormal() {\n        const seconds = this.d.getSeconds();\n        return `${seconds < 10 ? 0 : \"\"}${seconds}`;\n    }\n}\n//# sourceMappingURL=SkyDate.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/SkyDate.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/SkyLog.js":
/*!***************************************************!*\
  !*** ./node_modules/skydapp-common/lib/SkyLog.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SkyLog)\n/* harmony export */ });\n/* harmony import */ var _SkyDate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SkyDate.js */ \"./node_modules/skydapp-common/lib/SkyDate.js\");\n\nclass SkyLog {\n    static get time() {\n        const time = new _SkyDate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        return `${time.monthFormal}-${time.dateFormal} ${time.hoursFormal}:${time.minutesFormal}`;\n    }\n    static success(message) {\n        console.log(`\u001b[32m[${this.time}] ${message}\u001b[0m`);\n    }\n    static warning(message) {\n        console.log(`\u001b[33m[${this.time}] ${message}\u001b[0m`);\n        console.trace();\n    }\n    static error(message, parameters) {\n        console.log(`\u001b[31m[${this.time}] ${message}\u001b[0m`, parameters === undefined ? \"\" : parameters);\n        console.trace();\n    }\n}\n//# sourceMappingURL=SkyLog.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/SkyLog.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/SkyUtil.js":
/*!****************************************************!*\
  !*** ./node_modules/skydapp-common/lib/SkyUtil.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ SkyUtil)\n/* harmony export */ });\nclass SkyUtil {\n    static pull(array, ...removeList) {\n        for (const el of removeList) {\n            const index = array.indexOf(el);\n            if (index !== -1) {\n                array.splice(index, 1);\n            }\n        }\n    }\n    static insert(array, index, item) {\n        array.splice(index, 0, item);\n    }\n    static random(min, max) {\n        return Math.floor(Math.random() * (max - min + 1) + min);\n    }\n    static repeat(times, func) {\n        for (let i = 0; i < times; i += 1) {\n            if (func(i) === false) {\n                break;\n            }\n        }\n    }\n    static repeatResult(times, func) {\n        const results = [];\n        for (let i = 0; i < times; i += 1) {\n            results.push(func(i));\n        }\n        return results;\n    }\n    static async repeatResultAsync(times, func) {\n        const results = [];\n        for (let i = 0; i < times; i += 1) {\n            results.push(await func(i));\n        }\n        return results;\n    }\n    static toTitleCase(str) {\n        return str.replace(/(^\\w|\\s\\w)(\\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());\n    }\n    static shortenAddress(address) {\n        return `${address.substring(0, 6)}...${address.substring(38)}`;\n    }\n    static numberWithCommas(x, fixed) {\n        if (fixed === undefined || +(+x) > Number.MAX_SAFE_INTEGER) {\n            const parts = x.split(\".\");\n            parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, \",\");\n            return parts[1] === \"0\" ? parts[0] : parts.join(\".\");\n        }\n        const parts = String(+(+x).toFixed(fixed)).split(\".\");\n        parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, \",\");\n        return parts.join(\".\");\n    }\n    static shuffle(array) {\n        let currentIndex = array.length;\n        while (currentIndex !== 0) {\n            const randomIndex = Math.floor(Math.random() * currentIndex);\n            currentIndex -= 1;\n            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];\n        }\n        return array;\n    }\n}\n//# sourceMappingURL=SkyUtil.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/SkyUtil.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/Validator.js":
/*!******************************************************!*\
  !*** ./node_modules/skydapp-common/lib/Validator.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Validator {\n    notEmpty(value) {\n        return typeof value === \"string\" && value.trim() !== \"\";\n    }\n    integerString(value) {\n        const str = String(value);\n        return this.notEmpty(str) === true && str.match(/^(?:-?(?:0|[1-9][0-9]*))$/) !== null;\n    }\n    url(value) {\n        const str = String(value);\n        return this.notEmpty(str) === true && str.length <= 2083 && str.match(/^(?:(?:ht|f)tp(?:s?)\\:\\/\\/|~\\/|\\/)?(?:\\w+:\\w+@)?((?:(?:[-a-z\\u0080-\\uffff\\d{1-3}]+\\.)+(?:[a-z\\u0080-\\uffff]+))|((\\b25[0-5]\\b|\\b[2][0-4][0-9]\\b|\\b[0-1]?[0-9]?[0-9]\\b)(\\.(\\b25[0-5]\\b|\\b[2][0-4][0-9]\\b|\\b[0-1]?[0-9]?[0-9]\\b)){3}))(?::[\\d]{1,5})?(?:(?:(?:\\/(?:[-\\u0000-\\uffff~!$+|.,=]|%[a-f\\d]{2})+)+|\\/)+|\\?|#)?(?:(?:\\?(?:[-\\u0000-\\uffff~!$+|.,*:]|%[a-f\\d{2}])+=?(?:[-\\u0000-\\uffff~!$+|.,*:=]|%[a-f\\d]{2})*)(?:&(?:[-\\u0000-\\uffff~!$+|.,*:]|%[a-f\\d{2}])+=?(?:[-\\u0000-\\uffff~!$+|.,*:=]|%[a-f\\d]{2})*)*)*(?:#(?:[-\\u0000-\\uffff~!$ |\\/.,*:;=]|%[a-f\\d]{2})*)?$/i) !== null;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Validator());\n//# sourceMappingURL=Validator.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/Validator.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/Waiter.js":
/*!***************************************************!*\
  !*** ./node_modules/skydapp-common/lib/Waiter.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Waiter)\n/* harmony export */ });\nclass Waiter {\n    waiting = false;\n    resolves = [];\n    rejects = [];\n    async cheer() {\n        return new Promise((resolve, reject) => {\n            this.resolves.push(resolve);\n            this.rejects.push(reject);\n        });\n    }\n    wait() {\n        this.waiting = true;\n    }\n    clear() {\n        this.waiting = false;\n        this.resolves = [];\n        this.rejects = [];\n    }\n    done(value) {\n        for (const resolve of this.resolves) {\n            resolve(value);\n        }\n        this.clear();\n    }\n    error(reason) {\n        for (const reject of this.rejects) {\n            reject(reason);\n        }\n        this.clear();\n    }\n}\n//# sourceMappingURL=Waiter.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/Waiter.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/skydapp-common/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Debouncer\": () => (/* reexport safe */ _Debouncer_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   \"EventContainer\": () => (/* reexport safe */ _EventContainer_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   \"JobQueue\": () => (/* reexport safe */ _JobQueue_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"]),\n/* harmony export */   \"SkyDate\": () => (/* reexport safe */ _SkyDate_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"]),\n/* harmony export */   \"SkyLog\": () => (/* reexport safe */ _SkyLog_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"]),\n/* harmony export */   \"SkyUtil\": () => (/* reexport safe */ _SkyUtil_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"]),\n/* harmony export */   \"URIParser\": () => (/* reexport safe */ _routing_URIParser_js__WEBPACK_IMPORTED_MODULE_8__[\"default\"]),\n/* harmony export */   \"Validator\": () => (/* reexport safe */ _Validator_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"]),\n/* harmony export */   \"View\": () => (/* reexport safe */ _routing_View_js__WEBPACK_IMPORTED_MODULE_9__[\"default\"]),\n/* harmony export */   \"Waiter\": () => (/* reexport safe */ _Waiter_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _EventContainer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventContainer.js */ \"./node_modules/skydapp-common/lib/EventContainer.js\");\n/* harmony import */ var _Debouncer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Debouncer.js */ \"./node_modules/skydapp-common/lib/Debouncer.js\");\n/* harmony import */ var _Waiter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Waiter.js */ \"./node_modules/skydapp-common/lib/Waiter.js\");\n/* harmony import */ var _SkyUtil_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SkyUtil.js */ \"./node_modules/skydapp-common/lib/SkyUtil.js\");\n/* harmony import */ var _SkyDate_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SkyDate.js */ \"./node_modules/skydapp-common/lib/SkyDate.js\");\n/* harmony import */ var _SkyLog_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SkyLog.js */ \"./node_modules/skydapp-common/lib/SkyLog.js\");\n/* harmony import */ var _Validator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Validator.js */ \"./node_modules/skydapp-common/lib/Validator.js\");\n/* harmony import */ var _JobQueue_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./JobQueue.js */ \"./node_modules/skydapp-common/lib/JobQueue.js\");\n/* harmony import */ var _routing_URIParser_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./routing/URIParser.js */ \"./node_modules/skydapp-common/lib/routing/URIParser.js\");\n/* harmony import */ var _routing_View_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./routing/View.js */ \"./node_modules/skydapp-common/lib/routing/View.js\");\n\n\n\n\n\n\n\n\n\n\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/index.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/routing/URIParser.js":
/*!**************************************************************!*\
  !*** ./node_modules/skydapp-common/lib/routing/URIParser.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass URIParser {\n    match(uriParts, pattern, params) {\n        const patternParts = pattern.split(\"/\");\n        for (const [index, uriPart] of uriParts.entries()) {\n            const patternPart = patternParts[index];\n            if (patternPart === undefined) {\n                return false;\n            }\n            else if (patternPart === \"**\") {\n                return true;\n            }\n            if (uriPart !== \"\" && patternPart[0] === \"{\" && patternPart[patternPart.length - 1] === \"}\") {\n                if (params !== undefined) {\n                    params[patternPart.substring(1, patternPart.length - 1)] = uriPart;\n                }\n            }\n            else if (patternPart !== \"*\" && patternPart !== uriPart) {\n                return false;\n            }\n            if (index === uriParts.length - 1 && index < patternParts.length - 1 && patternParts[patternParts.length - 1] !== \"\") {\n                return false;\n            }\n        }\n        return true;\n    }\n    parse(uri, pattern, params) {\n        const uriParts = uri.split(\"/\");\n        return this.match(uriParts, pattern, params);\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new URIParser());\n//# sourceMappingURL=URIParser.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/routing/URIParser.js?");

/***/ }),

/***/ "./node_modules/skydapp-common/lib/routing/View.js":
/*!*********************************************************!*\
  !*** ./node_modules/skydapp-common/lib/routing/View.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ View)\n/* harmony export */ });\nclass View {\n    closed = false;\n    changeParams(params, uri) { }\n    close() {\n        this.closed = true;\n    }\n}\n//# sourceMappingURL=View.js.map\n\n//# sourceURL=webpack://gaia-community-chat-lib/./node_modules/skydapp-common/lib/routing/View.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;