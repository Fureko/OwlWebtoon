document.addEventListener("DOMContentLoaded", () => {
    const webtoonsContainer = document.querySelector(".webtoon-buttons");
    const tabsContainer = document.querySelector(".tabs");
    const chaptersContainer = document.getElementById("chapters");
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    function generateChapters(count) {
        return Array.from({ length: count }, (_, i) => i + 1);
    }

    const webtoonData = {
        "Blue Project": {
            chapters: [...generateChapters(24), 25, 25.5, ...generateChapters(22).map((n) => n + 25)]
        },
        "Roses and Champagne": {
            chapters: generateChapters(52)
        },
        "Oshi No Ko": {
            chapters: [
                ...generateChapters(156),
                20.5, 25.5, 25.6, 25.7, 25.8,
                90.1, 90.2, 111.1, 115.5,
                125.5, 125.6, 125.7, 125.8
            ]
        },
        "La Vrai C'est Moi": {
            chapters: generateChapters(128)
        }
    };

    async function loadChapterImages(webtoonName, chapterIndex) {
        const chapterName = `Chapitre ${chapterIndex}`;
        const chapterDiv = document.createElement("div");
        chapterDiv.className = "chapter";
        chapterDiv.id = `webtoon-${webtoonName}-chapter-${chapterIndex}`;

        const chapterTitle = document.createElement("h2");
        chapterTitle.textContent = chapterName;
        chapterDiv.appendChild(chapterTitle);

        const imagesDiv = document.createElement("div");
        imagesDiv.className = "images";

        let index = 1;
        let hasImages = false;

        while (true) {
            const imgSrc = `Webtoon/${webtoonName}/${chapterName}/${String(index).padStart(2, "0")}.jpg`;
            const imgExists = await imageExists(imgSrc);

            if (!imgExists) break;

            hasImages = true;
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = `Page ${index}`;
            img.loading = "lazy";  // Lazy loading natif
            imagesDiv.appendChild(img);

            index++;
        }

        if (hasImages) {
            chapterDiv.appendChild(imagesDiv);
            chaptersContainer.appendChild(chapterDiv);
        }
    }

    function imageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    }

    function setActiveTab(tab) {
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
    }

    function setActiveChapter(chapterId) {
        document.querySelectorAll(".chapter").forEach((c) => c.classList.remove("active"));
        document.getElementById(chapterId).classList.add("active");
    }

    function createTab(webtoonName, chapterIndex) {
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.id = `tab-webtoon-${webtoonName}-chapter-${chapterIndex}`;
        tab.textContent = `Chapitre ${chapterIndex}`;
        tab.addEventListener("click", async () => {
            setActiveTab(tab);
            const chapterId = `webtoon-${webtoonName}-chapter-${chapterIndex}`;
            let chapterElement = document.getElementById(chapterId);
            if (!chapterElement) {
                await loadChapterImages(webtoonName, chapterIndex);
                chapterElement = document.getElementById(chapterId);
            }
            setActiveChapter(chapterId);
        });
        tabsContainer.appendChild(tab);
    }

    function addTabs(webtoonName) {
        const chapters = webtoonData[webtoonName]?.chapters || [];
        tabsContainer.innerHTML = "";  // Nettoyer les anciens onglets

        chapters.sort((a, b) => a - b).forEach((chapterIndex) => {
            createTab(webtoonName, chapterIndex);
        });
    }

    function addWebtoonButton(webtoonName) {
        const button = document.createElement("div");
        button.className = "webtoon-button";
        button.id = `webtoon-${webtoonName}`;
        button.textContent = webtoonName;
        button.addEventListener("click", () => {
            document.querySelectorAll(".webtoon-button").forEach((b) => b.classList.remove("active"));
            button.classList.add("active");
            clearChapters();
            addTabs(webtoonName);
            activateFirstChapter();
        });
        webtoonsContainer.appendChild(button);
    }

    function clearChapters() {
        chaptersContainer.innerHTML = "";
    }

    function activateFirstChapter() {
        const firstTab = tabsContainer.querySelector(".tab");
        if (firstTab) {
            firstTab.classList.add("active");
            const firstChapterId = `webtoon-${firstTab.id.split('-').pop()}`;
            setActiveChapter(firstChapterId);
        }
    }

    function initializeWebtoonButtons() {
        Object.keys(webtoonData).forEach((webtoonName) => {
            addWebtoonButton(webtoonName);
        });

        if (webtoonsContainer.firstChild) {
            webtoonsContainer.firstChild.classList.add("active");
            const firstWebtoonName = Object.keys(webtoonData)[0];
            addTabs(firstWebtoonName);
            activateFirstChapter();
        }
    }

    initializeWebtoonButtons();
});
