/**
 * AMORA LOVE CALCULATOR - MAIN APPLICATION LOGIC
 * Features: Particle Canvas, Dynamic Relationship Emojis (Love, Crush, Best Friends),
 * Custom Pair-Sum Algorithm Engine, Trace Visualizer, Audio Synthesis & History
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Dynamic Relationship Configurations ---
    const RELATIONSHIP_CONFIGS = {
        Romance: {
            key: 'Romance',
            clean: 'loves',
            connectorDisplay: 'loves',
            emoji: '💖',
            iconClass: 'fa-heart',
            themeClass: 'theme-romance',
            color: '#ff2a6d',
            particleColors: ['#ff2a6d', '#ff758c', '#9d4edd'],
            metrics: [
                { label: 'Passion', icon: 'fa-fire' },
                { label: 'Trust', icon: 'fa-shield-halved' },
                { label: 'Communication', icon: 'fa-comments' },
                { label: 'Humor Sync', icon: 'fa-face-laugh-beam' }
            ],
            verdicts: {
                90: { title: 'Cosmic Soulmates 💖', quote: '"Written in the stars, bound by destiny. A legendary match!"' },
                75: { title: 'Deep Flame 🔥', quote: '"Electric chemistry and profound connection. Keep the spark roaring!"' },
                55: { title: 'Sweet Harmony 🌸', quote: '"A wonderful balance of joy, understanding, and affection."' },
                35: { title: 'Growing Spark 🌱', quote: '"Great potential awaits with effort, laughter, and communication."' },
                0:  { title: 'Opposites Attract ⚡', quote: '"Unpredictable & exciting! Difference makes the magic extra spicy."' }
            }
        },
        Crush: {
            key: 'Crush',
            clean: 'crush',
            connectorDisplay: 'crush',
            emoji: '🔥',
            iconClass: 'fa-fire',
            themeClass: 'theme-crush',
            color: '#ff5400',
            particleColors: ['#ff5400', '#ff9f1c', '#ff2a6d'],
            metrics: [
                { label: 'Eye Contact', icon: 'fa-eye' },
                { label: 'Chemistry', icon: 'fa-vial' },
                { label: 'Butterfly Factor', icon: 'fa-bolt' },
                { label: 'Flirt Factor', icon: 'fa-wand-magic-sparkles' }
            ],
            verdicts: {
                90: { title: 'Dream Crush 🔥😍', quote: '"Major butterfly overdose! They definitely glance your way too!"' },
                75: { title: 'Electric Sparks ⚡🦋', quote: '"The tension is real! Time to make a bold move and drop a hint!"' },
                55: { title: 'Sweet Admirer 💌', quote: '"Super cute vibe! A casual chat could unlock something special."' },
                35: { title: 'Shy Connection 🌱', quote: '"The spark is there, but someone needs to make the first move!"' },
                0:  { title: 'Friendly Zone 🙈', quote: '"Keep it cool! Low crush stats, but high potential for fun banter!"' }
            }
        },
        Besties: {
            key: 'Besties',
            clean: 'bestfriend',
            connectorDisplay: 'best friend',
            emoji: '🫂',
            iconClass: 'fa-handshake',
            themeClass: 'theme-besties',
            color: '#ffd166',
            particleColors: ['#ffd166', '#05d9e8', '#9d4edd'],
            metrics: [
                { label: 'Loyalty', icon: 'fa-handshake' },
                { label: 'Secret Keeping', icon: 'fa-user-shield' },
                { label: 'Chaos Energy', icon: 'fa-bolt-lightning' },
                { label: 'Laugh Frequency', icon: 'fa-face-grin-squint' }
            ],
            verdicts: {
                90: { title: 'Unbreakable Besties 🫂✨', quote: '"Rides together, dies together! An unstoppable legendary friendship!"' },
                75: { title: 'Partners In Crime 👯⚡', quote: '"Maximum mischief and endless inside jokes. Bestie goals!"' },
                55: { title: 'Dynamic Duo 🫂', quote: '"Always got each other\'s back through thick and thin!"' },
                35: { title: 'Good Vibes Buddies 🌱', quote: '"Fun connection with plenty of laughs and shared memories."' },
                0:  { title: 'Playful Rivals 🤪', quote: '"Friendly banter and chaotic roasting — dynamic chaos!"' }
            }
        }
    };

    function getRelConfig(relType) {
        const rel = (relType || '').toLowerCase();
        if (rel.includes('crush')) return RELATIONSHIP_CONFIGS.Crush;
        if (rel.includes('best') || rel.includes('friend')) return RELATIONSHIP_CONFIGS.Besties;
        return RELATIONSHIP_CONFIGS.Romance;
    }

    let activeThemeColor = RELATIONSHIP_CONFIGS.Romance.color;
    let activeParticlePalette = RELATIONSHIP_CONFIGS.Romance.particleColors;

    // --- 1. Canvas Particle Engine (Floating Hearts, Flame Sparks & Stars) ---
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 12 + 6;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.02;
            this.isMainShape = Math.random() > 0.3;
            this.color = activeParticlePalette[Math.floor(Math.random() * activeParticlePalette.length)];
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;

            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            if (this.isMainShape) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const d = this.size;
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
                ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
                ctx.fill();
            } else {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- 2. Web Audio Sound Synthesizer ---
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playChime(freqs = [523.25, 659.25, 783.99, 1046.50]) {
        try {
            initAudio();
            if (!audioCtx) return;

            freqs.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(0.01, audioCtx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + idx * 0.08 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.6);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(audioCtx.currentTime + idx * 0.08);
                osc.stop(audioCtx.currentTime + idx * 0.08 + 0.7);
            });
        } catch (e) {
            console.log('Audio playback prevented or unsupported');
        }
    }

    // --- 3. Corrected Algorithm Engine ---
    /**
     * Calculates Love Percentage based on:
     * 1. Combined string: "${name1}${connector}${name2}"
     * 2. Unique character frequencies in order of first appearance.
     * 3. Iterative pair-sum reduction (summing i-th left with i-th right, splitting sums >= 10).
     */
    function calculateLoveScore(name1, name2, relType = 'Romance') {
        const config = getRelConfig(relType);
        const clean1 = name1.toLowerCase().replace(/[^a-z]/g, '');
        const clean2 = name2.toLowerCase().replace(/[^a-z]/g, '');

        const combinedSentence = `${clean1}${config.clean}${clean2}`;
        
        // Step 2: Unique letter counts
        const uniqueChars = [];
        const charCounts = {};

        for (let char of combinedSentence) {
            if (!charCounts[char]) {
                charCounts[char] = 0;
                uniqueChars.push(char);
            }
            charCounts[char]++;
        }

        let currentArray = uniqueChars.map(c => charCounts[c]);
        const frequencyMap = uniqueChars.map(c => ({ char: c, count: charCounts[c] }));

        // Step 3: Iterative Pair Reduction
        const reductionSteps = [];
        reductionSteps.push([...currentArray]);

        while (currentArray.length > 2) {
            const nextArray = [];
            const len = currentArray.length;
            const mid = Math.floor(len / 2);

            for (let i = 0; i < mid; i++) {
                const sum = currentArray[i] + currentArray[len - 1 - i];
                if (sum >= 10) {
                    // Split digits (e.g. 14 -> 1, 4)
                    nextArray.push(Math.floor(sum / 10));
                    nextArray.push(sum % 10);
                } else {
                    nextArray.push(sum);
                }
            }

            // Unpaired middle element
            if (len % 2 !== 0) {
                nextArray.push(currentArray[mid]);
            }

            currentArray = nextArray;
            reductionSteps.push([...currentArray]);

            if (reductionSteps.length > 25) break;
        }

        // Final score from remaining digits
        let finalScore = parseInt(currentArray.join(''), 10);
        if (isNaN(finalScore)) finalScore = 50;
        if (finalScore > 100) finalScore = finalScore % 100;

        return {
            combinedSentence,
            frequencyMap,
            reductionSteps,
            score: finalScore,
            config
        };
    }

    // Hash helper for sub-metrics
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function generateSubMetrics(name1, name2, overallScore) {
        const hash = simpleHash(`${name1.toLowerCase()}_${name2.toLowerCase()}`);
        return {
            metric1: Math.min(99, Math.max(35, (overallScore + (hash % 23) - 10))),
            metric2: Math.min(99, Math.max(40, (overallScore + ((hash >> 2) % 27) - 12))),
            metric3: Math.min(99, Math.max(30, (overallScore + ((hash >> 4) % 25) - 8))),
            metric4: Math.min(99, Math.max(45, (overallScore + ((hash >> 6) % 21) - 5)))
        };
    }

    function getVerdictInfo(score, relType = 'Romance') {
        const config = getRelConfig(relType);
        const dict = config.verdicts;

        if (score >= 90) return dict[90];
        if (score >= 75) return dict[75];
        if (score >= 55) return dict[55];
        if (score >= 35) return dict[35];
        return dict[0];
    }

    // --- 4. DOM Elements & State ---
    const loveForm = document.getElementById('loveForm');
    const person1Input = document.getElementById('person1');
    const person2Input = document.getElementById('person2');
    const swapBtn = document.getElementById('swapBtn');
    const clearBtn = document.getElementById('clearBtn');
    const calculateBtn = document.getElementById('calculateBtn');

    const connectorIcon = document.getElementById('connectorIcon');
    const heartPulseContainer = document.getElementById('heartPulseContainer');
    const resDividerEmoji = document.getElementById('resDividerEmoji');

    const resultsCard = document.getElementById('resultsCard');
    const resName1 = document.getElementById('resName1');
    const resName2 = document.getElementById('resName2');
    const relTag = document.getElementById('relTag');

    const gaugeProgress = document.getElementById('gaugeProgress');
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreVerdict = document.getElementById('scoreVerdict');
    const verdictQuote = document.getElementById('verdictQuote');

    const labelMetric1 = document.getElementById('labelMetric1');
    const labelMetric2 = document.getElementById('labelMetric2');
    const labelMetric3 = document.getElementById('labelMetric3');
    const labelMetric4 = document.getElementById('labelMetric4');

    const valPassion = document.getElementById('valPassion');
    const barPassion = document.getElementById('barPassion');
    const valTrust = document.getElementById('valTrust');
    const barTrust = document.getElementById('barTrust');
    const valComm = document.getElementById('valComm');
    const barComm = document.getElementById('barComm');
    const valHumor = document.getElementById('valHumor');
    const barHumor = document.getElementById('barHumor');

    const algoAccordionBtn = document.getElementById('algoAccordionBtn');
    const algoAccordionContent = document.getElementById('algoAccordionContent');
    const step1Text = document.getElementById('step1Text');
    const step2FreqList = document.getElementById('step2FreqList');
    const step3Reductions = document.getElementById('step3Reductions');

    const shareBtn = document.getElementById('shareBtn');
    const recalculateBtn = document.getElementById('recalculateBtn');

    const historyToggleBtn = document.getElementById('historyToggleBtn');
    const historyBadge = document.getElementById('historyBadge');
    const historyDrawer = document.getElementById('historyDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Pop Note / Disclaimer Modal Elements
    const disclaimerToggleBtn = document.getElementById('disclaimerToggleBtn');
    const heroPopNoteBtn = document.getElementById('heroPopNoteBtn');
    const disclaimerModal = document.getElementById('disclaimerModal');
    const closeDisclaimerX = document.getElementById('closeDisclaimerX');
    const closeDisclaimerBtn = document.getElementById('closeDisclaimerBtn');

    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    let historyData = JSON.parse(localStorage.getItem('amora_love_history') || '[]');

    function updateHistoryBadge() {
        historyBadge.textContent = historyData.length;
    }

    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }

    // --- Dynamic Form Connector UI & Particles ---
    function updateConnectorUI(relType) {
        const config = getRelConfig(relType);
        if (!connectorIcon || !heartPulseContainer) return;

        // Update icon class
        connectorIcon.className = `fa-solid ${config.iconClass} heart-pulse-icon`;

        // Update theme class on container
        heartPulseContainer.className = `heart-pulse-container ${config.themeClass}`;

        // Update particle canvas palette
        activeThemeColor = config.color;
        activeParticlePalette = config.particleColors;
        particles.forEach(p => p.reset());
    }

    // Attach listeners to radio pills for real-time visual change
    const relRadioInputs = document.querySelectorAll('input[name="relType"]');
    relRadioInputs.forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateConnectorUI(e.target.value);
        });
    });

    // Initialize initial form connector UI
    const checkedRadio = document.querySelector('input[name="relType"]:checked');
    if (checkedRadio) {
        updateConnectorUI(checkedRadio.value);
    }

    // --- Disclaimer / Pop Note Logic ---
    function openDisclaimerModal() {
        if (disclaimerModal) {
            disclaimerModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDisclaimerModal() {
        if (disclaimerModal) {
            disclaimerModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (disclaimerToggleBtn) disclaimerToggleBtn.addEventListener('click', openDisclaimerModal);
    if (heroPopNoteBtn) heroPopNoteBtn.addEventListener('click', openDisclaimerModal);
    if (closeDisclaimerX) closeDisclaimerX.addEventListener('click', closeDisclaimerModal);
    if (closeDisclaimerBtn) closeDisclaimerBtn.addEventListener('click', closeDisclaimerModal);

    if (disclaimerModal) {
        disclaimerModal.addEventListener('click', (e) => {
            if (e.target === disclaimerModal) {
                closeDisclaimerModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && disclaimerModal && !disclaimerModal.classList.contains('hidden')) {
            closeDisclaimerModal();
        }
    });

    // Always display Pop Note Modal first on page load
    openDisclaimerModal();

    // Swap names
    swapBtn.addEventListener('click', () => {
        const temp = person1Input.value;
        person1Input.value = person2Input.value;
        person2Input.value = temp;
    });

    // Clear form
    clearBtn.addEventListener('click', () => {
        person1Input.value = '';
        person2Input.value = '';
        resultsCard.classList.add('hidden');
    });

    // Accordion Toggle
    algoAccordionBtn.addEventListener('click', () => {
        algoAccordionBtn.classList.toggle('active');
        algoAccordionContent.classList.toggle('hidden');
    });

    // Handle Form Submit
    loveForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const n1 = person1Input.value.trim();
        const n2 = person2Input.value.trim();
        const rel = document.querySelector('input[name="relType"]:checked').value;

        if (!n1 || !n2) return;

        // Perform Calculation
        const result = calculateLoveScore(n1, n2, rel);
        const config = result.config;
        const subMetrics = generateSubMetrics(n1, n2, result.score);
        const verdict = getVerdictInfo(result.score, rel);

        // Display Header Data & Emojis
        resName1.textContent = n1;
        resName2.textContent = n2;
        if (resDividerEmoji) resDividerEmoji.textContent = config.emoji;
        
        if (relTag) {
            relTag.textContent = `${config.emoji} ${rel}`;
            relTag.className = `rel-tag ${config.themeClass}`;
        }

        // Populate Dynamic Sub-metric Labels & Icons
        if (labelMetric1) labelMetric1.innerHTML = `<i class="fa-solid ${config.metrics[0].icon}"></i> ${config.metrics[0].label}`;
        if (labelMetric2) labelMetric2.innerHTML = `<i class="fa-solid ${config.metrics[1].icon}"></i> ${config.metrics[1].label}`;
        if (labelMetric3) labelMetric3.innerHTML = `<i class="fa-solid ${config.metrics[2].icon}"></i> ${config.metrics[2].label}`;
        if (labelMetric4) labelMetric4.innerHTML = `<i class="fa-solid ${config.metrics[3].icon}"></i> ${config.metrics[3].label}`;

        // Populate Algorithm Step Trace
        step1Text.textContent = `"${n1}" + "${config.emoji} ${config.connectorDisplay}" + "${n2}" = "${result.combinedSentence}"`;

        step2FreqList.innerHTML = result.frequencyMap
            .map(item => `<div class="freq-chip">'${item.char}' : <strong>${item.count}</strong></div>`)
            .join('');

        step3Reductions.innerHTML = result.reductionSteps
            .map((arr, idx) => `<div class="reduction-step">Pass ${idx + 1}: <span class="highlight-pass">[ ${arr.join(', ')} ]</span></div>`)
            .join('');

        // Show Results Card
        resultsCard.classList.remove('hidden');
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Animate SVG Gauge
        const maxOffset = 534; // 2 * PI * 85
        const targetOffset = maxOffset - (maxOffset * result.score) / 100;
        gaugeProgress.style.strokeDashoffset = maxOffset; // Reset

        setTimeout(() => {
            gaugeProgress.style.strokeDashoffset = targetOffset;
        }, 50);

        // Animate Score Counter
        let count = 0;
        const duration = 1500;
        const stepTime = Math.max(10, Math.floor(duration / (result.score || 1)));

        scoreNumber.textContent = '0';
        scoreVerdict.textContent = 'Calculating...';

        const counterTimer = setInterval(() => {
            if (count >= result.score) {
                scoreNumber.textContent = result.score;
                scoreVerdict.textContent = verdict.title;
                clearInterval(counterTimer);
                playChime();
            } else {
                count++;
                scoreNumber.textContent = count;
            }
        }, stepTime);

        // Set Quote
        verdictQuote.textContent = verdict.quote;

        // Animate Sub-Metric Bars
        setTimeout(() => {
            valPassion.textContent = `${subMetrics.metric1}%`;
            barPassion.style.width = `${subMetrics.metric1}%`;

            valTrust.textContent = `${subMetrics.metric2}%`;
            barTrust.style.width = `${subMetrics.metric2}%`;

            valComm.textContent = `${subMetrics.metric3}%`;
            barComm.style.width = `${subMetrics.metric3}%`;

            valHumor.textContent = `${subMetrics.metric4}%`;
            barHumor.style.width = `${subMetrics.metric4}%`;
        }, 200);

        // Save to History
        const historyItem = {
            id: Date.now(),
            name1: n1,
            name2: n2,
            relType: rel,
            emoji: config.emoji,
            score: result.score,
            date: new Date().toLocaleDateString()
        };

        // Avoid duplicate top entry
        if (historyData.length === 0 || historyData[0].name1 !== n1 || historyData[0].name2 !== n2 || historyData[0].relType !== rel) {
            historyData.unshift(historyItem);
            if (historyData.length > 30) historyData.pop();
            localStorage.setItem('amora_love_history', JSON.stringify(historyData));
            updateHistoryBadge();
        }
    });

    // Share / Copy Result
    shareBtn.addEventListener('click', () => {
        const n1 = resName1.textContent;
        const n2 = resName2.textContent;
        const score = scoreNumber.textContent;
        const rel = document.querySelector('input[name="relType"]:checked').value;
        const config = getRelConfig(rel);

        const text = `${config.emoji} ${rel} Match Result: ${n1} & ${n2} have a ${score}% Compatibility on Amora! ✨`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Result copied to clipboard! 📋');
            });
        } else {
            showToast('Result ready to share!');
        }
    });

    // Test Another
    recalculateBtn.addEventListener('click', () => {
        person1Input.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // History Drawer Logic
    function renderHistoryList() {
        if (historyData.length === 0) {
            historyList.innerHTML = '<p style="text-align:center; color: var(--text-muted); margin-top:20px;">No calculations recorded yet.</p>';
            return;
        }

        historyList.innerHTML = historyData.map(item => {
            const itemConfig = getRelConfig(item.relType);
            const emoji = item.emoji || (itemConfig ? itemConfig.emoji : '💖');
            return `
                <div class="history-item">
                    <div>
                        <div class="hist-names">${item.name1} & ${item.name2}</div>
                        <div class="hist-date">${emoji} ${item.relType} • ${item.date}</div>
                    </div>
                    <div class="hist-score">${item.score}%</div>
                </div>
            `;
        }).join('');
    }

    historyToggleBtn.addEventListener('click', () => {
        renderHistoryList();
        historyDrawer.classList.remove('hidden');
    });

    closeDrawerBtn.addEventListener('click', () => {
        historyDrawer.classList.add('hidden');
    });

    historyDrawer.addEventListener('click', (e) => {
        if (e.target === historyDrawer) {
            historyDrawer.classList.add('hidden');
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        historyData = [];
        localStorage.removeItem('amora_love_history');
        updateHistoryBadge();
        renderHistoryList();
        showToast('History cleared');
    });

    updateHistoryBadge();
});

