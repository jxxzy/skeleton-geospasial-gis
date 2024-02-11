export function setCookieWithExpireDay(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  export function setCookieWithExpireHour(cname, cvalue, exhour) {
    const d = new Date();
    d.setTime(d.getTime() + (exhour * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  export function setCookieWithExpireSecond(cname, cvalue, exsecs) {
    const d = new Date();
    d.setTime(d.getTime() + (exsecs * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  export function deleteCookie() {
    var cookies = document.cookie.split("; ");
      for (var c = 0; c < cookies.length; c++) {
          var d = window.location.hostname.split(".");
          while (d.length > 0) {
              var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ' + d.join('.') + ' ;path=';
              var p = location.pathname.split('/');
              document.cookie = cookieBase + '/';
              while (p.length > 0) {
                  document.cookie = cookieBase + p.join('/');
                  p.pop();
              };
              d.shift();
          }
      }
  }
  
  export function getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
          c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
          }
      }
      return "";
      }