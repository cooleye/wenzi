const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function str2asc(strstr) {
  return ("0" + strstr.charCodeAt(0).toString(16)).slice(-2);
}
function asc2str(ascasc) {
  return String.fromCharCode(ascasc);
} 

function UrlEncode(str) {
  var ret = "";
  var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
  var tt = "";

  for (var i = 0; i < str.length; i++) {
    var chr = str.charAt(i);
    var c = str2asc(chr);
    tt += chr + ":" + c + "n";
    if (parseInt("0x" + c) > 0x7f) {
      ret += "%" + c.slice(0, 2) + "%" + c.slice(-2);
    } else {
      if (chr == " ")
        ret += "+";
      else if (strSpecial.indexOf(chr) != -1)
        ret += "%" + c.toString(16);
      else
        ret += chr;
    }
  }
  return ret;
}

module.exports = {
  formatTime: formatTime,
  UrlEncode: UrlEncode
}
