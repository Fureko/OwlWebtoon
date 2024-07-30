document.addEventListener("DOMContentLoaded", () => {
    const webtoonsContainer = document.querySelector('.webtoon-buttons');
    const tabsContainer = document.querySelector('.tabs');
    const chaptersContainer = document.getElementById('chapters');

    // Base de données intégrée des webtoons et chapitres
    const webtoonData = {
        "Blue Project": {
            chapters: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25.5, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47
            ]
        },
        "Roses and Champagne": {
            chapters: Array.from({ length: 52 }, (_, i) => i + 1)  // Chapitres numérotés de 1 à 52
        }
    };

    // Fonction pour vérifier si une image existe
    function imageExists(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    }

    // Fonction pour charger les images d'un chapitre
    async function loadChapterImages(webtoonName, chapterIndex) {
        const chapterName = `Chapitre ${chapterIndex}`;
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';
        chapterDiv.id = `webtoon-${webtoonName}-chapter-${chapterIndex}`;

        const chapterTitle = document.createElement('h2');
        chapterTitle.textContent = chapterName;
        chapterDiv.appendChild(chapterTitle);

        const imagesDiv = document.createElement('div');
        imagesDiv.className = 'images';

        let index = 1;
        let hasImages = false;

        while (true) {
            const imgSrc = `Webtoon/${webtoonName}/${chapterName}/${String(index).padStart(2, '0')}.jpg`;
            const imgSrcFallback = `Webtoon/${webtoonName}/${chapterName}/${String(index).padStart(2, '0')}.jpeg`;

            const imgExists = await imageExists(imgSrc);
            const fallbackExists = !imgExists && await imageExists(imgSrcFallback);

            if (!imgExists && !fallbackExists) {
                break;
            }

            hasImages = true;
            const img = document.createElement('img');
            img.src = imgExists ? imgSrc : imgSrcFallback;
            img.alt = `Page ${index}`;
            imagesDiv.appendChild(img);

            index++;
        }

        if (hasImages) {
            chapterDiv.appendChild(imagesDiv);
            chaptersContainer.appendChild(chapterDiv);
        }
    }

    // Fonction pour ajouter des onglets pour les chapitres
    function addTabs(webtoonName) {
        const chapters = webtoonData[webtoonName]?.chapters || [];

        tabsContainer.innerHTML = ''; // Nettoyer les anciens onglets

        chapters
            .sort((a, b) => a - b) // Trier les chapitres
            .forEach(chapterIndex => {
                createTab(webtoonName, chapterIndex);
            });
    }

    // Fonction d'aide pour créer un onglet
    function createTab(webtoonName, chapterIndex) {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.id = `tab-webtoon-${webtoonName}-chapter-${chapterIndex}`;
        tab.textContent = `Chapitre ${chapterIndex}`;
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.chapter').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`webtoon-${webtoonName}-chapter-${chapterIndex}`).classList.add('active');
        });
        tabsContainer.appendChild(tab);
    }

    // Fonction pour ajouter des boutons pour les webtoons
    function addWebtoonButton(webtoonName) {
        const button = document.createElement('div');
        button.className = 'webtoon-button';
        button.id = `webtoon-${webtoonName}`;
        button.textContent = webtoonName;
        button.addEventListener('click', async () => {
            document.querySelectorAll('.webtoon-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            // Effacer le contenu précédent
            tabsContainer.innerHTML = '';
            chaptersContainer.innerHTML = '';
            // Ajouter les onglets des chapitres
            addTabs(webtoonName);
            // Charger les images pour les chapitres
            for (let chapterIndex of webtoonData[webtoonName].chapters) {
                await loadChapterImages(webtoonName, chapterIndex);
            }
            // Activer le premier onglet par défaut
            activateFirstChapter();
        });
        webtoonsContainer.appendChild(button);
    }

    // Fonction pour activer le premier chapitre par défaut
    function activateFirstChapter() {
        if (tabsContainer.firstChild) {
            tabsContainer.firstChild.classList.add('active');
            document.querySelector('.chapter').classList.add('active');
        }
    }

    // Initialiser les boutons des webtoons
    function initializeWebtoonButtons() {
        Object.keys(webtoonData).forEach(webtoonName => {
            addWebtoonButton(webtoonName);
        });

        // Activer le premier bouton de webtoon par défaut et charger ses chapitres
        if (webtoonsContainer.firstChild) {
            webtoonsContainer.firstChild.classList.add('active');
            const firstWebtoonName = Object.keys(webtoonData)[0];
            addTabs(firstWebtoonName);
            loadWebtoonChapters(firstWebtoonName);
        }
    }

    // Fonction pour charger les chapitres d'un webtoon spécifique
    async function loadWebtoonChapters(webtoonName) {
        const chapters = webtoonData[webtoonName]?.chapters || [];

        // Charger les chapitres
        for (let chapterIndex of chapters) {
            await loadChapterImages(webtoonName, chapterIndex);
        }

        // Activer le premier chapitre par défaut
        activateFirstChapter();
    }

    // Initialiser les boutons des webtoons sur le chargement de la page
    initializeWebtoonButtons();
});
