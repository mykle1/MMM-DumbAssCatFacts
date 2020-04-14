/* Magic Mirror
 * Module: MMM-DumbAssCatFacts
 *
 * By Mykle1
 *
 */
Module.register("MMM-DumbAssCatFacts", {

    // Module config defaults.
    defaults: {
        title: "Dumb Ass Cat Facts",
        apiKey: "", // Get yours from https://rapidapi.com/
        scroll: false, // true or false
        scrollSpeed: "3",
        useHeader: false, // False if you don't want a header
        header: "", // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 0, // fade speed
        initialLoadDelay: 1250,
        retryDelay: 2500,
        rotateInterval: 30 * 1000,
        updateInterval: 2 * 60 * 60 * 1000,
    },

    getStyles: function() {
        return ["MMM-DumbAssCatFacts.css"];
    },

    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        //  Set locale.
        this.facts = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Meow . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        // title
        var title = document.createElement("div");
        title.classList.add("medium", "bright", "title");
        title.innerHTML = this.config.title;
        wrapper.appendChild(title);


        // loop through the cat obects
        var info = this.facts;
        var keys = Object.keys(info);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 1;
            }
            var fact = info[keys[this.activeItem]];


            if (this.config.scroll === true) {
                // scrolling data
                var data = document.createElement("div");
                data.classList.add("small", "bright", "data");
                data.innerHTML = '<marquee behavior="scroll" direction="left" scrollamount="' + this.config.scrollSpeed + '">' + fact.text + '</marquee>';
                wrapper.appendChild(data);

            } else if (this.config.scroll === false) {
                // static data
                var data = document.createElement("div");
                data.classList.add("small", "bright", "data");
                data.innerHTML = fact.text;
                wrapper.appendChild(data);
            }
        }
        return wrapper;
    },

    processFacts: function(data) {
        this.facts = data.body.all;
        this.loaded = true;
        console.log(this.facts);
    },

    scheduleCarousel: function() {
        console.log("Carousel of DumbAssCatFacts fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++; //this.activeItem +1
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getFacts();
        }, this.config.updateInterval);
        this.getFacts(this.config.initialLoadDelay);
    },

    getFacts: function() {
        this.sendSocketNotification('GET_FACTS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FACTS_RESULT") {
            this.processFacts(payload);
        }

        if (this.rotateInterval == null) {
            this.scheduleCarousel();
        }
        this.updateDom(this.config.animationSpeed);
        this.updateDom(this.config.initialLoadDelay);
    },
});
