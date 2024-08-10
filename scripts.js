document.addEventListener("DOMContentLoaded", () => {
    const webtoonsContainer = document.querySelector('.webtoon-buttons');
    const tabsContainer = document.querySelector('.tabs');
    const chaptersContainer = document.getElementById('chapters');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    function generateChapters(count) {
        return Array.from({ length: count }, (_, i) => i + 1);
    }

    const webtoonData = {
        "Blue Project": {
            chapters: [...generateChapters(24), 25, 25.5, ...generateChapters(22).map(n => n + 25)] // 1 à 24, 25, 25.5, 26 à 47
        },
        "Roses and Champagne": {
            chapters: generateChapters(52)  // Chapitres de 1 à 52
        },
        "Oshi No Ko": {
            chapters: [...generateChapters(156), 20.5, 25.5, 25.6, 25.7, 25.8, 90.1, 90.2, 111.1, 115.5, 125.5, 125.6, 125.7, 125.8]  // Chapitres normaux et spéciaux
        },
        "La Vrai C'est Moi": {
            chapters: generateChapters(128)  // Chapitres de 1 à 128
        }
    };

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

            const imgExists = await imageExists(imgSrc);
            if (!imgExists) {
                break;
            }

            hasImages = true;
            const img = document.createElement('img');
            img.dataset.src = imgSrc;  // Utilisation de data-src pour le lazy loading
            img.alt = `Page ${index}`;
            img.classList.add('lazyload');  // Ajouter une classe pour le lazy loading
            imagesDiv.appendChild(img);

            index++;
        }

        if (hasImages) {
            chapterDiv.appendChild(imagesDiv);
            chaptersContainer.appendChild(chapterDiv);
        }

        // Initialiser le lazy loading pour les nouvelles images
        if ('IntersectionObserver' in window) {
            let lazyImages = [].slice.call(chapterDiv.querySelectorAll('.lazyload'));
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazyload');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
    }

    // Fonction pour vérifier si une image existe
    function imageExists(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
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
            removeNonActiveChapters();  // Supprime les chapitres non actifs du DOM
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
            removeNonActiveChapters();  // Supprime les chapitres non actifs
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
        const firstTab = tabsContainer.querySelector('.tab');
        if (firstTab) {
            firstTab.classList.add('active');
            const firstChapter = chaptersContainer.querySelector('.chapter');
            if (firstChapter) {
                firstChapter.classList.add('active');
            }
        }
    }

    // Initialisation
    function initializeWebtoonButtons() {
        Object.keys(webtoonData).forEach(webtoonName => {
            addWebtoonButton(webtoonName);
        });

        if (webtoonsContainer.firstChild) {
            webtoonsContainer.firstChild.classList.add('active');
            const firstWebtoonName = Object.keys(webtoonData)[0];
            addTabs(firstWebtoonName);
            loadWebtoonChapters(firstWebtoonName);
        }
    }

    // Fonction pour charger les chapitres d'un webtoon
    function loadWebtoonChapters(webtoonName) {
        webtoonData[webtoonName].chapters.forEach(chapterIndex => {
            loadChapterImages(webtoonName, chapterIndex);
        });
    }

    // Appel à l'initialisation
    initializeWebtoonButtons();

    // Fonction pour supprimer les chapitres non actifs
    function removeNonActiveChapters() {
        document.querySelectorAll('.chapter').forEach(chapter => {
            if (!chapter.classList.contains('active')) {
                chapter.remove();  // Supprime les chapitres non actifs du DOM
            }
        });
    }

    // Gestion du bouton pour remonter la page
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Afficher le bouton après avoir fait défiler 300px
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Ajouter un événement au clic pour remonter en haut de la page
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Défilement fluide vers le haut
    });
});
