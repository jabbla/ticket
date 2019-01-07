import axios from 'axios';

export default function validateCaptchaImg(answer){
    let jsonp = document.createElement('script');
    jsonp.src = `
        https://kyfw.12306.cn/passport/captcha/captcha-check?callback=jQuery19109600698514445551_1546675562085&answer=${answer}&rand=sjrand&login_site=E&_=${Date.now()}
    `;
    document.body.appendChild(jsonp);
    
    return new Promise((resolve, reject) => {
        window.jQuery19109600698514445551_1546675562085 = function(res){
            document.body.removeChild(jsonp);
            resolve(res);
        };
    });
}