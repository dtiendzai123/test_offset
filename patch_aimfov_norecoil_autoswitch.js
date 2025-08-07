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

// === Constants ===
const AIMFOV_FIND = `70 42 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;
const AIMFOV_REPLACE = `FF FF 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;

const NORECOIL_FIND = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 7A 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;
const NORECOIL_REPLACE = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 EF 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;


const HEAD_LOCK_RADIUS = 9999.0;
const BoneOffset = { head: 0x3D8, chest: 0x50, auto: dist => dist < 10 ? 0x3D8 : 0x50 };

// === Helpers ===
const Vector3 = {
    distance: (a, b) => {
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
};
class AimSmoother {
    constructor(smoothFactor = 0.65) {
        this.lastPos = null;
        this.smoothFactor = smoothFactor;
    }

    smooth(currentPos) {
        if (!this.lastPos) {
            this.lastPos = currentPos;
            return currentPos;
        }

        const smoothed = {
            x: this.lastPos.x + (currentPos.x - this.lastPos.x) * this.smoothFactor,
            y: this.lastPos.y + (currentPos.y - this.lastPos.y) * this.smoothFactor,
            z: this.lastPos.z + (currentPos.z - this.lastPos.z) * this.smoothFactor
        };

        this.lastPos = smoothed;
        return smoothed;
    }
}
// === Input States ===
let lastEnemyHeadPos = null;
let lastPlayerPos = null;
let isTouchDragging = false;

if (typeof document !== 'undefined') {
    document.addEventListener("touchstart", () => isTouchDragging = true);
    document.addEventListener("touchend", () => isTouchDragging = false);
}
let predictedHead = fixBulletDrift(enemy.headPos, playerPos);
let corrected = correctCrosshairOffset(crosshairPos, predictedHead);
let smoothedAim = aimSmoother.smooth(corrected);

// Gán lại vào hệ thống aim
crosshairPos.x = smoothedAim.x;
crosshairPos.y = smoothedAim.y;
crosshairPos.z = smoothedAim.z;
// === Core Functions ===
function fixBulletDrift(targetPos, playerPos, bulletSpeed = 95, predictionFactor = 1.0) {
    const direction = {
        x: targetPos.x - playerPos.x,
        y: targetPos.y - playerPos.y,
        z: targetPos.z - playerPos.z
    };

    // Ước lượng thời gian đạn bay đến mục tiêu
    const distance = Vector3.distance(playerPos, targetPos);
    const travelTime = distance / bulletSpeed;

    // Dự đoán vị trí tương lai của enemy (simple linear prediction)
    return {
        x: targetPos.x + (direction.x * predictionFactor * travelTime),
        y: targetPos.y + (direction.y * predictionFactor * travelTime),
        z: targetPos.z + (direction.z * predictionFactor * travelTime)
    };
}
function correctCrosshairOffset(crosshair, targetHead, offsetThreshold = 0.05) {
    const dx = Math.abs(crosshair.x - targetHead.x);
    const dy = Math.abs(crosshair.y - targetHead.y);
    const dz = Math.abs(crosshair.z - targetHead.z);

    if (dx > offsetThreshold || dy > offsetThreshold || dz > offsetThreshold) {
        return {
            x: targetHead.x,
            y: targetHead.y,
            z: targetHead.z
        };
    }
    return crosshair; // No correction needed
}
function updateAimbot(crosshair, playerPos, enemy) {
    const headPos = enemy.headPos;
    const chestPos = enemy.chestPos;

    // Tính chuyển động
    let enemyVelocity = lastEnemyHeadPos ? Vector3.distance(headPos, lastEnemyHeadPos) : 0;
    let playerVelocity = lastPlayerPos ? Vector3.distance(playerPos, lastPlayerPos) : 0;
    lastEnemyHeadPos = { ...headPos };
    lastPlayerPos = { ...playerPos };

    const isEnemyMoving = enemyVelocity > 0.01;
    const isPlayerMoving = playerVelocity > 0.01;
    const isDynamicLock = isEnemyMoving || isPlayerMoving;

    // Kiểm tra trạng thái tâm đỏ
    let isRedDotActive = Vector3.distance(crosshair, headPos) < 0.15;

    return magneticAimChestToHead(crosshair, chestPos, headPos, isDynamicLock, isRedDotActive);
}

function magneticAimChestToHead(crosshair, chestPos, headPos, isDynamicLock, isRedDotActive) {
    const distToChest = Vector3.distance(crosshair, chestPos);
    const distToHead = Vector3.distance(crosshair, headPos);

    let dragForce = 0.4;

    if (isRedDotActive) {
        return { x: headPos.x, y: headPos.y, z: headPos.z };
    }

    if (isDynamicLock) {
        dragForce = distToHead < 0.4 ? 0.96 : 0.85;
    } else {
        if (distToHead < 0.3) dragForce = 0.8;
        else if (distToChest < 1.2) dragForce = 0.65;
    }

    let newX = crosshair.x + (headPos.x - crosshair.x) * dragForce;
    let newY = crosshair.y + (headPos.y - crosshair.y) * dragForce;
    let newZ = crosshair.z + (headPos.z - crosshair.z) * dragForce;

    if (newY > headPos.y) newY = headPos.y;
    return { x: newX, y: newY, z: newZ };
}

function fireIfLocked(crosshair, targetHead) {
    const dist = Vector3.distance(crosshair, targetHead);
    if (dist < HEAD_LOCK_RADIUS) {
        aimTo(targetHead);
        triggerFire();
        console.log("🔒 Head Lock Fire Triggered");
    }
}

function autoLockNearest(playerPos, enemyList) {
    let minDist = Infinity, target = null;
    for (let enemy of enemyList) {
        let dist = Vector3.distance(playerPos, enemy.pos);
        if (dist < minDist) {
            minDist = dist;
            target = enemy;
        }
    }
    return target;
}

// === Simulated Native Bindings ===
function readVector3(address) { return { x: 0, y: 0, z: 0 }; }
function aimTo(vec3) { console.log("🎯 AimTo:", vec3); }
function triggerFire() { console.log("🔫 Fire Triggered"); }
function cameraLookAt(x, y, z) { console.log("🎥 LookAt:", x, y, z); }

// === PATCH JSON ===
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

            // Force aim/accuracy
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

        // === AIM LOOP ===
        const playerPos = { x: 0, y: 0, z: 0 };
        const crosshair = { x: 0, y: 0, z: 0 };
        const enemyList = json.data.filter(e => e?.position).map(e => {
            const pos = e.position;
            return {
                pos: { x: pos.x, y: pos.y, z: pos.z },
                chestPos: { x: pos.x, y: pos.y + 1.0, z: pos.z },
                headPos: { x: pos.x, y: pos.y + 1.6, z: pos.z }
            };
        });

        const target = autoLockNearest(playerPos, enemyList);
        if (target) {
            const adjustedAim = updateAimbot(crosshair, playerPos, target);
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
