let stopSprite; // 儲存角色站立動作的精靈圖。
let walkSprite; // 儲存角色行走動作的精靈圖。
let jumpSprite; // 儲存角色跳躍動作的精靈圖。
let pushSprite; // 儲存角色推動動作的精靈圖。
const stopFrameCount = 10; // 設定站立精靈圖的影格數量。
const walkFrameCount = 9; // 設定行走精靈圖的影格數量。
const jumpFrameCount = 14; // 設定跳躍精靈圖的影格數量。
const pushFrameCount = 8; // 設定推動精靈圖的影格數量。
const animationSpeed = 8; // 設定站立與行走動畫切換影格的速度。
let characterCenterX; // 儲存角色目前的水平中心位置。
let characterTop; // 儲存角色目前的垂直頂端位置。
let characterDisplayWidth; // 儲存角色目前影格的顯示寬度供相遇判斷使用。
let characterDisplayHeight; // 儲存角色目前影格的顯示高度供相遇判斷使用。
let horizontalDirection = 0; // 儲存角色目前的水平移動方向。
let facingDirection = 1; // 儲存角色面向方向，正值為右，負值為左。
let leftKeyDown = false; // 記錄左方向鍵目前是否按住。
let rightKeyDown = false; // 記錄右方向鍵目前是否按住。
let isJumping = false; // 記錄角色目前是否正在跳躍。
let isPushing = false; // 記錄角色目前是否正在推動。
let jumpVelocity = 0; // 儲存角色目前的垂直跳躍速度。
let jumpAnimationStartFrame = 0; // 記錄跳躍動畫開始播放的繪圖影格。
let pushAnimationStartFrame = 0; // 記錄推動動畫開始播放的繪圖影格。
let characterTwoWalkSprite; // 儲存角色二的走路精靈圖。
let characterTwoFlipSprite; // 儲存角色二的空中轉圈精靈圖。
let characterTwoPunchSprite; // 儲存角色二的揮拳精靈圖。
const characterTwoWalkFrameCount = 6; // 設定角色二走路精靈圖的影格數量。
const characterTwoActionFrameCount = 10; // 設定角色二兩種動作精靈圖的影格數量。
let characterTwoCenterX; // 儲存角色二目前的水平中心位置。
let characterTwoDirection = 0; // 儲存角色二目前的水平移動方向。
let characterTwoFacingDirection = 1; // 儲存角色二面向方向，正值為右，負值為左。
let characterTwoLeftKeyDown = false; // 記錄 A 鍵目前是否按住。
let characterTwoRightKeyDown = false; // 記錄 D 鍵目前是否按住。
let characterTwoFlipKeyDown = false; // 記錄 W 鍵目前是否按住以避免重複觸發動作。
let characterTwoPunchKeyDown = false; // 記錄 S 鍵目前是否按住以避免重複觸發動作。
let characterTwoAction = ''; // 儲存角色二目前播放的動作名稱。
let characterTwoActionStartFrame = 0; // 記錄角色二目前動作開始播放的繪圖影格。
let encounterTriggered = false; // 記錄兩個角色是否已觸發過相遇對話。
let encounterStartTime = 0; // 記錄相遇對話開始顯示的時間。
const encounterDuration = 3000; // 設定相遇對話顯示三秒。

function preload() { // 在建立畫布前載入角色的四種精靈圖。
  stopSprite = loadImage('1/stop/all.png'); // 載入包含10格影格的站立精靈圖。
  walkSprite = loadImage('1/walk/all.png'); // 載入包含9格影格的行走精靈圖。
  jumpSprite = loadImage('1/jump/all.png'); // 載入包含14格影格的跳躍精靈圖。
  pushSprite = loadImage('1/push/all.png'); // 載入包含8格影格的推動精靈圖。
  characterTwoWalkSprite = loadImage('2/走路/all.png'); // 載入角色二包含6格影格的走路精靈圖。
  characterTwoFlipSprite = loadImage('2/空中轉一圈/all.png'); // 載入角色二包含10格影格的空中轉圈精靈圖。
  characterTwoPunchSprite = loadImage('2/揮拳/all.png'); // 載入角色二包含10格影格的揮拳精靈圖。
} // 結束圖片載入函式。

function setup() { // 初始化全視窗畫布與角色起始位置。
  createCanvas(windowWidth, windowHeight); // 建立符合目前視窗大小的畫布。
  imageMode(CORNER); // 使用圖片左上角作為繪製座標基準。
  characterCenterX = (width * 2) / 3; // 將角色初始水平中心放在畫布寬度的三分之二處。
  characterTwoCenterX = width / 3; // 將角色二初始水平中心放在畫布寬度的三分之一處。
} // 結束初始化函式。

