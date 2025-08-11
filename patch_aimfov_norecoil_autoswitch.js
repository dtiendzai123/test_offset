// ==UserScript==
// @name         Enhanced Game Assist - Organized Version
// @namespace    http://garena.freefire/
// @match        *api.ff.garena.com*
// @run-at       response
// ==/UserScript==

// ===========================
// 1. CONFIGURATION SECTION
// ===========================
const CONFIG = {
  // Core Settings
  DEBUG: true,
  lockHoldTime: 9999,
  AUTO_SWITCH: true,
  DEFAULT_AIMFOV: 999,
  AIM_SMOOTH: 0,
  NO_RECOIL: true,
  AUTO_HEADSHOT: true,
  LOCK_BONE: "head",
  
  // Sensitivity & Smoothing
  sensitivity: 9999.0,
  superHeadLock: 9999.0,
  aimSmoothnessNear: 0.00001,
  aimSmoothnessFar: 0.00001,
  smoothingFrames: 5,
  frameDelay: 5,
  noiseLevel: 0.2,
  
  // FOV Settings
  aimFov: 380,
  headLockFov: 520,
  
  // Prediction Settings
  PREDICTION: { 
    enabled: true, 
    leadFactor: 1.0 
  },
  predictiveMultiplier: 0.1,
  
  // AI & Machine Learning
  quantumAiming: true,
  neuralPrediction: true,
  adaptiveAI: true,
  multiThreaded: true,
  realTimeML: true,
  contextualAwareness: true,
  behaviorCloning: true,
  
  // Advanced Features
  ghostMode: true,
  perfectHumanization: true,
  stealthMode: true,
  wallPenetration: true,
  magicBullet: true,
  magicTrick: true,
  
  // Auto Systems
  autoHeadLock: true,
  aimLockHead: true,
  triggerFireChance: 0.995,
  
  // Performance & Optimization
  hyperOptimization: true,
  quantumCalculations: true,
  memoryOptimization: true,
  realTimeAdaptation: true,
  cacheOptimization: true,
  wasmAcceleration: true,
  threadPoolSize: 12,
  maxCalculationsPerFrame: 30,
  
  // Hyper Sensitivity
  HYPER_SENSITY: {
    enabled: true,
    chestRadius: 0.001,
    sensitivityMultiplier: 9999.0
  },
  
  // Auto Fire
  AUTO_FIRE: {
    enabled: true,
    minLockConfidence: 0.0
  },
  
  // Human-like Behavior
  naturalJitter: { min: 0.008, max: 0.06 },
  humanReactionTime: { min: 35, max: 100 },
  organicMovement: true,
  biometricMimicry: true,
  mousePersonality: 'ultra_adaptive',
  antiPatternDetection: true,
  
  // Priority Zones
  headshotPriorityZone: { 
    xMin: 0.45, xMax: 0.55, 
    yMin: 0.10, yMax: 0.25 
  },
  
  // Performance Monitoring
  fpsLogInterval: 1000,
  trackHistoryLimit: 50,
  enableGhostOverlay: true,
  enableOneShotAI: true,
  adaptiveSensitivity: true,
  stabilizationWindow: 7,
  
  // Advanced Head Lock
  rapidHeadSwitch: true,
  dynamicHeadPriority: true,
  ultraSmoothTransition: true,
  contextualHeadLock: true,
  
  // Magic Trick Configuration
  magicTrickConfig: {
    enabled: true,
    headAttraction: 9999.0,
    adaptiveMagic: true,
    magicSwitchSpeed: 0.0001,
    magicConfidence: 0.0,
    visualFeedback: true,
    lockPersistence: 0.000001
  },
  
  // Magic Bullet Configuration
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
    magicBurstMode: { 
      enabled: true, 
      burstBoost: 1.2, 
      maxBurst: 5 
    }
  },
  
  // Trigger Bot
  triggerBot: {
    enabled: true,
    delay: { min: 4, max: 12 },
    burstMode: true,
    smartTrigger: true,
    safeMode: true,
    adaptiveBurst: true
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
  }
};

