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

const projectLocations = [
    {
        title: "مقر مهيب",
        status: "available",
        coords: [24.467197, 39.60858],
        image: "assets/identity-cards-clean.png",
        description: "المدينة المنورة، السعودية.",
    },
    {
        title: "نطاق الفعاليات",
        status: "soon",
        coords: [24.456096, 39.712948],
        image: "assets/identity-wall-clean.png",
        description: "تنظيم فعاليات ومعارض وتجارب حضور.",
    },
    {
        title: "نطاق الحملات",
        status: "sold",
        coords: [24.46469, 39.567518],
        image: "assets/brand-palette.jpg",
        description: "حملات تسويقية وتطبيقات بصرية.",
    },
    {
        title: "نطاق التشغيل",
        status: "sold",
        coords: [24.436738, 39.689044],
        image: "assets/identity-stamp-clean.png",
        description: "تشغيل، توثيق، واعتماد مخرجات التجربة.",
    },
];

const statusColors = {
    available: "#2d7b54",
    soon: "#c49b3a",
    sold: "#88827c",
};

const initMap = () => {
    const mapElement = document.getElementById("map");
    if (!mapElement || !window.L) return;

    const map = window.L.map(mapElement, {
        scrollWheelZoom: false,
        attributionControl: false,
    }).setView([24.4598, 39.6502], 12);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(map);

    projectLocations.forEach((project) => {
        const marker = window.L.divIcon({
            className: "meheib-marker",
            html: `<span style="background:${statusColors[project.status]}"></span>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });

        window.L.marker(project.coords, { icon: marker })
            .addTo(map)
            .bindPopup(`
                <div class="popup-card">
                    <img src="${project.image}" alt="">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                </div>
            `);
    });
};

const markerStyle = document.createElement("style");
markerStyle.textContent = `
    .meheib-marker span {
        width: 28px;
        height: 28px;
        display: block;
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 8px 20px rgba(40, 40, 40, 0.25);
    }
`;
document.head.appendChild(markerStyle);

initIcons();
initMap();
loadPublishedEvents();
