function hideNotification() {

    const notification = document.getElementsByClassName('notification__wrapper');
    console.log(notification);
    notification[0].style.display = "none";
}

function notificationHandler() {

    const notification = document.getElementsByClassName('notification__wrapper');

    notification[0].addEventListener('click', hideNotification);
}

notificationHandler();