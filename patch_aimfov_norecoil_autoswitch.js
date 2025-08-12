// ==UserScript==
// @name         Patch AIMFOV + NORECOIL + AutoSwitch Head/Chest + Full Aim Assist + TouchDrag + HeadLock
// @namespace    http://garena.freefire/
// @match        *api.ff.garena.com*
// @run-at       response
// ==/UserScript==
// === INIT BODY HANDLER ===
let body = "";
let json = null;

// Ưu tiên lấy body từ request nếu có
if (typeof $request !== 'undefined' && $request.body) {
    body = $request.body;
} 
// Nếu không có request body thì thử lấy response body
else if (typeof $response !== 'undefined' && $response.body) {
    body = $response.body;
}

// Nếu body là object -> stringify
if (typeof body === 'object') {
    try { body = JSON.stringify(body); } catch (e) { body = ""; }
}

// Thử parse JSON
try {
    json = JSON.parse(body);
} catch (e) {
    json = null; // Nếu không phải JSON thì để null, các patch phía dưới sẽ xử lý raw body
}
const CONFIG = {
  lockHoldTime: 9999,   // ms giữ lock khi đã ở đầu
  AUTO_SWITCH: true,
  DEBUG: true,
  DEFAULT_AIMFOV: 999,
  AIM_SMOOTH: 0,
  NO_RECOIL: true,
  AUTO_HEADSHOT: true,
  LOCK_BONE: "head",

  PREDICTION: { enabled: true, leadFactor: 1.0 },

  HYPER_SENSITY: {
    enabled: true,
    chestRadius: 0.001,
    sensitivityMultiplier: 9999.0
  },

  AUTO_FIRE: {
    enabled: true,
    minLockConfidence: 0.0
  },

  
  sensitivity: 9999.0,
  autoHeadLock: true,
  aimLockHead: true,
  headLockFov: 520,
  aimFov: 380,
  predictiveMultiplier: 0.1,
  superHeadLock: 9999.0,
  aimSmoothnessNear: 0.00001,
  aimSmoothnessFar: 0.00001,
  triggerFireChance: 1.0,
  quantumAiming: true,
  neuralPrediction: true,
  adaptiveAI: true,
  multiThreaded: true,
  ghostMode: true,
  perfectHumanization: true,
  realTimeML: true,
  contextualAwareness: true,
  wallPenetration: true,
  magicBullet: true,
  magicTrick: true, // New MagicTrick feature
  stealthMode: true,
  behaviorCloning: true,
  naturalJitter: { min: 0.0, max: 0.0 },
  humanReactionTime: { min: 0, max: 0 },
  organicMovement: true,
  biometricMimicry: true,
  mousePersonality: 'ultra_adaptive',
  antiPatternDetection: true,
  hyperOptimization: true,
  quantumCalculations: true,
  memoryOptimization: true,
  realTimeAdaptation: true,
  cacheOptimization: true,

  smoothingFrames: 5,
  frameDelay: 5,
  noiseLevel: 0.2,
  recoilCancelFactor: 1.0,
  fpsLogInterval: 1000,
  trackHistoryLimit: 50,
  enableGhostOverlay: true,
  enableOneShotAI: true,
  adaptiveSensitivity: true,
  stabilizationWindow: 7,

  wasmAcceleration: true,
  threadPoolSize: 12,
  maxCalculationsPerFrame: 30,
  rapidHeadSwitch: true,
  dynamicHeadPriority: true,
  ultraSmoothTransition: true,
  contextualHeadLock: true,

  // MagicTrick Configuration
  magicTrickConfig: {
    enabled: true,
    headAttraction: 9999.0, // Strength of head attraction
    adaptiveMagic: true, // Adjust based on game context
    magicSwitchSpeed: 0.0001, // Speed of switching to new head target
    magicConfidence: 0.0, // Confidence threshold for magic trick activation
    visualFeedback: true, // Enable visual feedback for magic trick
    lockPersistence: 9999.0 // Time to maintain head lock (seconds)
  },

  // Master Weapon Profiles
  tracking: {
    default: { 
      speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
    mp40: { 
     speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
    thompson: { 
         speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
    ump: { 
         speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
        m1887: { 
        speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    }
  },

  // Advanced Sensitivity Matrix
  sensiActivity: {
    default: 9999.0,
    mp40: 9999.0,
    thompson: 9999.0,
    ump: 9999.0,
    m1887: 9999.0
  },

  // Enhanced Target Priority System
  targetPriority: {
    head: 230,
    neck: 130,
    chest: 90,
    limbs: 60,
    distance: 1.6,
    health: 1.2,
    threat: 1.5,
    movement: 1.3,
    cover: 0.5,
    teamPriority: 2.0,
    visibility: 1.7,
    exposureTime: 1.4
  },

  // AI Learning System
  aiLearning: {
    enabled: true,
    learningRate: 0.25,
    memoryDepth: 120,
    adaptationSpeed: 0.18,
    patternRecognition: true,
    behaviorAnalysis: true,
    performanceFeedback: true,
    maxTrainingSamples: 2500
  },

  // Quantum Physics Engine
  quantumPhysics: {
    enabled: true,
    uncertaintyPrinciple: 0.0006,
    quantumTunneling: true,
    superposition: true,
    entanglement: true,
    quantumCurveFluctuation: 0.0004
  },

  // Magic Bullet Settings
  magicBulletConfig: {
    enabled: true,
    curve: 3.5,
    prediction: 1.5,
    wallBypass: true,
    trajectoryOptimization: true,
    dynamicCurveAdjustment: true,
    adaptiveTrajectory: {
      smg: { curve: 3.0, prediction: 1.3 },
      sniper: { curve: 4.5, prediction: 1.7 }
    },
    magicBurstMode: { enabled: true, burstBoost: 1.2, maxBurst: 5 }
  },

  // Trigger Bot Settings
  triggerBot: {
    enabled: true,
    delay: { min: 0, max: 0 },
    burstMode: true,
    smartTrigger: true,
    safeMode: true,
    adaptiveBurst: true
  }
};
function log(...args){
  if(CONFIG.DEBUG) console.log("[FF-PATCH]", ...args);
}




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

const aimSmoother = new AimSmoother(0.2);
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
let boneHead = {
    position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
    rotation: {
        x: 0.0258174837,
        y: -0.08611039,
        z: -0.1402113,
        w: 0.9860321
    }
};
// ==========================
// 2. Biến trạng thái lock
// ==========================
let isHeadLocked = true;
let isDragging = false;
let isShooting = false;
let currentAimPos = { x: -0.128512, y: 0.0, z: 0.0 };
let cam = new Vector3(0, 0, 0);
let head = new Vector3(-0.04089227, 0.00907892, 0.02748467);
// ==========================
// 3. Vector3 - Tính khoảng cách
// ==========================
function quaternionToVectors(q) {
    // forward vector
    let forward = {
        x: 2 * (q.x * q.z + q.w * q.y),
        y: 2 * (q.y * q.z - q.w * q.x),
        z: 1 - 2 * (q.x * q.x + q.y * q.y)
    };
    // up vector
    let up = {
        x: 2 * (q.x * q.y - q.w * q.z),
        y: 1 - 2 * (q.x * q.x + q.z * q.z),
        z: 2 * (q.y * q.z + q.w * q.x)
    };
    // right vector
    let right = {
        x: 1 - 2 * (q.y * q.y + q.z * q.z),
        y: 2 * (q.x * q.y + q.w * q.z),
        z: 2 * (q.x * q.z - q.w * q.y)
    };
    return { forward, up, right };
}

// Giả lập hàm worldToScreen
function worldToScreen(pos) {
    // Ở đây bạn sẽ dùng API/game engine để convert 3D -> 2D
    // Mình để ví dụ giả lập
    return { x: pos.x * 100, y: pos.y * 100 };
}

// Cập nhật vùng headshot theo rotation
function updateHeadshotZone(boneHead) {
    let q = boneHead.rotation;
    let { up, right } = quaternionToVectors(q);

    // Tâm đầu ở screen space
    let headCenter = worldToScreen(boneHead.position);

    // Kích thước vùng headshot (theo tỉ lệ màn hình)
    let halfWidth = 0.05;  // 5% màn hình
    let halfHeight = 0.075; // 7.5% màn hình

    // Điều chỉnh vùng theo hướng đầu
    headshotPriorityZone.xMin = headCenter.x - halfWidth;
    headshotPriorityZone.xMax = headCenter.x + halfWidth;
    headshotPriorityZone.yMin = headCenter.y - halfHeight;
    headshotPriorityZone.yMax = headCenter.y + halfHeight;
}

function enhancedBlendTargets(head, neck, chest, weapon) {
    const track = config.tracking[weapon] || config.tracking.default;
    if (config.aimLockHead && config.dynamicHeadPriority && config.magicTrick) {
      return head;
    }
    const headWeight = track.headBias / (track.headBias + track.neckBias + track.chestBias);
    const neckWeight = track.neckBias / (track.headBias + track.neckBias + track.chestBias);
    const chestWeight = track.chestBias / (track.headBias + track.neckBias + track.chestBias);
    return {
      x: head.x * headWeight + neck.x * neckWeight + chest.x * chestWeight,
      y: head.y * headWeight + neck.y * neckWeight + chest.y * chestWeight
    };
  }

  // Advanced Recoil Compensation
  function advancedRecoilCompensation(weapon, shotCount, deltaTime) {
    if (!config.tracking[weapon]?.recoilPattern) return { x: 0, y: 0 };
    const weaponData = config.tracking[weapon] || config.tracking.default;
    const pattern = weaponData.recoilPattern;
    const patternIndex = Math.min(shotCount, pattern.length - 1);
    const nextIndex = Math.min(shotCount + 1, pattern.length - 1);
    const t = Math.min(shotCount % 1, 1);
    const currentRecoil = QuantumMathEngine.neuralLerp(pattern[patternIndex] || 0, pattern[nextIndex] || 0, t);
    const intensity = Math.min(shotCount * 0.1, 1.0) * (2 - weaponData.stability);
    const stabilityBonus = weaponData.stability * 0.65;
    const magicFactor = config.magicTrick ? 1 - config.magicTrickConfig.headAttraction * 0.05 : 1;
    return { x: currentRecoil * intensity * (1 - stabilityBonus) * magicFactor, y: currentRecoil * intensity * (1 - stabilityBonus) * magicFactor };
  }

  // Magic Bullet and Magic Trick System
  function magicBulletAdjustment(current, target, weapon, distance) {
    if (!config.magicBullet || !config.magicBulletConfig.enabled) return { x: 0, y: 0 };
    const weaponData = config.tracking[weapon] || config.tracking.default;
    let curve = config.magicBulletConfig.curve;
    let prediction = config.magicBulletConfig.prediction;

    // Adaptive trajectory based on weapon type
    if (config.magicBulletConfig.adaptiveTrajectory) {
      if (weaponData.speed > 35) { // SMG
        curve *= 0.9;
        prediction *= 0.95;
      } else if (weaponData.speed < 25) { // Sniper
        curve *= 1.2;
        prediction *= 1.1;
      }
    }

    // Dynamic curve adjustment based on distance
    if (config.magicBulletConfig.dynamicCurveAdjustment) {
      curve *= (distance < 70 ? 1.5 : distance > 400 ? 0.5 : 1.0);
    }

    // Burst mode boost
    if (config.magicBulletConfig.magicBurstMode?.enabled && gameState.recoilState.shotCount > 0) {
      curve *= 1 + (gameState.recoilState.shotCount / config.magicBulletConfig.magicBurstMode.maxBurst) * config.magicBulletConfig.magicBurstMode.burstBoost;
    }

    // Magic Trick enhancement
    let magicTrickBoost = 1;
    if (config.magicTrick && config.magicTrickConfig.enabled && gameState.magicTrickState.magicConfidence > config.magicTrickConfig.magicConfidence) {
      magicTrickBoost = config.magicTrickConfig.headAttraction;
      curve *= magicTrickBoost;
      prediction *= magicTrickBoost;
      gameState.magicTrickState.lastHeadLock = Date.now();
    }

    // Quantum fluctuation
    const quantumFluctuation = config.quantumPhysics.enabled ? (Math.random() - 0.5) * config.quantumPhysics.quantumCurveFluctuation : 0;

    const angle = Math.atan2(target.y - current.y, target.x - current.x);
    const curveIntensity = Math.min(distance / 100, 1) * curve;
    return {
      x: Math.cos(angle + Math.PI/2) * curveIntensity * weaponData.penetration * magicTrickBoost + quantumFluctuation,
      y: Math.sin(angle + Math.PI/2) * curveIntensity * weaponData.penetration * magicTrickBoost + quantumFluctuation
    };
  }

  // Rapid Head Switch System with Magic Trick
  function rapidHeadSwitch(targets, currentTarget, currentPos, weapon) {
    if (!config.rapidHeadSwitch || targets.length <= 1) return currentTarget;
    const weaponData = config.tracking[weapon] || config.tracking.default;
    let bestHead = null;
    let bestScore = -1;
    const now = Date.now();
    targets.forEach(target => {
      if (target.bodyPart !== 'head') return;
      const distance = QuantumMathEngine.quantumDistance(currentPos, target.position);
      let score = config.targetPriority.head * (2500 / (distance + 1)) * config.targetPriority.distance;
      if (distance < weaponData.criticalZone) score += 50;
      if (target.visibility) score += target.visibility * config.targetPriority.visibility;
      if (target.exposureTime) score += target.exposureTime * config.targetPriority.exposureTime;
      if (config.magicTrick && now - gameState.magicTrickState.lastHeadLock < config.magicTrickConfig.lockPersistence * 1000) {
        score *= config.magicTrickConfig.magicSwitchSpeed;
      }
      if (score > bestScore) {
        bestScore = score;
        bestHead = target;
      }
    });
    if (bestHead && config.magicTrick) {
      gameState.magicTrickState.activeTarget = bestHead;
      gameState.magicTrickState.magicConfidence = bestScore / (2500 * config.targetPriority.distance);
    }
    return bestHead || currentTarget;
  }

  // Ultimate Target Selection
  function ultimateTargetSelection(targets, currentPos, weapon) {
    if (!config.multiThreaded || targets.length <= 1) return targets[0];
    let bestTarget = null;
    let bestScore = -1;
    const weaponData = config.tracking[weapon] || config.tracking.default;
    targets.forEach(target => {
      let score = 0;
      const distance = QuantumMathEngine.quantumDistance(currentPos, target.position);
      const criticalZone = weaponData.criticalZone || 15;
      score += (3000 / (distance + 1)) * config.targetPriority.distance;
      if (target.bodyPart === 'head') {
        score += config.targetPriority.head;
        if (distance < criticalZone) score += 50;
      } else if (target.bodyPart === 'neck') {
        score += config.targetPriority.neck;
        if (distance < criticalZone) score += 40;
      } else if (target.bodyPart === 'chest') {
        score += config.targetPriority.chest;
      } else {
        score += config.targetPriority.limbs;
      }
      if (target.health) score += (100 - target.health) * config.targetPriority.health;
      if (target.threatLevel) score += target.threatLevel * config.targetPriority.threat;
      if (target.movementSpeed) score += target.movementSpeed * config.targetPriority.movement;
      if (target.armor) score -= target.armor * config.targetPriority.cover;
      if (target.visibility) score += target.visibility * config.targetPriority.visibility;
      if (target.exposureTime) score += target.exposureTime * config.targetPriority.exposureTime;
      if (weaponData.penetration && target.armor) score *= (1 - target.armor * (1 - weaponData.penetration));
      if (config.magicTrick && target.bodyPart === 'head') {
        score *= config.magicTrickConfig.headAttraction;
      }
      if (score > bestScore) {
        bestScore = score;
        bestTarget = target;
      }
    });
    return config.rapidHeadSwitch ? rapidHeadSwitch(targets, bestTarget, currentPos, weapon) : bestTarget;
  }

  // Dynamic Sensitivity System
  function calculateUltimateSensitivity(weapon, distance, targetSpeed, shotCount) {
    const weaponData = config.tracking[weapon] || config.tracking.default;
    let baseSensi = config.sensiActivity[weapon] || config.sensiActivity.default;
    const distanceMultiplier = distance > 450 ? 0.6 : distance > 250 ? 0.75 : distance < 25 ? 1.5 : 1.0;
    const speedMultiplier = targetSpeed > 22 ? 1.35 : targetSpeed > 15 ? 1.25 : targetSpeed < 0.8 ? 0.7 : 1.0;
    const recoilMultiplier = shotCount > 8 ? 0.82 : 1.0;
    const stabilityBonus = weaponData.stability * 0.2;
    const magicFactor = config.magicTrick ? 1 + config.magicTrickConfig.headAttraction * 0.05 : 1;
    return baseSensi * distanceMultiplier * speedMultiplier * recoilMultiplier * (1 + stabilityBonus) * magicFactor;
  }

  // Ultimate Aim Adjustment
  function ultimateAdjustAim(current, head, neck, chest, weapon = 'default', options = {}) {
    const { velocity = { x: 0, y: 0 }, acceleration = { x: 0, y: 0 }, jerk = { x: 0, y: 0 }, pingMs = 15, targetSpeed = 0, deltaTime = 16.67, targets = [], context = {} } = options;
    if (config.hyperOptimization && gameState.performanceProfile.fps < 20) return gameState.lastAim;
    const weaponData = config.tracking[weapon] || config.tracking.default;
    const selectedTarget = config.rapidHeadSwitch ? rapidHeadSwitch(targets, head, current, weapon) : head;
    const blendedTarget = enhancedBlendTargets(selectedTarget, neck, chest, weapon);
    const predicted = NeuralPredictor.neuralPredict(blendedTarget, velocity, acceleration, jerk, pingMs, weapon, context);
    const distance = QuantumMathEngine.quantumDistance(current, predicted);
    if (!config.autoHeadLock || distance > config.headLockFov) return gameState.lastAim;
    const vector = QuantumMathEngine.quantumVector(current, predicted, config.magicTrick);
    let dx = vector.x * weaponData.speed * weaponData.pullRate * 0.09;
    let dy = vector.y * weaponData.speed * weaponData.pullRate * 0.09;
    const recoilComp = advancedRecoilCompensation(weapon, gameState.recoilState.shotCount, deltaTime);
    dx += recoilComp.x;
    dy += recoilComp.y;
    const magicAdj = magicBulletAdjustment(current, predicted, weapon, distance);
    dx += magicAdj.x;
    dy += magicAdj.y;
    const baseSmoothness = distance > 120 ? config.aimSmoothnessFar : config.aimSmoothnessNear;
    const weaponSmoothness = baseSmoothness * weaponData.stability;
    const smoothnessFactor = config.ultraSmoothTransition ? QuantumMathEngine.neuralLerp(0, 1, weaponSmoothness, 'smoother') : weaponSmoothness;
    if (distance < weaponData.closeBoost) {
      const boostFactor = (weaponData.closeBoost - distance) / weaponData.closeBoost;
      dx *= (1 + boostFactor * 0.45);
      dy *= (1 + boostFactor * 0.45);
    }
    const smoothed = {
      x: current.x + dx * smoothnessFactor,
      y: current.y + dy * smoothnessFactor
    };
    const humanized = PerfectHumanization.generateOrganicMovement(current, smoothed, smoothnessFactor, gameState.humanizationProfile.personality);
    if (config.wasmAcceleration && wasmModule) {
      const optimized = wasmModule.optimizeTrajectory(humanized.x, humanized.y, distance);
      gameState.lastAim = { x: optimized.x, y: optimized.y };
    } else {
      gameState.lastAim = humanized;
    }
    if (config.magicTrickConfig.visualFeedback) {
      gameState.performanceProfile.magicTrickConfidence = gameState.magicTrickState.magicConfidence;
    }
    return gameState.lastAim;
  }

  // Ultimate Aim Function
  function ultimateAim(current, head, neck, chest, weapon = 'default', options = {}) {
    const startTime = performance.now();
    const aimed = ultimateAdjustAim(current, head, neck, chest, weapon, options);
    const distance = QuantumMathEngine.quantumDistance(current, head);
    const dynamicSensi = calculateUltimateSensitivity(weapon, distance, options.targetSpeed || 0, gameState.recoilState.shotCount);
    const sensitivityMultiplier = config.sensitivity * dynamicSensi;
    const confidence = calculateAimConfidence(current, head, weapon, distance);
    const stability = (config.tracking[weapon] || config.tracking.default).stability;
    const calcTime = performance.now() - startTime;
    updatePerformanceMetrics(options.fps || 60, calcTime);
    return {
      x: aimed.x * sensitivityMultiplier,
      y: aimed.y * sensitivityMultiplier,
      confidence,
      stability,
      distance,
      weapon,
      magicTrickConfidence: config.magicTrickConfig.visualFeedback ? gameState.performanceProfile.magicTrickConfidence : undefined
    };
  }

  // Enhanced Trigger Bot
  function ultimateTriggerBot(targetDistance, weapon, targetHealth = 100) {
    if (!config.triggerBot.enabled) return false;
    const now = Date.now();
    const weaponData = config.tracking[weapon] || config.tracking.default;
    if (config.triggerBot.safeMode && gameState.performanceProfile.fps < 25) return false;
    if (config.triggerBot.smartTrigger) {
      const isInRange = targetDistance < config.aimFov;
      const isInCriticalZone = targetDistance < weaponData.criticalZone;
      const canPenetrate = weaponData.penetration > 0.7;
      if (!isInRange && !canPenetrate) return false;
      if (isInCriticalZone && targetHealth < 15) return true;
    }
    if (config.triggerBot.burstMode && gameState.triggerState?.burstCount > 0) {
      gameState.triggerState.burstCount--;
      return true;
    }
    if (now - (gameState.triggerState?.lastTrigger || 0) < config.triggerBot.delay.min) return false;
    const shouldFire = Math.random() < config.triggerFireChance && targetDistance < config.aimFov;
    if (shouldFire) {
      gameState.triggerState = { lastTrigger: now, burstCount: config.triggerBot.adaptiveBurst ? Math.floor(Math.random() * (targetHealth > 50 ? 3 : 6)) + 1 : 0 };
    }
    if (config.magicTrick && shouldFire && gameState.magicTrickState.magicConfidence > config.magicTrickConfig.magicConfidence) {
      gameState.magicTrickState.lastHeadLock = now;
    }
    return shouldFire;
  }

  // Aim Confidence Calculator
  function calculateAimConfidence(current, target, weapon, distance) {
    const weaponData = config.tracking[weapon] || config.tracking.default;
    let confidence = weaponData.stability;
    if (distance > 550) confidence -= 0.55;
    else if (distance > 350) confidence -= 0.35;
    else if (distance < weaponData.criticalZone) confidence += 0.35;
    if (weaponData.speed > 35) confidence += 0.2;
    if (weaponData.headBias > 60) confidence += 0.25;
    if (weaponData.penetration > 0.9) confidence += 0.2;
    if (gameState.performanceProfile.fps < 25) confidence -= 0.45;
    else if (gameState.performanceProfile.fps > 85) confidence += 0.25;
    if (config.neuralPrediction && gameState.neuralNetwork.weights.size > 1200) confidence += 0.2;
    if (config.magicTrick && gameState.magicTrickState.magicConfidence > config.magicTrickConfig.magicConfidence) {
      confidence += config.magicTrickConfig.headAttraction * 0.1;
    }
    gameState.magicTrickState.magicConfidence = confidence;
    return Math.min(1.0, Math.max(0.1, confidence));
  }

  // Performance Monitoring
  function updatePerformanceMetrics(fps, calcTime) {
    gameState.performanceProfile.fps = fps;
    gameState.performanceProfile.latency = gameState.performanceProfile.latency * 0.9 + calcTime * 0.1;
    if (config.memoryOptimization) {
      if (gameState.targetMemory.size > config.aiLearning.memoryDepth) {
        const oldestKey = gameState.targetMemory.keys().next().value;
        gameState.targetMemory.delete(oldestKey);
      }
      if (gameState.aiMemory.size > config.aiLearning.memoryDepth) {
        const oldestKey = gameState.aiMemory.keys().next().value;
        gameState.aiMemory.delete(oldestKey);
      }
      if (gameState.neuralNetwork.activations.length > config.aiLearning.maxTrainingSamples) {
        gameState.neuralNetwork.activations.shift();
      }
    }
  }

  // Neural Training
  function trainNeuralNet(sample) {
    if (!config.aiLearning.enabled) return;
    gameState.neuralNetwork.activations.push(sample);
    if (gameState.neuralNetwork.activations.length > config.aiLearning.maxTrainingSamples) {
      gameState.neuralNetwork.activations.shift();
    }
    const networkKey = `${sample.weapon}_prediction`;
    const weights = gameState.neuralNetwork.weights.get(networkKey) || { x: Math.random(), y: Math.random() };
    weights.x += config.aiLearning.learningRate * (Math.random() - 0.5) * 0.07;
    weights.y += config.aiLearning.learningRate * (Math.random() - 0.5) * 0.07;
    gameState.neuralNetwork.weights.set(networkKey, weights);
    if (config.magicTrick && sample.target?.bodyPart === 'head') {
      gameState.magicTrickState.magicConfidence += 0.05;
    }
  }

  // Shot Management
  function onShot(weapon, target) {
    gameState.recoilState.shotCount++;
    gameState.recoilState.lastShot = Date.now();
    gameState.recoilState.weapon = weapon;
    if (config.aiLearning.enabled && target) {
      trainNeuralNet({ weapon, target, timestamp: Date.now() });
    }
    setTimeout(() => {
      if (Date.now() - gameState.recoilState.lastShot > 1200) {
        gameState.recoilState.shotCount = 0;
      }
    }, 1200);
  }
const NeuralPredictor = {
    neuralPredict(target, velocity, acceleration, jerk, ping, weapon, context = {}) {
      const t = ping / 1000.0;
      const weaponData = config.tracking[weapon] || config.tracking.default;
      let predicted = {
        x: target.x + velocity.x * t * config.predictiveMultiplier,
        y: target.y + velocity.y * t * config.predictiveMultiplier
      };
      if (acceleration && (Math.abs(acceleration.x) > 0.1 || Math.abs(acceleration.y) > 0.1)) {
        const accelFactor = this.calculateAccelFactor(velocity, acceleration);
        predicted.x += 0.5 * acceleration.x * t * t * accelFactor;
        predicted.y += 0.5 * acceleration.y * t * t * accelFactor;
      }
      if (jerk && (Math.abs(jerk.x) > 0.1 || Math.abs(jerk.y) > 0.1)) {
        const jerkWeight = this.calculateJerkWeight(acceleration, jerk);
        predicted.x += (1/6) * jerk.x * t * t * t * jerkWeight;
        predicted.y += (1/6) * jerk.y * t * t * t * jerkWeight;
      }
      if (config.neuralPrediction && gameState.neuralNetwork.weights.size > 0) {
        const neuralAdjustment = this.neuralAdjust(predicted, velocity, weapon);
        predicted.x += neuralAdjustment.x;
        predicted.y += neuralAdjustment.y;
      }
      const quantumFactor = weaponData.speed > 30 ? 1.25 : 1.1;
      predicted.x *= config.predictiveMultiplier * quantumFactor;
      predicted.y *= config.predictiveMultiplier * quantumFactor;
      if (config.contextualHeadLock && context.engagement === 'high') {
        predicted.x *= 1.05;
        predicted.y *= 1.05;
      }
      if (config.magicTrick && gameState.magicTrickState.magicConfidence > config.magicTrickConfig.magicConfidence) {
        predicted.x *= config.magicTrickConfig.headAttraction;
        predicted.y *= config.magicTrickConfig.headAttraction;
      }
      return predicted;
    },
    calculateAccelFactor(velocity, acceleration) {
      const speedMagnitude = Math.hypot(velocity.x, velocity.y);
      const accelMagnitude = Math.hypot(acceleration.x, acceleration.y);
      const input = (speedMagnitude * 0.07) + (accelMagnitude * 0.03);
      return QuantumMathEngine.sigmoidActivation(input - 0.3) * 1.7 + 0.3;
    },
    calculateJerkWeight(acceleration, jerk) {
      const accelMag = Math.hypot(acceleration.x, acceleration.y);
      const jerkMag = Math.hypot(jerk.x, jerk.y);
      return jerkMag === 0 ? 0 : Math.min(1.0, accelMag / (jerkMag + 1)) * 0.9;
    },
    neuralAdjust(predicted, velocity, weapon) {
      const networkKey = `${weapon}_prediction`;
      const weights = gameState.neuralNetwork.weights.get(networkKey) || { x: 0, y: 0 };
      const speedFactor = Math.hypot(velocity.x, velocity.y) * 0.007;
      return {
        x: weights.x * speedFactor * Math.sin(Date.now() * 0.0007),
        y: weights.y * speedFactor * Math.cos(Date.now() * 0.0007)
      };
    },
    aiPatternAnalysis(targetId, currentPos, velocity, context = {}) {
      const history = gameState.targetMemory.get(targetId) || [];
      if (history.length < 5) return currentPos;
      const patterns = {
        linear: this.analyzeLinearPattern(history),
        circular: this.analyzeCircularPattern(history),
        zigzag: this.analyzeZigzagPattern(history),
        adaptive: this.analyzeAdaptivePattern(history, velocity)
      };
      const bestPattern = Object.entries(patterns).reduce((best, [type, data]) => 
        data.confidence > best.confidence ? { type, ...data } : best, { confidence: 0 });
      return bestPattern.confidence > 0.7 ? this.extrapolateFromPattern(currentPos, bestPattern, velocity) : currentPos;
    },
    analyzeLinearPattern(history) {
      if (history.length < 3) return { confidence: 0 };
      const movements = this.calculateMovements(history);
      const avgDirection = this.averageDirection(movements);
      const consistency = this.calculateConsistency(movements, avgDirection);
      return { confidence: consistency, direction: avgDirection, type: 'linear' };
    },
    analyzeCircularPattern(history) {
      if (history.length < 5) return { confidence: 0 };
      const angles = [];
      for (let i = 2; i < history.length; i++) {
        const angle1 = Math.atan2(history[i-1].y - history[i-2].y, history[i-1].x - history[i-2].x);
        const angle2 = Math.atan2(history[i].y - history[i-1].y, history[i].x - history[i-1].x);
        angles.push(angle2 - angle1);
      }
      const avgAngleChange = angles.reduce((sum, a) => sum + a, 0) / angles.length;
      const consistency = 1 - (angles.reduce((sum, a) => sum + Math.abs(a - avgAngleChange), 0) / angles.length) / Math.PI;
      return { confidence: Math.max(0, consistency), angleChange: avgAngleChange, type: 'circular' };
    },
    analyzeZigzagPattern(history) {
      if (history.length < 4) return { confidence: 0 };
      const directions = [];
      for (let i = 1; i < history.length; i++) {
        directions.push({
          x: Math.sign(history[i].x - history[i-1].x),
          y: Math.sign(history[i].y - history[i-1].y)
        });
      }
      let changes = 0;
      for (let i = 1; i < directions.length; i++) {
        if (directions[i].x !== directions[i-1].x || directions[i].y !== directions[i-1].y) changes++;
      }
      const changeRate = changes / directions.length;
      return { confidence: changeRate > 0.3 ? changeRate : 0, changeRate, type: 'zigzag' };
    },
    analyzeAdaptivePattern(history, velocity) {
      const features = this.extractFeatures(history, velocity);
      const confidence = this.calculateAdaptiveConfidence(features);
      return { confidence, features, type: 'adaptive' };
    },
    calculateMovements(history) {
      return history.slice(1).map((pos, i) => ({
        dx: pos.x - history[i].x,
        dy: pos.y - history[i].y,
        dt: pos.time - history[i].time
      }));
    },
    averageDirection(movements) {
      const sum = movements.reduce((acc, m) => ({ x: acc.x + m.dx, y: acc.y + m.dy }), { x: 0, y: 0 });
      return { x: sum.x / movements.length, y: sum.y / movements.length };
    },
    calculateConsistency(movements, avgDirection) {
      const deviationSum = movements.reduce((sum, m) => sum + Math.abs(m.dx - avgDirection.x) + Math.abs(m.dy - avgDirection.y), 0);
      return Math.max(0, 1 - (deviationSum / movements.length) / 35);
    },
    extractFeatures(history, velocity) {
      return {
        speed: Math.hypot(velocity.x, velocity.y),
        acceleration: this.calculateAcceleration(history),
        directionChanges: this.countDirectionChanges(history),
        pathLength: this.calculatePathLength(history),
        timeSpan: history.length > 1 ? history[history.length-1].time - history[0].time : 0
      };
    },
    calculateAdaptiveConfidence(features) {
      let confidence = 0.6;
      if (features.speed > 15) confidence += 0.3;
      if (features.acceleration < 3) confidence += 0.2;
      if (features.directionChanges < 2) confidence += 0.3;
      return Math.min(1.0, confidence);
    },
    extrapolateFromPattern(currentPos, pattern, velocity) {
      switch (pattern.type) {
        case 'linear': return { x: currentPos.x + pattern.direction.x * 2.5, y: currentPos.y + pattern.direction.y * 2.5 };
        case 'circular': {
          const angle = Math.atan2(velocity.y, velocity.x) + pattern.angleChange;
          const speed = Math.hypot(velocity.x, velocity.y);
          return { x: currentPos.x + Math.cos(angle) * speed * 0.15, y: currentPos.y + Math.sin(angle) * speed * 0.15 };
        }
        case 'zigzag': return { x: currentPos.x + velocity.x * (1 - pattern.changeRate), y: currentPos.y + velocity.y * (1 - pattern.changeRate) };
        default: return currentPos;
      }
    },
    calculateAcceleration(history) {
      if (history.length < 3) return 0;
      const velocities = this.calculateMovements(history).map(m => Math.hypot(m.dx, m.dy) / (m.dt || 1));
      return velocities.slice(1).reduce((sum, v, i) => sum + Math.abs(v - velocities[i]), 0) / (velocities.length - 1);
    },
    countDirectionChanges(history) {
      let changes = 0;
      for (let i = 2; i < history.length; i++) {
        const dir1 = Math.sign(history[i-1].x - history[i-2].x);
        const dir2 = Math.sign(history[i].x - history[i-1].x);
        if (dir1 !== dir2) changes++;
      }
      return changes;
    },
    calculatePathLength(history) {
      return history.slice(1).reduce((sum, pos, i) => sum + Math.hypot(pos.x - history[i].x, pos.y - history[i].y), 0);
    }
  };
function lockToHead(cameraPos, headPos) {
    let dir = headPos.subtract(cameraPos).normalize();
    // Gửi lệnh aim tới API game (tùy hệ thống của bạn)
    aimTo(dir);
}
function applyHeadLockDragOverride(target, crosshairPos) {
    if (!CONFIG.DRAG_HEAD_LOCK_ENABLED) return null;
    if (!target || !target.bone_Head) return null;

    const headScreenPos = worldToScreen(target.bone_Head);
    const dx = crosshairPos.x - headScreenPos.x;
    const dy = crosshairPos.y - headScreenPos.y;
    const distSq = dx * dx + dy * dy;

    if (distSq <= CONFIG.DRAG_HEAD_LOCK_RADIUS ** 2) {
        // Trong phạm vi head lock drag → trả về luôn vị trí head
        return headScreenPos;
    }
    return null;
}
let overrideAimPos = applyHeadLockDragOverride(currentTarget, getCrosshairPosition());
if (overrideAimPos) {
    // Gán thẳng aim vào đầu, bỏ qua body/chest logic
    aimToScreen(overrideAimPos.x, overrideAimPos.y);
} else {
    // Aim logic bình thường
    processNormalAim(currentTarget);
}
function selectBone(target, crosshairPos) {
    const distToHead = distance2D(crosshairPos, target.headPos);
    const distToChest = distance2D(crosshairPos, target.chestPos);

    const now = Date.now();

    // Nếu đang lock vào head và chưa hết thời gian giữ
    if (currentLockBone === "head" && now - headLockTimer < CONFIG.lockHoldTime) {
        if (CONFIG.DEBUG) console.log("🟢 Giữ lock ở head");
        return "head";
    }

    // Nếu crosshair đang gần head hơn chest
    if (distToHead <= CONFIG.headSnapRadius) {
        currentLockBone = "head";
        headLockTimer = now;
        if (CONFIG.DEBUG) console.log("🎯 Lock HEAD");
        return "head";
    }

    // Nếu cho phép auto switch và crosshair gần chest hơn
    if (CONFIG.AUTO_SWITCH && distToChest <= CONFIG.chestSnapRadius) {
        currentLockBone = "chest";
        if (CONFIG.DEBUG) console.log("🎯 Lock CHEST");
        return "chest";
    }

    // Mặc định vẫn giữ bone trước đó
    return currentLockBone;
}

// ===== HÀM TÍNH KHOẢNG CÁCH =====
function distance2D(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
}
// Nếu đang drag vào head thì giữ nguyên, không auto-switch về chest
if (currentLockedBone === "head" && playerIsDragging) {
    // Giữ nguyên head lock, bỏ qua auto-switch
    targetBone = "head";
} else {
    // Logic chọn bone bình thường
    if (distanceToHead <= CONFIG.HEAD_SNAP_RADIUS) {
        targetBone = "head";
    } else {
        targetBone = "chest";
    }
}
// === ƯU TIÊN HEAD ===
function getPreferredTargetBone(target) {
    // target.bones.head, chest, neck đã có từ tracker
    if (target?.bones?.head && target.bones.head.visible) {
        return target.bones.head; // Ưu tiên head
    }
    if (target?.bones?.neck && target.bones.neck.visible) {
        return target.bones.neck;
    }
    if (target?.bones?.chest && target.bones.chest.visible) {
        return target.bones.chest;
    }
    return null;
}

// === DRAG LOCK NGAY LẬP TỨC VÀO HEAD ===
function dragLockToHead(target) {
    const bone = getPreferredTargetBone(target);
    if (!bone) return;

    // Đưa tâm ngắm ngay lập tức vào head position
    cameraLookAt(bone.position.x, bone.position.y, bone.position.z);

    // Nếu có auto fire khi head lock
    if (CONFIG.AUTO_FIRE && bone.name === "head") {
        triggerFire();
    }
}

// === VÒNG LẶP GAME ===
function gameLoop() {
    const target = TargetManager.getNearestEnemy();
    if (target) {
        dragLockToHead(target);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
// Giả lập hàm bắn
function triggerFire() {
    console.log("🔫 Fire Triggered");
}

// Loop chính
function update(cameraPos, headPos, isFiring) {
    if (CONFIG.AUTO_HEADLOCK && isFiring) {
        lockToHead(cameraPos, headPos);
    }
    if (isFiring) {
        triggerFire();
    }
}
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
        if (dist < 0.001) {
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
    isHeadLocked = true;
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
setInterval(() => {
    update(cam, head, true);
}, 16); // ~60fps
// ==========================
// 11. Ví dụ chạy thử
// ==========================
startDrag();
moveDrag(-0.0456970781, 1.70); // kéo tới gần đầu
startShooting();
// Hàm chuyển quaternion thành vector hướng
updateHeadshotZone(boneHead);
console.log("Vùng headshot mới:", headshotPriorityZone);
// Ví dụ sử dụng





// ====== Trong loop aim ======


// Ví dụ chạy


// Mô phỏng bắn liên tục

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

    let dragForce = 1.0;

    if (isRedDotActive) {
        return { x: headPos.x, y: headPos.y, z: headPos.z };
    }

    if (isDynamicLock) {
        dragForce = distToHead < 0.4 ? 0.96 : 0.85;
    } else {
        if (distToHead < 0.3) dragForce = 0.01;
        else if (distToChest < 1.2) dragForce = 9999.0;
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
