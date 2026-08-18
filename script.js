/* =========================
   AURATUNE
   Main JavaScript
========================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================== */

    const imageInput = document.getElementById("imageInput");
    const uploadBox = document.getElementById("uploadBox");

    const previewContainer =
        document.getElementById("previewContainer");

    const imagePreview =
        document.getElementById("imagePreview");

    const removeBtn =
        document.getElementById("removeBtn");

    const analyzeBtn =
        document.getElementById("analyzeBtn");

    const resultSection =
        document.getElementById("resultSection");

    const resultImage =
        document.getElementById("resultImage");

    const sceneText =
        document.getElementById("sceneText");

    const playBtn =
        document.getElementById("playBtn");

    const themeBtn =
        document.getElementById("themeBtn");


    /* =========================
       MUSIC
    ========================== */

    let audio = null;
    let currentMusic = null;


    /*
       Demo music files.

       Create these files inside:

       AuraTune/
       └── assets/
           └── music/

       calm.mp3
       happy.mp3
       cinematic.mp3
       energetic.mp3
    */

    const musicLibrary = {
        calm: "assets/music/calm.mp3",
        happy: "assets/music/happy.mp3",
        cinematic: "assets/music/cinematic.mp3",
        energetic: "assets/music/energetic.mp3"
    };


    /* =========================
       IMAGE UPLOAD
    ========================== */

    imageInput.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (file) {
            handleImage(file);
        }

    });


    /* =========================
       HANDLE IMAGE
    ========================== */

    function handleImage(file) {

        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image file.");

            return;
        }


        const reader = new FileReader();


        reader.onload = (event) => {

            imagePreview.src = event.target.result;

            resultImage.src = event.target.result;

            previewContainer.hidden = false;

            resultSection.hidden = true;

        };


        reader.readAsDataURL(file);
    }


    /* =========================
       DRAG & DROP
    ========================== */

    uploadBox.addEventListener("dragover", (event) => {

        event.preventDefault();

        uploadBox.classList.add("dragging");

    });


    uploadBox.addEventListener("dragleave", () => {

        uploadBox.classList.remove("dragging");

    });


    uploadBox.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadBox.classList.remove("dragging");


        const file =
            event.dataTransfer.files[0];


        if (file) {

            imageInput.files =
                event.dataTransfer.files;

            handleImage(file);

        }

    });


    /* =========================
       REMOVE IMAGE
    ========================== */

    removeBtn.addEventListener("click", () => {

        imageInput.value = "";

        imagePreview.src = "";

        resultImage.src = "";

        previewContainer.hidden = true;

        resultSection.hidden = true;

        stopMusic();

    });


    /* =========================
       DEMO AI ANALYSIS
    ========================== */

    analyzeBtn.addEventListener("click", () => {

        if (!imagePreview.src) {

            alert("Please upload an image first.");

            return;
        }


        analyzeBtn.disabled = true;

        analyzeBtn.textContent =
            "✨ Analyzing...";


        /*
           This is currently a DEMO.

           Later we will replace this with:

           Image
             ↓
           AI Vision API
             ↓
           Scene + Mood
             ↓
           Music recommendation
        */


        setTimeout(() => {

            const result =
                generateDemoAnalysis();


            updateResult(result);


            resultSection.hidden = false;


            resultSection.scrollIntoView({
                behavior: "smooth"
            });


            analyzeBtn.disabled = false;

            analyzeBtn.textContent =
                "✨ Analyze Image";

        }, 1200);

    });


    /* =========================
       DEMO ANALYSIS ENGINE
    ========================== */

    function generateDemoAnalysis() {

        const fileName =
            imageInput.files[0]?.name.toLowerCase() || "";


        /*
           Temporary keyword-based system.

           Example:

           sunset.jpg
           beach.png
           mountain.jpg
           party.png
        */


        if (
            fileName.includes("sunset") ||
            fileName.includes("sunrise") ||
            fileName.includes("sky")
        ) {

            return {

                scene: "Dreamy Sunset",

                mood: "Peaceful",

                tags: [
                    "Peaceful",
                    "Dreamy",
                    "Warm"
                ],

                peaceful: 90,
                dreamy: 88,
                energetic: 25,

                music: "calm",

                musicTitle: "Golden Hour",

                musicType: "Calm · Ambient"

            };

        }


        if (
            fileName.includes("beach") ||
            fileName.includes("sea") ||
            fileName.includes("ocean")
        ) {

            return {

                scene: "Ocean Escape",

                mood: "Relaxing",

                tags: [
                    "Relaxing",
                    "Fresh",
                    "Peaceful"
                ],

                peaceful: 92,
                dreamy: 80,
                energetic: 40,

                music: "calm",

                musicTitle: "Ocean Breeze",

                musicType: "Ambient · Relaxing"

            };

        }


        if (
            fileName.includes("mountain") ||
            fileName.includes("hill") ||
            fileName.includes("travel")
        ) {

            return {

                scene: "Adventure Landscape",

                mood: "Cinematic",

                tags: [
                    "Adventure",
                    "Cinematic",
                    "Epic"
                ],

                peaceful: 55,
                dreamy: 70,
                energetic: 82,

                music: "cinematic",

                musicTitle: "Beyond the Horizon",

                musicType: "Cinematic · Atmospheric"

            };

        }


        if (
            fileName.includes("party") ||
            fileName.includes("dance") ||
            fileName.includes("festival")
        ) {

            return {

                scene: "Celebration",

                mood: "Energetic",

                tags: [
                    "Energetic",
                    "Happy",
                    "Fun"
                ],

                peaceful: 25,
                dreamy: 45,
                energetic: 96,

                music: "energetic",

                musicTitle: "Good Vibes",

                musicType: "Energetic · Electronic"

            };

        }


        /*
           Default result
        */

        return {

            scene: "Beautiful Moment",

            mood: "Dreamy",

            tags: [
                "Dreamy",
                "Calm",
                "Atmospheric"
            ],

            peaceful: 78,
            dreamy: 85,
            energetic: 42,

            music: "calm",

            musicTitle: "Aura Reflection",

            musicType: "Calm · Ambient"

        };

    }


    /* =========================
       UPDATE RESULT
    ========================== */

    function updateResult(result) {

        sceneText.textContent =
            result.scene;


        /* -------------------------
           Mood Tags
        ------------------------- */

        const moodTags =
            document.querySelector(".mood-tags");


        moodTags.innerHTML = "";


        result.tags.forEach(tag => {

            const span =
                document.createElement("span");

            span.textContent = tag;

            moodTags.appendChild(span);

        });


        /* -------------------------
           Mood Bars
        ------------------------- */

        const progressBars =
            document.querySelectorAll(
                ".progress-fill"
            );


        if (progressBars.length >= 3) {

            progressBars[0].style.width =
                result.peaceful + "%";

            progressBars[1].style.width =
                result.dreamy + "%";

            progressBars[2].style.width =
                result.energetic + "%";

        }


        /* -------------------------
           Music Information
        ------------------------- */

        const musicTitle =
            document.querySelector(
                ".music-title"
            );

        const musicType =
            document.querySelector(
                ".music-type"
            );


        musicTitle.textContent =
            result.musicTitle;

        musicType.textContent =
            result.musicType;


        /* -------------------------
           Load Music
        ------------------------- */

        loadMusic(result.music);

    }


    /* =========================
       LOAD MUSIC
    ========================== */

    function loadMusic(type) {

        stopMusic();


        currentMusic =
            musicLibrary[type];


        audio =
            new Audio(currentMusic);


        audio.loop = true;


        playBtn.textContent = "▶";

    }


    /* =========================
       PLAY / PAUSE
    ========================== */

    playBtn.addEventListener("click", () => {

        if (!audio) {

            alert(
                "Please analyze an image first."
            );

            return;
        }


        if (audio.paused) {

            audio.play()
                .then(() => {

                    playBtn.textContent = "❚❚";

                })
                .catch(() => {

                    alert(
                        "Add your BGM files to assets/music first."
                    );

                });

        } else {

            audio.pause();

            playBtn.textContent = "▶";

        }

    });


    /* =========================
       STOP MUSIC
    ========================== */

    function stopMusic() {

        if (audio) {

            audio.pause();

            audio.currentTime = 0;

            audio = null;

        }


        playBtn.textContent = "▶";

    }


    /* =========================
       THEME TOGGLE
    ========================== */

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle(
            "light-mode"
        );


        const lightMode =
            document.body.classList.contains(
                "light-mode"
            );


        themeBtn.textContent =
            lightMode ? "☀" : "◐";


        localStorage.setItem(
            "auratune-theme",
            lightMode ? "light" : "dark"
        );

    });


    /* =========================
       REMEMBER THEME
    ========================== */

    const savedTheme =
        localStorage.getItem(
            "auratune-theme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light-mode"
        );

        themeBtn.textContent = "☀";

    }


    /* =========================
       KEYBOARD SHORTCUT
    ========================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
               Press Escape to remove image
            */

            if (
                event.key === "Escape" &&
                !previewContainer.hidden
            ) {

                removeBtn.click();

            }

        }
    );

});