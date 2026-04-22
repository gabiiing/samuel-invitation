document.addEventListener('DOMContentLoaded', () => {
    const guestNameInput = document.getElementById('guestName');
    const guestPhoneInput = document.getElementById('guestPhone');
    const messagePreview = document.getElementById('messagePreview');
    const btnSendWA = document.getElementById('btnSendWA');
    const btnPickContact = document.getElementById('btnPickContact');

    btnPickContact.style.display = 'flex'; // Selalu tampilkan untuk UI

    btnPickContact.addEventListener('click', async () => {
        // Pengecekan support API yang lebih universal
        if (!('contacts' in navigator)) {
            alert('Maaf, fitur pilih kontak Phonebook langsung dari website belum didukung oleh HP/Browser Anda (Saat ini paling optimal di Google Chrome Android). Silakan ketik ketik nama/nomor secara manual.');
            return;
        }

        try {
            // Mengambil spesifik nama dan telepon
            const props = ['name', 'tel'];
            const opts = { multiple: false };
            const contacts = await navigator.contacts.select(props, opts);
            
            if (contacts && contacts.length > 0) {
                const contact = contacts[0];
                
                if (contact.name && contact.name.length > 0) {
                    guestNameInput.value = contact.name[0];
                }
                
                if (contact.tel && contact.tel.length > 0) {
                    guestPhoneInput.value = contact.tel[0];
                } else {
                    alert('Data kontak yang dipilih tidak memiliki Nomor HP. Silakan isi secara manual.');
                }
                
                updatePreview();
            }
        } catch (ex) {
            console.error("Contact picker failed:", ex);
            alert("Gagal membaca buku kontak. Pastikan Anda klik 'Allow/Izinkan' saat browser meminta akses, dan pastikan membukanya di koneksi aman (HTTPS).");
        }
    });


    function formatPhoneNumber(phone) {
        // Remove all non-numeric characters
        let cleaned = phone.replace(/\D/g, '');

        // Ensure starting with 62 (for Indonesia) instead of 0 or 8
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        } else if (cleaned.startsWith('8')) {
            cleaned = '62' + cleaned;
        }

        return cleaned;
    }

    function generateMessage(name) {
        const fallbackName = "Nama Tamu";
        const targetName = name.trim() || fallbackName;
        // Format to Replace spaces with '+' and encode properly if needed
        const encodedNameForUrl = encodeURIComponent(targetName).replace(/%20/g, '+');
        const invitationLink = `https://prime.goodchoice.id/samuel-imanuella/?to=${encodedNameForUrl}`;

        return `Salam sejahtera,

Dengan kasih karunia Tuhan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada pernikahan kami:

Samuel Guhan Nugraha Putra
&
Imanuella Kriseka Widyasari

\u{1F4C5} Sabtu, 13 Juni 2026
\u{23F0} Resepsi: 12:00 – 14:00 WIB
\u{1F4CD} Gedung Soos Sasono Suko
Jl. Ronggolawe No.1, Sidomulyo, Cepu, Kec. Cepu, Kabupaten Blora, Jawa Tengah 58112

Klik link undangan berikut:
${invitationLink}

Kehadiran dan doa restu yang tulus akan menjadi anugerah dan kebahagiaan bagi kami.

Terima kasih atas perhatian serta doa baik yang diberikan.

Mohon konfirmasi kehadiran melalui form RSVP pada undangan.

With Love,
\u{1F496} Samuel & Imanuella`;
    }

    function updatePreview() {
        const name = guestNameInput.value;
        const phone = guestPhoneInput.value;

        const message = generateMessage(name);
        messagePreview.textContent = message;

        const cleanPhone = formatPhoneNumber(phone);
        if (cleanPhone && cleanPhone.length > 5) {
            btnSendWA.disabled = false;
        } else {
            btnSendWA.disabled = true;
        }
    }

    guestNameInput.addEventListener('input', updatePreview);
    guestPhoneInput.addEventListener('input', updatePreview);

    btnSendWA.addEventListener('click', () => {
        const name = guestNameInput.value;
        const phone = guestPhoneInput.value;
        const cleanPhone = formatPhoneNumber(phone);
        const message = generateMessage(name);

        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    });

    // Initialize preview
    updatePreview();
});
