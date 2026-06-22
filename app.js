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
        if (["contact", "event"].includes(document.body.dataset.page)) {
            const activeHref = document.body.dataset.page === "event" ? "index.html#projects" : "contact.html";
            document.querySelectorAll(".nav-links a").forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === activeHref);
            });
            return;
        }
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
let publishedEvents = [];
let eventCategoryOptions = [];
const eventDetailModal = document.getElementById("eventDetailModal");
const eventDetailContent = document.getElementById("eventDetailContent");
const closeEventDetail = document.getElementById("closeEventDetail");

const categoryMeta = {
    event: { label: "فعاليات", statusClass: "available", icon: "sparkles" },
    marketing: { label: "تسويق", statusClass: "soon", icon: "target" },
    identity: { label: "هوية", statusClass: "available", icon: "palette" },
    operation: { label: "تشغيل", statusClass: "sold", icon: "clipboard-check" },
};

const getCategoryMeta = (category) => {
    const fallback = categoryMeta[category] || { label: category || "فعالية", statusClass: "available", icon: "sparkles" };
    const option = eventCategoryOptions.find((item) => item.value === category || item.label === category);
    return {
        ...fallback,
        label: option?.label || fallback.label,
    };
};

const stringifySectionValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    if (typeof value === "object") {
        return String(value.title || value.text || value.name || value.label || value.value || "").trim();
    }
    return String(value).trim();
};

const normalizeEventSections = (sections = []) => (Array.isArray(sections) ? sections : [])
    .map((section, index) => {
        if (typeof section === "string") {
            const [title = "", text = "", image = ""] = section.split("|").map((part) => part.trim());
            return { title, text, image };
        }
        const title = stringifySectionValue(section.title || section.heading || section.name);
        const text = stringifySectionValue(section.text || section.description || section.body || section.content);
        const image = stringifySectionValue(section.image || section.imagePath || section.path || section.logo);
        return {
            title: title || (text || image ? `قسم ${index + 1}` : ""),
            text,
            image,
        };
    })
    .filter((section) => section.title || section.text || section.image);

const staticEvents = [
    {
        id: "static-event",
        title: "المؤتمرات والمعارض",
        category: "event",
        categoryLabel: "فعاليات",
        location: "المدينة المنورة",
        venueName: "مساحة الفعالية",
        eventDate: "تخطيط وتشغيل",
        description: "إدارة تجربة الحضور، المسارات، نقاط التسجيل، وتطبيق الهوية داخل مساحة الحدث.",
        highlights: ["تجربة حضور", "تنسيق ميداني", "هوية المكان"],
        achievements: ["مسارات حضور منظمة", "تطبيق هوية موحد", "توثيق مخرجات الفعالية"],
        participants: ["فريق التشغيل", "جهات التنظيم", "مقدمو الخدمات"],
        coverImage: "assets/identity-wall-clean.png",
        gallery: [
            { imagePath: "assets/identity-wall-clean.png", altText: "تنظيم فعاليات مهيب" },
            { imagePath: "assets/identity-stamp-clean.png", altText: "توثيق واعتماد" },
        ],
    },
    {
        id: "static-marketing",
        title: "الحملات التسويقية",
        category: "marketing",
        categoryLabel: "تسويق",
        location: "السعودية",
        eventDate: "فكرة ورسالة",
        description: "بناء فكرة الحملة ورسائلها، وتنسيق الظهور البصري عبر القنوات والمواد.",
        highlights: ["خطة ظهور", "مسار بصري", "محتوى تسويقي"],
        achievements: ["رسائل واضحة", "مواد متسقة", "قنوات ظهور محددة"],
        coverImage: "assets/brand-palette.jpg",
        gallery: [{ imagePath: "assets/brand-palette.jpg", altText: "حملات تسويقية مهيب" }],
    },
    {
        id: "static-identity",
        title: "التطبيقات البصرية",
        category: "identity",
        categoryLabel: "هوية",
        location: "حسب نطاق المشروع",
        eventDate: "تصميم واعتماد",
        description: "مطبوعات، بطاقات، لوحات، وأدوات تعريف تحفظ اتساق العلامة في كل نقطة تواصل.",
        highlights: ["شعار واضح", "نظام ألوان", "ملفات جاهزة"],
        achievements: ["تطبيقات عملية", "اتساق بصري", "ملفات منظمة"],
        coverImage: "assets/identity-cards-clean.png",
        gallery: [{ imagePath: "assets/identity-cards-clean.png", altText: "تطبيقات هوية مهيب" }],
    },
    {
        id: "static-operation",
        title: "التنفيذ والتوثيق",
        category: "operation",
        categoryLabel: "تشغيل",
        location: "موقع الفعالية",
        eventDate: "متابعة واعتماد",
        description: "إدارة التفاصيل التشغيلية، اعتماد المواد، وتوثيق المخرجات لتظهر الفعالية بصورة محترفة.",
        highlights: ["متابعة دقيقة", "اعتماد مخرجات", "تنسيق شركاء"],
        achievements: ["تشغيل منظم", "توثيق نهائي", "اعتماد المواد"],
        coverImage: "assets/identity-stamp-clean.png",
        gallery: [{ imagePath: "assets/identity-stamp-clean.png", altText: "تشغيل وتوثيق مهيب" }],
    },
];

