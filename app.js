const initIcons = () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
};

const preloader = document.getElementById("preloader");
const loaderBar = document.getElementById("loaderBar");
let progress = 0;

const loaderTimer = window.setInterval(() => {
    progress += 6;
    if (loaderBar) {
        loaderBar.style.width = `${Math.min(progress, 100)}%`;
    }
    if (progress >= 100) {
        window.clearInterval(loaderTimer);
        window.setTimeout(() => preloader?.classList.add("hidden"), 180);
    }
}, 28);

window.addEventListener("load", () => {
    if (loaderBar) {
        loaderBar.style.width = "100%";
    }
    window.setTimeout(() => preloader?.classList.add("hidden"), 220);
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    document.body.classList.toggle("menu-open", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    initIcons();
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuToggle?.setAttribute("aria-expanded", "false");
        if (menuToggle) {
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        }
        initIcons();
    });
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.scroll);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    },
    { threshold: 0.16 }
);

document.querySelectorAll(".section-observe").forEach((section) => observer.observe(section));

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            document.querySelectorAll(".nav-links a").forEach((link) => {
                const href = link.getAttribute("href");
                link.classList.toggle("active", href === `#${id}` || (id === "home" && href === "#top"));
            });
        });
    },
    { rootMargin: "-42% 0px -52% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => navObserver.observe(section));

const filterButtons = document.querySelectorAll(".filter-btn");
const projectGrid = document.querySelector(".project-grid");
let projectCards = document.querySelectorAll(".project-card");

const categoryMeta = {
    event: { label: "فعاليات", statusClass: "available", icon: "sparkles" },
    marketing: { label: "تسويق", statusClass: "soon", icon: "target" },
    identity: { label: "هوية", statusClass: "available", icon: "palette" },
    operation: { label: "تشغيل", statusClass: "sold", icon: "clipboard-check" },
};

const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[char]));

const getContentValue = (content, key, fallback = "") => {
    const item = content?.[key];
    if (item && typeof item === "object" && "value" in item) return item.value ?? fallback;
    return item ?? fallback;
};

const normalizePhoneDigits = (value) => String(value || "").replace(/\D/g, "");

const applyContactLinks = (content) => {
    const phone = getContentValue(content, "contact_phone", "+966 59 957 5691");
    const phoneDigits = normalizePhoneDigits(phone);
    const whatsappDigits = normalizePhoneDigits(getContentValue(content, "contact_whatsapp_number", phoneDigits));
    const email = getContentValue(content, "contact_email", "info.muheeb0@gmail.com");

    document.querySelectorAll("[data-phone-link]").forEach((link) => {
        if (phoneDigits) link.href = `tel:+${phoneDigits}`;
    });
    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
        if (whatsappDigits) link.href = `https://wa.me/${whatsappDigits}`;
    });
    document.querySelectorAll("[data-email-link]").forEach((link) => {
        if (email) link.href = `mailto:${email}`;
    });
};

const applyTextContent = (content) => {
    document.querySelectorAll("[data-content]").forEach((element) => {
        const key = element.dataset.content;
        const value = getContentValue(content, key, null);
        if (value === null || value === undefined) return;
        element.textContent = value;
    });

    document.querySelectorAll("[data-placeholder-content]").forEach((element) => {
        const key = element.dataset.placeholderContent;
        const value = getContentValue(content, key, null);
        if (value === null || value === undefined) return;
        element.setAttribute("placeholder", value);
    });

    applyContactLinks(content);
};

const applySiteImages = (images) => {
    const keyedImages = new Map(
        (images || [])
            .filter((image) => image.published !== false)
            .map((image) => [image.imageKey, image])
    );

    document.querySelectorAll("[data-image]").forEach((imageElement) => {
        const image = keyedImages.get(imageElement.dataset.image);
        if (!image?.imagePath) return;
        imageElement.src = image.imagePath;
        if (image.altText) {
            imageElement.alt = image.altText;
        }
    });

    const interestBackground = keyedImages.get("interest_background");
    const interestSection = document.querySelector(".interest");
    if (interestSection && interestBackground?.imagePath) {
        interestSection.style.backgroundImage = `linear-gradient(90deg, rgba(69, 18, 22, 0.93), rgba(69, 18, 22, 0.78)), url("${interestBackground.imagePath}")`;
    }

    const gallery = (images || [])
        .filter((image) => image.published !== false && image.groupName === "identity_gallery" && image.imagePath)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const identityGallery = document.getElementById("identityGallery");
    if (identityGallery && gallery.length) {
        const repeatedGallery = gallery.length < 6 ? [...gallery, ...gallery] : gallery;
        identityGallery.innerHTML = repeatedGallery.map((image) => `
            <article class="slide">
                <img src="${escapeHtml(image.imagePath)}" alt="${escapeHtml(image.altText || image.label)}">
                <span>${escapeHtml(image.label || image.altText || "صورة من مهيب")}</span>
            </article>
        `).join("");
    }
};

