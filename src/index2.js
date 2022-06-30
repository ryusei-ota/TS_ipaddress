var ip2bin = function (ip) { return ip.split(".").map(function (e) { return Number(e).toString(2).padStart(8, '0'); }).join(''); };
var ip2long = function (ip) { return parseInt(ip2bin(ip), 2); };
var long2ip = function (num) {
    var bin = Number(num).toString(2).padStart(32, '0');
    return [
        bin.slice(0, 8),
        bin.slice(8, 16),
        bin.slice(16, 24),
        bin.slice(24, 32),
    ].map(function (e) { return parseInt(e, 2); }).join('.');
};
var cidr2long = function (cidr) { return parseInt(String("").padStart(cidr, '1').padEnd(32, '0'), 2); };
var cidr2subnetmask = function (num) { return long2ip(cidr2long(Number(num))); };
var subnetmask2cidr = function (ip) { return ip2bin(ip).split('1').length - 1; };
var getNetworkAddr = function (ip, subnetmask) { return (ip & subnetmask) >>> 0; };
var getBroadcastAddr = function (ip, subnetmask) { return (ip | ~subnetmask) >>> 0; };
var getClass = function (ip) {
    if (ip2long("0.0.0.0") <= ip && ip <= ip2long("127.255.255.255")) {
        return 'A';
    }
    if (ip2long("128.0.0.0") <= ip && ip <= ip2long("191.255.255.255")) {
        return 'B';
    }
    if (ip2long("192.0.0.0") <= ip && ip <= ip2long("223.255.255.255")) {
        return 'C';
    }
    if (ip2long("224.0.0.0") <= ip && ip <= ip2long("239.255.255.255")) {
        return 'D';
    }
    if (ip2long("240.0.0.0") <= ip && ip <= ip2long("255.255.255.255")) {
        return 'E';
    }
    return false;
};
var ipLong = ip2long("192.168.0.2");
var cidr = cidr2long(24);
var address = [];
var i = 1;
while (i < 255) {
    address.push(long2ip(getNetworkAddr(ipLong, cidr) + i));
    i += 1;
}
// 指定ipaddress内に存在するかしないか
console.log("192.168.0.3は");
if (address.includes("192.168.0.3")) {
    console.log("存在します。");
}
else {
    console.log("存在しません。");
}
console.log("192.168.10.3は");
if (address.includes("192.168.10.3")) {
    console.log("存在します。");
}
else {
    console.log("存在しません。");
}
// 配列の中身を見る
// for (const x of address) {
//     console.log(x);
// }
console.log("\nIP\u30A2\u30C9\u30EC\u30B9: ".concat(long2ip(ipLong), "\n\u30B5\u30D6\u30CD\u30C3\u30C8\u30DE\u30B9\u30AF: /").concat(subnetmask2cidr("255.255.255.0"), " (").concat(cidr2subnetmask(24), ")\n\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u30A2\u30C9\u30EC\u30B9: ").concat(long2ip(getNetworkAddr(ipLong, cidr)), "\n\n\u4F7F\u7528\u53EF\u80FDIP: ").concat(long2ip(getNetworkAddr(ipLong, cidr) + 1), " \u301C ").concat(long2ip(getBroadcastAddr(ipLong, cidr) - 1), "\n\n\u30D6\u30ED\u30FC\u30C9\u30AD\u30E3\u30B9\u30C8\u30A2\u30C9\u30EC\u30B9: ").concat(long2ip(getBroadcastAddr(ipLong, cidr)), "\n\u30A2\u30C9\u30EC\u30B9\u6570: ").concat(getBroadcastAddr(ipLong, cidr) - getNetworkAddr(ipLong, cidr) + 1, "\n\u30DB\u30B9\u30C8\u30A2\u30C9\u30EC\u30B9\u6570: ").concat(getBroadcastAddr(ipLong, cidr) - getNetworkAddr(ipLong, cidr) - 1, "\nIP\u30A2\u30C9\u30EC\u30B9\u30AF\u30E9\u30B9: ").concat(getClass(ipLong), "\n"));