window.MuheebStaticEvents = staticEvents;

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

const getEventPageUrl = (event) => `event.html?id=${encodeURIComponent(event.id)}`;

const appLooksLikeImagePath = (value) => /^(https?:|data:|assets\/|uploads\/|event-images\/|storage\/)/i.test(String(value || ""));

const normalizePartnerLogo = (entry, index = 0) => {
    if (typeof entry === "object" && entry !== null) {
        return {
            logo: entry.logo || entry.image || entry.path || entry.imagePath || "",
            name: entry.name || entry.label || `جهة ${index + 1}`,
        };
    }
    const raw = String(entry || "").trim();
    if (raw.includes("|")) {
        const [first = "", second = ""] = raw.split("|").map((part) => part.trim());
        return appLooksLikeImagePath(first)
            ? { logo: first, name: second || `جهة ${index + 1}` }
            : { logo: second, name: first || `جهة ${index + 1}` };
    }
    return { logo: raw, name: `جهة ${index + 1}` };
};

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

    document.querySelectorAll("[data-href-content]").forEach((link) => {
        const value = getContentValue(content, link.dataset.hrefContent, link.getAttribute("href") || "");
        if (!value) return;
        link.href = value;
        const isExternal = /^https?:\/\//i.test(value);
        if (isExternal) {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
        } else {
            link.removeAttribute("target");
            link.removeAttribute("rel");
        }
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
    const allKeyedImages = new Map((images || []).map((image) => [image.imageKey, image]));
    const keyedImages = new Map(
        (images || [])
            .filter((image) => image.published !== false)
            .map((image) => [image.imageKey, image])
    );

    document.querySelectorAll("[data-image]").forEach((imageElement) => {
        const imageKey = imageElement.dataset.image;
        const storedImage = allKeyedImages.get(imageKey);
        const hiddenByCms = storedImage && storedImage.published === false;
        const hideTarget = imageElement.closest("[data-image-block]") || imageElement;
        hideTarget.classList.toggle("is-hidden-by-cms", Boolean(hiddenByCms));
        if (hiddenByCms) {
            imageElement.removeAttribute("src");
            return;
        }
        const image = keyedImages.get(imageKey);
        if (!image?.imagePath) return;
        imageElement.src = image.imagePath;
        if (image.altText) {
            imageElement.alt = image.altText;
        }
    });

    const interestBackgroundRow = allKeyedImages.get("interest_background");
    const interestBackground = keyedImages.get("interest_background");
    const interestSection = document.querySelector(".interest");
    if (interestSection && interestBackgroundRow?.published === false) {
        interestSection.style.backgroundImage = "linear-gradient(90deg, rgba(69, 18, 22, 0.93), rgba(69, 18, 22, 0.78))";
    }
    if (interestSection && interestBackground?.imagePath) {
        interestSection.style.backgroundImage = `linear-gradient(90deg, rgba(69, 18, 22, 0.93), rgba(69, 18, 22, 0.78)), url("${interestBackground.imagePath}")`;
    }

    const allGalleryRows = (images || []).filter((image) => image.groupName === "identity_gallery");
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
    } else if (identityGallery && allGalleryRows.length) {
        identityGallery.innerHTML = "";
    }
};

