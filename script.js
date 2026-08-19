/* =========================================================
   AURATUNE — INTERACTIVE 3D EXPERIENCE
   Image Upload + JSON Analysis
   ========================================================= */


/* =========================================================
   ANALYSIS DATA
   Loaded from analysis.json
   ========================================================= */

let analysisData = null;


/* =========================================================
   LOAD ANALYSIS JSON
   ========================================================= */

async function loadAnalysisData() {

    try {

        const response =
            await fetch("./analysis.json");

        if (!response.ok) {

            throw new Error(
                "Could not load analysis.json"
            );

        }

        analysisData =
            await response.json();

        console.log(
            "AuraTune JSON loaded:",
            analysisData
        );

    } catch (error) {

        console.error(
            "Error loading analysis.json:",
            error
        );

    }

}

loadAnalysisData();


/* =========================================================
   MAIN APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const heroVisual =
            document.getElementById(
                "heroVisual"
            );

        const floatingFrame =
            document.querySelector(
                ".floating-frame"
            );

        const dataTop =
            document.querySelector(
                ".data-top"
            );

        const dataBottom =
            document.querySelector(
                ".data-bottom"
            );

        const particles =
            document.querySelectorAll(
                ".particle"
            );

        const rings =
            document.querySelectorAll(
                ".sound-ring"
            );


        /* =====================================================
           THEME
        ===================================================== */

        const themeBtn =
            document.getElementById(
                "themeBtn"
            );


        /* =====================================================
           IMAGE UPLOAD
        ===================================================== */

        const imageInput =
            document.getElementById(
                "imageInput"
            );

        const uploadBox =
            document.getElementById(
                "uploadBox"
            );

        const previewContainer =
            document.getElementById(
                "previewContainer"
            );

        const imagePreview =
            document.getElementById(
                "imagePreview"
            );

        const removeBtn =
            document.getElementById(
                "removeBtn"
            );


        /* =====================================================
           ANALYSIS
        ===================================================== */

        const analyzeBtn =
            document.getElementById(
                "analyzeBtn"
            );

        const resultSection =
            document.getElementById(
                "resultSection"
            );

        const resultImage =
            document.getElementById(
                "resultImage"
            );

        const sceneText =
            document.getElementById(
                "sceneText"
            );


        /* =====================================================
           MUSIC
        ===================================================== */

        const playBtn =
            document.getElementById(
                "playBtn"
            );


        /* =====================================================
           VARIABLES
        ===================================================== */

        let selectedAnalysis = null;

        let currentImageURL = null;

        let playing = false;


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        /* =====================================================
           3D MOUSE MOVEMENT
        ===================================================== */

        if (
            heroVisual &&
            floatingFrame &&
            !reducedMotion &&
            window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {

            let mouseX = 0;

            let mouseY = 0;

            let currentX = 0;

            let currentY = 0;


            /* -------------------------------------------------
               MOUSE MOVE
            ------------------------------------------------- */

            heroVisual.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        heroVisual.getBoundingClientRect();


                    /*
                     * Convert mouse position
                     * to -1 → +1
                     */

                    mouseX =
                        (
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width
                        ) * 2 - 1;


                    mouseY =
                        (
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height
                        ) * 2 - 1;

                }
            );


            /* -------------------------------------------------
               MOUSE LEAVE
            ------------------------------------------------- */

            heroVisual.addEventListener(
                "mouseleave",
                () => {

                    mouseX = 0;

                    mouseY = 0;

                }
            );


            /* -------------------------------------------------
               3D ANIMATION
            ------------------------------------------------- */

            function animate3D() {

                currentX +=
                    (
                        mouseX -
                        currentX
                    ) * 0.06;


                currentY +=
                    (
                        mouseY -
                        currentY
                    ) * 0.06;


                /* Main card */

                const rotateY =
                    currentX * 14;


                const rotateX =
                    currentY * -10;


                const translateX =
                    currentX * 8;


                const translateY =
                    currentY * 6;


                floatingFrame.style.transform = `
                    translate3d(
                        ${translateX}px,
                        ${translateY}px,
                        0
                    )
                    rotateY(${rotateY - 8}deg)
                    rotateX(${rotateX + 5}deg)
                    rotateZ(${currentX * 1.5}deg)
                `;


                /* Top information card */

                if (dataTop) {

                    dataTop.style.transform = `
                        translate3d(
                            ${currentX * 25}px,
                            ${currentY * 20}px,
                            80px
                        )
                    `;

                }


                /* Bottom information card */

                if (dataBottom) {

                    dataBottom.style.transform = `
                        translate3d(
                            ${currentX * -20}px,
                            ${currentY * -16}px,
                            60px
                        )
                    `;

                }


                /* Particles */

                particles.forEach(
                    (particle, index) => {

                        const depth =
                            (index + 1) * 5;


                        particle.style.transform = `
                            translate3d(
                                ${currentX * depth}px,
                                ${currentY * depth}px,
                                0
                            )
                        `;

                    }
                );


                /* Sound rings */

                rings.forEach(
                    (ring, index) => {

                        const depth =
                            (index + 1) * 2;


                        ring.style.transform = `
                            translate3d(
                                ${currentX * depth}px,
                                ${currentY * depth}px,
                                0
                            )
                        `;

                    }
                );


                requestAnimationFrame(
                    animate3D
                );

            }


            animate3D();


            /* -------------------------------------------------
               CURSOR
            ------------------------------------------------- */

            heroVisual.addEventListener(
                "mouseenter",
                () => {

                    heroVisual.style.cursor =
                        "crosshair";

                }
            );

        }


        /* =====================================================
           THEME TOGGLE
        ===================================================== */

        if (themeBtn) {

            themeBtn.addEventListener(
                "click",
                () => {

                    document.body.classList.toggle(
                        "light-mode"
                    );


                    const lightMode =
                        document.body.classList.contains(
                            "light-mode"
                        );


                    themeBtn.textContent =
                        lightMode
                            ? "☀"
                            : "◐";


                    localStorage.setItem(
                        "auratune-theme",
                        lightMode
                            ? "light"
                            : "dark"
                    );

                }
            );


            /* Restore saved theme */

            const savedTheme =
                localStorage.getItem(
                    "auratune-theme"
                );


            if (
                savedTheme === "light"
            ) {

                document.body.classList.add(
                    "light-mode"
                );


                themeBtn.textContent =
                    "☀";

            }

        }


        /* =====================================================
           IMAGE UPLOAD
        ===================================================== */

        if (imageInput) {

            imageInput.addEventListener(
                "change",
                handleImageUpload
            );

        }


        function handleImageUpload(event) {

            const file =
                event.target.files[0];


            if (!file) {

                return;

            }


            /* Check image */

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please upload a valid image."
                );

                return;

            }


            /* Remove previous URL */

            if (currentImageURL) {

                URL.revokeObjectURL(
                    currentImageURL
                );

            }


            /* Create image URL */

            currentImageURL =
                URL.createObjectURL(
                    file
                );


            imagePreview.src =
                currentImageURL;


            /* Show preview */

            if (uploadBox) {

                uploadBox.hidden =
                    true;

            }


            if (previewContainer) {

                previewContainer.hidden =
                    false;

            }

        }


        /* =====================================================
           REMOVE IMAGE
        ===================================================== */

        if (removeBtn) {

            removeBtn.addEventListener(
                "click",
                resetUpload
            );

        }


        function resetUpload() {

            if (imageInput) {

                imageInput.value = "";

            }


            if (imagePreview) {

                imagePreview.src = "";

            }


            if (previewContainer) {

                previewContainer.hidden =
                    true;

            }


            if (uploadBox) {

                uploadBox.hidden =
                    false;

            }


            if (resultSection) {

                resultSection.hidden =
                    true;

            }


            selectedAnalysis =
                null;


            playing =
                false;


            if (playBtn) {

                playBtn.textContent =
                    "▶";

                playBtn.classList.remove(
                    "playing"
                );

            }


            if (currentImageURL) {

                URL.revokeObjectURL(
                    currentImageURL
                );

                currentImageURL =
                    null;

            }

        }


        /* =====================================================
           DRAG & DROP
        ===================================================== */

        if (uploadBox) {


            /* Drag over */

            uploadBox.addEventListener(
                "dragover",
                (event) => {

                    event.preventDefault();

                    uploadBox.classList.add(
                        "dragging"
                    );

                }
            );


            /* Drag leave */

            uploadBox.addEventListener(
                "dragleave",
                () => {

                    uploadBox.classList.remove(
                        "dragging"
                    );

                }
            );


            /* Drop */

            uploadBox.addEventListener(
                "drop",
                (event) => {

                    event.preventDefault();


                    uploadBox.classList.remove(
                        "dragging"
                    );


                    const file =
                        event.dataTransfer.files[0];


                    if (
                        file &&
                        file.type.startsWith(
                            "image/"
                        )
                    ) {

                        const dataTransfer =
                            new DataTransfer();


                        dataTransfer.items.add(
                            file
                        );


                        imageInput.files =
                            dataTransfer.files;


                        handleImageUpload({
                            target: imageInput
                        });

                    }

                }
            );

        }


        /* =====================================================
           ANALYZE IMAGE
        ===================================================== */

        if (analyzeBtn) {

            analyzeBtn.addEventListener(
                "click",
                analyzeImage
            );

        }


        async function analyzeImage() {


            /* -------------------------------------------------
               CHECK IMAGE
            ------------------------------------------------- */

            if (
                !imagePreview ||
                !imagePreview.src ||
                imagePreview.src ===
                    window.location.href
            ) {

                alert(
                    "Please upload an image first."
                );

                return;

            }


            /* -------------------------------------------------
               CHECK JSON
            ------------------------------------------------- */

            if (
                !analysisData ||
                !analysisData.analyses ||
                !analysisData.analyses.length
            ) {

                alert(
                    "AuraTune analysis data is still loading. Please try again."
                );

                return;

            }


            /* -------------------------------------------------
               LOADING
            ------------------------------------------------- */

            analyzeBtn.disabled =
                true;


            analyzeBtn.innerHTML = `
                <span class="loading-spinner"></span>
                Reading your aura...
            `;


            /* -------------------------------------------------
               SIMULATE ANALYSIS
            ------------------------------------------------- */

            await wait(1800);


            /*
             * For this current version,
             * AuraTune selects one analysis
             * from analysis.json.
             *
             * Later this will be replaced
             * with real AI image analysis.
             */

            selectedAnalysis =
                selectAnalysis();


            /* -------------------------------------------------
               DISPLAY RESULT
            ------------------------------------------------- */

            displayAnalysis(
                selectedAnalysis
            );


            /* -------------------------------------------------
               SHOW RESULT
            ------------------------------------------------- */

            if (resultSection) {

                resultSection.hidden =
                    false;

            }


            /* -------------------------------------------------
               RESET BUTTON
            ------------------------------------------------- */

            analyzeBtn.disabled =
                false;


            analyzeBtn.innerHTML = `
                <span>✦</span>
                Analyze My Image
                <span>→</span>
            `;


            /* -------------------------------------------------
               SCROLL TO RESULT
            ------------------------------------------------- */

            if (resultSection) {

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }


        /* =====================================================
           SELECT ANALYSIS
        ===================================================== */

        function selectAnalysis() {

            const analyses =
                analysisData.analyses;


            /*
             * Current demo:
             * randomly selects one result.
             */

            const randomIndex =
                Math.floor(
                    Math.random() *
                    analyses.length
                );


            return analyses[
                randomIndex
            ];

        }


        /* =====================================================
           DISPLAY ANALYSIS
        ===================================================== */

        function displayAnalysis(
            analysis
        ) {

            if (!analysis) {

                return;

            }


            /* -------------------------------------------------
               RESULT IMAGE
            ------------------------------------------------- */

            if (resultImage) {

                resultImage.src =
                    imagePreview.src;

            }


            /* -------------------------------------------------
               SCENE
            ------------------------------------------------- */

            if (sceneText) {

                sceneText.textContent =
                    analysis.scene;

            }


            /* -------------------------------------------------
               MOOD TAGS
            ------------------------------------------------- */

            createMoodTags(
                analysis.mood
            );


            /* -------------------------------------------------
               MUSIC INFORMATION
            ------------------------------------------------- */

            updateMusicPlayer(
                analysis
            );


            /* -------------------------------------------------
               ANALYSIS DETAILS
            ------------------------------------------------- */

            updateAnalysisDetails(
                analysis
            );


            console.log(
                "AuraTune Analysis:",
                analysis
            );

        }


        /* =====================================================
           CREATE MOOD TAGS
        ===================================================== */

        function createMoodTags(
            moods
        ) {

            const moodContainer =
                document.querySelector(
                    ".mood-tags"
                );


            if (!moodContainer) {

                return;

            }


            moodContainer.innerHTML =
                "";


            if (
                !Array.isArray(moods)
            ) {

                return;

            }


            moods.forEach(
                (mood) => {

                    const tag =
                        document.createElement(
                            "span"
                        );


                    tag.textContent =
                        mood;


                    moodContainer.appendChild(
                        tag
                    );

                }
            );

        }


        /* =====================================================
           UPDATE MUSIC PLAYER
        ===================================================== */

        function updateMusicPlayer(
            analysis
        ) {

            if (
                !analysis ||
                !analysis.music
            ) {

                return;

            }


            const musicTitle =
                document.querySelector(
                    ".music-title"
                );


            const musicType =
                document.querySelector(
                    ".music-type"
                );


            const musicArtist =
                document.querySelector(
                    ".music-artist"
                );


            if (musicTitle) {

                musicTitle.textContent =
                    analysis.music.title;

            }


            if (musicType) {

                musicType.textContent =
                    `${analysis.music.genre} · ${analysis.music.duration}`;

            }


            if (musicArtist) {

                musicArtist.textContent =
                    analysis.music.artist;

            }

        }


        /* =====================================================
           UPDATE EXTRA ANALYSIS DETAILS
        ===================================================== */

        function updateAnalysisDetails(
            analysis
        ) {


            /* -------------------------------------------------
               Description
            ------------------------------------------------- */

            const description =
                document.querySelector(
                    ".analysis-description"
                );


            if (
                description &&
                analysis.description
            ) {

                description.textContent =
                    analysis.description;

            }


            /* -------------------------------------------------
               Style
            ------------------------------------------------- */

            const style =
                document.querySelector(
                    ".analysis-style"
                );


            if (
                style &&
                analysis.style
            ) {

                style.textContent =
                    analysis.style;

            }


            /* -------------------------------------------------
               Music Type
            ------------------------------------------------- */

            const musicType =
                document.querySelector(
                    ".analysis-music-type"
                );


            if (
                musicType &&
                analysis.music_type
            ) {

                musicType.textContent =
                    analysis.music_type;

            }


            /* -------------------------------------------------
               Energy
            ------------------------------------------------- */

            const energy =
                document.querySelector(
                    ".analysis-energy"
                );


            if (
                energy &&
                typeof analysis.energy ===
                    "number"
            ) {

                energy.textContent =
                    `${analysis.energy}%`;

            }


            /* -------------------------------------------------
               Instruments
            ------------------------------------------------- */

            const instruments =
                document.querySelector(
                    ".analysis-instruments"
                );


            if (
                instruments &&
                Array.isArray(
                    analysis.instruments
                )
            ) {

                instruments.textContent =
                    analysis.instruments.join(
                        " · "
                    );

            }

        }


        /* =====================================================
           PLAY BUTTON
        ===================================================== */

        if (playBtn) {

            playBtn.addEventListener(
                "click",
                () => {


                    /* Check analysis */

                    if (
                        !selectedAnalysis
                    ) {

                        alert(
                            "Analyze an image first."
                        );

                        return;

                    }


                    playing =
                        !playing;


                    if (playing) {

                        playBtn.textContent =
                            "❚❚";


                        playBtn.classList.add(
                            "playing"
                        );


                        console.log(
                            "AuraTune selected:",
                            selectedAnalysis.music
                        );


                    } else {

                        playBtn.textContent =
                            "▶";


                        playBtn.classList.remove(
                            "playing"
                        );

                    }

                }
            );

        }


        /* =====================================================
           SCROLL REVEAL
        ===================================================== */

        const revealElements =
            document.querySelectorAll(
                ".process-card, .experience-card, .result-grid, .about-section"
            );


        if (
            "IntersectionObserver" in window &&
            !reducedMotion
        ) {

            const observer =
                new IntersectionObserver(
                    (entries) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "revealed"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );


            revealElements.forEach(
                (element) => {

                    element.classList.add(
                        "reveal"
                    );


                    observer.observe(
                        element
                    );

                }
            );

        }


        /* =====================================================
           HELPER — WAIT
        ===================================================== */

        function wait(
            milliseconds
        ) {

            return new Promise(
                (resolve) => {

                    setTimeout(
                        resolve,
                        milliseconds
                    );

                }
            );

        }

    }
);