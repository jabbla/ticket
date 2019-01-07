### 点击预定

/otn/confirmPassenger/getPassengerDTOs
获取乘客信息

#### request
```js
{
    _json_att: 
    REPEAT_SUBMIT_TOKEN: '31267e413dfa9e2987675a01913c7561'
}
```
#### response
```js
```

### 点击提交订单

/otn/confirmPassenger/checkOrderInfo
获取订单信息
```js

```

/otn/confirmPassenger/getQueueCount
获取余票信息

### 登录相关
/web/login

request
```js
{
    username,
    password,
    appid: 'otn',
    answer: 
}
```

1. _passport_session 静态session 无过期时间 /passport/web/auth/uamtk-static
3. _passport_ct 验证码session 有过期时间
4. BIGipServerpool_passport 验证码校验成功session
5. _passport_session 等登录成功session

### 提交订单
```js
{

    choose_seats: "",
    key_check_isChange: "8084E8BC436655A44620795379E4001794520A26C3E483362856AFF1",
    leftTicketStr: "Z08aFXRYbJpFPPfSCJqbl5U8mtRZGzHi8jE%2BlqNyF44d8N6qJqOJ2CpQMvo%3D",
    oldPassengerStr: "朱潇然,1,653224199310112312,3_",
    passengerTicketStr: "1,0,1,朱潇然,1,653224199310112312,18088671170,N",
    purpose_codes: "00",
    randCode: "",
    seatDetailType: "000",
    train_location: "H3",
    whatsSelect: "1",
    roomType: '00',
    dwAll: 'N',

}
```
/otn/confirmPassenger/confirmSingleForQueue




