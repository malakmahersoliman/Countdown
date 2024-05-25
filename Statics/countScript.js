const countdownEls = document.querySelectorAll(".countdown");

countdownEls.forEach(countdownEl => createCountdown(countdownEl));

function createCountdown(countdownEl) {
    const target = new Date(countdownEl.dataset.targetDate);

    const parts = {
        days: { text: ["days", "day"], dots: 30 },
        hours: { text: ["hours", "hour"], dots: 24 },
        minutes: { text: ["minutes", "minute"], dots: 60 },
        seconds: { text: ["seconds", "second"], dots: 60 },
    };

    Object.entries(parts).forEach(([key, value]) => {
        const partEl = document.createElement("div");
        partEl.classList.add("part", key);
        partEl.style.setProperty("--dots", value.dots);
        value.element = partEl;

        const remainingEl = document.createElement("div");
        remainingEl.classList.add("remaining");
        remainingEl.innerHTML = `
            <span class="number"></span>
            <span class="text"></span>
        `;

        partEl.append(remainingEl);

        for (let i = 0; i < value.dots; i++) {
            const dotContainerEl = document.createElement("div");
            dotContainerEl.style.setProperty("--dot-idx", i);
            dotContainerEl.classList.add("dot-container");
            const dotEl = document.createElement("div");
            dotEl.classList.add("dot");
            dotContainerEl.append(dotEl);
            partEl.append(dotContainerEl);
        }

        countdownEl.append(partEl);
    });

    function updateRemainingTime() {
        const now = new Date();
        const remainingTime = target - now;

        if (remainingTime <= 0) {
            clearInterval(interval);
            Object.values(parts).forEach(part => {
                part.element.querySelector('.number').textContent = "0";
                part.element.querySelector('.text').textContent = part.text[0];
                const dots = part.element.querySelectorAll('.dot');
                dots.forEach(dot => dot.dataset.active = 'false');
            });
            return;
        }

        const timeParts = {
            days: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
            hours: Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((remainingTime % (1000 * 60)) / 1000),
        };

        Object.entries(timeParts).forEach(([key, value]) => {
            const part = parts[key];
            const numberEl = part.element.querySelector('.number');
            numberEl.textContent = value;

            const dots = part.element.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.dataset.active = index < value ? 'true' : 'false';
                dot.dataset.lastactive = index === value - 1 ? 'true' : 'false';
            });
        });
    }

    const interval = setInterval(updateRemainingTime, 1000);
    updateRemainingTime(); // Initial call to set the time immediately
}