function draw() { // 每個繪圖影格更新背景、角色位置與動畫。
  background('#87CEEB'); // 以天空藍填滿整個畫布背景。
  const activeSprite = isJumping ? jumpSprite : isPushing ? pushSprite : horizontalDirection === 0 ? stopSprite : walkSprite; // 依跳躍、推動、移動或靜止狀態選擇精靈圖。
  const activeFrameCount = isJumping ? jumpFrameCount : isPushing ? pushFrameCount : horizontalDirection === 0 ? stopFrameCount : walkFrameCount; // 取得目前動作的影格數量。
  const sourceFrameWidth = activeSprite.width / activeFrameCount; // 依精靈圖實際寬度計算單格寬度。
  const sourceFrameHeight = activeSprite.height; // 取得精靈圖單格的來源高度。
  const characterScale = min((width * 0.24) / sourceFrameWidth, (height * 0.4) / sourceFrameHeight); // 依畫布寬高比例縮放角色並避免超出可用空間。
  const displayWidth = sourceFrameWidth * characterScale; // 計算角色顯示寬度。
  const displayHeight = sourceFrameHeight * characterScale; // 計算角色顯示高度。
  characterDisplayWidth = displayWidth; // 儲存角色目前影格的寬度供相遇判斷使用。
  characterDisplayHeight = displayHeight; // 儲存角色目前影格的高度供相遇判斷使用。
  const groundY = height - displayHeight; // 計算角色站立時貼齊畫布底端的位置。
  const movementSpeed = max(2, width * 0.006); // 依畫布寬度設定角色水平移動速度。
  characterCenterX += horizontalDirection * movementSpeed; // 依目前方向更新角色水平位置。
  characterCenterX = constrain(characterCenterX, displayWidth / 2, width - displayWidth / 2); // 將角色限制在畫布左右邊界內。
  if (isJumping) { // 判斷角色是否正在空中跳躍。
    characterTop += jumpVelocity; // 依目前垂直速度更新角色高度。
    jumpVelocity += height * 0.0012; // 施加依畫布高度調整的重力。
    if (characterTop >= groundY) { // 判斷角色是否已回到地面。
      characterTop = groundY; // 將角色底端貼齊畫布底端。
      jumpVelocity = 0; // 清除落地後的垂直速度。
      isJumping = false; // 結束本次跳躍狀態。
    } // 結束落地判斷。
  } else { // 角色未跳躍時維持站立地面位置。
    characterTop = groundY; // 將角色底端固定在畫布底端。
  } // 結束角色垂直位置更新。
  const frameIndex = isJumping ? floor((frameCount - jumpAnimationStartFrame) / 3) % activeFrameCount : isPushing ? floor((frameCount - pushAnimationStartFrame) / animationSpeed) % activeFrameCount : floor(frameCount / animationSpeed) % activeFrameCount; // 依目前動作播放對應動畫影格。
  const characterLeft = characterCenterX - displayWidth / 2; // 由角色中心計算圖片左側位置。
  push(); // 暫存畫布座標狀態以便處理角色轉向。
  translate(characterLeft, 0); // 將繪圖原點移至角色圖片左側。
  if (facingDirection < 0) { // 判斷角色是否需要朝左轉向。
    translate(displayWidth, 0); // 將水平翻轉的原點移至圖片右側。
    scale(-1, 1); // 水平翻轉角色圖片以面向左側。
  } // 結束角色轉向判斷。
  image(activeSprite, 0, characterTop, displayWidth, displayHeight, frameIndex * sourceFrameWidth, 0, sourceFrameWidth, sourceFrameHeight); // 繪製目前動作所選取的精靈影格。
  pop(); // 還原畫布座標狀態以免影響其他繪圖。
  drawSecondCharacter(); // 更新並繪製由 A、D、W、S 鍵控制的第二個角色。
} // 結束繪圖函式。