const renderInterestOptions = (options) => {
    const interestSelect = document.getElementById("interestSelect");
    const publishedOptions = (options || []).filter((option) => option.published !== false && (option.optionType || "interest") === "interest");
    if (!interestSelect || !publishedOptions.length) return;
    interestSelect.innerHTML = publishedOptions.map((option) => `
        <option value="${escapeHtml(option.value || option.label)}">${escapeHtml(option.label)}</option>
    `).join("");
};

const loadSiteCms = async () => {
    try {
        const siteData = await window.MuheebData.getSiteContent();
        eventCategoryOptions = siteData.eventCategoryOptions || [];
        applyTextContent(siteData.content || {});
        applySiteImages(siteData.images || []);
        renderInterestOptions(siteData.interestOptions || []);
    } catch (error) {
        console.info("Using static site content fallback.");
    }
};

const renderProjectCards = (events) => {
    if (!projectGrid || !events.length) return;
    publishedEvents = events;
    projectGrid.innerHTML = events.map((event) => {
        const meta = getCategoryMeta(event.category);
        const highlights = Array.isArray(event.highlights) && event.highlights.length
            ? event.highlights
            : [event.location || "المدينة المنورة", event.eventDate || "تخطيط وتنفيذ", meta.label];
        return `
            <article class="project-card" data-status="${escapeHtml(event.category)}">
                <img src="${escapeHtml(event.coverImage || "assets/logo-meheib.png")}" alt="${escapeHtml(event.title)}">
                <div class="project-content">
                    <span class="status ${meta.statusClass}">${escapeHtml(meta.label || event.categoryLabel)}</span>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(event.description)}</p>
                    <ul>
                        ${highlights.slice(0, 3).map((highlight, index) => `
                            <li><i data-lucide="${index === 0 ? "map-pin" : index === 1 ? "calendar-check" : meta.icon}"></i> ${escapeHtml(highlight)}</li>
                        `).join("")}
                    </ul>
                    <a class="project-link" href="${escapeHtml(getEventPageUrl(event))}">عرض التفاصيل</a>
                </div>
            </article>
        `;
    }).join("");
    projectCards = document.querySelectorAll(".project-card");
};

const eventDateRange = (event) => {
    if (event.dateFrom && event.dateTo && event.dateFrom !== event.dateTo) {
        return `${event.dateFrom} إلى ${event.dateTo}`;
    }
    return event.dateFrom || event.eventDate || "حسب موعد الفعالية";
};

const eventTimeRange = (event) => {
    if (event.timeFrom && event.timeTo) return `${event.timeFrom} - ${event.timeTo}`;
    return event.timeFrom || event.timeTo || "";
};

