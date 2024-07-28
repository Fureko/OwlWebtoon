// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    const tabsContainer = document.querySelector('.tabs');
    const chaptersContainer = document.getElementById('chapters');

    // Créer une fonction pour charger les images
    function loadChapterImages(chapterId, chapterName) {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';
        chapterDiv.id = `chapter-${chapterId}`;

        const chapterTitle = document.createElement('h2');
        chapterTitle.textContent = chapterName;
        chapterDiv.appendChild(chapterTitle);

        const imagesDiv = document.createElement('div');
        imagesDiv.className = 'images';

        // Nombre d'images par chapitre à ajuster si nécessaire
        for (let i = 1; i <= 12; i++) {
            const img = document.createElement('img');
            img.src = `Chapitre/Chapitre ${chapterId}/${String(i).padStart(2, '0')}.jpg`;
            img.alt = `Page ${i}`;
            img.onerror = function() {
                this.style.display = 'none'; // Masquer les images non trouvées
            };
            imagesDiv.appendChild(img);
        }

        chapterDiv.appendChild(imagesDiv);
        chaptersContainer.appendChild(chapterDiv);
    }

    // Créer une fonction pour ajouter les onglets
    function addTabs(chapterId, chapterName) {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.id = `tab-${chapterId}`;
        tab.textContent = chapterName;
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.chapter').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`chapter-${chapterId}`).classList.add('active');
        });
        tabsContainer.appendChild(tab);
    }

    // Charger tous les chapitres
    for (let chapterId = 1; chapterId <= 52; chapterId++) {
        loadChapterImages(chapterId, `Chapitre ${chapterId}`);
        addTabs(chapterId, `Chapitre ${chapterId}`);
    }

    // Activer le premier onglet par défaut
    if (tabsContainer.firstChild) {
        tabsContainer.firstChild.classList.add('active');
        document.querySelector('.chapter').classList.add('active');
    }
});
