document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('usernamesignup').value;
    const password = document.getElementById('passwordsignup').value;

    const userData = {
        Username: username,
        Password: password
    };

    fetch('https://asia-southeast2-vivid-vent-401501.cloudfunctions.net/signupfix', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Pendaftaran gagal');
        }
    })
    .then(data => {
        // Handle respons dari server (misalnya, tampilkan pesan sukses)
        console.log('Pendaftaran berhasil:', data);
        // Redirect ke halaman login
        // window.location.href = '../theme/signin.html'; // Ganti dengan nama file halaman login yang sesuai
    })
    .catch(error => {
        // Handle kesalahan (misalnya, tampilkan pesan kesalahan)
        console.error('Pendaftaran error:', error);
    });
});
