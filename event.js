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

let eventPageCategoryOptions = [];
let eventPageContent = {};

const getEventContentValue = (key, fallback = "") => {
    const value = eventPageContent?.[key];
    return value === undefined || value === null || value === "" ? fallback : value;
};

const getEventCategoryMeta = (category) => {
    const fallback = eventCategoryMeta[category] || { label: category || "فعالية", icon: "sparkles" };
    const option = eventPageCategoryOptions.find((item) => item.value === category || item.label === category);
    return {
        ...fallback,
        label: option?.label || fallback.label,
    };
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

const looksLikeImagePath = (value) => /^(https?:|data:|assets\/|uploads\/|event-images\/|storage\/)/i.test(String(value || ""));

const stringifyEventPageSectionValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    if (typeof value === "object") {
        return String(value.title || value.text || value.name || value.label || value.value || "").trim();
    }
    return String(value).trim();
};

const normalizeEventPageSections = (sections = []) => (Array.isArray(sections) ? sections : [])
    .map((section, index) => {
        if (typeof section === "string") {
            const [title = "", text = "", image = ""] = section.split("|").map((part) => part.trim());
            return { title, text, image };
        }
        const title = stringifyEventPageSectionValue(section.title || section.heading || section.name);
        const text = stringifyEventPageSectionValue(section.text || section.description || section.body || section.content);
        const image = stringifyEventPageSectionValue(section.image || section.imagePath || section.path || section.logo);
        return {
            title: title || (text || image ? `قسم ${index + 1}` : ""),
            text,
            image,
        };
    })
    .filter((section) => section.title || section.text || section.image);

const normalizePartner = (logo, index, participants) => {
    if (typeof logo === "object" && logo !== null) {
        return {
            logo: logo.image || logo.logo || logo.path || logo.imagePath || "",
            name: logo.name || logo.label || participants[index] || `جهة ${index + 1}`,
        };
    }
    const raw = String(logo || "").trim();
    if (raw.includes("|")) {
        const [first = "", second = ""] = raw.split("|").map((part) => part.trim());
        return looksLikeImagePath(first)
            ? { logo: first, name: second || participants[index] || `جهة ${index + 1}` }
            : { logo: second, name: first || participants[index] || `جهة ${index + 1}` };
    }
    return {
        logo: raw,
        name: participants[index] || `جهة ${index + 1}`,
    };
};

const buildPartners = (event) => {
    const participants = Array.isArray(event.participants) ? event.participants : [];
    const logos = Array.isArray(event.supportLogos) ? event.supportLogos : [];
    const count = Math.max(participants.length, logos.length);
    return Array.from({ length: count }, (_, index) => normalizePartner(logos[index] || "", index, participants))
        .filter((partner) => partner.logo || partner.name);
};

const renderEvent = (event) => {
    const meta = getEventCategoryMeta(event.category);
    const gallery = event.gallery?.length
        ? event.gallery
        : [{ imagePath: event.coverImage || "assets/logo-meheib.png", altText: event.title }];
    const highlights = Array.isArray(event.highlights) ? event.highlights : [];
    const achievements = Array.isArray(event.achievements) ? event.achievements : [];
    const partners = buildPartners(event);
    const eventDetailSections = normalizeEventPageSections(event.detailSections || []);
    const detailSections = eventDetailSections.length ? eventDetailSections : [
        {
            title: getEventContentValue("event_default_section_title", "تفاصيل التجربة"),
            text: event.description || "يمكن إضافة أقسام تفصيلية لهذه الفعالية من لوحة التحكم.",
            image: event.coverImage || "",
        },
    ];

    document.title = `${event.title} | مهيب`;
    document.getElementById("eventCoverImage").src = event.coverImage || "assets/logo-meheib.png";
    document.getElementById("eventCoverImage").alt = event.title;
    document.getElementById("eventCategory").textContent = event.categoryLabel || meta.label;
    document.getElementById("eventTitle").textContent = event.title;
    document.getElementById("eventTitle").dataset.titleSize = event.titleSize || "normal";
    document.getElementById("eventDescription").textContent = event.description || "";
    document.getElementById("eventMeta").innerHTML = renderEventMeta(event);
    document.getElementById("eventAboutTitle").textContent = event.title;
    document.getElementById("eventAboutText").textContent = event.description || "فعالية من أعمال مهيب.";
    document.getElementById("eventHighlights").innerHTML = highlights.length
        ? highlights.map((item, index) => `
            <article>
                <i data-lucide="${index === 0 ? "activity" : index === 1 ? "users" : meta.icon}"></i>
                <span>${eventEscapeHtml(item)}</span>
            </article>
        `).join("")
        : `<article><i data-lucide="sparkles"></i><span>يمكن إضافة نقاط مختصرة من لوحة التحكم.</span></article>`;

    document.getElementById("eventAchievements").innerHTML = achievements.length
        ? achievements.map((item, index) => `
            <article>
                <i data-lucide="${index === 0 ? "badge-check" : index === 1 ? "sparkles" : meta.icon}"></i>
                <span>${eventEscapeHtml(item)}</span>
            </article>
        `).join("")
        : `<article><i data-lucide="badge-check"></i><span>يمكن إضافة الإنجازات المحققة من لوحة التحكم.</span></article>`;

    document.getElementById("eventGalleryTrack").innerHTML = repeatForMarquee(gallery).map((image) => `
        <article class="slide">
            <img src="${eventEscapeHtml(image.imagePath)}" alt="${eventEscapeHtml(image.altText || event.title)}">
            <span>${eventEscapeHtml(image.altText || event.title)}</span>
        </article>
    `).join("");

    document.getElementById("eventPartnersTrack").innerHTML = partners.length
        ? `<div class="event-logo-track">${repeatForMarquee(partners).map((logo) => `
            <article class="event-partner-card">
                ${logo.logo ? `<img src="${eventEscapeHtml(logo.logo)}" alt="${eventEscapeHtml(logo.name)}">` : `<i data-lucide="building-2"></i>`}
                <strong>${eventEscapeHtml(logo.name)}</strong>
            </article>
        `).join("")}</div>`
        : `<div class="event-empty-panel">يمكن إضافة أسماء وشعارات الجهات المشاركة من لوحة التحكم.</div>`;

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
    document.getElementById("eventHighlights").innerHTML = "";
    document.getElementById("eventGalleryTrack").innerHTML = "";
    document.getElementById("eventPartnersTrack").innerHTML = "";
    document.getElementById("eventSectionList").innerHTML = "";
    if (window.lucide) window.lucide.createIcons();
};

const loadEventPage = async () => {
    const eventId = new URLSearchParams(window.location.search).get("id") || "static-event";
    let events = staticEventFallback;
    try {
        const [publishedEvents, siteData] = await Promise.all([
            window.MuheebData.listPublishedEvents(),
            window.MuheebData.getSiteContent().catch(() => ({})),
        ]);
        eventPageCategoryOptions = siteData.eventCategoryOptions || [];
        eventPageContent = siteData.content || {};
        if (Array.isArray(publishedEvents) && publishedEvents.length) {
            events = [...publishedEvents, ...staticEventFallback];
        }
    } catch (error) {
        events = staticEventFallback;
    }
    let event = events.find((item) => String(item.id) === String(eventId));
    if (!event && window.MuheebData?.getPublishedEvent) {
        try {
            event = await window.MuheebData.getPublishedEvent(eventId);
        } catch (error) {
            event = null;
        }
    }
    if (event) {
        renderEvent(event);
    } else {
        renderEventNotFound();
    }
};

loadEventPage();