function keyPressed() { // 按下空白鍵或方向鍵時更新角色動作狀態。
  if (keyCode === 32 && !isPushing) { // 判斷是否首次按下空白鍵。
    isPushing = true; // 開始播放推動狀態。
    pushAnimationStartFrame = frameCount; // 從推動起始影格播放推動動畫。
  } // 結束空白鍵處理。
  if (keyCode === RIGHT_ARROW) { // 判斷是否按下右方向鍵。
    rightKeyDown = true; // 記錄右方向鍵正在按住。
    horizontalDirection = 1; // 設定角色向右移動。
    facingDirection = 1; // 讓角色面向右側。
  } // 結束右方向鍵處理。
  if (keyCode === LEFT_ARROW) { // 判斷是否按下左方向鍵。
    leftKeyDown = true; // 記錄左方向鍵正在按住。
    horizontalDirection = -1; // 設定角色向左移動。
    facingDirection = -1; // 讓角色面向左側。
  } // 結束左方向鍵處理。
  if (keyCode === UP_ARROW && !isJumping) { // 僅在角色尚未跳躍時接受上方向鍵。
    isJumping = true; // 開始播放跳躍狀態。
    jumpVelocity = -height * 0.024; // 設定依畫布高度調整的向上初速度。
    jumpAnimationStartFrame = frameCount; // 從跳躍起始影格播放跳躍動畫。
  } // 結束上方向鍵處理。
  if (keyCode === 65) { // 判斷是否按下 A 鍵。
    characterTwoLeftKeyDown = true; // 記錄 A 鍵正在按住。
    characterTwoDirection = -1; // 設定角色二向左移動。
    characterTwoFacingDirection = -1; // 讓角色二面向左側。
  } // 結束 A 鍵處理。
  if (keyCode === 68) { // 判斷是否按下 D 鍵。
    characterTwoRightKeyDown = true; // 記錄 D 鍵正在按住。
    characterTwoDirection = 1; // 設定角色二向右移動。
    characterTwoFacingDirection = 1; // 讓角色二面向右側。
  } // 結束 D 鍵處理。
  if (keyCode === 87 && !characterTwoFlipKeyDown) { // 判斷是否首次按下 W 鍵。
    characterTwoFlipKeyDown = true; // 記錄 W 鍵已按下以避免自動重複觸發。
    characterTwoAction = 'flip'; // 設定角色二播放空中轉圈動作。
    characterTwoActionStartFrame = frameCount; // 記錄空中轉圈動作的起始影格。
  } // 結束 W 鍵處理。
  if (keyCode === 83 && !characterTwoPunchKeyDown) { // 判斷是否首次按下 S 鍵。
    characterTwoPunchKeyDown = true; // 記錄 S 鍵已按下以避免自動重複觸發。
    characterTwoAction = 'punch'; // 設定角色二播放揮拳動作。
    characterTwoActionStartFrame = frameCount; // 記錄揮拳動作的起始影格。
  } // 結束 S 鍵處理。
  return false; // 阻止方向鍵造成瀏覽器頁面捲動。
} // 結束按鍵按下處理函式。

function keyReleased() { // 放開空白鍵或方向鍵時更新角色動作狀態。
  if (keyCode === 32) { // 判斷是否放開空白鍵。
    isPushing = false; // 結束推動狀態並切回目前的移動或站立動作。
  } // 結束空白鍵放開處理。
  if (keyCode === LEFT_ARROW) { // 判斷是否放開左方向鍵。
    leftKeyDown = false; // 記錄左方向鍵已放開。
  } // 結束左方向鍵放開處理。
  if (keyCode === RIGHT_ARROW) { // 判斷是否放開右方向鍵。
    rightKeyDown = false; // 記錄右方向鍵已放開。
  } // 結束右方向鍵放開處理。
  if (leftKeyDown) { // 優先處理仍按住的左方向鍵。
    horizontalDirection = -1; // 繼續向左移動。
    facingDirection = -1; // 保持面向左側。
  } else if (rightKeyDown) { // 否則檢查右方向鍵是否仍按住。
    horizontalDirection = 1; // 繼續向右移動。
    facingDirection = 1; // 保持面向右側。
  } else { // 若左右方向鍵都已放開。
    horizontalDirection = 0; // 停止水平移動並切回站立動畫。
  } // 結束方向鍵放開後的移動狀態更新。
  if (keyCode === 65) { // 判斷是否放開 A 鍵。
    characterTwoLeftKeyDown = false; // 記錄 A 鍵已放開。
  } // 結束 A 鍵放開處理。
  if (keyCode === 68) { // 判斷是否放開 D 鍵。
    characterTwoRightKeyDown = false; // 記錄 D 鍵已放開。
  } // 結束 D 鍵放開處理。
  if (characterTwoLeftKeyDown) { // 優先處理仍按住的 A 鍵。
    characterTwoDirection = -1; // 讓角色二繼續向左移動。
    characterTwoFacingDirection = -1; // 保持角色二面向左側。
  } else if (characterTwoRightKeyDown) { // 否則檢查 D 鍵是否仍按住。
    characterTwoDirection = 1; // 讓角色二繼續向右移動。
    characterTwoFacingDirection = 1; // 保持角色二面向右側。
  } else { // 若 A、D 鍵都已放開。
    characterTwoDirection = 0; // 停止角色二水平移動。
  } // 結束角色二方向鍵放開後的移動狀態更新。
  if (keyCode === 87) { // 判斷是否放開 W 鍵。
    characterTwoFlipKeyDown = false; // 記錄 W 鍵已放開以允許下次觸發。
  } // 結束 W 鍵放開處理。
  if (keyCode === 83) { // 判斷是否放開 S 鍵。
    characterTwoPunchKeyDown = false; // 記錄 S 鍵已放開以允許下次觸發。
  } // 結束 S 鍵放開處理。
  return false; // 阻止方向鍵造成瀏覽器頁面捲動。
} // 結束按鍵放開處理函式。

