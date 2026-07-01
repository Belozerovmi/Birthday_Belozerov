// ============================================
// 1. КАРТА (версия 2.0 — стабильнее)
// ============================================
function initMap() {
  const COORDS = [51.668629, 39.205291]; // [широта, долгота] для v2

  const map = new ymaps.Map("map", {
    center: COORDS,
    zoom: 16,
    controls: ["zoomControl", "fullscreenControl"],
  });

  // Метка
  const placemark = new ymaps.Placemark(
    COORDS,
    {
      hintContent: "Пастерия «Высота»",
      balloonContent: "Пастерия «Высота»<br>ул. Плехановская, 10",
    },
    {
      preset: "islands#circleIcon",
      iconColor: "#8b6f4c",
    },
  );

  map.geoObjects.add(placemark);
}

// Загружаем карту
if (typeof ymaps !== "undefined") {
  ymaps.ready(initMap);
} else {
  // Если ymaps не загрузился — показываем заглушку
  document.getElementById("map").innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#e8e4e0;color:#6b6b6b;font-size:0.9rem;padding:16px;text-align:center;">
            Пастерия «Высота»<br>ул. Плехановская, 10
        </div>
    `;
}

// ============================================
// 2. ФОРМА → GOOGLE TABLES + ВАЛИДАЦИЯ
// ============================================
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbze6G854TGIM8lf2NhV3M0d_5dn-Y1hjLsm8sVd8A-Rqth-D7lCojntD8ODqIukrDqe/exec";

const form = document.getElementById("rsvpForm");
const submitBtn = document.getElementById("submitBtn");
const successMsg = document.getElementById("successMessage");
const errorMsg = document.getElementById("formError");
const nameInput = document.getElementById("name");
const privacyCheckbox = document.getElementById("privacyConsent");
const privacyError = document.getElementById("privacyError");
const checkboxLabel = document.querySelector(".checkbox-label");

// Валидация имени (только кириллица)
nameInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^а-яёА-ЯЁ\s\-']/g, "");
  errorMsg.classList.remove("show");
});

// Валидация чекбокса
privacyCheckbox.addEventListener("change", function () {
  if (this.checked) {
    checkboxLabel.classList.remove("error");
    privacyError.classList.remove("show");
  }
});

// Клик на текст тоже должен срабатывать
document
  .querySelector(".checkbox-text")
  .addEventListener("click", function (e) {
    // Не даём клику пройти на ссылку внутри
    if (e.target.tagName === "A") return;
    privacyCheckbox.click();
  });

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Проверка имени
  const name = nameInput.value.trim();
  if (!name) {
    errorMsg.textContent = "Пожалуйста, укажите ваше имя.";
    errorMsg.classList.add("show");
    nameInput.focus();
    return;
  }

  if (!/^[а-яёА-ЯЁ\s\-']+$/.test(name)) {
    errorMsg.textContent = "Имя должно содержать только буквы кириллицы.";
    errorMsg.classList.add("show");
    nameInput.focus();
    return;
  }
  errorMsg.classList.remove("show");

  // Проверка чекбокса
  if (!privacyCheckbox.checked) {
    checkboxLabel.classList.add("error");
    privacyError.classList.add("show");
    privacyCheckbox.focus();
    return;
  }
  checkboxLabel.classList.remove("error");
  privacyError.classList.remove("show");

  const status =
    document.querySelector('input[name="status"]:checked')?.value || "";
  const allergies = document.getElementById("allergies").value.trim();
  const message = document.getElementById("message").value.trim();

  const data = {
    name,
    status,
    allergies,
    message,
    privacyConsent: "Да",
    timestamp: new Date().toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Блокируем кнопку
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    successMsg.classList.add("show");
    form.reset();

    // Сбрасываем радио на "Приду"
    document.querySelector('input[name="status"][value="Приду"]').checked =
      true;
    // Сбрасываем чекбокс
    privacyCheckbox.checked = false;
    checkboxLabel.classList.remove("error");
    privacyError.classList.remove("show");

    setTimeout(() => {
      successMsg.classList.remove("show");
    }, 8000);
  } catch (error) {
    console.error("Ошибка отправки:", error);
    alert(
      "Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз или напишите мне лично.",
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Отправить ответ";
  }
});

// ============================================
// 3. СЛАЙДЕР МЕНЮ
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  const dots = document.querySelectorAll(".dot");
  let currentIndex = 0;
  const totalSlides = 2;

  // Функция обновления слайдера
  function updateSlider(index) {
    // Проверяем границы
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;

    // Двигаем трек
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Обновляем точки
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  // События для кнопок
  prevBtn.addEventListener("click", () => updateSlider(currentIndex - 1));
  nextBtn.addEventListener("click", () => updateSlider(currentIndex + 1));

  // События для точек
  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      updateSlider(index);
    });
  });

  // Клавиатура (стрелки)
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      updateSlider(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      updateSlider(currentIndex + 1);
    }
  });

  // Свайп для мобильных устройств
  let startX = 0;
  let isSwiping = false;

  const container = document.querySelector(".slider-container");

  container.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      isSwiping = true;
    },
    { passive: true },
  );

  container.addEventListener(
    "touchmove",
    function (e) {
      if (!isSwiping) return;
      const deltaX = e.touches[0].clientX - startX;
      // Если свайп достаточно длинный
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          updateSlider(currentIndex - 1);
        } else {
          updateSlider(currentIndex + 1);
        }
        isSwiping = false;
      }
    },
    { passive: true },
  );

  container.addEventListener(
    "touchend",
    function () {
      isSwiping = false;
    },
    { passive: true },
  );

  // Инициализация
  updateSlider(0);
});

// ============================================
// 4. LIGHTBOX ДЛЯ СЛАЙДЕРА
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const slides = document.querySelectorAll(".slide");
  let currentLightboxIndex = 0;
  const totalSlides = slides.length;

  // Функция открытия лайтбокса
  function openLightbox(index) {
    currentLightboxIndex = index;
    const img = slides[index].querySelector("img");
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCounter.textContent = `${index + 1} / ${totalSlides}`;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Функция закрытия лайтбокса
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Функция переключения в лайтбоксе
  function changeLightboxImage(direction) {
    let newIndex = currentLightboxIndex + direction;
    if (newIndex < 0) newIndex = totalSlides - 1;
    if (newIndex >= totalSlides) newIndex = 0;
    openLightbox(newIndex);
  }

  // Клик по слайду (открытие лайтбокса)
  slides.forEach((slide, index) => {
    slide.style.cursor = "pointer";
    slide.addEventListener("click", function (e) {
      // Не открываем лайтбокс если клик по кнопкам навигации
      if (e.target.closest(".slider-btn")) return;
      openLightbox(index);
    });
  });

  // Закрытие по кнопке
  closeBtn.addEventListener("click", closeLightbox);

  // Закрытие по клику на фон
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Закрытие по Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
    if (lightbox.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        changeLightboxImage(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        changeLightboxImage(1);
      }
    }
  });

  // Кнопки навигации в лайтбоксе
  prevBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    changeLightboxImage(-1);
  });

  nextBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    changeLightboxImage(1);
  });
});

// ============================================
// 5. ВАЛИДАЦИЯ ПОЛЯ "ИМЯ" (только кириллица)
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const formError = document.getElementById("formError");

  // Валидация при вводе (блокируем ввод латиницы и цифр)
  nameInput.addEventListener("input", function (e) {
    // Разрешаем: кириллицу, пробел, дефис, апостроф
    // Заменяем все недопустимые символы на пустую строку
    const allowed = /[^а-яёА-ЯЁ\s\-']/g;
    if (allowed.test(this.value)) {
      this.value = this.value.replace(allowed, "");
    }
  });

  // Дополнительная проверка при потере фокуса
  nameInput.addEventListener("blur", function () {
    const trimmed = this.value.trim();
    if (trimmed.length > 0 && !/^[а-яёА-ЯЁ\s\-']+$/.test(trimmed)) {
      formError.textContent = "Имя должно содержать только буквы кириллицы";
      formError.classList.add("show");
      this.style.borderColor = "#c0392b";
    } else {
      formError.classList.remove("show");
      this.style.borderColor = "";
    }
  });

  // Очищаем ошибку при фокусе
  nameInput.addEventListener("focus", function () {
    formError.classList.remove("show");
    this.style.borderColor = "";
  });

  // Валидация перед отправкой формы (дополнительно)
  const originalSubmit = form.addEventListener;
  form.addEventListener(
    "submit",
    function (e) {
      const name = nameInput.value.trim();
      if (name && !/^[а-яёА-ЯЁ\s\-']+$/.test(name)) {
        e.preventDefault();
        formError.textContent = "Имя должно содержать только буквы кириллицы";
        formError.classList.add("show");
        nameInput.style.borderColor = "#c0392b";
        nameInput.focus();
        return false;
      }
      // Если всё ок, форма отправится
    },
    true,
  );
});

// ============================================
// 6. ТАЙМЕР ОБРАТНОГО ОТСЧЁТА
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // УСТАНОВИ ДАТУ СВОЕГО ДНЯ РОЖДЕНИЯ
  // Формат: год, месяц (0-11, где 0 = январь), день, час, минута, секунда
  const targetDate = new Date(2026, 6, 18, 14, 0, 0); // 18 июля 2026, 14:00

  function updateTimer() {
    const now = new Date();
    let diff = targetDate - now;

    // Если время уже прошло
    if (diff <= 0) {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";

      // Меняем заголовок
      document.querySelector(".timer-title").textContent =
        "🎉 Встреча уже началась!";
      return;
    }

    // Расчёт времени
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    // Обновляем DOM с ведущими нулями
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(
      2,
      "0",
    );
    document.getElementById("minutes").textContent = String(minutes).padStart(
      2,
      "0",
    );
    document.getElementById("seconds").textContent = String(seconds).padStart(
      2,
      "0",
    );
  }

  // Обновляем каждую секунду
  updateTimer();
  setInterval(updateTimer, 1000);
});
// ============================================
// 7. ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // Выбираем все элементы, которые хотим анимировать
  const elements = document.querySelectorAll(
    ".card, .header, .info, .map-wrapper, .menu-slider-section, .timer-container, .form-section, .footer",
  );

  // Добавляем класс fade-in ко всем элементам
  elements.forEach((el, index) => {
    // Пропускаем если уже есть класс
    if (
      !el.classList.contains("fade-in") &&
      !el.classList.contains("fade-in-scale")
    ) {
      el.classList.add("fade-in");
      // Добавляем задержку для каскадного эффекта
      const delay = Math.min(index * 0.1, 0.5);
      if (delay > 0) {
        el.classList.add(`delay-${Math.round(delay * 10)}`);
      }
    }
  });

  // Настраиваем Intersection Observer
  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px 0px -50px 0px", // активируется чуть раньше, чем элемент появится
    threshold: 0.1, // 10% элемента видно
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Добавляем класс visible
        entry.target.classList.add("visible");
        // Можно остановить наблюдение за этим элементом
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Начинаем наблюдать за всеми элементами с fade-in
  document.querySelectorAll(".fade-in, .fade-in-scale").forEach((el) => {
    observer.observe(el);
  });
});
