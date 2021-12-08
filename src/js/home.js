const dbBaseUrl = 'https://raw.githubusercontent.com/hash-define-organization/website-update/main/database/';
class NotificationManager {

    #notificationHandler = {};

    constructor() {
        this.notificationSound = new Audio('/assets/sounds/notification.mp3');

        notificationSound();
        showNotification();
    }

    notificationSound () {
        const audioElement = document.createElement('audio');
        audioElement.setAttribute('src', '/assets/sounds/notification.mp3');
        this.#notificationHandler.sound = audioElement;
    }

    showNotification() {
        this.#notificationHandler.sound.play();
    }

    async setNotification() {
        try {
            this.#notificationHandler.data = await this.fetchNotification();
            console.log(this.#notificationHandler);
        } catch (error) {
            console.log(error);
        }
    }

    static setInstance(instance) {
        this.#notificationHandler.instance = instance;
        console.log(this.#notificationHandler);
    }

    async fetchNotification() {
        try {
            return await (await fetch(`${dbBaseUrl}notifications.json`)).json();
        } catch (error) {
            console.log("Failed to check for Notifications");
        }
    }

    //show notif

    //dismiss hotification


    // Start Notification Manager after some time on Website

    static initNotificationHandler() {
            setTimeout(() => {
                NotificationManager.setInstance(new NotificationManager());
                console.dir(this);
            }, 0);
    }
}

// NotificationManager.initNotificationHandler();


function notificationHandler() {



    const notification = document.querySelector('.notification-dismiss');

    notification.addEventListener('click', () => {
        const notification = document.querySelector('.notification__wrapper');
        notification.style.display = "none";    
    });
}

// gallery

// const galleryWraper = document.querySelector('.gallery__wrapper');
// const galleryItems = document.querySelectorAll('.gallery__item');
// let pos = { top: 0, left: 0, x: 0, y: 0 };

// const mouseMoveHandler = function (e) {
//     // How far the mouse has been moved
//     const dx = e.clientX - pos.x;
//     const dy = e.clientY - pos.y;

//     // Scroll the element
//     galleryWraper.scrollTop = pos.top - dy;
//     galleryWraper.scrollLeft = pos.left - dx;
// };

// const mouseUpHandler = function () {
//     document.removeEventListener('mousemove', mouseMoveHandler);
//     document.removeEventListener('mouseup', mouseUpHandler);

//     galleryWraper.style.cursor = 'grab';
//     galleryWraper.style.removeProperty('user-select');
// };

// const mouseDownHandler = (e) => {

//     //change cursor to grab and remove selecting
//     galleryWraper.style.cursor = "grabbing";
//     galleryWraper.style.userSelect = "none";

//     pos = {
//         //curr scroll pos of the wrapper
//         left: galleryWraper.scrollLeft,
//         top: galleryWraper.scrollTop,

//         //curr pos of the mouse 
//         x: e.clientX,
//         y: e.clientY
//     }

//     document.addEventListener('mousemove', mouseMoveHandler);
//     document.addEventListener('mouseup', mouseUpHandler);
// };

// galleryWraper.addEventListener('mousedown', mouseDownHandler);


// gallery

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

function init() {
    console.log("Home page loaded");
};

emailHandler();
