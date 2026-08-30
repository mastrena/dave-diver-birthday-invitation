const config = window.BIRTHDAY_INVITATION

if (!config) throw new Error('没有找到 config.js，请确认文件与 index.html 放在同一目录。')

document.querySelectorAll('[data-field]').forEach((element) => {
  const value = config[element.dataset.field]
  if (value !== undefined && value !== null) element.textContent = value
})
document.querySelectorAll('[data-link]').forEach((element) => {
  const value = config[element.dataset.link]
  if (value) element.href = value
})

document.title = `${config.heroName}的生日邀请｜BLUE HOLE BIRTHDAY`
document.querySelector('meta[name="description"]')?.setAttribute('content', `${config.heroName}发来一份蓝洞生日任务，等你加入。`)
document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${config.heroName}的生日邀请｜BLUE HOLE BIRTHDAY`)
document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', `${config.heroName}的生日邀请｜BLUE HOLE BIRTHDAY`)

const scheduleList = document.querySelector('#schedule-list')
const scheduleItems = Array.isArray(config.schedule) ? config.schedule : []
scheduleItems.forEach((item) => {
  const article = document.createElement('article')
  const time = document.createElement('time')
  const copy = document.createElement('div')
  const title = document.createElement('b')
  const detail = document.createElement('span')
  const stars = document.createElement('strong')
  time.textContent = item.time
  title.textContent = item.title
  detail.textContent = item.detail
  stars.textContent = item.stars || '★'
  copy.append(title, detail)
  article.append(time, copy, stars)
  scheduleList.append(article)
})

const crewSlidesRoot = document.querySelector('#crew-slides')
const crewItems = Array.isArray(config.crewMessages) && config.crewMessages.length
  ? config.crewMessages
  : [{ name: 'BLUE HOLE', image: './assets/dave-character.webp', message: '生日任务已经就绪，等待你的加入！' }]
crewItems.forEach((item, index) => {
  const article = document.createElement('article')
  article.className = `crew-slide${index === 0 ? ' is-active' : ''}`
  article.dataset.name = item.name
  const image = document.createElement('img')
  image.src = item.image
  image.alt = `${item.name} 的生日来电`
  const message = document.createElement('p')
  const name = document.createElement('b')
  name.textContent = item.name
  message.append(name, document.createTextNode(`“${item.message}”`))
  article.append(image, message)
  crewSlidesRoot.append(article)
})

const eventDate = new Date(config.dateTime)
const daysCount = document.querySelector('#days-count')
if (Number.isNaN(eventDate.getTime())) {
  daysCount.textContent = '--'
  daysCount.title = '请检查 config.js 中的 dateTime 格式'
} else {
  daysCount.textContent = String(Math.max(0, Math.ceil((eventDate.getTime() - Date.now()) / 86400000)))
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealElements = document.querySelectorAll('.reveal')
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return
    entry.target.classList.add('is-visible')
    revealObserver.unobserve(entry.target)
  }), { threshold: 0.12, rootMargin: '0px 0px -4% 0px' })
  revealElements.forEach((element) => revealObserver.observe(element))
} else revealElements.forEach((element) => element.classList.add('is-visible'))

const bubbleField = document.querySelector('.bubble-field')
for (let index = 0; index < 28; index += 1) {
  const bubble = document.createElement('i')
  bubble.style.left = `${(index * 37 + 9) % 97}%`
  bubble.style.setProperty('--duration', `${6 + (index % 6) * 1.1}s`)
  bubble.style.setProperty('--delay', `${-(index % 9) * 1.15}s`)
  bubbleField.append(bubble)
}

const hud = document.querySelector('.game-hud')
const depthValue = document.querySelector('#depth-value')
const oxygenFill = document.querySelector('#oxygen-fill')
const musicHint = document.querySelector('#music-hint')
let ticking = false
function updateHud() {
  const progress = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))
  hud.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.55)
  depthValue.textContent = String(Math.round(progress * 420))
  oxygenFill.style.transform = `scaleX(${1 - progress * 0.22})`
  if (window.scrollY > 20) musicHint.classList.add('is-hidden')
  ticking = false
}
window.addEventListener('scroll', () => {
  if (!ticking) requestAnimationFrame(updateHud)
  ticking = true
}, { passive: true })

const missionCard = document.querySelector('.mission-card')
const acceptButton = document.querySelector('#accept-quest')
const questStatus = document.querySelector('#quest-status')
const missionComplete = document.querySelector('#mission-complete')
let holdTimer
function startHold() {
  if (missionCard.classList.contains('is-accepted') || missionCard.classList.contains('is-holding')) return
  missionCard.classList.add('is-holding')
  holdTimer = window.setTimeout(() => {
    missionCard.classList.remove('is-holding')
    missionCard.classList.add('is-accepted')
    questStatus.textContent = 'ACCEPTED'
    acceptButton.textContent = '委托已接受 ✓'
    missionComplete.classList.remove('show')
    requestAnimationFrame(() => missionComplete.classList.add('show'))
    navigator.vibrate?.([45, 30, 80])
  }, 900)
}
function cancelHold() {
  window.clearTimeout(holdTimer)
  missionCard.classList.remove('is-holding')
}
acceptButton.addEventListener('pointerdown', startHold)
acceptButton.addEventListener('pointerup', cancelHold)
acceptButton.addEventListener('pointerleave', cancelHold)
acceptButton.addEventListener('pointercancel', cancelHold)
acceptButton.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    startHold()
  }
})
acceptButton.addEventListener('keyup', cancelHold)

const gameStage = document.querySelector('#game-stage')
const gameIntro = document.querySelector('#game-intro')
const gameResult = document.querySelector('#game-result')
const gameTime = document.querySelector('#game-time')
const gameScoreOutput = document.querySelector('#game-score')
const gameComboOutput = document.querySelector('#game-combo')
const gameOxygenOutput = document.querySelector('#game-oxygen')
const gameHudScore = document.querySelector('#game-hud-score')
const gameBestOutput = document.querySelector('#game-best')
const gameResultTitle = document.querySelector('#game-result-title')
const gameFinalScore = document.querySelector('#game-final-score')
const gameReward = document.querySelector('#game-reward')
const GAME_DURATION = 20000
const GAME_TARGET = 8
const gameSupplies = [
  { icon: '🎂', label: '生日蛋糕', points: 3 },
  { icon: '🎁', label: '生日礼物', points: 2 },
  { icon: '🧁', label: '纸杯蛋糕', points: 2 },
  { icon: '🎈', label: '生日气球', points: 1 },
  { icon: '⭐', label: '幸运星', points: 1 },
]
const gameHazards = [
  { icon: '🗑️', label: '海洋垃圾' },
  { icon: '🪨', label: '海底礁石' },
  { icon: '🧦', label: '走失的袜子' },
]
const gameLanes = [4, 23, 42, 61, 80]
const gameBestKey = 'blue-hole-birthday-supply-best'
let gameActive = false
let gameScore = 0
let gameCombo = 0
let gameOxygen = 3
let gameCollected = 0
let gameBest = 0
try { gameBest = Math.max(0, Number(localStorage.getItem(gameBestKey) || 0) || 0) } catch { gameBest = 0 }
let gameEndAt = 0
let gameSpawnTimer
let gameClockTimer
let gameRound = 0
let lastGameLane = -1
gameBestOutput.textContent = String(gameBest)

function updateGameStats() {
  gameScoreOutput.textContent = String(gameScore)
  gameHudScore.textContent = String(gameScore)
  gameComboOutput.textContent = `×${gameCombo}`
  gameOxygenOutput.textContent = `${'●'.repeat(gameOxygen)}${'○'.repeat(3 - gameOxygen)}`
}

function showGameFloat(item, text, danger = false) {
  const itemRect = item.getBoundingClientRect()
  const stageRect = gameStage.getBoundingClientRect()
  const marker = document.createElement('p')
  marker.className = `game-float${danger ? ' is-danger' : ''}`
  marker.textContent = text
  marker.style.left = `${itemRect.left - stageRect.left + 8}px`
  marker.style.top = `${itemRect.top - stageRect.top}px`
  gameStage.append(marker)
  window.setTimeout(() => marker.remove(), 750)
}

function maybeShowGameBlessing(item) {
  if (Math.random() > .38) return
  const blessings = Array.isArray(config.gameBlessings) && config.gameBlessings.length
    ? config.gameBlessings
    : ['愿你新一岁快乐值永久 MAX']
  const itemRect = item.getBoundingClientRect()
  const stageRect = gameStage.getBoundingClientRect()
  const blessing = document.createElement('p')
  blessing.className = 'game-blessing'
  blessing.textContent = blessings[Math.floor(Math.random() * blessings.length)]
  blessing.style.left = `${Math.max(6, Math.min(stageRect.width - 176, itemRect.left - stageRect.left - 50))}px`
  blessing.style.top = `${Math.max(8, itemRect.top - stageRect.top - 38)}px`
  gameStage.append(blessing)
  window.setTimeout(() => blessing.remove(), 2100)
}

function clearGameItems() {
  gameStage.querySelectorAll('.supply-item, .game-float, .game-blessing').forEach((item) => item.remove())
}

function finishSupplyGame() {
  if (!gameActive) return
  gameActive = false
  window.clearInterval(gameSpawnTimer)
  window.clearInterval(gameClockTimer)
  clearGameItems()
  gameTime.textContent = '0.0'
  if (gameScore > gameBest) {
    gameBest = gameScore
    gameBestOutput.textContent = String(gameBest)
    try { localStorage.setItem(gameBestKey, String(gameBest)) } catch { /* 无痕模式下忽略最高分保存失败 */ }
  }
  const success = gameCollected >= GAME_TARGET && gameOxygen > 0
  const rewards = Array.isArray(config.gameRewards) && config.gameRewards.length ? config.gameRewards : ['快乐值永久 MAX']
  gameResultTitle.textContent = success ? '补给打捞成功！' : gameOxygen <= 0 ? '氧气耗尽！' : '还差一点！'
  gameFinalScore.textContent = `${gameScore} PTS`
  gameReward.textContent = success
    ? `生日彩蛋：${rewards[Math.floor(Math.random() * rewards.length)]}`
    : `本次收集 ${gameCollected}/${GAME_TARGET} 件补给，再试一次就能解锁彩蛋。`
  gameResult.hidden = false
  navigator.vibrate?.(success ? [35, 25, 35, 25, 80] : [80, 40, 80])
}

function spawnSupplyItem() {
  if (!gameActive) return
  const itemRound = gameRound
  const danger = Math.random() < .23
  const pool = danger ? gameHazards : gameSupplies
  const itemData = pool[Math.floor(Math.random() * pool.length)]
  const item = document.createElement('button')
  const fallTime = 2400
  const availableLanes = gameLanes.map((_, index) => index).filter((index) => index !== lastGameLane)
  const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)]
  lastGameLane = lane
  let resolved = false
  let expiryTimer
  item.type = 'button'
  item.className = `supply-item${danger ? ' is-danger' : ''}`
  item.textContent = itemData.icon
  item.setAttribute('aria-label', `${danger ? '避开' : '打捞'}${itemData.label}`)
  item.style.setProperty('--left', `${gameLanes[lane]}%`)
  item.style.setProperty('--drift', `${-8 + Math.random() * 16}px`)
  item.style.setProperty('--fall-time', `${fallTime}ms`)
  if (reducedMotion) {
    item.style.top = `${8 + Math.random() * 64}%`
    item.style.animation = 'none'
  }

  function expireItem() {
    if (resolved) return
    resolved = true
    if (!gameActive || itemRound !== gameRound) {
      item.remove()
      return
    }
    if (!danger) gameCombo = 0
    updateGameStats()
    item.remove()
  }

  item.addEventListener('click', () => {
    if (!gameActive || resolved || itemRound !== gameRound) return
    resolved = true
    window.clearTimeout(expiryTimer)
    item.classList.add('is-hit')
    if (danger) {
      gameOxygen = Math.max(0, gameOxygen - 1)
      gameScore = Math.max(0, gameScore - 2)
      gameCombo = 0
      showGameFloat(item, '-O₂', true)
      gameStage.classList.remove('is-danger')
      requestAnimationFrame(() => gameStage.classList.add('is-danger'))
      navigator.vibrate?.([70, 30, 70])
    } else {
      gameCollected += 1
      gameCombo += 1
      const comboBonus = Math.min(3, Math.floor(gameCombo / 3))
      const points = itemData.points + comboBonus
      gameScore += points
      showGameFloat(item, `+${points}`)
      maybeShowGameBlessing(item)
      navigator.vibrate?.(22)
    }
    updateGameStats()
    window.setTimeout(() => item.remove(), 330)
    if (gameOxygen === 0 || gameCollected >= GAME_TARGET) window.setTimeout(finishSupplyGame, 350)
  })
  item.addEventListener('animationend', expireItem, { once: true })
  expiryTimer = window.setTimeout(expireItem, reducedMotion ? 1700 : fallTime + 150)
  gameStage.append(item)
}

function startSupplyGame() {
  window.clearInterval(gameSpawnTimer)
  window.clearInterval(gameClockTimer)
  clearGameItems()
  gameScore = 0
  gameCombo = 0
  gameOxygen = 3
  gameCollected = 0
  gameRound += 1
  lastGameLane = -1
  gameActive = true
  gameEndAt = performance.now() + GAME_DURATION
  gameIntro.hidden = true
  gameResult.hidden = true
  gameStage.classList.remove('is-danger')
  gameTime.textContent = '20.0'
  updateGameStats()
  spawnSupplyItem()
  gameSpawnTimer = window.setInterval(spawnSupplyItem, 640)
  gameClockTimer = window.setInterval(() => {
    const remaining = Math.max(0, gameEndAt - performance.now())
    gameTime.textContent = (remaining / 1000).toFixed(1)
    if (remaining <= 0) finishSupplyGame()
  }, 100)
}

document.querySelector('#game-start').addEventListener('click', startSupplyGame)
document.querySelector('#game-restart').addEventListener('click', startSupplyGame)

const crewSlides = [...document.querySelectorAll('.crew-slide')]
const crewName = document.querySelector('#crew-name')
let crewIndex = 0
function showCrew(nextIndex) {
  crewIndex = (nextIndex + crewSlides.length) % crewSlides.length
  crewSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === crewIndex))
  crewName.textContent = `${crewSlides[crewIndex].dataset.name} · ${crewIndex + 1}/${crewSlides.length}`
}
showCrew(0)
document.querySelector('[data-crew="prev"]').addEventListener('click', () => showCrew(crewIndex - 1))
document.querySelector('[data-crew="next"]').addEventListener('click', () => showCrew(crewIndex + 1))

const musicDock = document.querySelector('#music-dock')
const musicToggle = document.querySelector('#music-toggle')
const birthdayBgm = document.querySelector('#birthday-bgm')
const musicEnabled = config.musicEnabled !== false
const hasCustomMusic = typeof config.musicUrl === 'string' && config.musicUrl.trim().length > 0
let musicPlaying = false
let synthContext
let synthTimer
let synthNextBarAt = 0
const synthNodes = new Set()

if (!musicEnabled) musicDock.hidden = true
else if (hasCustomMusic) {
  birthdayBgm.src = config.musicUrl.trim()
  musicHint.textContent = config.musicHint || '点击播放 / 关闭背景音乐'
}
else musicHint.textContent = '点击播放像素音乐'

function setMusicState(playing) {
  musicPlaying = playing
  musicToggle.classList.toggle('playing', playing)
  musicToggle.setAttribute('aria-pressed', String(playing))
  musicToggle.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐')
}

function scheduleSynthTone(frequency, startAt, duration, volume, wave = 'square') {
  if (!synthContext || frequency <= 0) return
  const oscillator = synthContext.createOscillator()
  const gain = synthContext.createGain()
  oscillator.type = wave
  oscillator.frequency.setValueAtTime(frequency, startAt)
  gain.gain.setValueAtTime(.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(volume, startAt + .018)
  gain.gain.exponentialRampToValueAtTime(.0001, startAt + duration)
  oscillator.connect(gain)
  gain.connect(synthContext.destination)
  oscillator.addEventListener('ended', () => synthNodes.delete(oscillator), { once: true })
  synthNodes.add(oscillator)
  oscillator.start(startAt)
  oscillator.stop(startAt + duration + .02)
}

function scheduleSynthBar(startAt) {
  const beat = .24
  const melody = [392, 494, 523.25, 659.25, 587.33, 523.25, 493.88, 392]
  const bass = [130.81, 0, 164.81, 0, 146.83, 0, 196, 0]
  melody.forEach((note, index) => {
    scheduleSynthTone(note, startAt + index * beat, beat * .72, .022)
    scheduleSynthTone(bass[index], startAt + index * beat, beat * 1.45, .014, 'triangle')
  })
}

function scheduleSynthAhead() {
  if (!synthContext) return
  const barDuration = .24 * 8
  while (synthNextBarAt < synthContext.currentTime + .65) {
    scheduleSynthBar(synthNextBarAt)
    synthNextBarAt += barDuration
  }
}

async function playSynthMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) throw new Error('当前浏览器不支持网页音频。')
  synthContext = new AudioContextClass()
  await synthContext.resume()
  synthNextBarAt = synthContext.currentTime + .06
  scheduleSynthAhead()
  synthTimer = window.setInterval(scheduleSynthAhead, 240)
}

async function stopSynthMusic() {
  window.clearInterval(synthTimer)
  synthNodes.forEach((node) => {
    try { node.stop() } catch { /* 已结束的音符无需再次停止 */ }
  })
  synthNodes.clear()
  if (synthContext && synthContext.state !== 'closed') await synthContext.close()
  synthContext = undefined
}

async function playMusic() {
  if (!musicEnabled || musicPlaying) return
  musicHint.classList.add('is-hidden')
  try {
    if (hasCustomMusic) {
      birthdayBgm.volume = 0.58
      await birthdayBgm.play()
    } else await playSynthMusic()
    setMusicState(true)
  } catch {
    await stopSynthMusic()
    setMusicState(false)
    musicHint.textContent = '音乐未能播放，请再次点击'
    musicHint.classList.remove('is-hidden')
  }
}

async function pauseMusic() {
  if (hasCustomMusic) birthdayBgm.pause()
  else await stopSynthMusic()
  setMusicState(false)
}

birthdayBgm.addEventListener('ended', () => setMusicState(false))
birthdayBgm.addEventListener('error', () => {
  if (!hasCustomMusic) return
  setMusicState(false)
  musicHint.textContent = '音乐加载失败，请检查网络或 config.js'
  musicHint.classList.remove('is-hidden')
})
musicToggle.addEventListener('click', () => musicPlaying ? pauseMusic() : playMusic())
document.querySelector('#start-mission').addEventListener('click', () => {
  playMusic()
  document.querySelector('#briefing').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
})

const rsvpForm = document.querySelector('#rsvp-form')
const rsvpSuccess = document.querySelector('#rsvp-success')
const rsvpExternal = document.querySelector('#rsvp-external')
const rsvpExternalLink = document.querySelector('#rsvp-external-link')
const rsvpStatus = document.querySelector('.rsvp-phone .app-bar small')
const publicRsvpUrl = typeof config.rsvpUrl === 'string' ? config.rsvpUrl.trim() : ''

if (publicRsvpUrl) {
  rsvpForm.hidden = true
  rsvpSuccess.hidden = true
  rsvpExternal.hidden = false
  rsvpExternalLink.href = publicRsvpUrl
  rsvpStatus.textContent = 'ONLINE'
} else if (rsvpForm) {
  const messageField = rsvpForm.elements.message
  const messageCount = document.querySelector('#message-count')
  const rsvpError = document.querySelector('#rsvp-error')
  const rsvpSuccessTitle = document.querySelector('#rsvp-success-title')
  const rsvpSuccessSummary = document.querySelector('#rsvp-success-summary')
  const rsvpSubmit = rsvpForm.querySelector('[type="submit"]')
  const partySizeField = document.querySelector('#party-size-field')
  const dietaryField = document.querySelector('#dietary-field')
  const storageKey = 'blue-hole-birthday-demo-rsvp'
  let savedRsvp
  try { savedRsvp = JSON.parse(localStorage.getItem(storageKey)) } catch { savedRsvp = undefined }

  function updateAttendance() {
    const attending = rsvpForm.elements.attending.value === 'yes'
    partySizeField.hidden = !attending
    dietaryField.hidden = !attending
  }
  function fillRsvp(data) {
    if (!data) return
    rsvpForm.elements.guestName.value = data.guestName || ''
    rsvpForm.elements.partySize.value = String(data.partySize || 1)
    rsvpForm.elements.dietary.value = data.dietary || ''
    rsvpForm.elements.message.value = data.message || ''
    const choice = rsvpForm.querySelector(`[name="attending"][value="${data.attending ? 'yes' : 'no'}"]`)
    if (choice) choice.checked = true
    messageCount.value = String(rsvpForm.elements.message.value.length)
    updateAttendance()
  }
  function collectRsvp() {
    const formData = new FormData(rsvpForm)
    const guestName = String(formData.get('guestName') || '').trim()
    const attending = formData.get('attending') === 'yes'
    if (!guestName) throw new Error('请填写你的姓名。')
    return {
      guestName,
      attending,
      partySize: attending ? Number(formData.get('partySize')) : 0,
      dietary: attending ? String(formData.get('dietary') || '').trim() : '',
      message: String(formData.get('message') || '').trim(),
    }
  }
  rsvpForm.addEventListener('change', (event) => {
    if (event.target.name === 'attending') updateAttendance()
  })
  messageField.addEventListener('input', () => { messageCount.value = String(messageField.value.length) })
  rsvpForm.addEventListener('submit', (event) => {
    event.preventDefault()
    rsvpError.hidden = true
    let submission
    try { submission = collectRsvp() } catch (error) {
      rsvpError.textContent = error.message
      rsvpError.hidden = false
      return
    }
    rsvpSubmit.disabled = true
    rsvpSubmit.querySelector('span').textContent = '正在保存演示登记……'
    try {
      savedRsvp = submission
      localStorage.setItem(storageKey, JSON.stringify(savedRsvp))
      rsvpForm.hidden = true
      rsvpSuccess.hidden = false
      rsvpSuccessTitle.textContent = `${submission.guestName}，登记成功`
      rsvpSuccessSummary.textContent = submission.attending
        ? `已在本机保存 ${submission.partySize} 人的演示记录；这些内容不会上传。`
        : '已在本机保存“遗憾缺席”的演示记录；这些内容不会上传。'
      rsvpSuccess.focus({ preventScroll: true })
    } catch {
      rsvpError.textContent = '当前浏览器无法保存，请检查隐私设置后再试。'
      rsvpError.hidden = false
    } finally {
      rsvpSubmit.disabled = false
      rsvpSubmit.querySelector('span').textContent = '保存赴约信息'
    }
  })
  document.querySelector('#rsvp-edit').addEventListener('click', () => {
    fillRsvp(savedRsvp)
    rsvpForm.hidden = false
    rsvpSuccess.hidden = true
  })
  updateAttendance()
  fillRsvp(savedRsvp)
}
