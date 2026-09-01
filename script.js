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
        /* =====================================================
   REAL AI IMAGE ANALYSIS
   OpenRouter → /api/analyze
===================================================== */

async function analyzeImage() {

    /* -------------------------------------------------
       CHECK IMAGE
    ------------------------------------------------- */

    const file = imageInput?.files?.[0];

    if (!file) {
        alert("Please upload an image first.");
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image.");
        return;
    }


    /* -------------------------------------------------
       CHECK ANALYSIS DATA
    ------------------------------------------------- */

    if (
        !analysisData ||
        !Array.isArray(analysisData.analyses) ||
        !analysisData.analyses.length
    ) {
        alert(
            "AuraTune analysis data is still loading. Please try again."
        );

        return;
    }


    /* -------------------------------------------------
       LOADING STATE
    ------------------------------------------------- */

    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML = `
        <span class="loading-spinner"></span>
        Reading your aura...
    `;


    try {

        /* -------------------------------------------------
           CONVERT IMAGE TO BASE64
        ------------------------------------------------- */

        const imageBase64 =
            await fileToBase64(file);


        /* -------------------------------------------------
           SEND IMAGE TO AURATUNE API
        ------------------------------------------------- */

        const response =
            await fetch("/api/analyze", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    image: imageBase64
                })
            });


        /* -------------------------------------------------
           READ API RESPONSE
        ------------------------------------------------- */

        const data =
            await response.json();


        /* -------------------------------------------------
           HANDLE API ERROR
        ------------------------------------------------- */

        if (!response.ok) {

            throw new Error(
                data?.error ||
                "AuraTune AI analysis failed."
            );
        }


        /* -------------------------------------------------
           GET AI ANALYSIS
        ------------------------------------------------- */

        const aiAnalysis =
            data?.analysis;


        if (!aiAnalysis) {

            throw new Error(
                "No AI analysis was returned."
            );
        }


        console.log(
            "AuraTune AI Analysis:",
            aiAnalysis
        );


        /* -------------------------------------------------
           MATCH AI RESULT WITH analysis.json
        ------------------------------------------------- */

        selectedAnalysis =
            matchMusicToAI(
                aiAnalysis
            );


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
           SCROLL TO RESULT
        ------------------------------------------------- */

        if (resultSection) {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    } catch (error) {

        console.error(
            "AuraTune AI Error:",
            error
        );

        alert(
            error.message ||
            "Something went wrong while analyzing your image."
        );

    } finally {

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
    }
}


/* =====================================================
   FILE → BASE64
===================================================== */

function fileToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload = () => {

                resolve(
                    reader.result
                );
            };

            reader.onerror = () => {

                reject(
                    new Error(
                        "Could not read the image."
                    )
                );
            };

            reader.readAsDataURL(file);
        }
    );
}


/* =====================================================
   MATCH AI RESULT WITH analysis.json
===================================================== */

function matchMusicToAI(aiAnalysis) {

    const analyses =
        analysisData.analyses;


    /* -------------------------------------------------
       SAFETY CHECK
    ------------------------------------------------- */

    if (!analyses.length) {

        throw new Error(
            "No music analysis data available."
        );
    }


    /* -------------------------------------------------
       NORMALIZE AI DATA
    ------------------------------------------------- */

    const aiScene =
        String(
            aiAnalysis.scene || ""
        ).toLowerCase();

    const aiStyle =
        String(
            aiAnalysis.style || ""
        ).toLowerCase();

    const aiMusicType =
        String(
            aiAnalysis.music_type || ""
        ).toLowerCase();


    const aiMoods =
        Array.isArray(aiAnalysis.mood)
            ? aiAnalysis.mood.map(
                mood =>
                    String(mood).toLowerCase()
            )
            : [];


    /* -------------------------------------------------
       SCORE EACH MUSIC PROFILE
    ------------------------------------------------- */

    let bestMatch =
        analyses[0];

    let highestScore =
        -1;


    analyses.forEach(
        (analysis) => {

            let score = 0;


            /* -----------------------------------------
               SCENE MATCH
            ----------------------------------------- */

            const scene =
                String(
                    analysis.scene || ""
                ).toLowerCase();

            if (
                aiScene &&
                (
                    aiScene.includes(scene) ||
                    scene.includes(aiScene)
                )
            ) {
                score += 10;
            }


            /* -----------------------------------------
               STYLE MATCH
            ----------------------------------------- */

            const style =
                String(
                    analysis.style || ""
                ).toLowerCase();

            if (
                aiStyle &&
                (
                    aiStyle.includes(style) ||
                    style.includes(aiStyle)
                )
            ) {
                score += 8;
            }


            /* -----------------------------------------
               MUSIC TYPE MATCH
            ----------------------------------------- */

            const musicType =
                String(
                    analysis.music_type || ""
                ).toLowerCase();

            if (
                aiMusicType &&
                (
                    aiMusicType.includes(musicType) ||
                    musicType.includes(aiMusicType)
                )
            ) {
                score += 8;
            }


            /* -----------------------------------------
               MOOD MATCH
            ----------------------------------------- */

            const analysisMoods =
                Array.isArray(analysis.mood)
                    ? analysis.mood.map(
                        mood =>
                            String(mood).toLowerCase()
                    )
                    : [];


            aiMoods.forEach(
                (aiMood) => {

                    analysisMoods.forEach(
                        (analysisMood) => {

                            if (
                                aiMood.includes(
                                    analysisMood
                                ) ||
                                analysisMood.includes(
                                    aiMood
                                )
                            ) {
                                score += 5;
                            }
                        }
                    );
                }
            );


            /* -----------------------------------------
               ENERGY MATCH
            ----------------------------------------- */

            if (
                typeof aiAnalysis.energy ===
                "number" &&
                typeof analysis.energy ===
                "number"
            ) {

                const difference =
                    Math.abs(
                        aiAnalysis.energy -
                        analysis.energy
                    );


                if (difference <= 10) {

                    score += 6;

                } else if (difference <= 20) {

                    score += 3;
                }
            }


            /* -----------------------------------------
               SAVE BEST MATCH
            ----------------------------------------- */

            if (
                score >
                highestScore
            ) {

                highestScore =
                    score;

                bestMatch =
                    analysis;
            }
        }
    );


    /* -------------------------------------------------
       COMBINE AI RESULT + MUSIC PROFILE
    ------------------------------------------------- */

    return {

        ...bestMatch,

        scene:
            aiAnalysis.scene ||
            bestMatch.scene,

        description:
            aiAnalysis.description ||
            bestMatch.description,

        mood:
            Array.isArray(
                aiAnalysis.mood
            ) &&
            aiAnalysis.mood.length
                ? aiAnalysis.mood
                : bestMatch.mood,

        energy:
            typeof aiAnalysis.energy ===
            "number"
                ? aiAnalysis.energy
                : bestMatch.energy,

        style:
            aiAnalysis.style ||
            bestMatch.style,

        music_type:
            aiAnalysis.music_type ||
            bestMatch.music_type,

        instruments:
            Array.isArray(
                aiAnalysis.instruments
            ) &&
            aiAnalysis.instruments.length
                ? aiAnalysis.instruments
                : bestMatch.instruments,

        /* Music comes from your
           analysis.json */

        music:
            bestMatch.music
    };
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