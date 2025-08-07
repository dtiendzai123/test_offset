// ==UserScript==
// @name         Patch AIMFOV + NORECOIL + AutoSwitch Head/Chest + Full Aim Assist
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

// === Bone Offset Definitions ===
const BoneOffset = {
    head: 0x3D8,
    chest: 0x50,
    auto: (dist) => dist < 10 ? 0x3D8 : 0x50 // Gần: head, Xa: chest
};

// === Helper Aim Functions ===
function readVector3(address) {
    return { x: 0, y: 0, z: 0 }; // placeholder
}
function aimTo(vec3) {
    // Điều chỉnh tâm ngắm tới vị trí vec3
}
function triggerFire() {
    // Gọi chức năng bắn
}
function cameraLookAt(x, y, z) {
    // Điều chỉnh camera tới tọa độ
}

// === Aim Assist: AutoLockNearestTarget ===
function autoLockNearest(playerPos, enemyList) {
    let minDist = Infinity;
    let target = null;
    for (let enemy of enemyList) {
        let dx = enemy.pos.x - playerPos.x;
        let dy = enemy.pos.y - playerPos.y;
        let dz = enemy.pos.z - playerPos.z;
        let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < minDist) {
            minDist = dist;
            target = enemy;
        }
    }
    return target;
}

// === Magnet Aim ===
function magneticAim(current, target) {
    const strength = 1.0;
    return {
        x: current.x + (target.x - current.x) * strength,
        y: current.y + (target.y - current.y) * strength,
        z: current.z + (target.z - current.z) * strength
    };
}

// === Fire if Locked ===
function fireIfLocked(crosshair, target) {
    const dx = crosshair.x - target.x;
    const dy = crosshair.y - target.y;
    const dz = crosshair.z - target.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (dist < 1.0) {
        triggerFire();
        console.log("🔥 Auto Fire Triggered");
    }
}

// === Chest to Head Switch ===
function immediateChestToHeadSwitch(playerPos, enemyBase) {
    const chestPos = readVector3(enemyBase + BoneOffset.chest);
    aimTo(chestPos);
    const headPos = readVector3(enemyBase + BoneOffset.head);
    setTimeout(() => {
        aimTo(headPos);
        console.log("🎯 Switch Chest → Head");
    }, 0);
}

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

            // ✅ Tính năng 1-2-4:
            entry.ForceHeadshot = true;
            entry.IsCritical = true;
            entry.Priority = 9999;
            entry.AlwaysEnable = true;
            entry.HighAccuracy = true;
            entry.DisableSpread = true;
            entry.BulletLinearity = 1.0;

            return entry;
        });

        // 📌 Giả lập tình huống xử lý AutoLockNearestTarget
        const playerPos = { x: 0, y: 0, z: 0 };
        const enemyList = [
            { pos: { x: 4, y: 0, z: 0 }, headPos: { x: 4, y: 1.6, z: 0 } },
            { pos: { x: 2, y: 0, z: 0 }, headPos: { x: 2, y: 1.6, z: 0 } }
        ];
        const crosshair = { x: 0, y: 0, z: 0 };

        const target = autoLockNearest(playerPos, enemyList);
        if (target) {
            const adjustedAim = magneticAim(crosshair, target.headPos);
            aimTo(adjustedAim);            // Magnet Aim
            cameraLookAt(target.pos.x, target.pos.y, target.pos.z); // Camera lock
            fireIfLocked(adjustedAim, target.headPos); // Auto fire
        }

        $done({ body: JSON.stringify(json) });
    } else {
        $done({ body });
    }
} catch (e) {
    console.log("❌ JSON Parse Error:", e);
    $done({ body });
}
