/* =====================================================
   SEHATIN — PRICE CALCULATOR
   SOFTWARE ENGINEER 1 & 2
   WEBDEV C — KELOMPOK 1

   SE 1:
   - Mengambil harga paket
   - Mengambil jumlah hari
   - Menghitung harga awal

   SE 2:
   - Memeriksa kode promo
   - Membuat kondisi IF dan ELSE
   - Menghitung nominal diskon
   - Menghitung total pembayaran
   - Menampilkan hasil perhitungan
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       1. MENGAMBIL ELEMEN DARI HTML
    ================================================= */

    const form = document.querySelector("#subscription-form");

    if (!form) {
        console.error("Form kalkulator #subscription-form tidak ditemukan.");
        return;
    }

    const packageSelect = form.querySelector("select");

    const durationInput = form.querySelector('input[type="number"]');

    const promoInput = form.querySelector('input[type="text"]');

    const applyPromoButton =
        document.querySelector(".btn-apply");

    const calculateButton =
        form.querySelector(".calc-submit");

    let promoMessage =
        document.querySelector(".promo-message");

    let resultBox =
        document.querySelector(".price-breakdown");


    /* =================================================
       2. MEMBUAT AREA PESAN PROMO JIKA BELUM ADA
    ================================================= */

    if (!promoMessage) {

        promoMessage = document.createElement("p");

        promoMessage.className = "promo-message";

        const promoRow = form.querySelector(".promo-input-row");

        if (promoRow) {
            promoRow.insertAdjacentElement("afterend", promoMessage);
        } else {
            form.appendChild(promoMessage);
        }

    }


    /* =================================================
       3. MEMBUAT AREA HASIL JIKA BELUM ADA
    ================================================= */

    if (!resultBox) {

        resultBox = document.createElement("div");

        resultBox.className = "price-breakdown";

        form.insertAdjacentElement("afterend", resultBox);

    }

    resultBox.hidden = true;


    /* =================================================
       4. KETENTUAN PROMO SEHATIN
    ================================================= */

    const PROMO_CODE = "SEHATIN10";

    const DISCOUNT_RATE = 0.10;

    const MINIMUM_DAYS = 7;


    /* =================================================
       5. FORMAT RUPIAH
    ================================================= */

    function formatRupiah(amount) {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount);

    }


    /* =================================================
       6. MENAMPILKAN PESAN KEPADA PENGGUNA
    ================================================= */

    function showMessage(message, status) {

        promoMessage.textContent = message;

        promoMessage.classList.remove(
            "is-error",
            "is-success"
        );

        if (status) {
            promoMessage.classList.add(status);
        }

    }


    /* =================================================
       7. MENGAMBIL HARGA DARI PAKET YANG DIPILIH
    ================================================= */

    function getPackagePrice(option) {

        if (!option) {
            return 0;
        }

        // Mengambil harga dari atribut data-price jika tersedia
        const dataPrice = Number(option.dataset.price);

        if (Number.isFinite(dataPrice) && dataPrice > 0) {
            return dataPrice;
        }

        // Mengambil harga dari value dropdown
        const value = option.value.trim();

        if (/^\d+(\.\d+)?$/.test(value)) {

            const price = Number(value);

            if (Number.isFinite(price) && price > 0) {
                return price;
            }

        }

        // Alternatif: membaca harga dari teks pilihan paket
        const priceMatch = option.textContent.match(
            /Rp\.?\s*([\d.]+)/i
        );

        if (priceMatch) {

            return Number(
                priceMatch[1].replace(/\./g, "")
            );

        }

        return 0;

    }


    /* =================================================
       8. FUNGSI UTAMA KALKULATOR
    ================================================= */

    function calculatePrice() {

        // Mengambil paket yang dipilih pengguna
        const selectedOption =
            packageSelect.options[packageSelect.selectedIndex];

        // Mengambil harga paket
        const unitPrice = getPackagePrice(selectedOption);

        // Mengambil jumlah hari berlangganan
        const duration = Number(durationInput.value);

        // Mengambil kode promo
        const promoCode =
            promoInput.value.trim().toUpperCase();


        /* =============================================
           9. VALIDASI PILIHAN PAKET
        ============================================= */

        if (!selectedOption || !packageSelect.value || unitPrice <= 0) {

            resultBox.hidden = true;

            showMessage(
                "Silakan pilih paket makanan terlebih dahulu.",
                "is-error"
            );

            packageSelect.focus();

            return;

        }


        /* =============================================
           10. VALIDASI JUMLAH HARI
        ============================================= */

        if (
            !Number.isInteger(duration) ||
            duration < 1
        ) {

            resultBox.hidden = true;

            showMessage(
                "Jumlah hari harus berupa angka bulat minimal 1 hari.",
                "is-error"
            );

            durationInput.focus();

            return;

        }


        /* =============================================
           11. MENGHITUNG HARGA AWAL — SE 1

           Harga awal = Harga paket x jumlah hari
        ============================================= */

        const originalPrice = unitPrice * duration;


        /* =============================================
           12. LOGIKA VALIDASI KODE PROMO — SE 2
        ============================================= */

        let discountRate = 0;

        let promoStatus = "";

        let statusType = "is-error";


        // KONDISI 1: KODE PROMO BENAR

        if (promoCode === PROMO_CODE) {

            discountRate = DISCOUNT_RATE;

            promoStatus =
                "Berhasil! Kode promo SEHATIN10 memberikan diskon 10%.";

            statusType = "is-success";

        }


        // KONDISI 2: LANGGANAN MINIMAL 7 HARI

        else if (duration >= MINIMUM_DAYS) {

            discountRate = DISCOUNT_RATE;

            promoStatus = promoCode !== ""
                ? "Kode promo tidak valid, tetapi kamu mendapatkan diskon otomatis 10% karena berlangganan minimal 7 hari."
                : "Selamat! Kamu mendapatkan diskon otomatis 10% karena berlangganan minimal 7 hari.";

            statusType = "is-success";

        }


        // KONDISI 3: KODE SALAH DAN TIDAK MEMENUHI SYARAT

        else {

            discountRate = 0;

            promoStatus = promoCode !== ""
                ? "Kode promo tidak valid. Silakan gunakan SEHATIN10."
                : "Belum ada diskon. Gunakan kode SEHATIN10 atau berlangganan minimal 7 hari.";

        }


        /* =============================================
           13. MENGHITUNG NOMINAL POTONGAN DISKON
        ============================================= */

        const discountAmount = Math.round(
            originalPrice * discountRate
        );


        /* =============================================
           14. MENGHITUNG TOTAL PEMBAYARAN AKHIR
        ============================================= */

        const finalPrice =
            originalPrice - discountAmount;


        /* =============================================
           15. MENAMPILKAN PESAN PROMO
        ============================================= */

        showMessage(promoStatus, statusType);


        /* =============================================
           16. MEMBUAT BARIS RINCIAN PEMBAYARAN
        ============================================= */

        resultBox.replaceChildren();

        const resultTitle = document.createElement("h4");

        resultTitle.textContent = "Rincian Pembayaran";

        resultBox.appendChild(resultTitle);


        // Fungsi untuk membuat setiap baris hasil
        function createResultRow(label, value, className) {

            const row = document.createElement("div");

            if (className) {
                row.className = className;
            }

            const labelElement = document.createElement("span");

            labelElement.textContent = label;

            const valueElement = document.createElement("strong");

            valueElement.textContent = value;

            row.appendChild(labelElement);

            row.appendChild(valueElement);

            resultBox.appendChild(row);

        }


        /* =============================================
           17. MENAMPILKAN HARGA AWAL
        ============================================= */

        createResultRow(
            "Paket Dipilih",
            selectedOption.textContent.trim()
        );

        createResultRow(
            "Harga per Hari",
            formatRupiah(unitPrice)
        );

        createResultRow(
            "Durasi Berlangganan",
            duration + " hari"
        );

        createResultRow(
            "Harga Awal",
            formatRupiah(originalPrice)
        );


        /* =============================================
           18. MENAMPILKAN NOMINAL DISKON
        ============================================= */

        createResultRow(
            "Potongan Diskon",
            "- " + formatRupiah(discountAmount) +
            " (" + (discountRate * 100) + "%)",
            "discount-row"
        );


        /* =============================================
           19. MENAMPILKAN TOTAL PEMBAYARAN
        ============================================= */

        createResultRow(
            "Total Pembayaran",
            formatRupiah(finalPrice),
            "total-row"
        );


        // Menampilkan kotak hasil perhitungan
        resultBox.hidden = false;

    }


    /* =================================================
       20. EVENT TOMBOL HITUNG
    ================================================= */

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        calculatePrice();

    });


    /* =================================================
       21. EVENT TOMBOL TERAPKAN PROMO
    ================================================= */

    if (applyPromoButton) {

        applyPromoButton.addEventListener("click", function(event) {

            event.preventDefault();

            calculatePrice();

        });

    }


    /* =================================================
       22. MENGUBAH KODE PROMO MENJADI HURUF KAPITAL
    ================================================= */

    if (promoInput) {

        promoInput.addEventListener("input", function() {

            const cursorPosition = promoInput.selectionStart;

            promoInput.value =
                promoInput.value.toUpperCase();

            promoInput.setSelectionRange(
                cursorPosition,
                cursorPosition
            );

        });

    }


    /* =================================================
       23. SELEKSI PAKET DARI KATALOG
    ================================================= */

    document.querySelectorAll(".btn-select").forEach(function(button) {

        button.addEventListener("click", function() {

            const priceElement =
                button.closest(".package-card")?.querySelector(".package-price strong");

            if (!priceElement) {
                return;
            }

            // Membaca harga pada kartu katalog
            const priceText = priceElement.textContent;

            const price = Number(
                priceText.replace(/[^\d]/g, "")
            );

            const matchingOption = Array.from(packageSelect.options)
                .find(function(option) {

                    return getPackagePrice(option) === price;

                });

            if (matchingOption) {

                packageSelect.value = matchingOption.value;

                document.querySelector("#calc-section")?.scrollIntoView({
                    behavior: "smooth"
                });

                showMessage(
                    "Paket berhasil dipilih. Masukkan durasi untuk menghitung harga.",
                    "is-success"
                );

            }

        });

    });


    console.log("SEHATIN Calculator berhasil dijalankan.");

});