// ===========================
// 2. WEAPON CONFIGURATIONS
// ===========================
CONFIG.tracking = {
  default: { 
    speed: 5.5, pullRate: 1.35, headBias: 65.0, neckBias: 28.0, chestBias: 23.0, 
    closeBoost: 35.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 1.0, 
    recoilRecovery: 0.95, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
    neuralWeight: 0.85 
  },
  mp40: { 
    speed: 33.0, pullRate: 0.65, headBias: 67.0, neckBias: 30.0, chestBias: 25.0, 
    closeBoost: 55.0, recoilPattern: [0, -1.5, 1.0, -0.7, 0.3], burstControl: 0.85, 
    rangeMod: 0.95, recoilRecovery: 0.96, penetration: 0.88, criticalZone: 18.0, 
    stability: 0.96, neuralWeight: 0.87 
  },
  thompson: { 
    speed: 34.0, pullRate: 0.63, headBias: 68.0, neckBias: 31.0, chestBias: 26.0, 
    closeBoost: 57.0, recoilPattern: [0, -1.7, 1.2, -0.8, 0.4], burstControl: 0.82, 
    rangeMod: 0.97, recoilRecovery: 0.95, penetration: 0.9, criticalZone: 19.0, 
    stability: 0.95, neuralWeight: 0.88 
  },
  ump45: { 
    speed: 33.5, pullRate: 0.64, headBias: 67.5, neckBias: 30.5, chestBias: 25.5, 
    closeBoost: 55.0, recoilPattern: [0, -1.6, 1.1, -0.75, 0.35], burstControl: 0.84, 
    rangeMod: 0.96, recoilRecovery: 0.96, penetration: 0.89, criticalZone: 18.5, 
    stability: 0.96, neuralWeight: 0.87 
  },
  vector: { 
    speed: 37.0, pullRate: 0.62, headBias: 69.0, neckBias: 32.0, chestBias: 27.0, 
    closeBoost: 58.0, recoilPattern: [0, -1.4, 0.9, -0.6, 0.3], burstControl: 0.86, 
    rangeMod: 0.93, recoilRecovery: 0.97, penetration: 0.92, criticalZone: 20.0, 
    stability: 0.97, neuralWeight: 0.89 
  }
};

// Sensitivity Matrix
CONFIG.sensiActivity = {
  default: 1.2,
  mp40: 1.3,
  thompson: 1.35,
  ump45: 1.28,
  vector: 1.35
};

// Target Priority System
CONFIG.targetPriority = {
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
};

// ===========================
// 3. CONSTANTS & BINARY PATCHES
// ===========================
const BINARY_PATCHES = {
  AIMFOV_FIND: `70 42 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`,
  AIMFOV_REPLACE: `FF FF 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`,
  NORECOIL_FIND: `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 7A 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`,
  NORECOIL_REPLACE: `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 EF 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`
};

const HEAD_LOCK_RADIUS = 9999.0;

// ===========================
// 4. UTILITY FUNCTIONS
// ===========================
function log(...args) {
  if (CONFIG.DEBUG) console.log("[FF-PATCH]", ...args);
}

function ensure(obj, path, defaultValue) {
  let parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in cur) || typeof cur[parts[i]] !== 'object') {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]];
  }
  if (!(parts[parts.length - 1] in cur)) {
    cur[parts[parts.length - 1]] = defaultValue;
  }
  return cur[parts[parts.length - 1]];
}

function patchBinary(base64, findHex, replaceHex) {
  const find = Buffer.from(findHex.replace(/\s+/g, ''), 'hex');
  const replace = Buffer.from(replaceHex.replace(/\s+/g, ''), 'hex');
  let buffer = Buffer.from(base64, 'base64');
  let index = buffer.indexOf(find);
  
  if (index !== -1) {
    replace.copy(buffer, index);
    log("✅ Binary patch success at index:", index);
    return buffer.toString('base64');
  } else {
    log("❌ Binary patch not found");
    return base64;
  }
}

