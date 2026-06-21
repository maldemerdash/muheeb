(function () {
    const config = window.MUHEEB_SUPABASE || {};
    const hasSupabaseConfig = Boolean(
        config.url &&
        config.anonKey
    );
    const storageBucket = config.storageBucket || "event-images";
    const supabaseScriptUrl = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
    let supabaseClient = null;
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
        const supabaseGlobal = await loadSupabaseLibrary();
        supabaseClient = supabaseGlobal.createClient(config.url, config.anonKey);
        return supabaseClient;
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

    const categoryLabels = {
        event: "فعاليات",
        marketing: "تسويق",
        identity: "هوية",
        operation: "تشغيل",
    };

    const normalizeGallery = (event) => {
        const gallery = event.event_images || event.gallery || [];
        return gallery
            .slice()
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((image) => ({
                id: image.id,
                imagePath: image.image_path || image.imagePath || "",
                altText: image.alt_text || image.altText || "",
            }));
    };

    const toCamelEvent = (event) => ({
        id: event.id,
        title: event.title,
        category: event.category,
        categoryLabel: categoryLabels[event.category] || event.category,
        location: event.location || "",
        eventDate: event.event_date || event.eventDate || "",
        description: event.description || "",
        highlights: Array.isArray(event.highlights) ? event.highlights : [],
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

    const countRows = async (table, buildQuery) => {
        const client = await requireSupabase();
        let query = client.from(table).select("*", { count: "exact", head: true });
        if (buildQuery) query = buildQuery(query);
        const { count, error } = await query;
        if (error) throw error;
        return count || 0;
    };

    const uploadSupabaseFiles = async (files) => {
        if (!files || files.length === 0) return [];
        await requireAdmin();
        const client = await requireSupabase();
        const uploaded = [];
        for (const file of Array.from(files)) {
            const extension = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
            const cleanExtension = extension || "jpg";
            const path = `events/${Date.now()}-${crypto.randomUUID()}.${cleanExtension}`;
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

    const dataApi = {
        isSupabaseEnabled() {
            return hasSupabaseConfig;
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
            return {
                id: data.user.id,
                username: data.user.email,
            };
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
            return {
                id: user.id,
                username: user.email,
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

        async uploadFiles(files) {
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
            return uploadSupabaseFiles(files);
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
                category: payload.category,
                location: payload.location || "",
                event_date: payload.eventDate || "",
                description: payload.description,
                highlights: payload.highlights || [],
                cover_image: payload.coverImage || "",
                published: Boolean(payload.published),
                sort_order: Number(payload.sortOrder || 0),
                updated_at: new Date().toISOString(),
            };
            let savedEvent;
            if (eventId) {
                const { data, error } = await client
                    .from("events")
                    .update(row)
                    .eq("id", eventId)
                    .select("*")
                    .single();
                if (error) throw error;
                savedEvent = data;
            } else {
                const { data, error } = await client
                    .from("events")
                    .insert(row)
                    .select("*")
                    .single();
                if (error) throw error;
                savedEvent = data;
            }
            if (payload.galleryImages?.length) {
                const galleryRows = payload.galleryImages.map((path, index) => ({
                    event_id: savedEvent.id,
                    image_path: path,
                    alt_text: payload.title,
                    sort_order: index + 1,
                }));
                const { error } = await client.from("event_images").insert(galleryRows);
                if (error) throw error;
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
