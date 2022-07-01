const ip2bin = (ip: string) => ip.split(".").map(e => Number(e).toString(2).padStart(8, '0')).join('')

const ip2long = (ip: string) => parseInt(ip2bin(ip), 2)

const long2ip = (num: number) => {
    let bin = Number(num).toString(2).padStart(32, '0')
    return [
        bin.slice(0, 8),
        bin.slice(8, 16),
        bin.slice(16, 24),
        bin.slice(24, 32),
    ].map(e => parseInt(e, 2)).join('.')
}

const cidr2long = (cidr: number) => parseInt(String("").padStart(cidr, '1').padEnd(32, '0'), 2)

const cidr2subnetmask = (num: number) => long2ip(cidr2long(Number(num)))

const subnetmask2cidr = (ip: string) => ip2bin(ip).split('1').length - 1

const getNetworkAddr = (ip: number, subnetmask: number) => (ip & subnetmask) >>> 0

const getBroadcastAddr = (ip: number, subnetmask: number) => (ip | ~subnetmask) >>> 0

const getClass = (ip: number) => {
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

/**
 * 引数
 */
const networkAddress: string = "192.16.0.0"
const ipAddress: string = "192.16.0.1"
const subnetmask: number = 22

const ipLong = ip2long(ipAddress)
const cidr = cidr2long(subnetmask)

/**
 * 生成addressを配列格納
 */
const address: string[] = [];
let i = 1;
while (i < 255) {
    address.push(long2ip(getNetworkAddr(ipLong, cidr) + i));
    i += 1;
}

// 指定ipaddressが存在するかしないか
if (address.includes(ipAddress)) {
    console.log("存在します。")
} else {
    console.log("存在しません。")
}

// ネットワークアドレスがdb内にあると仮定
export interface NetworkListType {
    networkAddress: string;
    subnetmask: number;
}

const networkAddressList: NetworkListType[] =
    [
        {
            networkAddress: "192.10.0.0",
            subnetmask: 24
        },
        {
            networkAddress: "10.32.0.0",
            subnetmask: 16
        },
        {
            networkAddress: "170.150.0.0",
            subnetmask: 24
        },
        {
            networkAddress: "192.168.0.0",
            subnetmask: 24
        },
        {
            networkAddress: "10.16.0.0",
            subnetmask: 24
        }
    ];

/**
 * ネットワークアドレス作成可能か
 */
if (networkAdd(networkAddressList)) {
    addIp()
    //////////////////////////////////////////////////////////////////////////
    // 追加部分：networkaddressListの最終行に追加ってことであってるかな？///////
    /////////////////////////////////////////////////////////////////////////
    networkAddressList.push({ networkAddress: networkAddress, subnetmask: subnetmask });
    for (const list of networkAddressList) {
        console.log(list);
    }
} else {
    console.log('作成不可')
}

/**
 * ネットワークアドレスがDBにあるか
 * return boolean
*/
function networkAdd(array: NetworkListType[]) {
    var postNetworkAddress = long2ip(getNetworkAddr(ipLong, cidr))
    let j = 0
    let flg = true
    //////////////////////////////////////////////////////////////////////////
    // 変更部分：networkaddressListをarrayに変更///////
    /////////////////////////////////////////////////////////////////////////
    array.forEach(function (e) {
        if (array[j].networkAddress.includes(postNetworkAddress)) {
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
function addIp() {
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