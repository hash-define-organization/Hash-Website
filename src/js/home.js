( function() {
const dbBaseUrl = 'https://raw.githubusercontent.com/hash-define-organization/website-update/main/database';
const notificationsUrl = '/notifications.json';
const eventsUrl = '/gallery/gallery.json';
class NotificationManager {

    messages = null;
    displayElement = null;
    messagePlaceholder = null;
    linkPlaceholder = null;
    totalCountElement = null;
    currentCountElement = null;
    
    cielCount = null;
    currentCount = null;
    totalCount = null;

    constructor() {
        this.displayElement = document.querySelector('.notification__wrapper');
        this.messagePlaceholder = document.querySelector('.notification-message');
        this.linkPlaceholder = document.querySelector('.notification-link__content');
        this.totalCountElement = document.querySelector('.total-count');
        this.currentCountElement = document.querySelector('.current-count');

        // Event Listeners
        this.dismissBtn = document.querySelector('#dismissBtn');
        this.expandBtn = document.querySelector('#expandBtn');
        this.showNextBtn = document.querySelector('#showNextBtn');
     
        this.startWithDelay(1000);
    }

    startWithDelay(time) {
        setTimeout(() => {
            this.initNotificationHandler();
        }, time);
    }

    toggleElementVisibility() {
        this.displayElement.style.display = this.displayElement.style.display === "none" ? "" : "none";
    }

    showNotification(count) {
        this.currentCountElement.innerText = count;

        let message = Object.values(this.messages)[count-1];

        this.messagePlaceholder.innerHTML = message.content;
    }

    async fetchNotifications() {
        try {
            return await (await fetch(`${dbBaseUrl}${notificationsUrl}`)).json();
        } catch (error) {
            console.log("Failed to check for Notifications");
        }
    }

    async initNotificationHandler() {
        try {
            this.messages = await this.fetchNotifications();
            
            if(!this.messages) return; 

            this.toggleElementVisibility();
            this.currentCount = this.cielCount = 1;
            this.totalCount = Object.keys(this.messages).length;
            this.totalCountElement.innerHTML = `&nbsp;/&nbsp; ${this.totalCount}`;
            
            this.showNotification(this.cielCount);

            this.dismissBtn.addEventListener('click', () => {
                this.toggleElementVisibility();

                this.displayElement.classList.add('notification__wrapper--close');
            });

            this.expandBtn.addEventListener('click', () => {
                console.log("Showing Message!");
            });

            this.showNextBtn.addEventListener('click', () => {
                this.cielCount++;

                if(this.cielCount > this.totalCount ) this.cielCount -= this.totalCount;

                this.showNotification(this.cielCount);
            });

        } catch (error) {
            console.log(error);
        }
    }
}

class galleryManager {

    galleryWraper = null;
    galleryItems = null;
    galleryWrapperFlex = null;
    infiniteScrollWrapper = null;
    
    constructor() {
        this.galleryWraper = document.querySelector('.gallery__wrapper');
        this.galleryItems = document.querySelectorAll('.gallery__item');
        this.galleryWrapperFlex = document.querySelector('.gallery__flex');
        this.infiniteScrollWrapper = document.querySelectorAll('.infinite-scroll__wrapper')
        
        this.initGalleryHandler();
    }
    
    async initGalleryHandler() {

        await this.updateGallery();  
        this.initScrollHandler();
        this.initInfiniteScrollHandler();
    
    }

    async updateGallery() {

        // console.log("Updating Gallery");
    
        const events = await (await fetch(`https://raw.githubusercontent.com/hash-define-organization/website-update/main/database/events.json`)).json();
        const fallbackImage = `https://raw.githubusercontent.com/hash-define-organization/website-update/main/database/gallery/images/define-logo-2.png`;
        
        // console.log(events);
        events.forEach( (event) => {
    
            let eventTags = ``;
    
            event.event_type.forEach((tag) => {
                eventTags += `<p>${tag}</p>`;
            })
            
            let cardImage;

            if(event.poster_link === "") {

                cardImage = fallbackImage;
            } else {
                
                cardImage = event.poster_link;
            }
            
            const eventCardHTML = `
            <div class="gallery__item">
                <img src="${cardImage}" />
                <div class="gallery__item-content">
                    <div class="event-name merge-sides infinite-scroll__wrapper">
                        <p class="infinite-scroll">${event.event_name}</p>
                    </div>
                    <div class="speaker-name">
                        <p>${event.event_guest}</p>
                    </div>
                    <div class="event-tag">
                        ${eventTags}
                    </div>
                </div>
            </div>
            `;
    
            this.galleryWrapperFlex.innerHTML += eventCardHTML;
    
        });
    
    };
    
    initScrollHandler() {

        const galleryWraper = this.galleryWraper;
        let pos = { top: 0, left: 0, x: 0, y: 0 };
        
        const mouseMoveHandler = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;
        
            // Scroll the element
            galleryWraper.scrollTop = pos.top - dy;
            galleryWraper.scrollLeft = pos.left - dx;
        };
        
        const mouseUpHandler = function () {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        
            galleryWraper.style.cursor = 'grab';
            galleryWraper.style.removeProperty('user-select');
        };
        
        const mouseDownHandler = (e) => {
        
            //change cursor to grab and remove selecting
            galleryWraper.style.cursor = "grabbing";
            galleryWraper.style.userSelect = "none";
        
            pos = {
                //curr scroll pos of the wrapper
                left: galleryWraper.scrollLeft,
                top: galleryWraper.scrollTop,
        
                //curr pos of the mouse 
                x: e.clientX,
                y: e.clientY
            }
        
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };
        
        galleryWraper.addEventListener('mousedown', mouseDownHandler);
    }

    convertRemToPixels(rem) {    
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
    
    initInfiniteScrollHandler() {
    
        document.querySelectorAll('.infinite-scroll__wrapper').forEach( (element) => {
                
            const scrollWrapper = element;
            const scrollingElement = element.children[0];
            
            const computedStyle = getComputedStyle(scrollingElement);
            const paddingWidth = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

            const scrollWrapperWidth = scrollWrapper.clientWidth;
            const scrollingElementWidth = scrollingElement.clientWidth;
            
            let elementNetOffsetWidth = scrollWrapperWidth - scrollingElementWidth;
            
            if(( elementNetOffsetWidth < 0 && -elementNetOffsetWidth < paddingWidth ) || elementNetOffsetWidth > 0) {
                
                elementNetOffsetWidth = 0;
                scrollingElement.classList.add('no-move');
            }
            
            // console.log(scrollingElement);
            // console.log("scrollWrapperWidth: " + scrollWrapperWidth);
            // console.log("scrollingElementWidth: " + scrollingElementWidth);
            // console.log("elementNetOffsetWidth: " + elementNetOffsetWidth);
            // console.log("paddingWidth: " + paddingWidth);


            scrollingElement.style.setProperty('--move-width', `${elementNetOffsetWidth}px`);
            scrollingElement.style.setProperty('--move-duration', `${-(elementNetOffsetWidth * 9) / 199}s`);
        });
    }
}

function emailHandler() {

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    const submitBtn = document.querySelector('.subscribe__form--submit');
    
    submitBtn.addEventListener('click', () => {
        const emailInput = document.querySelector('.subscribe__form--email').value;
        const messageBox = document.querySelector('.alert-message');

        let submitMessage = messageBox.children[0];

        submitMessage.parentElement.style.display = "block";

        if(validateEmail(emailInput))
        {
            submitMessage.innerHTML = "🎉 Thanks for subscribing!";
        }
        else
        {
            submitMessage.innerHTML = "🙅‍♀️ Please enter a valid email address";
        }

        submitMessage.parentElement.addEventListener('animationend', () => {

            submitMessage.parentElement.style.display = "none";
            submitMessage.innerHTML = "";

        })

        // setTimeout(() => {
        //     submitMessage.style.animation = "fadeOut 0.5s ease-in-out !important";
        //     submitMessage.parentElement.style.display = "none";
        // }
        // , 2000);
    }); 
}

class typingEffect {

    constructor(properties) {

        if(!properties.words || !properties.element) {
            throw new Error("Must Enter required Values!");
        }   
     
        this.typedTextElement = document.querySelector(properties.element);
        this.textCursor = document.querySelector(properties.cursor);
        this.typedWords = properties.words;
        this.typingDelay = properties.tDelay || 200;
        this.erasingDelay = properties.eDelay || 100;
        this.newTextDelay = properties.ntDelay || 2000;
    
        this.textArrayIndex = 0;
        this.charIndex = 0;

        this.init();
    }

    init() {
        // setTimeout(this.print, 5000);
        // this.type();
        if(this.typedWords.length) {
            setTimeout(() => this.type(), this.newTextDelay + 250);
        }
    }

    print() {
        console.log("Called timeout!!");
    }

    type() {
        if(this.charIndex < this.typedWords[this.textArrayIndex].length) {
            if(!this.textCursor.classList.contains("typing")) {
                this.textCursor.classList.add("typing");
            }
            this.typedTextElement.textContent += this.typedWords[this.textArrayIndex].charAt(this.charIndex);
            this.charIndex++;
            setTimeout(() => this.type(), this.typingDelay);
        }
        else {
            this.textCursor.classList.remove("typing");
            setTimeout(() => this.erase(), this.newTextDelay);
        }
    }

    erase() {
        if(this.charIndex > 0) {
            if(!this.textCursor.classList.contains("typing")) {
                this.textCursor.classList.add("typing");
            }
            this.typedTextElement.textContent = this.typedWords[this.textArrayIndex].substring(0, this.charIndex - 1);
            this.charIndex--;
            setTimeout(() => this.erase(), this.erasingDelay);
        }
        else {
            this.textCursor.classList.remove("typing");
            this.textArrayIndex++;
            if (this.textArrayIndex >= this.typedWords.length) {
                this.textArrayIndex = 0;
                // return;
            }
            setTimeout(() => this.type(), this.typingDelay + 1100);
        }
    }
}

function generateGradient() {

    try {
        if(!Gradient) {
            console.log("Gradient is not defined!");
        }
    
        let gradient = new Gradient();
        gradient.initGradient('#gradient-canvas');
    
    } catch (error) {

        const script = document.createElement('script');
        script.src = "/js/homeGradient.js";
        script.type = "text/javascript";
        document.head.appendChild(script);
        
        script.onload = () => {
            let gradient = new Gradient();
            gradient.initGradient('#gradient-canvas');
        }
    }
}

const masterHeadline = {
    words: ['Code', 'Learn', 'Grow'],
    element: '.typed-text-1',
    cursor: '.cursor-1',
}

    generateGradient();
    const notificationHandler = new NotificationManager();
    const galleryHandler = new galleryManager();
    const headlineTyping = new typingEffect(masterHeadline);
})();