// ===========================
// 5. MATHEMATICAL UTILITIES
// ===========================
const Vector3 = {
  distance: (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  
  subtract: function(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  },
  
  normalize: function(v) {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return mag > 0 ? { x: v.x / mag, y: v.y / mag, z: v.z / mag } : { x: 0, y: 0, z: 0 };
  }
};

const QuantumMathEngine = {
  quantumDistance: (a, b) => {
    const baseDist = Vector3.distance(a, b);
    const quantumFluctuation = CONFIG.quantumPhysics.enabled ? 
      (Math.random() - 0.5) * CONFIG.quantumPhysics.uncertaintyPrinciple : 0;
    return baseDist + quantumFluctuation;
  },
  
  quantumVector: (current, target, magicTrick = false) => {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    
    if (magicTrick && CONFIG.magicTrickConfig.enabled) {
      const magicFactor = CONFIG.magicTrickConfig.headAttraction;
      return { x: dx * magicFactor, y: dy * magicFactor };
    }
    
    return { x: dx, y: dy };
  },
  
  sigmoidActivation: (x) => 1 / (1 + Math.exp(-x)),
  
  neuralLerp: (a, b, t, type = 'linear') => {
    switch (type) {
      case 'smoother': return a + (b - a) * t * t * (3 - 2 * t);
      case 'smoothest': return a + (b - a) * t * t * t * (t * (t * 6 - 15) + 10);
      default: return a + (b - a) * t;
    }
  }
};

// ===========================
// 6. GAME STATE MANAGEMENT
// ===========================
const gameState = {
  recoilState: {
    shotCount: 0,
    lastShot: 0,
    weapon: 'default'
  },
  
  magicTrickState: {
    activeTarget: null,
    magicConfidence: 0,
    lastHeadLock: 0
  },
  
  performanceProfile: {
    fps: 60,
    latency: 16,
    magicTrickConfidence: 0
  },
  
  triggerState: {
    lastTrigger: 0,
    burstCount: 0
  },
  
  lastAim: { x: 0, y: 0 },
  
  targetMemory: new Map(),
  aiMemory: new Map(),
  
  neuralNetwork: {
    weights: new Map(),
    activations: []
  },
  
  humanizationProfile: {
    personality: CONFIG.mousePersonality
  }
};

// ===========================
// 7. AIM SMOOTHING CLASS
// ===========================
class AimSmoother {
  constructor(smoothFactor = 0.65) {
    this.lastPos = null;
    this.smoothFactor = smoothFactor;
  }

  smooth(currentPos, isRedDotActive = false) {
    if (!this.lastPos) {
      this.lastPos = currentPos;
      return currentPos;
    }
    
    // Sử dụng smoothing cao hơn khi tâm đỏ hoạt động
    const activeSmoothFactor = isRedDotActive ? 0.9 : this.smoothFactor;
    
    const smoothed = {
      x: this.lastPos.x + (currentPos.x - this.lastPos.x) * activeSmoothFactor,
      y: this.lastPos.y + (currentPos.y - this.lastPos.y) * activeSmoothFactor,
      z: this.lastPos.z + (currentPos.z - this.lastPos.z) * activeSmoothFactor
    };
    
    this.lastPos = smoothed;
    return smoothed;
  }
}

// ===========================
// 8. NEURAL PREDICTION SYSTEM
// ===========================
const NeuralPredictor = {
  neuralPredict(target, velocity, acceleration, jerk, ping, weapon, context = {}) {
    const t = ping / 1000.0;
    const weaponData = CONFIG.tracking[weapon] || CONFIG.tracking.default;
    
    let predicted = {
      x: target.x + velocity.x * t * CONFIG.predictiveMultiplier,
      y: target.y + velocity.y * t * CONFIG.predictiveMultiplier
    };

    // Acceleration prediction
    if (acceleration && (Math.abs(acceleration.x) > 0.1 || Math.abs(acceleration.y) > 0.1)) {
      const accelFactor = this.calculateAccelFactor(velocity, acceleration);
      predicted.x += 0.5 * acceleration.x * t * t * accelFactor;
      predicted.y += 0.5 * acceleration.y * t * t * accelFactor;
    }

    // Jerk prediction
    if (jerk && (Math.abs(jerk.x) > 0.1 || Math.abs(jerk.y) > 0.1)) {
      const jerkWeight = this.calculateJerkWeight(acceleration, jerk);
      predicted.x += (1/6) * jerk.x * t * t * t * jerkWeight;
      predicted.y += (1/6) * jerk.y * t * t * t * jerkWeight;
    }

    // Neural network adjustment
    if (CONFIG.neuralPrediction && gameState.neuralNetwork.weights.size > 0) {
      const neuralAdjustment = this.neuralAdjust(predicted, velocity, weapon);
      predicted.x += neuralAdjustment.x;
      predicted.y += neuralAdjustment.y;
    }

    // Apply weapon-specific factors
    const quantumFactor = weaponData.speed > 30 ? 1.25 : 1.1;
    predicted.x *= CONFIG.predictiveMultiplier * quantumFactor;
    predicted.y *= CONFIG.predictiveMultiplier * quantumFactor;

    // Context-aware adjustments
    if (CONFIG.contextualHeadLock && context.engagement === 'high') {
      predicted.x *= 1.05;
      predicted.y *= 1.05;
    }

    // Magic trick enhancement
    if (CONFIG.magicTrick && gameState.magicTrickState.magicConfidence > CONFIG.magicTrickConfig.magicConfidence) {
      predicted.x *= CONFIG.magicTrickConfig.headAttraction;
      predicted.y *= CONFIG.magicTrickConfig.headAttraction;
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
  }
};

// ===========================
// 9. PERFECT HUMANIZATION SYSTEM
// ===========================
const PerfectHumanization = {
  generateOrganicMovement(current, target, smoothness, personality) {
    if (!CONFIG.perfectHumanization) return target;
    
    const jitter = this.calculateNaturalJitter();
    const reactionDelay = this.simulateHumanReaction();
    
    return {
      x: target.x + jitter.x,
      y: target.y + jitter.y
    };
  },
  
  calculateNaturalJitter() {
    const min = CONFIG.naturalJitter.min;
    const max = CONFIG.naturalJitter.max;
    return {
      x: (Math.random() - 0.5) * (min + Math.random() * (max - min)),
      y: (Math.random() - 0.5) * (min + Math.random() * (max - min))
    };
  },
  
  simulateHumanReaction() {
    const min = CONFIG.humanReactionTime.min;
    const max = CONFIG.humanReactionTime.max;
    return min + Math.random() * (max - min);
  }
};

// ===========================
// 10. CORE AIM FUNCTIONS
// ===========================
function enhancedBlendTargets(head, neck, chest, weapon) {
  const track = CONFIG.tracking[weapon] || CONFIG.tracking.default;
  
  if (CONFIG.aimLockHead && CONFIG.dynamicHeadPriority && CONFIG.magicTrick) {
    return head;
  }
  
  const totalBias = track.headBias + track.neckBias + track.chestBias;
  const headWeight = track.headBias / totalBias;
  const neckWeight = track.neckBias / totalBias;
  const chestWeight = track.chestBias / totalBias;
  
  return {
    x: head.x * headWeight + neck.x * neckWeight + chest.x * chestWeight,
    y: head.y * headWeight + neck.y * neckWeight + chest.y * chestWeight
  };
}

function advancedRecoilCompensation(weapon, shotCount, deltaTime) {
  if (!CONFIG.tracking[weapon]?.recoilPattern) return { x: 0, y: 0 };
  
  const weaponData = CONFIG.tracking[weapon] || CONFIG.tracking.default;
  const pattern = weaponData.recoilPattern;
  const patternIndex = Math.min(shotCount, pattern.length - 1);
  const nextIndex = Math.min(shotCount + 1, pattern.length - 1);
  const t = Math.min(shotCount % 1, 1);
  
  const currentRecoil = QuantumMathEngine.neuralLerp(
    pattern[patternIndex] || 0, 
    pattern[nextIndex] || 0, 
    t
  );
  
  const intensity = Math.min(shotCount * 0.1, 1.0) * (2 - weaponData.stability);
  const stabilityBonus = weaponData.stability * 0.65;
  const magicFactor = CONFIG.magicTrick ? 
    1 - CONFIG.magicTrickConfig.headAttraction * 0.05 : 1;
  
  return {
    x: currentRecoil * intensity * (1 - stabilityBonus) * magicFactor,
    y: currentRecoil * intensity * (1 - stabilityBonus) * magicFactor
  };
}

function magicBulletAdjustment(current, target, weapon, distance) {
  if (!CONFIG.magicBullet || !CONFIG.magicBulletConfig.enabled) {
    return { x: 0, y: 0 };
  }
  
  const weaponData = CONFIG.tracking[weapon] || CONFIG.tracking.default;
  let curve = CONFIG.magicBulletConfig.curve;
  let prediction = CONFIG.magicBulletConfig.prediction;

  // Adaptive trajectory based on weapon type
  if (CONFIG.magicBulletConfig.adaptiveTrajectory) {
    if (weaponData.speed > 35) { // SMG
      curve *= 0.9;
      prediction *= 0.95;
    } else if (weaponData.speed < 25) { // Sniper
      curve *= 1.2;
      prediction *= 1.1;
    }
  }

  // Dynamic curve adjustment based on distance
  if (CONFIG.magicBulletConfig.dynamicCurveAdjustment) {
    curve *= (distance < 70 ? 1.5 : distance > 400 ? 0.5 : 1.0);
  }

  // Magic Trick enhancement
  let magicTrickBoost = 1;
  if (CONFIG.magicTrick && CONFIG.magicTrickConfig.enabled && 
      gameState.magicTrickState.magicConfidence > CONFIG.magicTrickConfig.magicConfidence) {
    magicTrickBoost = CONFIG.magicTrickConfig.headAttraction;
    curve *= magicTrickBoost;
    prediction *= magicTrickBoost;
    gameState.magicTrickState.lastHeadLock = Date.now();
  }

  // Quantum fluctuation
  const quantumFluctuation = CONFIG.quantumPhysics.enabled ? 
    (Math.random() - 0.5) * CONFIG.quantumPhysics.quantumCurveFluctuation : 0;

  const angle = Math.atan2(target.y - current.y, target.x - current.x);
  const curveIntensity = Math.min(distance / 100, 1) * curve;
  
  return {
    x: Math.cos(angle + Math.PI/2) * curveIntensity * weaponData.penetration * magicTrickBoost + quantumFluctuation,
    y: Math.sin(angle + Math.PI/2) * curveIntensity * weaponData.penetration * magicTrickBoost + quantumFluctuation
  };
}

function calculateUltimateSensitivity(weapon, distance, targetSpeed, shotCount) {
  const weaponData = CONFIG.tracking[weapon] || CONFIG.tracking.default;
  let baseSensi = CONFIG.sensiActivity[weapon] || CONFIG.sensiActivity.default;
  
  const distanceMultiplier = distance > 450 ? 0.6 : 
                           distance > 250 ? 0.75 : 
                           distance < 25 ? 1.5 : 1.0;
  
  const speedMultiplier = targetSpeed > 22 ? 1.35 : 
                         targetSpeed > 15 ? 1.25 : 
                         targetSpeed < 0.8 ? 0.7 : 1.0;
  
  const recoilMultiplier = shotCount > 8 ? 0.82 : 1.0;
  const stabilityBonus = weaponData.stability * 0.2;
  const magicFactor = CONFIG.magicTrick ? 
    1 + CONFIG.magicTrickConfig.headAttraction * 0.05 : 1;
  
  return baseSensi * distanceMultiplier * speedMultiplier * 
         recoilMultiplier * (1 + stabilityBonus) * magicFactor;
}

// ===========================
// 11. MAIN AIM SYSTEM
// ===========================
function ultimateAdjustAim(current, head, neck, chest, weapon = 'default', options = {}) {
  const {
    velocity = { x: 0, y: 0 },
    acceleration = { x: 0, y: 0 },
    jerk = { x: 0, y: 0 },
    pingMs = 15,
    targetSpeed = 0,
    deltaTime = 16.67,
    targets = [],
    context = {}
  } = options;

  // Performance optimization
  if (CONFIG.hyperOptimization && gameState.performanceProfile.fps < 20) {
    return gameState.lastAim;
  }

  const weaponData = CONFIG.tracking[weapon] || CONFIG.tracking.default;
  const blendedTarget = enhancedBlendTargets(head, neck, chest, weapon);
  const predicted = NeuralPredictor.neuralPredict(
    blendedTarget, velocity, acceleration, jerk, pingMs, weapon, context
  );

  const distance = QuantumMathEngine.quantumDistance(current, predicted);

  // Check if target is within FOV
  if (!CONFIG.autoHeadLock || distance > CONFIG.headLockFov) {
    return gameState.lastAim;
  }

  const vector = QuantumMathEngine.quantumVector(current, predicted, CONFIG.magicTrick);
  
  let dx = vector.x * weaponData.speed * weaponData.pullRate * 0.09;
  let dy = vector.y * weaponData.speed * weaponData.pullRate * 0.09;

  // Apply recoil compensation
  const recoilComp = advancedRecoilCompensation(weapon, gameState.recoilState.shotCount, deltaTime);
  dx += recoilComp.x;
  dy += recoilComp.y;

  // Apply magic bullet adjustment
  const magicAdj = magicBulletAdjustment(current, predicted, weapon, distance);
  dx += magicAdj.x;
  dy += magicAdj.y;

  // Calculate smoothness
  const baseSmoothness = distance > 120 ? CONFIG.aimSmoothnessFar : CONFIG.aimSmoothnessNear;
  const weaponSmoothness = baseSmoothness * weaponData.stability;
  const smoothnessFactor = CONFIG.ultraSmoothTransition ? 
    QuantumMathEngine.neuralLerp(0, 1, weaponSmoothness, 'smoother') : weaponSmoothness;

  // Close range boost
  if (distance < weaponData.closeBoost) {
    const boostFactor = (weaponData.closeBoost - distance) / weaponData.closeBoost;
    dx *= (1 + boostFactor * 0.45);
    dy *= (1 + boostFactor * 0.45);
  }

  const smoothed = {
    x: current.x + dx * smoothnessFactor,
    y: current.y + dy * smoothnessFactor
  };

  // Apply humanization
  const humanized = PerfectHumanization.generateOrganicMovement(
    current, smoothed, smoothnessFactor, gameState.humanizationProfile.personality
  );

  // WASM acceleration if available
  if (CONFIG.wasmAcceleration && typeof wasmModule !== 'undefined') {
    const optimized = wasmModule.optimizeTrajectory(humanized.x, humanized.y, distance);
    gameState.lastAim = { x: optimized.x, y: optimized.y };
  } else {
    gameState.lastAim = humanized;
  }

  // Update magic trick visual feedback
  if (CONFIG.magicTrickConfig.visualFeedback) {
    gameState.performanceProfile.magicTrickConfidence = gameState.magicTrickState.magicConfidence;
  }

  return gameState.lastAim;
}

function ultimateAim(current, head, neck, chest, weapon = 'default', options = {}) {
  const startTime = performance.now();
  const aimed = ultimateAdjustAim(current, head, neck, chest, weapon, options);
  const distance = QuantumMathEngine.quantumDistance(current, head);
  const dynamicSensi = calculateUltimateSensitivity(
    weapon, distance, options.targetSpeed || 0, gameState.recoilState.shotCount
  );
  
  const sensitivityMultiplier = CONFIG.sensitivity * dynamicSensi;
  const confidence = calculateAimConfidence(current, head, weapon, distance);
  const stability = (CONFIG.tracking[weapon] || CONFIG.tracking.default).stability;
  
  const calcTime = performance.now() - startTime;
  updatePerformanceMetrics(options.fps || 60, calcTime);

  return {
    x: aimed.x * sensitivityMultiplier,
    y: aimed.y * sensitivityMultiplier,
    confidence,
    stability,
    distance,
    weapon,
    magicTrickConfidence: CONFIG.magicTrickConfig.visualFeedback ? 
      gameState.performanceProfile.magicTrickConfidence : undefined
  };
}

// ===========================
// 12. TRIGGER BOT SYSTEM
// ===========================
function ultimateTriggerBot(targetDistance, weapon, targetHealth = 100) {
  if (!CONFIG.triggerBot.enabled) return false;
  
  const now = Date.now();
  const weaponData = CONFIG.tracking[weapon] || CONFIG.tracking.default;

  // Safe mode check
  if (CONFIG.triggerBot.safeMode && gameState.performanceProfile.fps < 25) {
    return false;
  }

  // Smart trigger logic
  if (CONFIG.triggerBot.smartTrigger) {
    const isInRange = targetDistance < CONFIG.aimFov;
    const isInCriticalZone = targetDistance < weaponData.criticalZone;
    const canPenetrate = weaponData.penetration > 0.7;
    
    if (!isInRange && !canPenetrate) return false;
    if (isInCriticalZone && targetHealth < 15) return true;
  }

  // Burst mode
  if (CONFIG.triggerBot.burstMode && gameState.triggerState?.burstCount > 0) {
    gameState.triggerState.burstCount--;
    return true;
  }

  // Rate limiting
  if (now - (gameState.triggerState?.lastTrigger || 0) < CONFIG.triggerBot.delay.min) {
    return false;
  }

  const shouldFire = Math.random() < CONFIG.triggerFireChance && 
                    targetDistance < CONFIG.aimFov;

  if (shouldFire) {
    gameState.triggerState = {
      lastTrigger: now,
      burstCount: CONFIG.triggerBot.adaptiveBurst ? 
        Math.floor(Math.random() * (targetHealth > 50 ? 3 : 6)) + 1 : 0
    };
  }

  // Magic trick enhancement
  if (CONFIG.magicTrick && shouldFire && 
      gameState.magicTrickState.magicConfidence > CONFIG.magicTrickConfig.magicConfidence) {
    gameState.magicTrickState.lastHeadLock = now;
  }

  return shouldFire;
}

// ===========================
// 13. AIM CONFIDENCE CALCULATOR
// ===========================
function calculateAimConfidence(current, target, weapon, distance) {
  const weaponData = CONFIG.tracking[weapon] || CONFIG.tracking.default;
  let confidence = weaponData.stability;

  // Distance adjustments
  if (distance > 550) confidence -= 0.55;
  else if (distance > 350) confidence -= 0.35;
  else if (distance < weaponData.criticalZone) confidence += 0.35;

  // Weapon characteristics
  if (weaponData.speed > 35) confidence += 0.2;
  if (weaponData.headBias > 60) confidence += 0.25;
  if (weaponData.penetration > 0.9) confidence += 0.2;

  // Performance adjustments
  if (gameState.performanceProfile.fps < 25) confidence -= 0.45;
  else if (gameState.performanceProfile.fps > 85) confidence += 0.25;

  // Neural network bonus
  if (CONFIG.neuralPrediction && gameState.neuralNetwork.weights.size > 1200) {
    confidence += 0.2;
  }

  // Magic trick bonus
  if (CONFIG.magicTrick && 
      gameState.magicTrickState.magicConfidence > CONFIG.magicTrickConfig.magicConfidence) {
    confidence += CONFIG.magicTrickConfig.headAttraction * 0.1;
  }

  gameState.magicTrickState.magicConfidence = confidence;
  return Math.min(1.0, Math.max(0.1, confidence));
}

// ===========================
// 14. PERFORMANCE MONITORING
// ===========================
function updatePerformanceMetrics(fps, calcTime) {
  gameState.performanceProfile.fps = fps;
  gameState.performanceProfile.latency = gameState.performanceProfile.latency * 0.9 + calcTime * 0.1;

  // Memory optimization
  if (CONFIG.memoryOptimization) {
    if (gameState.targetMemory.size > CONFIG.aiLearning.memoryDepth) {
      const oldestKey = gameState.targetMemory.keys().next().value;
      gameState.targetMemory.delete(oldestKey);
    }
    
    if (gameState.aiMemory.size > CONFIG.aiLearning.memoryDepth) {
      const oldestKey = gameState.aiMemory.keys().next().value;
      gameState.aiMemory.delete(oldestKey);
    }
    
    if (gameState.neuralNetwork.activations.length > CONFIG.aiLearning.maxTrainingSamples) {
      gameState.neuralNetwork.activations.shift();
    }
  }
}

// ===========================
// 15. NEURAL TRAINING SYSTEM
// ===========================
function trainNeuralNet(sample) {
  if (!CONFIG.aiLearning.enabled) return;

  gameState.neuralNetwork.activations.push(sample);
  
  if (gameState.neuralNetwork.activations.length > CONFIG.aiLearning.maxTrainingSamples) {
    gameState.neuralNetwork.activations.shift();
  }

  const networkKey = `${sample.weapon}_prediction`;
  const weights = gameState.neuralNetwork.weights.get(networkKey) || 
    { x: Math.random(), y: Math.random() };

  weights.x += CONFIG.aiLearning.learningRate * (Math.random() - 0.5) * 0.07;
  weights.y += CONFIG.aiLearning.learningRate * (Math.random() - 0.5) * 0.07;

  gameState.neuralNetwork.weights.set(networkKey, weights);

  // Magic trick learning
  if (CONFIG.magicTrick && sample.target?.bodyPart === 'head') {
    gameState.magicTrickState.magicConfidence += 0.05;
  }
}

// ===========================
// 16. SHOT MANAGEMENT
// ===========================
function onShot(weapon, target) {
  gameState.recoilState.shotCount++;
  gameState.recoilState.lastShot = Date.now();
  gameState.recoilState.weapon = weapon;

  if (CONFIG.aiLearning.enabled && target) {
    trainNeuralNet({ weapon, target, timestamp: Date.now() });
  }

  // Reset shot count after delay
  setTimeout(() => {
    if (Date.now() - gameState.recoilState.lastShot > 1200) {
      gameState.recoilState.shotCount = 0;
    }
  }, 1200);
}

// ===========================
// 17. CORE GAME LOGIC
// ===========================
let lastEnemyHeadPos = null;
let lastPlayerPos = null;
let isTouchDragging = false;
let isHeadLocked = false;
let isDragging = false;
let isShooting = false;
let currentAimPos = { x: 0, y: 0, z: 0 };
let currentLockBone = "head";
let headLockTimer = 0;

// Touch event handlers
if (typeof document !== 'undefined') {
  document.addEventListener("touchstart", () => isTouchDragging = true);
  document.addEventListener("touchend", () => isTouchDragging = false);
}

const aimSmoother = new AimSmoother(0.2);

// Enemy head data
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

// ===========================
// 18. CORE AIM FUNCTIONS
// ===========================
function aimTo(vec3) {
  log(`🎯 AimTo -> X=${vec3.x.toFixed(3)}, Y=${vec3.y.toFixed(3)}, Z=${vec3.z.toFixed(3)}`);
  // TODO: Hook API game để di chuyển tâm ngắm
}

function lockAimToHead(enemyHeadData) {
  const preciseHeadPos = enemyHeadData.position;
  aimTo(preciseHeadPos);
}

function clampAimToHead(currentPos, headPos) {
  let clamped = { ...currentPos };
  if (clamped.y > headPos.y) {
    clamped.y = headPos.y;
  }
  return clamped;
}

function autoPrecisionHeadshot() {
  if (isHeadLocked) {
    aimTo(enemyHeadData.position);
  }
}

function distance2D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function selectBone(target, crosshairPos) {
  const distToHead = distance2D(crosshairPos, target.headPos);
  const distToChest = distance2D(crosshairPos, target.chestPos);
  const now = Date.now();

  // Nếu đang lock vào head và chưa hết thời gian giữ
  if (currentLockBone === "head" && now - headLockTimer < CONFIG.lockHoldTime) {
    if (CONFIG.DEBUG) log("🟢 Giữ lock ở head");
    return "head";
  }

  // Nếu crosshair đang gần head hơn chest
  if (distToHead <= CONFIG.headLockFov) {
    currentLockBone = "head";
    headLockTimer = now;
    if (CONFIG.DEBUG) log("🎯 Lock HEAD");
    return "head";
  }

  // Nếu cho phép auto switch và crosshair gần chest hơn
  if (CONFIG.AUTO_SWITCH && distToChest <= CONFIG.aimFov) {
    currentLockBone = "chest";
    if (CONFIG.DEBUG) log("🎯 Lock CHEST");
    return "chest";
  }

  return currentLockBone;
}

function onDragMove(newAimPos) {
  newAimPos = clampAimToHead(newAimPos, enemyHeadData.position);

  if (!isHeadLocked) {
    const dist = Vector3.distance(newAimPos, enemyHeadData.position);
    if (dist < 0.05) {
      isHeadLocked = true;
      log("🔒 Locked on enemy head!");
    }
  }

  if (isHeadLocked) {
    aimTo(enemyHeadData.position);
  } else {
    aimTo(newAimPos);
  }
}

// ===========================
// 19. ADVANCED AIM SYSTEMS
// ===========================
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
  let smoothedAim = aimSmoother.smooth(aimedPos, isRedDotActive);

  return magneticAimChestToHead(smoothedAim, chestPos, headPos, isDynamicLock, isRedDotActive);
}

function fireIfLocked(crosshair, targetHead) {
  const dist = Vector3.distance(crosshair, targetHead);
  if (dist < HEAD_LOCK_RADIUS) {
    aimTo(targetHead);
    triggerFire();
    log("🔒 Head Lock Fire Triggered");
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

// ===========================
// 20. DRAG AND TOUCH HANDLERS
// ===========================
function startDrag() {
  isDragging = true;
}

function endDrag() {
  isDragging = false;
  isHeadLocked = true;
}

function moveDrag(x, y) {
  if (!isDragging) return;
  currentAimPos = { x: x, y: y, z: 0 };
  onDragMove(currentAimPos);
}

function startShooting() {
  isShooting = true;
  autoPrecisionHeadshot();
}

function stopShooting() {
  isShooting = false;
}

// ===========================
// 21. GAME SIMULATION FUNCTIONS
// ===========================
function readVector3(address) { 
  return { x: 0, y: 0, z: 0 }; 
}

function triggerFire() { 
  log("🔫 Fire Triggered"); 
}

function cameraLookAt(x, y, z) { 
  log("🎥 LookAt:", x, y, z); 
}

function lockToHead(cameraPos, headPos) {
  let dir = headPos.subtract ? headPos.subtract(cameraPos).normalize() : 
    Vector3.normalize(Vector3.subtract(headPos, cameraPos));
  aimTo(dir);
}

function getPreferredTargetBone(target) {
  if (target?.bones?.head && target.bones.head.visible) {
    return target.bones.head;
  }
  if (target?.bones?.neck && target.bones.neck.visible) {
    return target.bones.neck;
  }
  if (target?.bones?.chest && target.bones.chest.visible) {
    return target.bones.chest;
  }
  return null;
}

function dragLockToHead(target) {
  const bone = getPreferredTargetBone(target);
  if (!bone) return;

  cameraLookAt(bone.position.x, bone.position.y, bone.position.z);

  if (CONFIG.AUTO_FIRE.enabled && bone.name === "head") {
    triggerFire();
  }
}

// ===========================
// 22. MAIN GAME LOOPS
// ===========================
function gameLoop() {
  if (isShooting && isHeadLocked) {
    autoPrecisionHeadshot();
  }
}

function enemyMovementSimulation() {
  if (isHeadLocked) {
    enemyHeadData.position.x += (Math.random() - 0.5) * 0.01;
    enemyHeadData.position.y += (Math.random() - 0.5) * 0.01;
  }
}

function update(cameraPos, headPos, isFiring) {
  if (CONFIG.autoHeadLock && isFiring) {
    lockToHead(cameraPos, headPos);
  }
  if (isFiring) {
    triggerFire();
  }
}

// ===========================
// 23. JSON PATCHING SYSTEM
// ===========================
function deepPatchForTargets(obj) {
  if (!obj || typeof obj !== 'object') return;
  
  for (let k in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
    let v = obj[k];
    
    if (v && typeof v === 'object') {
      if ('priority' in v) { 
        v.priority = Math.max(9000, v.priority || 0); 
      }
      if ('forceHeadshot' in v) { 
        v.forceHeadshot = true; 
      }
      if ('alwaysEnable' in v) { 
        v.alwaysEnable = true; 
      }
      if (v.boneName) { 
        v.boneName = CONFIG.LOCK_BONE; 
      }
      deepPatchForTargets(v);
    }
  }
}

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
    } catch(e) { 
      // ignore errors 
    }
  }
}

