(function () {
    const config = window.MUHEEB_SUPABASE || {};
    const hasSupabaseConfig = Boolean(
        config.url &&
        config.anonKey
    );
    const storageBucket = config.storageBucket || "event-images";
    const supabaseScriptUrl = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
    let supabaseClient = null;
    let supabaseClientPromise = null;
    let supabaseLoadPromise = null;

    const loadSupabaseLibrary = () => {
        if (window.supabase && typeof window.supabase.createClient === "function") {
            return Promise.resolve(window.supabase);
        }
        if (supabaseLoadPromise) {
            return supabaseLoadPromise;
        }
        supabaseLoadPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = supabaseScriptUrl;
            script.async = true;
            script.onload = () => {
                if (window.supabase && typeof window.supabase.createClient === "function") {
                    resolve(window.supabase);
                } else {
                    reject(new Error("تعذر تهيئة مكتبة Supabase."));
                }
            };
            script.onerror = () => reject(new Error("تعذر تحميل مكتبة Supabase."));
            document.head.appendChild(script);
        });
        return supabaseLoadPromise;
    };

    const getSupabaseClient = async () => {
        if (!hasSupabaseConfig) {
            return null;
        }
        if (supabaseClient) {
            return supabaseClient;
        }
        if (!supabaseClientPromise) {
            supabaseClientPromise = loadSupabaseLibrary().then((supabaseGlobal) => {
                supabaseClient = supabaseGlobal.createClient(config.url, config.anonKey);
                return supabaseClient;
            });
        }
        return supabaseClientPromise;
    };

    const localJson = async (path, options = {}) => {
        const response = await fetch(path, {
            credentials: "same-origin",
            headers: {
                ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
                ...(options.headers || {}),
            },
            ...options,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || payload.ok === false) {
            throw new Error(payload.message || "حدث خطأ غير متوقع.");
        }
        return payload;
    };

    const supabaseError = (context, error) => {
        const parts = [
            context,
            error?.message,
            error?.details,
            error?.hint,
            error?.code ? `code: ${error.code}` : "",
        ].filter(Boolean);
        return new Error(parts.join(" - "));
    };

    const toCamelLead = (lead) => ({
        id: lead.id,
        name: lead.name,
        countryCode: lead.country_code || lead.countryCode || "",
        phone: lead.phone || "",
        service: lead.service || "",
        source: lead.source || "",
        message: lead.message || "",
        status: lead.status || "new",
        adminNotes: lead.admin_notes || lead.adminNotes || "",
        createdAt: lead.created_at || lead.createdAt,
        updatedAt: lead.updated_at || lead.updatedAt,
    });

    const toCamelAdminUser = (user) => ({
        id: user.user_id || user.id,
        userId: user.user_id || user.userId || user.id,
        fullName: user.full_name || user.fullName || user.email || "",
        phone: user.phone || "",
        email: user.email || "",
        role: user.role || "user",
        permissions: user.permissions || {},
        avatarUrl: user.avatar_url || user.avatarUrl || user.permissions?.avatarUrl || "",
        active: user.active !== false,
        createdAt: user.created_at || user.createdAt,
        updatedAt: user.updated_at || user.updatedAt,
    });

    const toCamelNotification = (notification) => ({
        id: notification.id,
        actorUserId: notification.actor_user_id || notification.actorUserId || "",
        targetUserId: notification.target_user_id || notification.targetUserId || "",
        leadId: notification.lead_id || notification.leadId || null,
        noteId: notification.note_id || notification.noteId || "",
        kind: notification.kind || "note_done",
        title: notification.title || "",
        message: notification.message || "",
        readBy: notification.read_by || notification.readBy || [],
        createdAt: notification.created_at || notification.createdAt,
    });

    const toCamelChatMessage = (message) => ({
        id: message.id,
        senderUserId: message.sender_user_id || message.senderUserId || "",
        recipientUserId: message.recipient_user_id || message.recipientUserId || "",
        body: message.body || "",
        attachment: message.attachment || {},
        readBy: message.read_by || message.readBy || [],
        createdAt: message.created_at || message.createdAt,
    });

    const toCamelLeadNote = (note) => ({
        id: note.id,
        leadId: note.lead_id || note.leadId,
        text: note.body || note.text || "",
        done: Boolean(note.done),
        createdBy: note.created_by || note.createdBy || "",
        assignedTo: note.assigned_to || note.assignedTo || "",
        createdAt: note.created_at || note.createdAt,
        doneAt: note.done_at || note.doneAt || "",
        updatedAt: note.updated_at || note.updatedAt,
    });

    const toCamelLeadNoteInquiry = (inquiry) => ({
        id: inquiry.id,
        leadId: inquiry.lead_id || inquiry.leadId,
        noteId: inquiry.note_id || inquiry.noteId || "",
        body: inquiry.body || "",
        createdBy: inquiry.created_by || inquiry.createdBy || "",
        createdAt: inquiry.created_at || inquiry.createdAt,
        replyBody: inquiry.reply_body || inquiry.replyBody || "",
        replyBy: inquiry.reply_by || inquiry.replyBy || "",
        replyAt: inquiry.reply_at || inquiry.replyAt || "",
    });

    const toCamelProfileRequest = (request) => ({
        id: request.id,
        userId: request.user_id || request.userId || "",
        requestedFullName: request.requested_full_name || request.requestedFullName || "",
        requestedPhone: request.requested_phone || request.requestedPhone || "",
        requestedEmail: request.requested_email || request.requestedEmail || "",
        status: request.status || "pending",
        reviewerId: request.reviewer_id || request.reviewerId || "",
        reviewerNote: request.reviewer_note || request.reviewerNote || "",
        createdAt: request.created_at || request.createdAt,
        reviewedAt: request.reviewed_at || request.reviewedAt || "",
    });

    const categoryLabels = {
        event: "فعاليات",
        marketing: "تسويق",
        identity: "هوية",
        operation: "تشغيل",
    };

    const getGallerySortRank = (image = {}) => {
        const value = Number(image.sort_order ?? image.sortOrder ?? 0);
        return Number.isFinite(value) && value > 0 ? value : Number.MAX_SAFE_INTEGER;
    };

    const normalizeGallery = (event) => {
        const gallery = event.event_images || event.gallery || [];
        return gallery
            .slice()
            .sort((a, b) => {
                const sortDiff = getGallerySortRank(a) - getGallerySortRank(b);
                if (sortDiff) return sortDiff;
                return Number(a.id || 0) - Number(b.id || 0);
            })
            .map((image) => ({
                id: image.id,
                imagePath: image.image_path || image.imagePath || "",
                altText: image.alt_text || image.altText || "",
                sortOrder: image.sort_order || image.sortOrder || 0,
            }));
    };

    const uniqueTextItems = (items = []) => {
        const seen = new Set();
        return (Array.isArray(items) ? items : [])
            .map((item) => String(item || "").trim())
            .filter((item) => {
                if (!item || seen.has(item)) return false;
                seen.add(item);
                return true;
            });
    };

    const stringifyClean = (value) => {
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
            const title = stringifyClean(section.title || section.heading || section.name);
            const text = stringifyClean(section.text || section.description || section.body || section.content);
            const image = stringifyClean(section.image || section.imagePath || section.path || section.logo);
            return {
                title: title || (text || image ? `قسم ${index + 1}` : ""),
                text,
                image,
            };
        })
        .filter((section) => section.title || section.text || section.image);

    const toCamelEvent = (event) => ({
        id: event.id,
        title: event.title,
        titleSize: event.title_size || event.titleSize || "normal",
        category: event.category,
        categoryLabel: categoryLabels[event.category] || event.category,
        location: event.location || "",
        venueName: event.venue_name || event.venueName || "",
        mapUrl: event.map_url || event.mapUrl || "",
        eventDate: event.event_date || event.eventDate || "",
        dateFrom: event.date_from || event.dateFrom || "",
        dateTo: event.date_to || event.dateTo || "",
        timeFrom: event.time_from || event.timeFrom || "",
        timeTo: event.time_to || event.timeTo || "",
        description: event.description || "",
        highlights: Array.isArray(event.highlights) ? event.highlights : [],
        participants: Array.isArray(event.participants) ? event.participants : [],
        achievements: Array.isArray(event.achievements) ? event.achievements : [],
        supportLogos: uniqueTextItems(event.support_logos || event.supportLogos || []),
        detailSections: normalizeEventSections(event.detail_sections || event.detailSections || []),
        coverImage: event.cover_image || event.coverImage || "",
        published: Boolean(event.published),
        sortOrder: event.sort_order || event.sortOrder || 0,
        createdAt: event.created_at || event.createdAt,
        updatedAt: event.updated_at || event.updatedAt,
        gallery: normalizeGallery(event),
    });

    const requireSupabase = async () => {
        const client = await getSupabaseClient();
        if (!client) {
            throw new Error("لم يتم ضبط Supabase بعد.");
        }
        return client;
    };

    const requireAdmin = async () => {
        const client = await requireSupabase();
        const { data: sessionData, error: sessionError } = await client.auth.getSession();
        if (sessionError) throw sessionError;
        const user = sessionData.session?.user;
        if (!user) throw new Error("تحتاج إلى تسجيل الدخول.");
        const { data, error } = await client.rpc("is_admin");
        if (error) throw error;
        if (!data) throw new Error("هذا الحساب ليس لديه صلاحية إدارة.");
        return user;
    };

    const createAuthUser = async ({ email, password, fullName, phone }) => {
        const supabaseGlobal = await loadSupabaseLibrary();
        const tempClient = supabaseGlobal.createClient(config.url, config.anonKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storageKey: `muheeb-user-create-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
            },
        });
        const { data, error } = await tempClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone,
                },
            },
        });
        await tempClient.auth.signOut().catch(() => null);
        if (error) throw error;
        if (!data.user?.id) throw new Error("تعذر إنشاء حساب المستخدم.");
        return data.user;
    };

    const countRows = async (table, buildQuery) => {
        const client = await requireSupabase();
        let query = client.from(table).select("*", { count: "exact", head: true });
        if (buildQuery) query = buildQuery(query);
        const { count, error } = await query;
        if (error) throw error;
        return count || 0;
    };

    const uploadSupabaseFiles = async (files, folder = "events") => {
        if (!files || files.length === 0) return [];
        await requireAdmin();
        const client = await requireSupabase();
        const uploaded = [];
        for (const file of Array.from(files)) {
            const extension = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
            const cleanExtension = extension || "jpg";
            const cleanFolder = String(folder || "events").replace(/[^a-z0-9_-]/gi, "") || "events";
            const path = `${cleanFolder}/${Date.now()}-${crypto.randomUUID()}.${cleanExtension}`;
            const { error } = await client.storage.from(storageBucket).upload(path, file, {
                cacheControl: "3600",
                upsert: false,
            });
            if (error) throw error;
            const { data } = client.storage.from(storageBucket).getPublicUrl(path);
            uploaded.push({
                path: data.publicUrl,
                name: file.name,
            });
        }
        return uploaded;
    };

    const toCamelContent = (row) => ({
        key: row.content_key || row.key,
        contentKey: row.content_key || row.contentKey || row.key,
        label: row.label || "",
        value: row.value || "",
        inputType: row.input_type || row.inputType || "text",
        groupName: row.group_name || row.groupName || "عام",
        sortOrder: row.sort_order || row.sortOrder || 0,
        updatedAt: row.updated_at || row.updatedAt,
    });

    const toCamelSiteImage = (row) => ({
        id: row.id,
        imageKey: row.image_key || row.imageKey || "",
        label: row.label || "",
        groupName: row.group_name || row.groupName || "صور الموقع",
        imagePath: row.image_path || row.imagePath || "",
        altText: row.alt_text || row.altText || "",
        published: row.published !== false,
        sortOrder: row.sort_order || row.sortOrder || 0,
        updatedAt: row.updated_at || row.updatedAt,
    });

    const toCamelInterestOption = (row) => ({
        id: row.id,
        label: row.label || "",
        value: row.value || row.label || "",
        optionType: row.option_type || row.optionType || "interest",
        published: row.published !== false,
        sortOrder: row.sort_order || row.sortOrder || 0,
        createdAt: row.created_at || row.createdAt,
        updatedAt: row.updated_at || row.updatedAt,
    });

    const defaultSiteImages = [
        { image_key: "hero_main", label: "صورة الهيرو الرئيسية", group_name: "site_core", image_path: "assets/identity-wall-hero.png", alt_text: "هوية مهيب في الواجهة الرئيسية", published: true, sort_order: 10 },
        { image_key: "hero_logo", label: "شعار الهيرو", group_name: "site_core", image_path: "assets/logo-meheib.png", alt_text: "شعار مهيب", published: true, sort_order: 11 },
        { image_key: "identity_gallery_1", label: "تطبيق الشعار", group_name: "identity_gallery", image_path: "assets/identity-wall-clean.png", alt_text: "تطبيق شعار مهيب على واجهة زجاجية", published: true, sort_order: 20 },
        { image_key: "identity_gallery_2", label: "بطاقات العمل", group_name: "identity_gallery", image_path: "assets/identity-cards-clean.png", alt_text: "بطاقات عمل مهيب", published: true, sort_order: 21 },
        { image_key: "identity_gallery_3", label: "الختم والتوثيق", group_name: "identity_gallery", image_path: "assets/identity-stamp-clean.png", alt_text: "ختم مهيب الرسمي", published: true, sort_order: 22 },
        { image_key: "identity_gallery_4", label: "ألوان الهوية", group_name: "identity_gallery", image_path: "assets/brand-palette.jpg", alt_text: "لوحة ألوان مهيب", published: true, sort_order: 23 },
        { image_key: "identity_gallery_5", label: "الشعار الأساسي", group_name: "identity_gallery", image_path: "assets/logo-meheib.png", alt_text: "شعار مهيب", published: true, sort_order: 24 },
        { image_key: "service_1_image", label: "صورة خدمة تنظيم الفعاليات", group_name: "services", image_path: "assets/identity-wall-clean.png", alt_text: "تنفيذ تجربة بصرية للفعالية", published: true, sort_order: 30 },
        { image_key: "service_2_image", label: "صورة خدمة الحملات التسويقية", group_name: "services", image_path: "assets/brand-palette.jpg", alt_text: "حملات تسويقية بهوية مهيب", published: true, sort_order: 31 },
        { image_key: "service_3_image", label: "صورة خدمة الهوية والتطبيقات", group_name: "services", image_path: "assets/identity-cards-clean.png", alt_text: "تطبيقات الهوية البصرية", published: true, sort_order: 32 },
        { image_key: "execution_image", label: "صورة رحلة التنفيذ", group_name: "site_core", image_path: "assets/identity-stamp-clean.png", alt_text: "توثيق واعتماد مخرجات مهيب", published: true, sort_order: 50 },
        { image_key: "interest_background", label: "خلفية نموذج الطلب", group_name: "site_core", image_path: "assets/brand-palette.jpg", alt_text: "لوحة ألوان مهيب", published: true, sort_order: 60 },
        { image_key: "footer_logo", label: "شعار الفوتر", group_name: "footer", image_path: "assets/logo-meheib.png", alt_text: "شعار مهيب", published: true, sort_order: 70 },
        { image_key: "admin_login_background", label: "خلفية شاشة دخول المشرف", group_name: "admin_login", image_path: "assets/brand-palette.jpg", alt_text: "خلفية لوحة التحكم", published: true, sort_order: 80 },
    ];

    const contentRowsToObject = (rows) =>
        Object.fromEntries((rows || []).map((row) => {
            const item = toCamelContent(row);
            return [item.contentKey, item];
        }));

    const dataApi = {
        isSupabaseEnabled() {
            return hasSupabaseConfig;
        },

        async getSiteContent() {
            const client = await getSupabaseClient();
            if (!client) {
                return { content: {}, contentRows: [], images: [], interestOptions: [] };
            }
            const [contentResult, imagesResult, optionsResult] = await Promise.all([
                client.from("site_content").select("*").order("sort_order", { ascending: true }),
                client.from("site_images").select("*").order("sort_order", { ascending: true }),
                client.from("interest_options").select("*").eq("published", true).order("sort_order", { ascending: true }),
            ]);
            if (contentResult.error) throw contentResult.error;
            if (imagesResult.error) throw imagesResult.error;
            if (optionsResult.error) throw optionsResult.error;
            const contentRows = (contentResult.data || []).map(toCamelContent);
            const dropdownOptions = (optionsResult.data || []).map(toCamelInterestOption);
            return {
                content: contentRowsToObject(contentResult.data || []),
                contentRows,
                images: (imagesResult.data || []).map(toCamelSiteImage),
                interestOptions: dropdownOptions.filter((option) => option.optionType === "interest"),
                eventCategoryOptions: dropdownOptions.filter((option) => option.optionType === "event_category"),
            };
        },

        async listPublishedEvents() {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson("/api/events", { headers: { Accept: "application/json" } });
                return payload.events || [];
            }
            const { data, error } = await client
                .from("events")
                .select("*, event_images(id, image_path, alt_text, sort_order)")
                .eq("published", true)
                .order("sort_order", { ascending: true })
                .order("id", { ascending: false });
            if (error) throw error;
            return (data || []).map(toCamelEvent);
        },

        async getPublishedEvent(eventId) {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson("/api/events", { headers: { Accept: "application/json" } });
                return (payload.events || []).find((event) => String(event.id) === String(eventId)) || null;
            }
            const { data, error } = await client
                .from("events")
                .select("*, event_images(id, image_path, alt_text, sort_order)")
                .eq("id", eventId)
                .eq("published", true)
                .maybeSingle();
            if (error) throw error;
            return data ? toCamelEvent(data) : null;
        },

        async createLead(lead) {
            const client = await getSupabaseClient();
            if (!client) {
                return localJson("/api/leads", {
                    method: "POST",
                    body: JSON.stringify(lead),
                });
            }
            const { data, error } = await client
                .from("leads")
                .insert({
                    name: lead.name,
                    country_code: lead.country || lead.countryCode || "",
                    phone: lead.phone,
                    service: lead.service || "استشارة عامة",
                    source: lead.source,
                    message: lead.message || "",
                })
                .select("id")
                .single();
            if (error) throw error;
            return { ok: true, leadId: data.id };
        },

        async signInAdmin(username, password) {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson("/api/admin/login", {
                    method: "POST",
                    body: JSON.stringify({ username, password }),
                });
                return payload.admin;
            }
            const { data, error } = await client.auth.signInWithPassword({
                email: username,
                password,
            });
            if (error) throw error;
            const isAdmin = await this.isCurrentUserAdmin();
            if (!isAdmin) {
                await client.auth.signOut();
                throw new Error("هذا الحساب ليس لديه صلاحية إدارة.");
            }
            return this.getCurrentAdmin();
        },

        async isCurrentUserAdmin() {
            const client = await getSupabaseClient();
            if (!client) return false;
            const { data, error } = await client.rpc("is_admin");
            if (error) throw error;
            return Boolean(data);
        },

        async getCurrentAdmin() {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson("/api/admin/me");
                return payload.admin;
            }
            const user = await requireAdmin();
            const { data, error } = await client
                .from("admin_users")
                .select("*")
                .eq("user_id", user.id)
                .single();
            if (error) throw error;
            return {
                ...toCamelAdminUser(data),
                username: data.full_name || data.email || user.email,
                authEmail: user.email,
            };
        },

        async logout() {
            const client = await getSupabaseClient();
            if (!client) {
                await localJson("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => null);
                return;
            }
            await client.auth.signOut();
        },

        async getStats() {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson("/api/admin/stats");
                return payload.stats || {};
            }
            await requireAdmin();
            const [leadTotal, leadNew, eventTotal, eventPublished] = await Promise.all([
                countRows("leads"),
                countRows("leads", (query) => query.eq("status", "new")),
                countRows("events"),
                countRows("events", (query) => query.eq("published", true)),
            ]);
            return { leadTotal, leadNew, eventTotal, eventPublished };
        },

        async listAdminUsers() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("admin_users")
                .select("*")
                .order("role", { ascending: true })
                .order("full_name", { ascending: true });
            if (error) throw error;
            return (data || []).map(toCamelAdminUser);
        },

        async saveAdminUser(payload, userId) {
            const client = await requireSupabase();
            const currentUser = await requireAdmin();
            const permissions = payload.permissions || {};
            const email = String(payload.email || "").trim().toLowerCase();
            const row = {
                full_name: String(payload.fullName || "").trim(),
                phone: String(payload.phone || "").trim(),
                role: payload.role || "user",
                permissions,
                active: payload.active !== false,
                updated_at: new Date().toISOString(),
            };
            if (!row.full_name) throw new Error("اسم المستخدم مطلوب.");
            if (userId) {
                const { data: existingUser, error: existingError } = await client
                    .from("admin_users")
                    .select("*")
                    .eq("user_id", userId)
                    .maybeSingle();
                if (existingError) throw existingError;
                const updateRow = {
                    ...row,
                    role: payload.role || existingUser?.role || "user",
                };
                if (email) {
                    updateRow.email = email;
                } else if (!existingUser?.email && userId === currentUser.id && currentUser.email) {
                    updateRow.email = currentUser.email;
                }
                const { data, error } = await client
                    .from("admin_users")
                    .update(updateRow)
                    .eq("user_id", userId)
                    .select("*")
                    .single();
                if (error?.code === "23503" && /admin_users_user_id_fkey/i.test(error.message || "")) {
                    throw new Error("لا يمكن حفظ هذا المستخدم لأن حساب الدخول غير موجود في Supabase Auth. افتح المستخدم الصحيح من قائمة الفريق أو أنشئه من زر إضافة مستخدم.");
                }
                if (error) throw error;
                return toCamelAdminUser(data);
            }
            if (!email) throw new Error("إيميل المستخدم مطلوب عند إضافة مستخدم جديد.");
            if (!payload.password || String(payload.password).length < 8) {
                throw new Error("كلمة السر مطلوبة ولا تقل عن 8 أحرف للمستخدم الجديد.");
            }
            const authUser = await createAuthUser({
                email,
                password: payload.password,
                fullName: row.full_name,
                phone: row.phone,
            });
            const { data, error } = await client
                .from("admin_users")
                .insert({
                    user_id: authUser.id,
                    ...row,
                    email,
                })
                .select("*")
                .single();
            if (error?.code === "23503" && /admin_users_user_id_fkey/i.test(error.message || "")) {
                throw new Error("تم رفض حفظ المستخدم لأن حساب الدخول لم يكتمل إنشاؤه في Supabase Auth. جرّب إضافة المستخدم مرة أخرى بإيميل مختلف أو تأكد من وجوده في Authentication.");
            }
            if (error) throw error;
            return toCamelAdminUser(data);
        },

        async deleteAdminUser(userId) {
            const client = await requireSupabase();
            await requireAdmin();
            const { error } = await client
                .from("admin_users")
                .delete()
                .eq("user_id", userId);
            if (error) throw error;
        },

        async listLeads() {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson("/api/admin/leads");
                return payload.leads || [];
            }
            await requireAdmin();
            const { data, error } = await client
                .from("leads")
                .select("*")
                .order("id", { ascending: false })
                .limit(300);
            if (error) throw error;
            return (data || []).map(toCamelLead);
        },

        async listLeadNotes() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("lead_notes")
                .select("*")
                .order("created_at", { ascending: true });
            if (error) throw error;
            return (data || []).map(toCamelLeadNote);
        },

        async listLeadNoteInquiries() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("lead_note_inquiries")
                .select("*")
                .order("created_at", { ascending: true });
            if (error) throw error;
            return (data || []).map(toCamelLeadNoteInquiry);
        },

        async createLeadNote(payload) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data, error } = await client
                .from("lead_notes")
                .insert({
                    lead_id: payload.leadId,
                    body: payload.text,
                    created_by: user.id,
                    assigned_to: payload.assignedTo || user.id,
                })
                .select("*")
                .single();
            if (error) throw error;
            return toCamelLeadNote(data);
        },

        async completeLeadNote(noteId) {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("lead_notes")
                .update({
                    done: true,
                    done_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", noteId)
                .select("*")
                .single();
            if (error) throw error;
            return toCamelLeadNote(data);
        },

        async createLeadNoteInquiry(payload) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data, error } = await client
                .from("lead_note_inquiries")
                .insert({
                    lead_id: payload.leadId,
                    note_id: payload.noteId,
                    body: payload.body,
                    created_by: user.id,
                })
                .select("*")
                .single();
            if (error) throw error;
            return toCamelLeadNoteInquiry(data);
        },

        async replyLeadNoteInquiry(inquiryId, body) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data, error } = await client
                .from("lead_note_inquiries")
                .update({
                    reply_body: String(body || "").trim(),
                    reply_by: user.id,
                    reply_at: new Date().toISOString(),
                })
                .eq("id", inquiryId)
                .select("*")
                .single();
            if (error) throw error;
            return toCamelLeadNoteInquiry(data);
        },

        async updateLead(leadId, values) {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson(`/api/admin/leads/${leadId}`, {
                    method: "PATCH",
                    body: JSON.stringify(values),
                });
                return payload.lead;
            }
            await requireAdmin();
            const { data, error } = await client
                .from("leads")
                .update({
                    status: values.status,
                    admin_notes: values.adminNotes || "",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", leadId)
                .select("*")
                .single();
            if (error) throw error;
            return toCamelLead(data);
        },

        async deleteLead(leadId) {
            const client = await getSupabaseClient();
            if (!client) {
                await localJson(`/api/admin/leads/${leadId}`, { method: "DELETE" });
                return;
            }
            await requireAdmin();
            const { error } = await client.from("leads").delete().eq("id", leadId);
            if (error) throw error;
        },

        async listNotifications() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("admin_notifications")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(30);
            if (error) throw error;
            return (data || []).map(toCamelNotification);
        },

        async markNotificationRead(notificationId) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data: current, error: readError } = await client
                .from("admin_notifications")
                .select("read_by")
                .eq("id", notificationId)
                .single();
            if (readError) throw readError;
            const readBy = Array.from(new Set([...(current?.read_by || []), user.id]));
            const { data, error } = await client
                .from("admin_notifications")
                .update({ read_by: readBy })
                .eq("id", notificationId)
                .select("*")
                .single();
            if (error) throw error;
            return toCamelNotification(data);
        },

        async createNotification(payload) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const row = {
                actor_user_id: user.id,
                target_user_id: payload.targetUserId || null,
                lead_id: payload.leadId || null,
                note_id: payload.noteId || null,
                kind: payload.kind || "note_done",
                title: payload.title,
                message: payload.message,
            };
            const { data: rpcData, error: rpcError } = await client.rpc("create_admin_notification", {
                p_target_user_id: row.target_user_id,
                p_lead_id: row.lead_id,
                p_note_id: row.note_id,
                p_kind: row.kind,
                p_title: row.title,
                p_message: row.message,
            });
            if (!rpcError) return toCamelNotification(Array.isArray(rpcData) ? rpcData[0] : rpcData);
            const missingRpc = rpcError.code === "PGRST202" || /create_admin_notification/i.test(rpcError.message || "");
            if (!missingRpc) throw supabaseError("تعذر إنشاء الإشعار عبر دالة Supabase", rpcError);

            const { data, error } = await client
                .from("admin_notifications")
                .insert(row)
                .select("*")
                .single();
            if (error) throw supabaseError("تعذر إنشاء الإشعار في جدول admin_notifications", error);
            return toCamelNotification(data);
        },

        async listProfileChangeRequests() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("profile_change_requests")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);
            if (error) throw error;
            return (data || []).map(toCamelProfileRequest);
        },

        async createProfileChangeRequest(payload) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data, error } = await client
                .from("profile_change_requests")
                .insert({
                    user_id: user.id,
                    requested_full_name: String(payload.fullName || "").trim(),
                    requested_phone: String(payload.phone || "").trim(),
                    requested_email: String(payload.email || "").trim().toLowerCase(),
                })
                .select("*")
                .single();
            if (error) throw error;
            return toCamelProfileRequest(data);
        },

        async reviewProfileChangeRequest(requestId, payload) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const status = payload.status || "approved";
            const { data: requestRow, error: requestError } = await client
                .from("profile_change_requests")
                .select("*")
                .eq("id", requestId)
                .single();
            if (requestError) throw requestError;
            if (status === "approved") {
                const { error: userError } = await client
                    .from("admin_users")
                    .update({
                        full_name: String(payload.fullName || requestRow.requested_full_name || "").trim(),
                        phone: String(payload.phone || requestRow.requested_phone || "").trim(),
                        email: String(payload.email || requestRow.requested_email || "").trim().toLowerCase(),
                        updated_at: new Date().toISOString(),
                    })
                    .eq("user_id", requestRow.user_id);
                if (userError) throw userError;
            }
            const { data, error } = await client
                .from("profile_change_requests")
                .update({
                    status,
                    reviewer_id: user.id,
                    reviewer_note: payload.note || "",
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", requestId)
                .select("*")
                .single();
            if (error) throw error;
            return toCamelProfileRequest(data);
        },

        async listAdminEvents() {
            const client = await getSupabaseClient();
            if (!client) {
                const payload = await localJson("/api/admin/events");
                return payload.events || [];
            }
            await requireAdmin();
            const { data, error } = await client
                .from("events")
                .select("*, event_images(id, image_path, alt_text, sort_order)")
                .order("sort_order", { ascending: true })
                .order("id", { ascending: false });
            if (error) throw error;
            return (data || []).map(toCamelEvent);
        },

        async uploadFiles(files, folder = "events") {
            const client = await getSupabaseClient();
            if (!client) {
                if (!files || files.length === 0) return [];
                const formData = new FormData();
                Array.from(files).forEach((file) => formData.append("files", file));
                const payload = await localJson("/api/admin/uploads", {
                    method: "POST",
                    body: formData,
                });
                return payload.files || [];
            }
            return uploadSupabaseFiles(files, folder);
        },

        async listChatMessages(peerUserId) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data, error } = await client
                .from("admin_chat_messages")
                .select("*")
                .or(`and(sender_user_id.eq.${user.id},recipient_user_id.eq.${peerUserId}),and(sender_user_id.eq.${peerUserId},recipient_user_id.eq.${user.id})`)
                .order("created_at", { ascending: true })
                .limit(250);
            if (error) throw error;
            return (data || []).map(toCamelChatMessage);
        },

        async listUnreadChatMessages() {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data, error } = await client
                .from("admin_chat_messages")
                .select("*")
                .eq("recipient_user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(250);
            if (error) throw error;
            return (data || [])
                .map(toCamelChatMessage)
                .filter((message) => !(message.readBy || []).includes(user.id));
        },

        async markChatMessagesRead(peerUserId) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { data, error } = await client
                .from("admin_chat_messages")
                .select("id, read_by")
                .eq("sender_user_id", peerUserId)
                .eq("recipient_user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(250);
            if (error) throw error;
            const unreadRows = (data || []).filter((row) => !(row.read_by || []).includes(user.id));
            const results = await Promise.all(unreadRows.map((row) => client
                .from("admin_chat_messages")
                .update({ read_by: Array.from(new Set([...(row.read_by || []), user.id])) })
                .eq("id", row.id)
            ));
            const updateError = results.find((result) => result.error)?.error;
            if (updateError) throw updateError;
            return unreadRows.length;
        },

        async deleteChatMessages(peerUserId) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const { error } = await client
                .from("admin_chat_messages")
                .delete()
                .or(`and(sender_user_id.eq.${user.id},recipient_user_id.eq.${peerUserId}),and(sender_user_id.eq.${peerUserId},recipient_user_id.eq.${user.id})`);
            if (error) throw error;
            return true;
        },

        async sendChatMessage(payload) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const row = {
                sender_user_id: user.id,
                recipient_user_id: payload.recipientUserId,
                body: String(payload.body || "").trim(),
                attachment: payload.attachment || {},
            };
            const { data, error } = await client
                .from("admin_chat_messages")
                .insert(row)
                .select("*")
                .single();
            if (error) throw error;
            return toCamelChatMessage(data);
        },

        async subscribeChatMessages(peerUserId, onMessage) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const channel = client
                .channel(`muheeb-chat-${user.id}-${peerUserId}`)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "admin_chat_messages" },
                    ({ new: message }) => {
                        const isCurrentConversation = (
                            (message.sender_user_id === user.id && message.recipient_user_id === peerUserId) ||
                            (message.sender_user_id === peerUserId && message.recipient_user_id === user.id)
                        );
                        if (isCurrentConversation) onMessage?.(toCamelChatMessage(message));
                    }
                )
                .subscribe();
            return channel;
        },

        async subscribeIncomingChatMessages(onMessage) {
            const client = await requireSupabase();
            const user = await requireAdmin();
            const channel = client
                .channel(`muheeb-chat-incoming-${user.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "admin_chat_messages",
                        filter: `recipient_user_id=eq.${user.id}`,
                    },
                    ({ new: message }) => onMessage?.(toCamelChatMessage(message))
                )
                .subscribe();
            return channel;
        },

        async unsubscribeChatMessages(channel) {
            const client = await getSupabaseClient();
            if (client && channel) {
                await client.removeChannel(channel);
            }
        },

        async addEventGalleryImages(eventId, payload = {}) {
            const client = await requireSupabase();
            await requireAdmin();
            const galleryImages = payload.galleryImages || [];
            if (!galleryImages.length) return [];
            const { data: lastImageRows, error: lastImageError } = await client
                .from("event_images")
                .select("sort_order")
                .eq("event_id", eventId)
                .order("sort_order", { ascending: false })
                .order("id", { ascending: false })
                .limit(1);
            if (lastImageError) throw lastImageError;
            const startOrder = Number(lastImageRows?.[0]?.sort_order || 0);
            const rows = galleryImages.map((path, index) => ({
                event_id: eventId,
                image_path: path,
                alt_text: payload.galleryCaptionAltText || "",
                sort_order: startOrder + index + 1,
            }));
            const { data, error } = await client
                .from("event_images")
                .insert(rows)
                .select("id, image_path, alt_text, sort_order");
            if (error) throw error;
            return (data || []).map((image) => ({
                id: image.id,
                imagePath: image.image_path || "",
                altText: image.alt_text || "",
                sortOrder: image.sort_order || 0,
            }));
        },

        async saveEvent(payload, eventId) {
            const client = await getSupabaseClient();
            if (!client) {
                const localPayload = await localJson(eventId ? `/api/admin/events/${eventId}` : "/api/admin/events", {
                    method: eventId ? "PUT" : "POST",
                    body: JSON.stringify(payload),
                });
                return localPayload.event;
            }
            await requireAdmin();
            const row = {
                title: payload.title,
                title_size: payload.titleSize || "normal",
                category: payload.category,
                location: payload.location || "",
                venue_name: payload.venueName || "",
                map_url: payload.mapUrl || "",
                event_date: payload.eventDate || "",
                date_from: payload.dateFrom || null,
                date_to: payload.dateTo || null,
                time_from: payload.timeFrom || "",
                time_to: payload.timeTo || "",
                description: payload.description,
                highlights: payload.highlights || [],
                participants: payload.participants || [],
                achievements: payload.achievements || [],
                support_logos: uniqueTextItems(payload.supportLogos || []),
                detail_sections: normalizeEventSections(payload.detailSections || []),
                cover_image: payload.coverImage || "",
                published: Boolean(payload.published),
                sort_order: Number(payload.sortOrder || 0),
                updated_at: new Date().toISOString(),
            };
            const persistEvent = async (eventRow) => {
                if (eventId) {
                    return client
                        .from("events")
                        .update(eventRow)
                        .eq("id", eventId)
                        .select("*")
                        .single();
                }
                return client
                    .from("events")
                    .insert(eventRow)
                    .select("*")
                    .single();
            };
            let { data: savedEvent, error: saveError } = await persistEvent(row);
            if (saveError?.code === "42703" && /title_size/i.test(saveError.message || "")) {
                const rowWithoutTitleSize = { ...row };
                delete rowWithoutTitleSize.title_size;
                const retry = await persistEvent(rowWithoutTitleSize);
                savedEvent = retry.data;
                saveError = retry.error;
            }
            if (saveError) throw saveError;
            if (payload.galleryImages?.length) {
                const { data: lastImageRows, error: lastImageError } = await client
                    .from("event_images")
                    .select("sort_order")
                    .eq("event_id", savedEvent.id)
                    .order("sort_order", { ascending: false })
                    .order("id", { ascending: false })
                    .limit(1);
                if (lastImageError) throw lastImageError;
                const startOrder = Number(lastImageRows?.[0]?.sort_order || 0);
                const galleryRows = payload.galleryImages.map((path, index) => ({
                    event_id: savedEvent.id,
                    image_path: path,
                    alt_text: payload.galleryCaptionAltText ?? payload.title,
                    sort_order: startOrder + index + 1,
                }));
                const { error } = await client.from("event_images").insert(galleryRows);
                if (error) throw error;
            }
            const { data: savedImages, error: imageReadError } = await client
                .from("event_images")
                .select("id, image_path, sort_order")
                .eq("event_id", savedEvent.id)
                .order("sort_order", { ascending: true })
                .order("id", { ascending: true });
            if (imageReadError) throw imageReadError;
            const seenImagePaths = new Set();
            const duplicateImageIds = [];
            (savedImages || []).forEach((image) => {
                const path = String(image.image_path || "").trim();
                if (!path) return;
                if (seenImagePaths.has(path)) {
                    duplicateImageIds.push(image.id);
                    return;
                }
                seenImagePaths.add(path);
            });
            if (duplicateImageIds.length) {
                const { error: imageDeleteError } = await client
                    .from("event_images")
                    .delete()
                    .in("id", duplicateImageIds);
                if (imageDeleteError) throw imageDeleteError;
            }
            return toCamelEvent(savedEvent);
        },

        async deleteEvent(eventId) {
            const client = await getSupabaseClient();
            if (!client) {
                await localJson(`/api/admin/events/${eventId}`, { method: "DELETE" });
                return;
            }
            await requireAdmin();
            const { error } = await client.from("events").delete().eq("id", eventId);
            if (error) throw error;
        },

        async deleteEventImage(imageId) {
            const client = await getSupabaseClient();
            if (!client) {
                await localJson(`/api/admin/event-images/${imageId}`, { method: "DELETE" });
                return;
            }
            await requireAdmin();
            const { error } = await client.from("event_images").delete().eq("id", imageId);
            if (error) throw error;
        },

        async updateEventImage(imageId, payload = {}) {
            const client = await getSupabaseClient();
            if (!client) {
                await localJson(`/api/admin/event-images/${imageId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
                return null;
            }
            await requireAdmin();
            const row = {};
            if ("altText" in payload) row.alt_text = String(payload.altText || "").trim();
            if ("sortOrder" in payload) row.sort_order = Number(payload.sortOrder || 0);
            if (!Object.keys(row).length) return null;
            const { data, error } = await client
                .from("event_images")
                .update(row)
                .eq("id", imageId)
                .select("id, image_path, alt_text, sort_order")
                .single();
            if (error) throw error;
            return data ? {
                id: data.id,
                imagePath: data.image_path || "",
                altText: data.alt_text || "",
                sortOrder: data.sort_order || 0,
            } : null;
        },

        async listSiteContent() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("site_content")
                .select("*")
                .order("group_name", { ascending: true })
                .order("sort_order", { ascending: true });
            if (error) throw error;
            return (data || []).map(toCamelContent);
        },

        async saveSiteContent(rows) {
            const client = await requireSupabase();
            await requireAdmin();
            const payload = (rows || []).map((row) => ({
                content_key: row.contentKey || row.key,
                label: row.label || row.contentKey || row.key,
                value: String(row.value ?? ""),
                input_type: row.inputType || "text",
                group_name: row.groupName || "عام",
                sort_order: Number(row.sortOrder || 0),
                updated_at: new Date().toISOString(),
            })).filter((row) => row.content_key);
            if (!payload.length) return [];
            const { data, error } = await client
                .from("site_content")
                .upsert(payload, { onConflict: "content_key" })
                .select("*");
            if (error) throw error;
            return (data || []).map(toCamelContent);
        },

        async listSiteImages() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("site_images")
                .select("*")
                .order("sort_order", { ascending: true })
                .order("id", { ascending: true });
            if (error) throw error;
            return (data || []).map(toCamelSiteImage);
        },

        async saveSiteImage(payload, imageId) {
            const client = await requireSupabase();
            await requireAdmin();
            const row = {
                image_key: String(payload.imageKey || "").trim(),
                label: String(payload.label || "").trim(),
                group_name: String(payload.groupName || "صور الموقع").trim(),
                image_path: String(payload.imagePath || "").trim(),
                alt_text: String(payload.altText || "").trim(),
                published: Boolean(payload.published),
                sort_order: Number(payload.sortOrder || 0),
                updated_at: new Date().toISOString(),
            };
            if (!row.image_key) throw new Error("مفتاح الصورة مطلوب.");
            if (!row.label) throw new Error("اسم الصورة مطلوب.");
            if (!row.image_path) throw new Error("اختر صورة أولًا.");
            const query = imageId
                ? client.from("site_images").update(row).eq("id", imageId)
                : client.from("site_images").insert(row);
            const { data, error } = await query.select("*").single();
            if (error) throw error;
            return toCamelSiteImage(data);
        },

        async deleteSiteImage(imageId) {
            const client = await requireSupabase();
            await requireAdmin();
            const { error } = await client
                .from("site_images")
                .update({
                    published: false,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", imageId);
            if (error) throw error;
        },

        async restoreDefaultSiteImages() {
            const client = await requireSupabase();
            await requireAdmin();
            const rows = defaultSiteImages.map((image) => ({
                ...image,
                updated_at: new Date().toISOString(),
            }));
            const { data, error } = await client
                .from("site_images")
                .upsert(rows, { onConflict: "image_key" })
                .select("*");
            if (error) throw error;
            return (data || []).map(toCamelSiteImage);
        },

        async listInterestOptions() {
            const client = await requireSupabase();
            await requireAdmin();
            const { data, error } = await client
                .from("interest_options")
                .select("*")
                .order("sort_order", { ascending: true })
                .order("id", { ascending: true });
            if (error) throw error;
            return (data || []).map(toCamelInterestOption);
        },

        async saveInterestOption(payload, optionId) {
            const client = await requireSupabase();
            await requireAdmin();
            const label = String(payload.label || "").trim();
            if (!label) throw new Error("اكتب اسم الاختيار.");
            const row = {
                label,
                value: String(payload.value || label).trim(),
                option_type: payload.optionType || payload.option_type || "interest",
                published: Boolean(payload.published),
                sort_order: Number(payload.sortOrder || 0),
                updated_at: new Date().toISOString(),
            };
            const query = optionId
                ? client.from("interest_options").update(row).eq("id", optionId)
                : client.from("interest_options").insert(row);
            const { data, error } = await query.select("*").single();
            if (error) throw error;
            return toCamelInterestOption(data);
        },

        async deleteInterestOption(optionId) {
            const client = await requireSupabase();
            await requireAdmin();
            const { error } = await client.from("interest_options").delete().eq("id", optionId);
            if (error) throw error;
        },

        async changePassword(currentPassword, newPassword) {
            const client = await getSupabaseClient();
            if (!client) {
                return localJson("/api/admin/change-password", {
                    method: "POST",
                    body: JSON.stringify({ currentPassword, newPassword }),
                });
            }
            const user = await requireAdmin();
            const { error: verifyError } = await client.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });
            if (verifyError) throw new Error("كلمة المرور الحالية غير صحيحة.");
            const { error } = await client.auth.updateUser({ password: newPassword });
            if (error) throw error;
            return { ok: true };
        },
    };

    window.MuheebData = dataApi;
})();
