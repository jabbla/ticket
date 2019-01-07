import Cookies from 'js-cookie';

export default function getUserCookie(){
    console.log(Cookies.get('tk'));
}