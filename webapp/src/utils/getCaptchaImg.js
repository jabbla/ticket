import axios from 'axios';

export default function getCaptchaImg(){
    let jsonp = document.createElement('script');
    jsonp.src = 'https://kyfw.12306.cn/passport/captcha/captcha-image64?login_site=E&module=login&rand=sjrand&1546675564413&callback=jQuery19109600698514445551_1546675562085&_=1546675562086';
    document.body.appendChild(jsonp);

    return new Promise((resolve, reject) => {
        window.jQuery19109600698514445551_1546675562085 = function(res){
            document.body.removeChild(jsonp);
            resolve(res);
        };
    });
}