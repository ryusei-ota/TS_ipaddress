const ip2bin = (ip : string) => ip.split(".").map(e => Number(e).toString(2).padStart(8, '0')).join('')

const ip2long = (ip : string) => parseInt(ip2bin(ip), 2)

const long2ip = (num : number) => {
    let bin = Number(num).toString(2).padStart(32, '0')
    return [
        bin.slice(0, 8),
        bin.slice(8, 16),
        bin.slice(16, 24),
        bin.slice(24, 32),
    ].map(e => parseInt(e, 2)).join('.')
}

const cidr2long = (cidr : number) => parseInt(String("").padStart(cidr, '1').padEnd(32, '0'), 2)

const cidr2subnetmask = (num : number) => long2ip(cidr2long(Number(num)))

const subnetmask2cidr = (ip : string) => ip2bin(ip).split('1').length - 1

const getNetworkAddr = (ip : number, subnetmask : number) => (ip & subnetmask) >>> 0

const getBroadcastAddr = (ip : number, subnetmask : number) => (ip | ~subnetmask) >>> 0

const getClass = (ip : number) => {
    if (ip2long("0.0.0.0") <= ip && ip <= ip2long("127.255.255.255")) {
        return 'A'
    }
    if (ip2long("128.0.0.0") <= ip && ip <= ip2long("191.255.255.255")) {
        return 'B'
    }
    if (ip2long("192.0.0.0") <= ip && ip <= ip2long("223.255.255.255")) {
        return 'C'
    }
    if (ip2long("224.0.0.0") <= ip && ip <= ip2long("239.255.255.255")) {
        return 'D'
    }
    if (ip2long("240.0.0.0") <= ip && ip <= ip2long("255.255.255.255")) {
        return 'E'
    }
    return false;
}

// ********************************************************************************
// 引数
const ipaddress = "192.18.0.0"
const subnetmask = 24

const ipLong = ip2long(ipaddress)
const cidr = cidr2long(subnetmask)

const address: string[] = [];
let i = 1;
while(i < 255){
    address.push(long2ip(getNetworkAddr(ipLong, cidr) + i));
    i += 1;
}

// 指定ipaddress内に存在するかしないか
if (address.includes(ipaddress)){
    console.log("存在します。")
}else{
    console.log("存在しません。")
}


// ネットワークアドレスがdb内にあると仮定
export interface NetworkListType {
    networkaddress: string;
    subnetmask: number;
}

const networkaddressList: NetworkListType[] = 
[
    {
       networkaddress : "192.10.0.0",
       subnetmask : 24
    },
    {
       networkaddress : "10.32.0.0",
       subnetmask : 16
    },
    {
        networkaddress : "170.150.0.0",
       subnetmask : 24
    },
    {
        networkaddress : "192.168.0.0",
       subnetmask : 24
    },
    {
        networkaddress : "10.16.0.0",
       subnetmask : 24
    }
];

/**
 * ネットワークアドレス作成可能か
 */
if(networkadd(networkaddressList)){
    addip()
}else{
    console.log('作成不可')
}

/**
 * ネットワークアドレスがDBにあるか
 * return boolean
*/
function networkadd(array : NetworkListType[]){
    var postnetworkaddress = long2ip(getNetworkAddr(ipLong, cidr))
    let j = 0
    let flg = true
    networkaddressList.forEach(function(e){
        if(networkaddressList[j].networkaddress.includes(postnetworkaddress)){
            flg = false
            return true
        }
        j += 1
    });
    return flg
}

/**
 * 作成
 */
function addip() { 
    console.log(`
    IPアドレス: ${long2ip(ipLong)}
    サブネットマスク: /${subnetmask2cidr("255.255.255.0")} (${cidr2subnetmask(24)})
    ネットワークアドレス: ${long2ip(getNetworkAddr(ipLong, cidr))}
    
    使用可能IP: ${long2ip(getNetworkAddr(ipLong, cidr) + 1)} 〜 ${long2ip(getBroadcastAddr(ipLong, cidr) - 1)}
    
    ブロードキャストアドレス: ${long2ip(getBroadcastAddr(ipLong, cidr))}
    アドレス数: ${getBroadcastAddr(ipLong, cidr) - getNetworkAddr(ipLong, cidr) + 1}
    ホストアドレス数: ${getBroadcastAddr(ipLong, cidr) - getNetworkAddr(ipLong, cidr) - 1}
    IPアドレスクラス: ${getClass(ipLong)}
    `)
}


// 配列の中身を見る
// for (const x of address) {
//     console.log(x);
// }