function drawSecondCharacter() { // 更新角色二位置並繪製目前的走路或動作影格。
  const actionFrame = floor((frameCount - characterTwoActionStartFrame) / animationSpeed); // 計算角色二目前動作已播放的影格序號。
  if (characterTwoAction !== '' && actionFrame >= characterTwoActionFrameCount) { // 判斷角色二的單次動作是否已播放完畢。
    characterTwoAction = ''; // 清除已完成的動作並恢復走路姿勢。
  } // 結束動作播放完成判斷。
  const activeSprite = characterTwoAction === 'flip' ? characterTwoFlipSprite : characterTwoAction === 'punch' ? characterTwoPunchSprite : characterTwoWalkSprite; // 依角色二目前狀態選擇走路、轉圈或揮拳精靈圖。
  const activeFrameCount = characterTwoAction === '' ? characterTwoWalkFrameCount : characterTwoActionFrameCount; // 取得角色二目前精靈圖的影格數量。
  const sourceFrameWidth = activeSprite.width / activeFrameCount; // 依目前精靈圖寬度計算單格影格寬度。
  const sourceFrameHeight = activeSprite.height; // 取得目前精靈圖單格影格高度。
  const walkFrameWidth = characterTwoWalkSprite.width / characterTwoWalkFrameCount; // 取得角色二走路影格寬度作為統一縮放基準。
  const characterScale = min((width * 0.2) / walkFrameWidth, (height * 0.38) / characterTwoWalkSprite.height); // 依畫布尺寸計算角色二的固定縮放比例。
  const displayWidth = sourceFrameWidth * characterScale; // 計算角色二目前影格的顯示寬度。
  const displayHeight = sourceFrameHeight * characterScale; // 計算角色二目前影格的顯示高度。
  const movementSpeed = max(2, width * 0.006); // 依畫布寬度設定角色二水平移動速度。
  characterTwoCenterX += characterTwoDirection * movementSpeed; // 依目前按鍵方向更新角色二水平位置。
  characterTwoCenterX = constrain(characterTwoCenterX, displayWidth / 2, width - displayWidth / 2); // 將角色二限制在畫布左右邊界內。
  const frameIndex = characterTwoAction === '' ? characterTwoDirection === 0 ? 0 : floor(frameCount / animationSpeed) % activeFrameCount : actionFrame; // 靜止時顯示走路首格，移動或動作時依序播放對應影格。
  const characterLeft = characterTwoCenterX - displayWidth / 2; // 由角色二中心計算目前影格的左側位置。
  const characterTwoTop = height - displayHeight; // 讓角色二目前影格的底端貼齊畫布底端。
  push(); // 暫存畫布座標狀態以便處理角色二轉向。
  translate(characterLeft, 0); // 將繪圖原點移至角色二目前影格的左側。
  if (characterTwoFacingDirection < 0) { // 判斷角色二是否需要面向左側。
    translate(displayWidth, 0); // 將水平翻轉的原點移至角色二影格右側。
    scale(-1, 1); // 水平翻轉角色二影格以面向左側。
  } // 結束角色二轉向判斷。
  image(activeSprite, 0, characterTwoTop, displayWidth, displayHeight, frameIndex * sourceFrameWidth, 0, sourceFrameWidth, sourceFrameHeight); // 繪製角色二目前動作所選取的精靈影格。
  pop(); // 還原畫布座標狀態以免影響其他繪圖。
  const charactersOverlapHorizontally = characterCenterX - characterDisplayWidth / 2 < characterTwoCenterX + displayWidth / 2 && characterTwoCenterX - displayWidth / 2 < characterCenterX + characterDisplayWidth / 2; // 判斷兩個角色的水平範圍是否重疊。
  const charactersOverlapVertically = characterTop < characterTwoTop + displayHeight && characterTwoTop < characterTop + characterDisplayHeight; // 判斷兩個角色的垂直範圍是否重疊。
  if (!encounterTriggered && charactersOverlapHorizontally && charactersOverlapVertically) { // 首次偵測到兩個角色相遇時觸發對話。
    encounterTriggered = true; // 標記本頁面已觸發相遇，避免對話再次出現。
    encounterStartTime = millis(); // 記錄相遇對話開始顯示的時間。
  } // 結束相遇對話觸發判斷。
  if (encounterTriggered && millis() - encounterStartTime < encounterDuration) { // 判斷相遇對話是否仍在三秒顯示期間內。
    const bubbleWidth = min(220, width - 24); // 依畫布寬度計算對話泡泡寬度。
    const bubbleX = constrain((characterCenterX + characterTwoCenterX) / 2, bubbleWidth / 2 + 12, width - bubbleWidth / 2 - 12); // 將對話泡泡放在兩個角色之間並限制於畫布範圍。
    const bubbleY = max(34, min(characterTop, characterTwoTop) - 34); // 將對話泡泡放在兩個角色頭頂上方。
    push(); // 暫存畫布狀態以設定對話泡泡樣式。
    rectMode(CENTER); // 使用泡泡中心作為矩形繪製座標。
    textAlign(CENTER, CENTER); // 將對話文字置中對齊。
    textSize(20); // 設定對話文字大小。
    stroke('#263238'); // 設定對話泡泡外框顏色。
    strokeWeight(2); // 設定對話泡泡外框粗細。
    fill('#FFFFFF'); // 設定對話泡泡背景顏色。
    rect(bubbleX, bubbleY, bubbleWidth, 44, 12); // 繪製白色圓角對話泡泡。
    noStroke(); // 移除文字外框以保持清晰。
    fill('#263238'); // 設定對話文字顏色。
    text('來戰鬥吧', bubbleX, bubbleY); // 顯示兩個角色的相遇對話。
    pop(); // 還原畫布狀態以免影響後續繪圖。
  } // 結束相遇對話顯示判斷。
} // 結束角色二繪圖函式。

