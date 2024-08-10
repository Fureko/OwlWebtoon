document.addEventListener("DOMContentLoaded", () => {
    const webtoonDropdown = document.getElementById("webtoonDropdown");
    const tabsContainer = document.querySelector(".tabs");
    const chaptersContainer = document.getElementById("chapters");
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

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

    function generateChapters(count) {
        return Array.from({ length: count }, (_, i) => i + 1);
    }

    function initializeDropdown() {
        Object.keys(webtoonData).forEach((webtoonName) => {
            const option = document.createElement("option");
            option.value = webtoonName;
            option.textContent = webtoonName;
            webtoonDropdown.appendChild(option);
        });

        webtoonDropdown.addEventListener("change", async () => {
            const selectedWebtoon = webtoonDropdown.value;
            if (selectedWebtoon) {
                clearChapters();
                addTabs(selectedWebtoon);
                await loadWebtoonChapters(selectedWebtoon);
                activateFirstChapter();
            }
        });

        // Charger le premier webtoon par défaut
        if (webtoonDropdown.firstChild) {
            webtoonDropdown.value = webtoonDropdown.firstChild.value;
            const firstWebtoonName = webtoonDropdown.firstChild.value;
            addTabs(firstWebtoonName);
            loadWebtoonChapters(firstWebtoonName);
            activateFirstChapter();
        }
    }

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

    function loadWebtoonChapters(webtoonName) {
        webtoonData[webtoonName].chapters.forEach((chapterIndex) => {
            loadChapterImages(webtoonName, chapterIndex);
        });
    }

    // Ajout du bouton "Remonter en haut de la page"
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    initializeDropdown();
});