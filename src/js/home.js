function notificationHandler() {

    const notification = document.querySelector('.notification-dismiss');

    notification.addEventListener('click', () => {
        const notification = document.querySelector('.notification__wrapper');
        notification.style.display = "none";    
    });
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

        // setTimeout(() => {
        //     submitMessage.style.animation = "fadeOut 0.5s ease-in-out !important";
        //     submitMessage.parentElement.style.display = "none";
        // }
        // , 2000);
    }); 
}

notificationHandler();
emailHandler();
