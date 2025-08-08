// ==UserScript==
// @name         Patch AIMFOV + NORECOIL + AutoSwitch Head/Chest + Full Aim Assist + TouchDrag + HeadLock
// @namespace    http://garena.freefire/
// @match        *api.ff.garena.com*
// @run-at       response
// ==/UserScript==
const CONFIG = {
  DEBUG: false,
  DEFAULT_AIMFOV: 999,
  AIM_SMOOTH: 0,
  NO_RECOIL: true,
  AUTO_HEADSHOT: true,
  LOCK_BONE: "head",
  PREDICTION: { enabled: true, leadFactor: 1.0 },
  HYPER_SENSITY: {
    enabled: true,
    chestRadius: 0.01,
    sensitivityMultiplier: 9999.0
  },
  AUTO_FIRE: {
    enabled: true,
    minLockConfidence: 0.0
  }
};

function log(...args){
  if(CONFIG.DEBUG) console.log("[FF-PATCH]", ...args);
}


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

try {
  let json = null;
  try { json = JSON.parse(body); } catch(e) { json = null; }

  if (!json) {
    log("Không parse được JSON, trả về nguyên gốc.");
     $done({ body });
  }

  // --- Helper: ensure path ---
  function ensure(obj, path, defaultValue){
    let parts = path.split('.');
    let cur = obj;
    for(let i=0;i<parts.length-1;i++){
      if(!(parts[i] in cur) || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    if(!(parts[parts.length-1] in cur)) cur[parts[parts.length-1]] = defaultValue;
    return cur[parts[parts.length-1]];
  }

  // --- Patch cấu hình aim phổ biến ---
  const aimObjects = [
    json.aimSettings,
    json.settings && json.settings.aim,
    json.settings && json.settings.aimAssist,
    json.gameConfig && json.gameConfig.aimAssist,
    json.config && json.config.aim,
  ];

  for (let i = 0; i < aimObjects.length; i++) {
    if (!aimObjects[i]) continue;
    try {
      aimObjects[i].enabled = true;
      aimObjects[i].aimFOV = CONFIG.DEFAULT_AIMFOV;
      aimObjects[i].aimSmooth = CONFIG.AIM_SMOOTH;
      aimObjects[i].noRecoil = CONFIG.NO_RECOIL;
      aimObjects[i].autoHeadshot = CONFIG.AUTO_HEADSHOT;
      aimObjects[i].lockBone = CONFIG.LOCK_BONE;
      aimObjects[i].prediction = CONFIG.PREDICTION.enabled;
      aimObjects[i].predictionLead = CONFIG.PREDICTION.leadFactor;
      aimObjects[i].hyperSensitivity = {
        enabled: CONFIG.HYPER_SENSITY.enabled,
        chestRadius: CONFIG.HYPER_SENSITY.chestRadius,
        multiplier: CONFIG.HYPER_SENSITY.sensitivityMultiplier
      };
      aimObjects[i].autoFire = {
        enabled: CONFIG.AUTO_FIRE.enabled,
        minConfidence: CONFIG.AUTO_FIRE.minLockConfidence
      };
      log("Patched aim object:", aimObjects[i]);
    } catch(e) {
      log("Patch aim object error:", e);
    }
  }

  // --- Patch priority và headshot cho targets ---
  function deepPatchForTargets(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (let k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      let v = obj[k];
      if (v && typeof v === 'object') {
        if ('priority' in v) { v.priority = Math.max(9000, v.priority || 0); }
        if ('forceHeadshot' in v) { v.forceHeadshot = true; }
        if ('alwaysEnable' in v) { v.alwaysEnable = true; }
        if (v.boneName) { v.boneName = CONFIG.LOCK_BONE; }
        deepPatchForTargets(v);
      }
    }
  }

  deepPatchForTargets(json.targets || json.enemySettings || json.gameTargets);

  // --- Heuristics patch các key có liên quan FOV, recoil ---
  function heuristicsPatch(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (let k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      try {
        let v = obj[k];
        if (typeof v === 'object') heuristicsPatch(v);
        if (typeof v === 'number' && (k.toLowerCase().includes('fov') || k.toLowerCase().includes('aim'))) {
          obj[k] = Math.max(obj[k], CONFIG.DEFAULT_AIMFOV);
          log("Heuristic patched key:", k, "->", obj[k]);
        }
        if (typeof v === 'boolean' && (k.toLowerCase().includes('recoil') || k.toLowerCase().includes('norecoil'))) {
          obj[k] = CONFIG.NO_RECOIL;
          log("Heuristic patched bool:", k, "->", obj[k]);
        }
      } catch(e){ /* ignore */ }
    }
  }
  heuristicsPatch(json);

  // --- Nếu json là mảng, patch từng phần ---
  if (Array.isArray(json)) {
    json = json.map(item => {
      try {
        if (typeof item === 'object') {
          deepPatchForTargets(item);
          heuristicsPatch(item);
        }
        return item;
      } catch (e) { return item; }
    });
  }

  // --- Patch binary base64 nếu cần (giữ đoạn patchBinary cũ, không áp dụng tự động ở đây) ---
  if (typeof body === 'string' && /base64/i.test(body) && body.length > 1000) {
    log("Detected base64-like response; skip binary patch.");
    // Nếu cần có thể bổ sung patchBinary ở đây theo logic cũ
  }

  // --- Ghi lại meta patch ---
  ensure(json, 'settings.patch_meta', {});
  json.settings.patch_meta.last_patch = (new Date()).toISOString();
  json.settings.patch_meta.config = {
    aimFOV: CONFIG.DEFAULT_AIMFOV,
    noRecoil: CONFIG.NO_RECOIL,
    autoHeadshot: CONFIG.AUTO_HEADSHOT,
    hyperSensitivity: CONFIG.HYPER_SENSITY
  };

  body = JSON.stringify(json);
   $done({ body });

} catch (err) {
  log("Lỗi patch:", err);
   $done({ body });
}

const Vector3 = {
    distance: (a, b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
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

let lastEnemyHeadPos = null;
let lastPlayerPos = null;
let isTouchDragging = false;

if (typeof document !== 'undefined') {
    document.addEventListener("touchstart", () => isTouchDragging = true);
    document.addEventListener("touchend", () => isTouchDragging = false);
}

const aimSmoother = new AimSmoother(0.65);
// ==========================
// 1. Dữ liệu vị trí đầu địch
// ==========================
// ==========================
// 1. Dữ liệu vị trí đầu địch
// ==========================
let enemyHeadData = {
    position: {
        x: -0.0456970781,
        y: -0.004478302,
        z: -0.0200432576
    }
};

// ==========================
// 2. Biến trạng thái lock
// ==========================
let isHeadLocked = false;
let isDragging = false;
let isShooting = false;
let currentAimPos = { x: 0, y: 0, z: 0 };

// ==========================
// 3. Vector3 - Tính khoảng cách
// ==========================
const Vector3 = {
    distance: (a, b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
};

// ==========================
// 4. Hàm di chuyển aim
// ==========================
function aimTo(vec3) {
    console.log(`🎯 AimTo -> X=${vec3.x.toFixed(3)}, Y=${vec3.y.toFixed(3)}, Z=${vec3.z.toFixed(3)}`);
    // TODO: Hook API game để di chuyển tâm ngắm
}

// ==========================
// 5. Giới hạn không vượt quá đỉnh đầu
// ==========================
function clampAimToHead(currentPos, headPos) {
    let clamped = { ...currentPos };
    if (clamped.y > headPos.y) {
        clamped.y = headPos.y;
    }
    return clamped;
}

// ==========================
// 6. Tự động căn chỉnh bắn chính xác
// ==========================
function autoPrecisionHeadshot() {
    if (isHeadLocked) {
        aimTo(enemyHeadData.position);
    }
}

// ==========================
// 7. Xử lý khi drag di chuyển
// ==========================
function onDragMove(newAimPos) {
    newAimPos = clampAimToHead(newAimPos, enemyHeadData.position);

    if (!isHeadLocked) {
        const dist = Vector3.distance(newAimPos, enemyHeadData.position);
        if (dist < 0.05) {
            isHeadLocked = true;
            console.log("🔒 Locked on enemy head!");
        }
    }

    if (isHeadLocked) {
        aimTo(enemyHeadData.position);
    } else {
        aimTo(newAimPos);
    }
}

// ==========================
// 8. Giả lập input drag và bắn
// ==========================

// Hàm giả lập bắt đầu kéo
function startDrag() {
    isDragging = true;
}

// Hàm giả lập thả kéo
function endDrag() {
    isDragging = false;
    isHeadLocked = false;
}

// Hàm giả lập di chuyển drag
function moveDrag(x, y) {
    if (!isDragging) return;
    currentAimPos = { x: x, y: y, z: 0 };
    onDragMove(currentAimPos);
}

// Hàm giả lập nhấn bắn
function startShooting() {
    isShooting = true;
    autoPrecisionHeadshot();
}

// Hàm giả lập nhả bắn
function stopShooting() {
    isShooting = false;
}

// ==========================
// 9. Vòng lặp game tick
// ==========================
setInterval(() => {
    if (isShooting && isHeadLocked) {
        autoPrecisionHeadshot();
    }
}, 16);

// ==========================
// 10. Giả lập enemy di chuyển khi lock
// ==========================
setInterval(() => {
    if (isHeadLocked) {
        enemyHeadData.position.x += (Math.random() - 0.5) * 0.01;
        enemyHeadData.position.y += (Math.random() - 0.5) * 0.01;
    }
}, 100);

// ==========================
// 11. Ví dụ chạy thử
// ==========================
startDrag();
moveDrag(-0.04, -0.004); // kéo tới gần đầu
startShooting();
// === Core Functions ===
function fixBulletDrift(targetPos, playerPos, bulletSpeed = 95, predictionFactor = 1.0) {
    const direction = {
        x: targetPos.x - playerPos.x,
        y: targetPos.y - playerPos.y,
        z: targetPos.z - playerPos.z
    };
    const distance = Vector3.distance(playerPos, targetPos);
    const travelTime = distance / bulletSpeed;
    return {
        x: targetPos.x + direction.x * predictionFactor * travelTime,
        y: targetPos.y + direction.y * predictionFactor * travelTime,
        z: targetPos.z + direction.z * predictionFactor * travelTime
    };
}

function correctCrosshairOffset(crosshair, targetHead, offsetThreshold = 0.05) {
    const dx = Math.abs(crosshair.x - targetHead.x);
    const dy = Math.abs(crosshair.y - targetHead.y);
    const dz = Math.abs(crosshair.z - targetHead.z);
    if (dx > offsetThreshold || dy > offsetThreshold || dz > offsetThreshold) {
        return { x: targetHead.x, y: targetHead.y, z: targetHead.z };
    }
    return crosshair;
}

function updateAimbot(crosshair, playerPos, enemy) {
    const headPos = enemy.headPos;
    const chestPos = enemy.chestPos;

    let enemyVelocity = lastEnemyHeadPos ? Vector3.distance(headPos, lastEnemyHeadPos) : 0;
    let playerVelocity = lastPlayerPos ? Vector3.distance(playerPos, lastPlayerPos) : 0;
    lastEnemyHeadPos = { ...headPos };
    lastPlayerPos = { ...playerPos };

    const isEnemyMoving = enemyVelocity > 0.01;
    const isPlayerMoving = playerVelocity > 0.01;
    const isDynamicLock = isEnemyMoving || isPlayerMoving;

    let isRedDotActive = Vector3.distance(crosshair, headPos) < 0.15;

    let aimedPos = magneticAimChestToHead(crosshair, chestPos, headPos, isDynamicLock, isRedDotActive);

    // Sử dụng smoothing cao hơn khi tâm đỏ
    let smoothedAim = aimSmoother.smooth(aimedPos, isRedDotActive);
if (target) {
  // Khóa tâm ngắm chặt vào vị trí đầu chuẩn
  lockAimToHead(enemyHeadData);

  // Bắn tự động nếu cần
  triggerFire();

  // Quay camera theo vị trí đầu
  cameraLookAt(enemyHeadData.position.x, enemyHeadData.position.y, enemyHeadData.position.z);
}
    return magneticAimChestToHead(smoothedAim, chestPos, headPos, isDynamicLock, isRedDotActive);
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
        aimTo(targetHead); // snap chuẩn vào đầu
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
    if (json && json.data) {
        json.data = json.data.map(entry => {
            if (entry && typeof entry.value === 'string' && entry.value.includes("base64")) {
                let b64 = entry.value.split(',')[1];
                let patched = patchBinary(b64, AIMFOV_FIND, AIMFOV_REPLACE);
                patched = patchBinary(patched, NORECOIL_FIND, NORECOIL_REPLACE);
                entry.value = "data:application/octet-stream;base64," + patched;
            }

            entry.ForceHeadshot = true;
            entry.IsCritical = true;
            entry.Priority = 9999;
            entry.AlwaysEnable = true;
            entry.HighAccuracy = true;
            entry.DisableSpread = true;
            entry.BulletLinearity = 1.0;

            if (entry.position) {
                entry.position.x = -0.128512;
                entry.position.y = 0.0;
                entry.position.z = 0.0;
            }

            return entry;
        });

        const playerPos = { x: 0, y: 0, z: 0 };
        const crosshair = { x: 0, y: 0, z: 0 };
        const enemyList = json.data.filter(e => e && e.position).map(e => {
            const pos = e.position;
            return {
                pos: { x: pos.x, y: pos.y, z: pos.z },
                chestPos: { x: pos.x, y: pos.y + 1.0, z: pos.z },
                headPos: { x: pos.x, y: pos.y + 1.6, z: pos.z }
            };
        });

        const target = autoLockNearest(playerPos, enemyList);
        if (target) {
            // Dữ liệu vị trí đầu địch chính xác
const enemyHeadData = {
  position: {
    x: -0.0456970781,
    y: -0.004478302,
    z: -0.0200432576
  },
  rotation: {
    x: 0.0258174837,
    y: -0.08611039,
    z: -0.1402113,
    w: 0.9860321
  },
  scale: {
    x: 0.99999994,
    y: 1.00000012,
    z: 1.0
  }
};

// Hàm giả lập điều tâm (aim)
function aimTo(vec3) {
  console.log("🎯 AimTo:", vec3);
  // Ở đây bạn gọi API native game để di chuyển tâm ngắm
}

// Hàm khóa tâm ngắm chặt vào đầu
function lockAimToHead(enemyHeadData) {
  const preciseHeadPos = enemyHeadData.position;

  // Gọi hàm aimTo với vị trí chính xác đầu
  aimTo(preciseHeadPos);
}

// Ví dụ gọi hàm khóa tâm ngắm chặt
lockAimToHead(enemyHeadData);
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

    // Nếu lỗi parse JSON, thử patch config chung nếu có
    let json = null;
    try {
        json = JSON.parse(body);
    } catch {}

    if (json) {
        const aimConfigs = [
            json.aimSettings,
            json.settings?.aimAssist,
            json.gameConfig?.aimAssist,
            json.config?.aim,
            json.settings?.aim
        ];

        for (let config of aimConfigs) {
            if (!config) continue;
            config.enabled = true;
            config.aimFOV = 999;
            config.aimSmooth = 0;
            config.noRecoil = true;
            config.autoHeadshot = true;
            config.lockBone = "head";
            config.prediction = true;
            config.autoFire = true;
        }

        // Patch target priority và force headshot
        function patchTargets(obj) {
            if (!obj || typeof obj !== 'object') return;
            for (const key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                let v = obj[key];
                if (v && typeof v === 'object') {
                    if ('priority' in v) v.priority = 9999;
                    if ('forceHeadshot' in v) v.forceHeadshot = true;
                    if ('alwaysEnable' in v) v.alwaysEnable = true;
                    patchTargets(v);
                }
            }
        }
        patchTargets(json.targets || json.enemySettings || json.gameTargets);

        body = JSON.stringify(json);
    }

    $done({ body });

}
