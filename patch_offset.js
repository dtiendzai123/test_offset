// ==UserScript==
// @name         Patch AIMFOV + NORECOIL + AutoSwitch Head/Chest
// @namespace    http://garena.freefire/
// @match        *api.ff.garena.com*
// @run-at       response
// ==/UserScript==

let body = $response.body;

// Convert hex pattern to buffer
function patchBinary(base64, findHex, replaceHex) {
    const find = Buffer.from(findHex.replace(/\s+/g, ''), 'hex');
    const replace = Buffer.from(replaceHex.replace(/\s+/g, ''), 'hex');
    let buffer = Buffer.from(base64, 'base64');

    let index = buffer.indexOf(find);
    if (index !== -1) {
        replace.copy(buffer, index);
        console.log("✅ Patch success at index:", index);
        return buffer.toString('base64');
    } else {
        console.log("❌ Patch not found.");
        return base64;
    }
}

// HEX patterns
const AIMFOV_FIND = `
70 42 00 00 00 00 00 00 C0 3F
0A D7 A3 3B 0A D7 A3 3B 8F C2
75 3D AE 47 E1 3D 9A 99 19 3E
CD CC 4C 3E A4 70 FD 3E`;

const AIMFOV_REPLACE = `
FF FF 00 00 00 00 00 00 C0 3F
0A D7 A3 3B 0A D7 A3 3B 8F C2
75 3D AE 47 E1 3D 9A 99 19 3E
CD CC 4C 3E A4 70 FD 3E`;

const NORECOIL_FIND = `
00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 7A 44
F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2
00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;

const NORECOIL_REPLACE = `
00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 EF 44
F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2
00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;

try {
    let json = JSON.parse(body);
    if (json?.data) {
        json.data = json.data.map(entry => {
            if (entry?.value?.includes("base64")) {
                let b64 = entry.value.split(',')[1];
                let patched = patchBinary(b64, AIMFOV_FIND, AIMFOV_REPLACE);
                patched = patchBinary(patched, NORECOIL_FIND, NORECOIL_REPLACE);
                entry.value = "data:application/octet-stream;base64," + patched;
            }
            return entry;
        });
        $done({ body: JSON.stringify(json) });
    } else {
        $done({ body });
    }
} catch (e) {
    console.log("❌ JSON Parse Error:", e);
    $done({ body });
}

// === Bone Offset + AutoSwitch ===

// === Bone Offset Definitions ===
const BoneOffset = {
    head: 0x3D8,
    chest: 0x50
};

// === Immediate Chest-to-Head Switch Logic ===
function immediateChestToHeadSwitch(playerPos, enemyBase) {
    const chestOffset = BoneOffset.chest;
    const headOffset = BoneOffset.head;

    // 1. Lấy vị trí chest đầu tiên
    const chestPos = readVector3(enemyBase + chestOffset);
    aimTo(chestPos);  // Ban đầu nhắm vào ngực

    // 2. Ngay sau đó (1 frame hoặc không delay), switch sang head
    const headPos = readVector3(enemyBase + headOffset);
    setTimeout(() => {
        aimTo(headPos); // Snap ngay lên đầu
        console.log("🎯 Switch Chest → Head");
    }, 0); // Không delay, thực hiện ngay
}

// === Ví dụ dùng Auto Switch ===
function getTargetBoneOffset(playerPos, enemyPos) {
    let dx = enemyPos.x - playerPos.x;
    let dy = enemyPos.y - playerPos.y;
    let dz = enemyPos.z - playerPos.z;
    let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return BoneOffset.auto(distance);
}
