// ==UserScript==
// @name         Patch AIMFOV + NORECOIL + AutoSwitch Head/Chest + Full Aim Assist + TouchDrag + HeadLock
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
const AIMFOV_FIND = `70 42 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;
const AIMFOV_REPLACE = `FF FF 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;

const NORECOIL_FIND = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 7A 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;
const NORECOIL_REPLACE = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 EF 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;

// Bone Offset Definitions
const BoneOffset = {
    head: 0x3D8,
    chest: 0x50,
    auto: (dist) => dist < 10 ? 0x3D8 : 0x50
};
const Vector3 = {
    distance: (a, b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
};
let lastEnemyHeadPos = null;
let lastPlayerPos = null;

function updateAimbot(crosshair, playerPos, enemy) {
    const headPos = enemy.headPos;
    const chestPos = enemy.chestPos;

    // ✅ Xác định enemy đang di chuyển?
    let enemyVelocity = 0;
    if (lastEnemyHeadPos) {
        enemyVelocity = Vector3.distance(headPos, lastEnemyHeadPos);
    }
    lastEnemyHeadPos = { ...headPos };

    // ✅ Xác định player đang xoay/ngắm?
    let playerVelocity = 0;
    if (lastPlayerPos) {
        playerVelocity = Vector3.distance(playerPos, lastPlayerPos);
    }
    lastPlayerPos = { ...playerPos };

    const isEnemyMoving = enemyVelocity > 0.01;
    const isPlayerMoving = playerVelocity > 0.01;

    // ✅ Kích hoạt chế độ lock mạnh nếu có chuyển động
    const isDynamicLock = isEnemyMoving || isPlayerMoving;

    // ✅ Truyền cờ vào magnetic system
    const newAim = magneticAimChestToHead(crosshair, chestPos, headPos, isDynamicLock);
    return newAim;
}
// Head Lock Tracking Radius
const HEAD_LOCK_RADIUS = 9999.0; // khoảng cách tính là đã headlock

// Touch Drag Detection
let isTouchDragging = false;
let isRedDotActive = false;

// Ví dụ: kiểm tra nếu crosshair rất gần đầu → giả lập “tâm ngắm đỏ”
if (Vector3.distance(crosshair, headPos) < 0.15) {
    isRedDotActive = true;
} else {
    isRedDotActive = false;
}
if (typeof document !== 'undefined') {
    document.addEventListener("touchstart", () => {
        isTouchDragging = true;
    });
    document.addEventListener("touchend", () => {
        isTouchDragging = false;
    });
}

// Placeholder: đọc Vector3 tại địa chỉ (giả lập)
function readVector3(address) {
    return { x: 0, y: 0, z: 0 }; // thực tế cần native hook
}

// Giả lập chức năng điều tâm
function aimTo(vec3) {
    console.log("🎯 AimTo:", vec3);
}

// Giả lập bắn
function triggerFire() {
    console.log("🔫 Fire Triggered");
}

// Giả lập quay camera
function cameraLookAt(x, y, z) {
    console.log("🎥 LookAt:", x, y, z);
}

// Tìm mục tiêu gần nhất
function autoLockNearest(playerPos, enemyList) {
    let minDist = Infinity;
    let target = null;
    for (let enemy of enemyList) {
        let dx = enemy.pos.x - playerPos.x;
        let dy = enemy.pos.y - playerPos.y;
        let dz = enemy.pos.z - playerPos.z;
        let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minDist) {
            minDist = dist;
            target = enemy;
        }
    }
    return target;
}

function magneticAimChestToHead(crosshair, chestPos, headPos, isDynamicLock) {
    const dx = crosshair.x - chestPos.x;
    const dy = crosshair.y - chestPos.y;
    const dz = crosshair.z - chestPos.z;
    const distToChest = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const distToHead = Math.sqrt(
        Math.pow(crosshair.x - headPos.x, 2) +
        Math.pow(crosshair.y - headPos.y, 2) +
        Math.pow(crosshair.z - headPos.z, 2)
    );

    let dragForce = 0.4;

    if (isRedDotActive) {
        return { x: headPos.x, y: headPos.y, z: headPos.z };
    }

    // ✅ Dynamic movement lock → tăng lực kéo lên đầu
    if (isDynamicLock) {
        if (distToHead < 0.4) {
            dragForce = 0.96;
        } else {
            dragForce = 0.85;
        }
    } else {
        if (distToHead < 0.3) {
            dragForce = 0.8;
        } else if (distToChest < 1.2) {
            dragForce = 0.65;
        }
    }

    let newX = crosshair.x + (headPos.x - crosshair.x) * dragForce;
    let newY = crosshair.y + (headPos.y - crosshair.y) * dragForce;
    let newZ = crosshair.z + (headPos.z - crosshair.z) * dragForce;

    // ✅ Không vượt quá đầu
    if (newY > headPos.y) {
        newY = headPos.y;
    }

    return { x: newX, y: newY, z: newZ };
}
// Auto Fire nếu gần head
function fireIfLocked(crosshair, targetHead) {
    const dx = crosshair.x - targetHead.x;
    const dy = crosshair.y - targetHead.y;
    const dz = crosshair.z - targetHead.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < HEAD_LOCK_RADIUS) {
        aimTo(targetHead); // snap chuẩn vào đầu
        triggerFire();
        console.log("🔒 Head Lock Fire Triggered");
    }
}

// Chest to Head Snap ngay lập tức
function immediateChestToHeadSwitch(playerPos, enemyBase) {
    const chestPos = readVector3(enemyBase + BoneOffset.chest);
    aimTo(chestPos);
    const headPos = readVector3(enemyBase + BoneOffset.head);
    setTimeout(() => {
        aimTo(headPos);
        console.log("🎯 Switch Chest → Head");
    }, 0);
}

// Xử lý phản hồi JSON từ game
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

            // Force aim/accuracy tweaks
            entry.ForceHeadshot = true;
            entry.IsCritical = true;
            entry.Priority = 9999;
            entry.AlwaysEnable = true;
            entry.HighAccuracy = true;
            entry.DisableSpread = true;
            entry.BulletLinearity = 1.0;

            if (entry.position) {
                entry.position.x = -0.0456970781;
                entry.position.y = -0.004478302;
                entry.position.z = -0.0200432576;
            }

            return entry;
        });

        // === AIM PROCESSING ===
        const playerPos = { x: 0, y: 0, z: 0 };
        const crosshair = { x: 0, y: 0, z: 0 };
        const enemyList = json.data
            .filter(entry => entry?.position)
            .map(entry => {
                const pos = entry.position;
                return {
                    pos: { x: pos.x, y: pos.y, z: pos.z },
                    chestPos: { x: pos.x, y: pos.y + 1.0, z: pos.z },
                    headPos: { x: pos.x, y: pos.y + 1.6, z: pos.z }
                };
            });

        const target = autoLockNearest(playerPos, enemyList);
        if (target) {
            const adjustedAim = magneticAimChestToHead(crosshair, target.chestPos, target.headPos);
            aimTo(adjustedAim);
            cameraLookAt(target.pos.x, target.pos.y, target.pos.z);
            fireIfLocked(adjustedAim, target.headPos);
        }

        $done({ body: JSON.stringify(json) });
    } else {
        $done({ body });
    }
} catch (e) {
    console.log("❌ JSON Parse Error:", e);
    $done({ body });
}