function windowResized() { // 視窗尺寸改變時重新調整畫布與角色位置。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗。
  const activeSprite = isJumping ? jumpSprite : isPushing ? pushSprite : horizontalDirection === 0 ? stopSprite : walkSprite; // 取得目前動作所使用的精靈圖。
  const activeFrameCount = isJumping ? jumpFrameCount : isPushing ? pushFrameCount : horizontalDirection === 0 ? stopFrameCount : walkFrameCount; // 取得目前動作的影格數量。
  const displayWidth = (activeSprite.width / activeFrameCount) * min((width * 0.24) / (activeSprite.width / activeFrameCount), (height * 0.4) / activeSprite.height); // 依新畫布尺寸計算角色顯示寬度。
  characterCenterX = constrain(characterCenterX, displayWidth / 2, width - displayWidth / 2); // 視窗縮放後避免角色超出左右邊界。
  if (!isJumping) { // 若角色目前沒有跳躍。
    characterTop = height - activeSprite.height * min((width * 0.24) / (activeSprite.width / activeFrameCount), (height * 0.4) / activeSprite.height); // 讓角色重新貼齊縮放後的畫布底端。
  } // 結束角色貼底位置調整。
  const characterTwoWalkFrameWidth = characterTwoWalkSprite.width / characterTwoWalkFrameCount; // 取得角色二走路單格影格寬度。
  const characterTwoScale = min((width * 0.2) / characterTwoWalkFrameWidth, (height * 0.38) / characterTwoWalkSprite.height); // 依新畫布尺寸計算角色二縮放比例。
  characterTwoCenterX = constrain(characterTwoCenterX, (characterTwoWalkFrameWidth * characterTwoScale) / 2, width - (characterTwoWalkFrameWidth * characterTwoScale) / 2); // 視窗縮放後避免角色二超出左右邊界。
} // 結束視窗尺寸調整函式。
