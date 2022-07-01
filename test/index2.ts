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

const ipLong = ip2long("192.16.0.1")
const cidr = cidr2long(22)


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