const renderInterestOptions = (options) => {
    const interestSelect = document.getElementById("interestSelect");
    const publishedOptions = (options || []).filter((option) => option.published !== false);
    if (!interestSelect || !publishedOptions.length) return;
    interestSelect.innerHTML = publishedOptions.map((option) => `
        <option value="${escapeHtml(option.value || option.label)}">${escapeHtml(option.label)}</option>
    `).join("");
};

const loadSiteCms = async () => {
    try {
        const siteData = await window.MuheebData.getSiteContent();
        applyTextContent(siteData.content || {});
        applySiteImages(siteData.images || []);
        renderInterestOptions(siteData.interestOptions || []);
    } catch (error) {
        console.info("Using static site content fallback.");
    }
};

const renderProjectCards = (events) => {
    if (!projectGrid || !events.length) return;
    projectGrid.innerHTML = events.map((event) => {
        const meta = categoryMeta[event.category] || categoryMeta.event;
        const highlights = Array.isArray(event.highlights) && event.highlights.length
            ? event.highlights
            : [event.location || "المدينة المنورة", event.eventDate || "تخطيط وتنفيذ", meta.label];
        return `
            <article class="project-card" data-status="${escapeHtml(event.category)}">
                <img src="${escapeHtml(event.coverImage || "assets/logo-meheib.png")}" alt="${escapeHtml(event.title)}">
                <div class="project-content">
                    <span class="status ${meta.statusClass}">${escapeHtml(event.categoryLabel || meta.label)}</span>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(event.description)}</p>
                    <ul>
                        ${highlights.slice(0, 3).map((highlight, index) => `
                            <li><i data-lucide="${index === 0 ? "map-pin" : index === 1 ? "calendar-check" : meta.icon}"></i> ${escapeHtml(highlight)}</li>
                        `).join("")}
                    </ul>
                    <a class="project-link" href="#interest">طلب تفاصيل</a>
                </div>
            </article>
        `;
    }).join("");
    projectCards = document.querySelectorAll(".project-card");
};

const applyProjectFilter = (filter) => {
    projectCards.forEach((card) => {
        const show = filter === "all" || card.dataset.status === filter;
        card.classList.toggle("hidden", !show);
    });
};

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        applyProjectFilter(button.dataset.filter);
    });
});

const loadPublishedEvents = async () => {
    try {
        const events = await window.MuheebData.listPublishedEvents();
        if (Array.isArray(events) && events.length) {
            renderProjectCards(events);
            const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
            applyProjectFilter(activeFilter);
            initIcons();
        }
    } catch (error) {
        console.info("Using static events fallback.");
    }
};

const countryCode = document.getElementById("countryCode");
const phoneInput = document.getElementById("phone");

const maxLengthByRule = {
    sa: 9,
    digits9: 9,
    digits8: 8,
};

const updatePhonePlaceholder = () => {
    const rule = countryCode?.selectedOptions[0]?.dataset.rule || "sa";
    if (!phoneInput) return;
    phoneInput.placeholder = rule === "sa" ? "5xxxxxxxx" : "xxxxxxxx";
    phoneInput.value = "";
};

countryCode?.addEventListener("change", updatePhonePlaceholder);

phoneInput?.addEventListener("input", () => {
    const rule = countryCode?.selectedOptions[0]?.dataset.rule || "sa";
    const maxLength = maxLengthByRule[rule] || 9;
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, maxLength);
    if (rule === "sa" && phoneInput.value.length && phoneInput.value[0] !== "5") {
        phoneInput.value = "";
    }
});

const leadForm = document.getElementById("leadForm");
const formNote = document.getElementById("formNote");

leadForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(leadForm);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const source = String(data.get("source") || "").trim();
    const rule = countryCode?.selectedOptions[0]?.dataset.rule || "sa";
    const expectedLength = maxLengthByRule[rule] || 9;

    if (!name || phone.length !== expectedLength || !source) {
        if (formNote) {
            formNote.textContent = "تأكد من تعبئة الاسم ورقم الجوال ومصدر الإعلان بشكل صحيح.";
        }
        return;
    }

    const lead = {
        name,
        country: data.get("country"),
        phone,
        service: data.get("project"),
        source,
        message: data.get("message"),
    };

    const submitButton = leadForm.querySelector(".form-submit");
    submitButton?.setAttribute("disabled", "disabled");
    if (formNote) {
        formNote.textContent = "جاري إرسال الطلب...";
    }

    try {
        await window.MuheebData.createLead(lead);
        leadForm.reset();
        updatePhonePlaceholder();
        if (formNote) {
            formNote.textContent = "تم إرسال طلبك بنجاح. سيظهر مباشرة في لوحة التحكم.";
        }
    } catch (error) {
        if (formNote) {
            formNote.textContent = error.message || "تعذر إرسال الطلب. حاول مرة أخرى.";
        }
    } finally {
        submitButton?.removeAttribute("disabled");
    }
});

const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
    toTop?.classList.toggle("visible", window.scrollY > 500);
});

toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

initIcons();
loadSiteCms();
loadPublishedEvents();