const openEventDetail = (eventId) => {
    const event = publishedEvents.find((item) => String(item.id) === String(eventId));
    if (!event || !eventDetailModal || !eventDetailContent) return;
    const meta = getCategoryMeta(event.category);
    const gallery = event.gallery || [];
    const achievements = event.achievements?.length ? event.achievements : event.highlights || [];
    const detailSections = normalizeEventSections(event.detailSections || []);
    eventDetailContent.innerHTML = `
        <div class="event-detail-hero">
            <img src="${escapeHtml(event.coverImage || "assets/logo-meheib.png")}" alt="${escapeHtml(event.title)}">
            <div>
                <span class="status ${meta.statusClass}">${escapeHtml(meta.label || event.categoryLabel)}</span>
                <h2 id="eventDetailTitle">${escapeHtml(event.title)}</h2>
                <p>${escapeHtml(event.description || "")}</p>
                <div class="event-detail-meta">
                    <span><i data-lucide="map-pin"></i>${escapeHtml(event.venueName || event.location || "موقع الفعالية")}</span>
                    <span><i data-lucide="calendar-days"></i>${escapeHtml(eventDateRange(event))}</span>
                    ${eventTimeRange(event) ? `<span><i data-lucide="clock"></i>${escapeHtml(eventTimeRange(event))}</span>` : ""}
                    ${event.mapUrl ? `<a href="${escapeHtml(event.mapUrl)}" target="_blank" rel="noopener"><i data-lucide="map"></i>فتح الموقع</a>` : ""}
                </div>
            </div>
        </div>
        ${achievements.length ? `
            <section class="event-detail-section">
                <h3>الإنجازات المحققة</h3>
                <div class="detail-chip-grid">
                    ${achievements.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
                </div>
            </section>
        ` : ""}
        ${event.participants?.length ? `
            <section class="event-detail-section">
                <h3>المشاركون والجهات</h3>
                <div class="detail-chip-grid">
                    ${event.participants.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
                </div>
            </section>
        ` : ""}
        ${event.supportLogos?.length ? `
            <section class="event-detail-section">
                <h3>شعارات الجهات</h3>
                <div class="logo-strip">
                    ${event.supportLogos.map((entry, index) => {
                        const partner = normalizePartnerLogo(entry, index);
                        return partner.logo ? `<img src="${escapeHtml(partner.logo)}" alt="${escapeHtml(partner.name)}" title="${escapeHtml(partner.name)}">` : "";
                    }).join("")}
                </div>
            </section>
        ` : ""}
        ${detailSections.length ? `
            <section class="event-detail-section detail-sections">
                ${detailSections.map((section) => `
                    <article>
                        ${section.image ? `<img src="${escapeHtml(section.image)}" alt="${escapeHtml(section.title || event.title)}">` : ""}
                        <div>
                            <h3>${escapeHtml(section.title || "تفاصيل الفعالية")}</h3>
                            <p>${escapeHtml(section.text || "")}</p>
                        </div>
                    </article>
                `).join("")}
            </section>
        ` : ""}
        ${gallery.length ? `
            <section class="event-detail-section">
                <h3>معرض الصور</h3>
                <div class="event-gallery-grid">
                    ${gallery.map((image) => `<img src="${escapeHtml(image.imagePath)}" alt="${escapeHtml(image.altText || event.title)}">`).join("")}
                </div>
            </section>
        ` : ""}
        <a class="primary-action detail-cta" href="#interest">${escapeHtml(getContentValue(null, "form_submit_button", "إرسال طلب"))}<i data-lucide="send"></i></a>
    `;
    eventDetailModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    initIcons();
};

const closeEventDetailModal = () => {
    eventDetailModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
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

projectGrid?.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-event-detail]");
    if (!detailButton) return;
    openEventDetail(detailButton.dataset.eventDetail);
});

closeEventDetail?.addEventListener("click", closeEventDetailModal);
eventDetailModal?.addEventListener("click", (event) => {
    if (event.target === eventDetailModal) closeEventDetailModal();
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
            formNote.textContent = "تم إرسال طلبك بنجاح وسيتم التواصل معكم";
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
const floatingActions = document.querySelector(".floating-actions");
const siteFooter = document.getElementById("siteFooter");

const updateFloatingActions = () => {
    toTop?.classList.toggle("visible", window.scrollY > 500);
};

window.addEventListener("scroll", updateFloatingActions);

toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

if (floatingActions && siteFooter) {
    const footerObserver = new IntersectionObserver(
        ([entry]) => {
            updateFloatingActions();
            toTop?.classList.toggle("visible", entry.isIntersecting || window.scrollY > 500);
            floatingActions.classList.toggle("over-footer", entry.isIntersecting);
        },
        { threshold: 0.08 }
    );
    footerObserver.observe(siteFooter);
}

updateFloatingActions();

const bootSite = async () => {
    initIcons();
    renderProjectCards(staticEvents);
    await loadSiteCms();
    await loadPublishedEvents();
};

bootSite();
