const eventEscapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[char]));

const eventCategoryMeta = {
    event: { label: "فعاليات", icon: "sparkles" },
    marketing: { label: "تسويق", icon: "target" },
    identity: { label: "هوية", icon: "palette" },
    operation: { label: "تشغيل", icon: "clipboard-check" },
};

const staticEventFallback = window.MuheebStaticEvents || [
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
];

const pageEventDateRange = (event) => {
    if (event.dateFrom && event.dateTo && event.dateFrom !== event.dateTo) {
        return `${event.dateFrom} إلى ${event.dateTo}`;
    }
    return event.dateFrom || event.eventDate || "حسب موعد الفعالية";
};

const pageEventTimeRange = (event) => {
    if (event.timeFrom && event.timeTo) return `${event.timeFrom} - ${event.timeTo}`;
    return event.timeFrom || event.timeTo || "";
};

const renderEventMeta = (event) => {
    const items = [
        { icon: "map-pin", label: event.venueName || event.location || "موقع الفعالية" },
        { icon: "calendar-days", label: pageEventDateRange(event) },
        pageEventTimeRange(event) ? { icon: "clock", label: pageEventTimeRange(event) } : null,
    ].filter(Boolean);
    const mapLink = event.mapUrl ? `
        <a href="${eventEscapeHtml(event.mapUrl)}" target="_blank" rel="noopener">
            <i data-lucide="map"></i>
            <span>فتح الموقع</span>
        </a>
    ` : "";
    return [
        ...items.map((item) => `
            <span>
                <i data-lucide="${eventEscapeHtml(item.icon)}"></i>
                <b>${eventEscapeHtml(item.label)}</b>
            </span>
        `),
        mapLink,
    ].join("");
};

const repeatForMarquee = (items) => {
    if (!items.length) return [];
    return items.length < 6 ? [...items, ...items, ...items] : [...items, ...items];
};

const renderEvent = (event) => {
    const meta = eventCategoryMeta[event.category] || eventCategoryMeta.event;
    const gallery = event.gallery?.length
        ? event.gallery
        : [{ imagePath: event.coverImage || "assets/logo-meheib.png", altText: event.title }];
    const achievements = event.achievements?.length ? event.achievements : event.highlights || [];
    const partners = event.supportLogos?.length ? event.supportLogos : [];
    const detailSections = event.detailSections?.length ? event.detailSections : [
        {
            title: "تفاصيل التجربة",
            text: event.description || "يمكن إضافة أقسام تفصيلية لهذه الفعالية من لوحة التحكم.",
            image: event.coverImage || "",
        },
    ];

    document.title = `${event.title} | مهيب`;
    document.getElementById("eventCoverImage").src = event.coverImage || "assets/logo-meheib.png";
    document.getElementById("eventCoverImage").alt = event.title;
    document.getElementById("eventCategory").textContent = event.categoryLabel || meta.label;
    document.getElementById("eventTitle").textContent = event.title;
    document.getElementById("eventDescription").textContent = event.description || "";
    document.getElementById("eventMeta").innerHTML = renderEventMeta(event);
    document.getElementById("eventAboutTitle").textContent = event.title;
    document.getElementById("eventAboutText").textContent = event.description || "فعالية من أعمال مهيب.";

    document.getElementById("eventAchievements").innerHTML = achievements.length
        ? achievements.map((item, index) => `
            <article>
                <i data-lucide="${index === 0 ? "badge-check" : index === 1 ? "sparkles" : meta.icon}"></i>
                <span>${eventEscapeHtml(item)}</span>
            </article>
        `).join("")
        : `<article><i data-lucide="sparkles"></i><span>تجربة مصممة بعناية</span></article>`;

    document.getElementById("eventGalleryTrack").innerHTML = repeatForMarquee(gallery).map((image) => `
        <article class="slide">
            <img src="${eventEscapeHtml(image.imagePath)}" alt="${eventEscapeHtml(image.altText || event.title)}">
            <span>${eventEscapeHtml(image.altText || event.title)}</span>
        </article>
    `).join("");

    document.getElementById("eventPartnersTrack").innerHTML = partners.length
        ? `<div class="event-logo-track">${repeatForMarquee(partners).map((logo) => `
            <span><img src="${eventEscapeHtml(logo)}" alt="شعار جهة مشاركة"></span>
        `).join("")}</div>`
        : `<div class="event-empty-panel">يمكن إضافة شعارات الجهات الداعمة أو المنفذة من لوحة التحكم.</div>`;

    document.getElementById("eventSectionList").innerHTML = detailSections.map((section) => `
        <article class="event-info-card">
            ${section.image ? `<img src="${eventEscapeHtml(section.image)}" alt="${eventEscapeHtml(section.title || event.title)}">` : ""}
            <div>
                <h3>${eventEscapeHtml(section.title || "تفاصيل الفعالية")}</h3>
                <p>${eventEscapeHtml(section.text || "")}</p>
            </div>
        </article>
    `).join("");

    if (window.lucide) window.lucide.createIcons();
};

const renderEventNotFound = () => {
    document.getElementById("eventTitle").textContent = "الفعالية غير موجودة";
    document.getElementById("eventDescription").textContent = "ربما تم حذف الفعالية أو إخفاؤها من لوحة التحكم.";
    document.getElementById("eventMeta").innerHTML = `
        <a href="index.html#projects">
            <i data-lucide="arrow-right"></i>
            <span>العودة إلى الأعمال</span>
        </a>
    `;
    document.getElementById("eventAchievements").innerHTML = "";
    document.getElementById("eventGalleryTrack").innerHTML = "";
    document.getElementById("eventPartnersTrack").innerHTML = "";
    document.getElementById("eventSectionList").innerHTML = "";
    if (window.lucide) window.lucide.createIcons();
};

const loadEventPage = async () => {
    const eventId = new URLSearchParams(window.location.search).get("id") || "static-event";
    let events = staticEventFallback;
    try {
        const publishedEvents = await window.MuheebData.listPublishedEvents();
        if (Array.isArray(publishedEvents) && publishedEvents.length) {
            events = [...publishedEvents, ...staticEventFallback];
        }
    } catch (error) {
        events = staticEventFallback;
    }
    const event = events.find((item) => String(item.id) === String(eventId));
    if (event) {
        renderEvent(event);
    } else {
        renderEventNotFound();
    }
};

loadEventPage();
