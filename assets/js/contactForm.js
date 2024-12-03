const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            form.reset();
            successMessage.classList.add('show-message');
            setTimeout(() => {
                successMessage.classList.remove('show-message');
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        errorMessage.classList.add('show-message');
        setTimeout(() => {
            errorMessage.classList.remove('show-message');
        }, 5000);
    }
});