function patchAimObjects(json) {
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
}

// ===========================
// 24. MAIN EXECUTION SCRIPT
// ===========================
(function() {
    let body = $response.body;

    try {
      let json = null;
      try { 
        json = JSON.parse(body); 
      } catch(e) { 
        json = null; 
      }

      if (!json) {
        log("Không parse được JSON, trả về nguyên gốc.");
        $done({ body });
        return; // ✅ bây giờ hợp lệ vì nằm trong function
      }

      // Patch aim configurations
      patchAimObjects(json);

      // Patch target priorities and headshot settings
      deepPatchForTargets(json.targets || json.enemySettings || json.gameTargets);

      // Apply heuristics patch
      heuristicsPatch(json);

    } catch (err) {
      log("Lỗi xử lý:", err);
      $done({ body });
    }
})();

  // Handle array responses
  if (Array.isArray(json)) {
    json = json.map(item => {
      try {
        if (typeof item === 'object') {
          deepPatchForTargets(item);
          heuristicsPatch(item);
        }
        return item;
      } catch (e) { 
        return item; 
      }
    });
  }

  // Handle binary base64 data
  if (json && json.data) {
    json.data = json.data.map(entry => {
      if (entry && typeof entry.value === 'string' && entry.value.includes("base64")) {
        let b64 = entry.value.split(',')[1];
        let patched = patchBinary(b64, BINARY_PATCHES.AIMFOV_FIND, BINARY_PATCHES.AIMFOV_REPLACE);
        patched = patchBinary(patched, BINARY_PATCHES.NORECOIL_FIND, BINARY_PATCHES.NORECOIL_REPLACE);
        entry.value = "data:application/octet-stream;base64," + patched;
      }

      // Enhanced entry properties
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

    // Game logic execution for data entries
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
      lockAimToHead(enemyHeadData);
      const adjustedAim = updateAimbot(crosshair, playerPos, target);
      aimTo(adjustedAim);
      cameraLookAt(target.pos.x, target.pos.y, target.pos.z);
      fireIfLocked(adjustedAim, target.headPos);
    }
  }

  // Add patch metadata
  ensure(json, 'settings.patch_meta', {});
  json.settings.patch_meta.last_patch = (new Date()).toISOString();
  json.settings.patch_meta.config = {
    aimFOV: CONFIG.DEFAULT_AIMFOV,
    noRecoil: CONFIG.NO_RECOIL,
    autoHeadshot: CONFIG.AUTO_HEADSHOT,
    hyperSensitivity: CONFIG.HYPER_SENSITY,
    magicTrick: CONFIG.magicTrick,
    version: "1.0.0-organized"
  };

  body = JSON.stringify(json);
  $done({ body });

} catch (err) {
  log("Lỗi patch:", err);
  $done({ body });
}

// ===========================
// 25. INITIALIZATION & TIMERS
// ===========================
// Game loop timer
setInterval(gameLoop, 16); // ~60fps

// Enemy movement simulation
setInterval(enemyMovementSimulation, 100);

// Example execution
if (typeof window !== 'undefined') {
  // Simulation example
  startDrag();
  moveDrag(-0.0456970781, 1.70);
  startShooting();
  
  // Continuous update example
  let cam = new Vector3 ? new Vector3(0, 0, 0) : { x: 0, y: 0, z: 0 };
  let head = { x: -0.04089227, y: 0.00907892, z: 0.02748467 };
  
  setInterval(() => {
    update(cam, head, true);
  }, 16);
}
