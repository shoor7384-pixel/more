    const defaultData = [

            {
                id: "main_1",
                name: "المسلة",
                description: "منطقة المسلة",
                image:
                    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
                subAreas: []
            },

            {
                id: "main_2",
                name: "عبودي",
                description: "منطقة عبودي",
                image:
                    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85",
                subAreas: []
            },

            {
                id: "main_3",
                name: "دلة",
                description: "منطقة دلة",
                image:
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
                subAreas: []
            },

            {
                id: "main_4",
                name: "كيمان",
                description: "منطقة كيمان",
                image:
                    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85",
                subAreas: []
            }

        ];


        let data =
            JSON.parse(
                localStorage.getItem("eliteEstateData")
            ) || defaultData;


        let currentMainId = null;

        let currentSubId = null;


        /* =========================================================
           SAVE DATA
        ========================================================= */

        function saveData() {

            localStorage.setItem(
                "eliteEstateData",
                JSON.stringify(data)
            );

        }


        /* =========================================================
           ESCAPE HTML
        ========================================================= */

        function escapeHTML(value) {

            if (value === null ||
                value === undefined) {
                return "";
            }

            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        }


        /* =========================================================
           FORMAT PRICE
        ========================================================= */

        function formatPrice(value) {

            if (!value) {
                return "السعر غير محدد";
            }

            return Number(value).toLocaleString("ar-EG")
                + " جنيه";

        }


        /* =========================================================
           HOME
        ========================================================= */

        function goHome() {

            hideViews();

            document
                .getElementById("homeView")
                .classList.add("active");

            currentMainId = null;
            currentSubId = null;

            renderAreas();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        function hideViews() {

            document
                .querySelectorAll(".view")
                .forEach(view => {

                    view.classList.remove("active");

                });

        }


        /* =========================================================
           RENDER MAIN AREAS
        ========================================================= */

        function renderAreas() {

            const grid =
                document.getElementById("areasGrid");

            grid.innerHTML = "";

            data.forEach((area, index) => {

                let propertyCount = 0;

                area.subAreas.forEach(sub => {

                    propertyCount +=
                        sub.properties.length;

                });

                grid.innerHTML += `

                    <article
                        class="area-card"
                        onclick="openMainArea('${area.id}')">

                        <img
                            class="area-image"
                            src="${escapeHTML(area.image)}"
                            alt="${escapeHTML(area.name)}">

                        <div class="area-content">

                            <div class="area-number">
                                0${index + 1} / AREA
                            </div>

                            <h3>
                                ${escapeHTML(area.name)}
                            </h3>

                            <p>
                                ${escapeHTML(area.description)}
                            </p>

                            <div class="area-meta">

                                <span class="meta-pill">
                                    ${area.subAreas.length}
                                    مناطق فرعية
                                </span>

                                <span class="meta-pill">
                                    ${propertyCount}
                                    عقار
                                </span>

                            </div>

                        </div>

                    </article>

                `;

            });

        }


        /* =========================================================
           OPEN MAIN AREA
        ========================================================= */

        function openMainArea(id) {

            const area =
                data.find(item => item.id === id);

            if (!area) return;

            currentMainId = id;
            currentSubId = null;

            hideViews();

            document
                .getElementById("mainAreaView")
                .classList.add("active");

            document
                .getElementById("mainAreaTitle")
                .textContent = area.name;

            document
                .getElementById("mainAreaDescription")
                .textContent =
                area.description || "";

            renderMainArea();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        /* =========================================================
           RENDER MAIN AREA
        ========================================================= */

        function renderMainArea() {

            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;

            let propertyCount = 0;

            area.subAreas.forEach(sub => {

                propertyCount +=
                    sub.properties.length;

            });

            document
                .getElementById("subCount")
                .textContent =
                area.subAreas.length;

            document
                .getElementById("mainPropertyCount")
                .textContent =
                propertyCount;


            const grid =
                document.getElementById("subAreasGrid");

            grid.innerHTML = "";


            if (area.subAreas.length === 0) {

                grid.innerHTML = `

                    <div class="empty"
                         style="grid-column:1/-1">

                        <div class="empty-icon">
                            ◇
                        </div>

                        <h3>
                            لا توجد مناطق فرعية حتى الآن
                        </h3>

                        <p>
                            ابدئي بإضافة أول منطقة فرعية
                            داخل ${escapeHTML(area.name)}
                        </p>

                        <button
                            class="primary-btn"
                            onclick="openSubModal()">
                            + إضافة منطقة فرعية
                        </button>

                    </div>

                `;

                return;

            }


            area.subAreas.forEach(sub => {

                grid.innerHTML += `

                    <article
                        class="sub-card"
                        onclick="openSubArea('${sub.id}')">

                        <div class="sub-icon">
                            ◇
                        </div>

                        <h3>
                            ${escapeHTML(sub.name)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                sub.description ||
                                "منطقة فرعية"
                            )}
                        </p>

                        <div class="sub-card-bottom">

                            <span>
                                ${sub.properties.length}
                                عقار
                            </span>

                            <button
                                class="delete-mini"
                                onclick="
                                    event.stopPropagation();
                                    deleteSubArea('${sub.id}')
                                ">
                                ×
                            </button>

                        </div>

                    </article>

                `;

            });

        }


        /* =========================================================
           SUB MODAL
        ========================================================= */

        function openSubModal() {

            document
                .getElementById("subName")
                .value = "";

            document
                .getElementById("subDescription")
                .value = "";

            document
                .getElementById("subModal")
                .classList.add("show");

        }


        function saveSubArea() {

            const name =
                document
                    .getElementById("subName")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("subDescription")
                    .value
                    .trim();


            if (!name) {

                showToast(
                    "اكتبي اسم المنطقة الفرعية أولاً"
                );

                return;

            }


            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;


            area.subAreas.push({

                id:
                    "sub_" +
                    Date.now(),

                name,

                description,

                properties: []

            });


            saveData();

            closeModal("subModal");

            renderMainArea();

            renderAreas();

            showToast(
                "تمت إضافة المنطقة الفرعية بنجاح"
            );

        }


        /* =========================================================
           DELETE SUB
        ========================================================= */

        function deleteSubArea(id) {

            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;


            const sub =
                area.subAreas.find(
                    item => item.id === id
                );

            if (!sub) return;


            const confirmed =
                confirm(
                    "هل أنتِ متأكدة من حذف المنطقة الفرعية وكل العقارات الموجودة بداخلها؟"
                );


            if (!confirmed) return;


            area.subAreas =
                area.subAreas.filter(
                    item => item.id !== id
                );


            saveData();

            renderMainArea();

            renderAreas();

            showToast(
                "تم حذف المنطقة الفرعية"
            );

        }


        /* =========================================================
           OPEN SUB AREA
        ========================================================= */

        function openSubArea(id) {

            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;


            const sub =
                area.subAreas.find(
                    item => item.id === id
                );

            if (!sub) return;


            currentSubId = id;


            hideViews();

            document
                .getElementById("subAreaView")
                .classList.add("active");


            document
                .getElementById("subAreaTitle")
                .textContent =
                sub.name;


            document
                .getElementById("subAreaDescription")
                .textContent =
                sub.description || "";


            document
                .getElementById("subAreaStatName")
                .textContent =
                sub.name;


            document
                .getElementById("subPropertyCount")
                .textContent =
                sub.properties.length;


            renderProperties();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        /* =========================================================
           BACK
        ========================================================= */

        function backToMainArea() {

            if (currentMainId) {

                openMainArea(
                    currentMainId
                );

            } else {

                goHome();

            }

        }


        /* =========================================================
           PROPERTY MODAL
        ========================================================= */

        function openPropertyModal() {

            document
                .getElementById("propertyForm")
                .reset();

            document
                .getElementById("propertyModal")
                .classList.add("show");

        }


        /* =========================================================
           SAVE PROPERTY
        ========================================================= */

        function saveProperty() {

            const title =
                document
                    .getElementById("p_title")
                    .value
                    .trim();


            if (!title) {

                showToast(
                    "اسم العقار مطلوب"
                );

                return;

            }


            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;


            const sub =
                area.subAreas.find(
                    item => item.id === currentSubId
                );

            if (!sub) return;


            const property = {

                id:
                    "property_" +
                    Date.now(),

                title,

                type:
                    val("p_type"),

                purpose:
                    val("p_purpose"),

                status:
                    val("p_status"),

                price:
                    val("p_price"),

                meterPrice:
                    val("p_meterPrice"),

                rent:
                    val("p_rent"),

                deposit:
                    val("p_deposit"),

                payment:
                    val("p_payment"),

                negotiable:
                    val("p_negotiable"),

                area:
                    val("p_area"),

                land:
                    val("p_land"),

                bedrooms:
                    val("p_bedrooms"),

                bathrooms:
                    val("p_bathrooms"),

                reception:
                    val("p_reception"),

                kitchens:
                    val("p_kitchens"),

                balconies:
                    val("p_balconies"),

                storage:
                    val("p_storage"),

                floor:
                    val("p_floor"),

                buildingFloors:
                    val("p_buildingFloors"),

                year:
                    val("p_year"),

                unitsPerFloor:
                    val("p_unitsPerFloor"),

                finish:
                    val("p_finish"),

                direction:
                    val("p_direction"),

                address:
                    val("p_address"),

                street:
                    val("p_street"),

                buildingNumber:
                    val("p_buildingNumber"),

                apartmentNumber:
                    val("p_apartmentNumber"),

                landmark:
                    val("p_landmark"),

                owner:
                    val("p_owner"),

                phone:
                    val("p_phone"),

                whatsapp:
                    val("p_whatsapp"),

                phone2:
                    val("p_phone2"),

                description:
                    val("p_description"),

                advantages:
                    val("p_advantages"),

                notes:
                    val("p_notes"),

                image:
                    val("p_image"),

                video:
                    val("p_video"),


                features: {

                    elevator:
                        checked("f_elevator"),

                    parking:
                        checked("f_parking"),

                    balcony:
                        checked("f_balcony"),

                    security:
                        checked("f_security"),

                    camera:
                        checked("f_camera"),

                    gas:
                        checked("f_gas"),

                    water:
                        checked("f_water"),

                    electric:
                        checked("f_electric"),

                    meter:
                        checked("f_meter"),

                    internet:
                        checked("f_internet"),

                    ac:
                        checked("f_ac"),

                    furnished:
                        checked("f_furnished"),

                    roof:
                        checked("f_roof"),

                    garden:
                        checked("f_garden"),

                    pool:
                        checked("f_pool"),

                    club:
                        checked("f_club")

                },

                createdAt:
                    new Date().toISOString()

            };


            sub.properties.push(
                property
            );


            saveData();

            closeModal(
                "propertyModal"
            );

            renderProperties();

            renderMainArea();

            renderAreas();


            showToast(
                "تم حفظ العقار بنجاح"
            );

        }


        /* =========================================================
           HELPERS
        ========================================================= */

        function val(id) {

            const element =
                document.getElementById(id);

            return element
                ? element.value.trim()
                : "";

        }


        function checked(id) {

            const element =
                document.getElementById(id);

            return element
                ? element.checked
                : false;

        }


        /* =========================================================
           RENDER PROPERTIES
        ========================================================= */

        function renderProperties() {

            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;


            const sub =
                area.subAreas.find(
                    item => item.id === currentSubId
                );

            if (!sub) return;


            const grid =
                document.getElementById(
                    "propertiesGrid"
                );


            document
                .getElementById(
                    "subPropertyCount"
                )
                .textContent =
                sub.properties.length;


            grid.innerHTML = "";


            if (sub.properties.length === 0) {

                grid.innerHTML = `

                    <div
                        class="empty"
                        style="grid-column:1/-1">

                        <div class="empty-icon">
                            ◇
                        </div>

                        <h3>
                            لا توجد عقارات حتى الآن
                        </h3>

                        <p>
                            أضيفي أول شقة أو عقار
                            داخل ${escapeHTML(sub.name)}
                        </p>

                        <button
                            class="primary-btn"
                            onclick="openPropertyModal()">
                            + إضافة عقار
                        </button>

                    </div>

                `;

                return;

            }


            sub.properties.forEach(property => {

                const image =
                    property.image ||
                    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85";


                grid.innerHTML += `

                    <article
                        class="property-card">

                        <div class="property-image">

                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(property.title)}">

                            <span
                                class="property-status">

                                ${escapeHTML(
                                    property.status ||
                                    "متاح"
                                )}

                            </span>

                        </div>


                        <div class="property-body">

                            <h3>
                                ${escapeHTML(property.title)}
                            </h3>

                            <div class="property-price">

                                ${formatPrice(
                                    property.price
                                )}

                            </div>


                            <div class="property-info">

                                ${
                                    property.area
                                    ?
                                    `<span>
                                        ${escapeHTML(property.area)}
                                        م²
                                    </span>`
                                    :
                                    ""
                                }

                                ${
                                    property.bedrooms
                                    ?
                                    `<span>
                                        ${escapeHTML(property.bedrooms)}
                                        غرف
                                    </span>`
                                    :
                                    ""
                                }

                                ${
                                    property.bathrooms
                                    ?
                                    `<span>
                                        ${escapeHTML(property.bathrooms)}
                                        حمام
                                    </span>`
                                    :
                                    ""
                                }

                                ${
                                    property.floor
                                    ?
                                    `<span>
                                        الدور ${escapeHTML(property.floor)}
                                    </span>`
                                    :
                                    ""
                                }

                            </div>


                            <div
                                class="property-buttons">

                                <button
                                    onclick="
                                        openDetails('${property.id}')
                                    ">
                                    التفاصيل
                                </button>

                                <button
                                    class="danger"
                                    onclick="
                                        deleteProperty('${property.id}')
                                    ">
                                    حذف
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            });

        }


        /* =========================================================
           PROPERTY DETAILS
        ========================================================= */

        function openDetails(id) {

            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;


            const sub =
                area.subAreas.find(
                    item => item.id === currentSubId
                );

            if (!sub) return;


            const property =
                sub.properties.find(
                    item => item.id === id
                );

            if (!property) return;


            document
                .getElementById("detailsTitle")
                .textContent =
                property.title;


            let html = "";


            if (property.image) {

                html += `

                    <img
                        class="details-image"
                        src="${escapeHTML(property.image)}"
                        alt="">

                `;

            }


            const details = [

                ["نوع العقار", property.type],
                ["الغرض", property.purpose],
                ["الحالة", property.status],
                ["السعر", property.price ? formatPrice(property.price) : ""],
                ["سعر المتر", property.meterPrice],
                ["الإيجار الشهري", property.rent],
                ["مقدم الحجز", property.deposit],
                ["طريقة الدفع", property.payment],
                ["قابل للتفاوض", property.negotiable],
                ["المساحة", property.area ? property.area + " م²" : ""],
                ["مساحة الأرض", property.land],
                ["غرف النوم", property.bedrooms],
                ["الحمامات", property.bathrooms],
                ["الريسبشن", property.reception],
                ["المطابخ", property.kitchens],
                ["البلكونات", property.balconies],
                ["التخزين", property.storage],
                ["الدور", property.floor],
                ["أدوار المبنى", property.buildingFloors],
                ["سنة البناء", property.year],
                ["الشقق في الدور", property.unitsPerFloor],
                ["التشطيب", property.finish],
                ["الاتجاه", property.direction],
                ["اسم الشارع", property.street],
                ["رقم العمارة", property.buildingNumber],
                ["رقم الشقة", property.apartmentNumber],
                ["أقرب معلم", property.landmark],
                ["المالك / المسؤول", property.owner],
                ["الهاتف", property.phone],
                ["واتساب", property.whatsapp],
                ["هاتف إضافي", property.phone2]

            ];


            const filtered =
                details.filter(
                    item =>
                        item[1] !== undefined &&
                        item[1] !== null &&
                        String(item[1]).trim() !== ""
                );


            if (filtered.length) {

                html += `
                    <div class="details-grid">
                `;


                filtered.forEach(item => {

                    html += `

                        <div class="detail-item">

                            <small>
                                ${escapeHTML(item[0])}
                            </small>

                            <strong>
                                ${escapeHTML(item[1])}
                            </strong>

                        </div>

                    `;

                });


                html += `
                    </div>
                `;

            }


            const featuresMap = {

                elevator: "أسانسير",
                parking: "جراج",
                balcony: "بلكونة",
                security: "أمن وحراسة",
                camera: "كاميرات",
                gas: "غاز طبيعي",
                water: "مياه",
                electric: "عداد كهرباء",
                meter: "عداد مياه",
                internet: "إنترنت",
                ac: "تكييف",
                furnished: "مفروش",
                roof: "روف",
                garden: "حديقة",
                pool: "حمام سباحة",
                club: "نادي"

            };


            const activeFeatures =
                Object.keys(
                    featuresMap
                ).filter(
                    key =>
                        property.features &&
                        property.features[key]
                );


            if (activeFeatures.length) {

                html += `

                    <div class="details-text">

                        <strong
                            style="color:#e8cb88">
                            المميزات:
                        </strong>

                        <br><br>

                        ${activeFeatures
                            .map(
                                key =>
                                    "◆ " +
                                    featuresMap[key]
                            )
                            .join(" &nbsp; ")}

                    </div>

                `;

            }


            if (property.address) {

                html += `

                    <div class="details-text">

                        <strong
                            style="color:#e8cb88">
                            العنوان
                        </strong>

                        <br><br>

                        ${escapeHTML(
                            property.address
                        )}

                    </div>

                `;

            }


            if (property.description) {

                html += `

                    <div class="details-text">

                        <strong
                            style="color:#e8cb88">
                            وصف العقار
                        </strong>

                        <br><br>

                        ${escapeHTML(
                            property.description
                        )}

                    </div>

                `;

            }


            if (property.advantages) {

                html += `

                    <div class="details-text">

                        <strong
                            style="color:#e8cb88">
                            أهم المميزات
                        </strong>

                        <br><br>

                        ${escapeHTML(
                            property.advantages
                        )}

                    </div>

                `;

            }


            if (property.notes) {

                html += `

                    <div class="details-text">

                        <strong
                            style="color:#ffadad">
                            ملاحظات / عيوب
                        </strong>

                        <br><br>

                        ${escapeHTML(
                            property.notes
                        )}

                    </div>

                `;

            }


            if (property.video) {

                html += `

                    <div
                        style="margin-top:18px">

                        <a
                            href="${escapeHTML(property.video)}"
                            target="_blank"
                            class="primary-btn"
                            style="
                                display:inline-flex;
                                align-items:center;
                                text-decoration:none;
                            ">

                            مشاهدة فيديو العقار

                        </a>

                    </div>

                `;

            }


            document
                .getElementById(
                    "detailsContent"
                )
                .innerHTML = html;


            document
                .getElementById(
                    "detailsModal"
                )
                .classList.add("show");

        }


        /* =========================================================
           DELETE PROPERTY
        ========================================================= */

        function deleteProperty(id) {

            const area =
                data.find(
                    item => item.id === currentMainId
                );

            if (!area) return;


            const sub =
                area.subAreas.find(
                    item => item.id === currentSubId
                );

            if (!sub) return;


            const confirmed =
                confirm(
                    "هل أنتِ متأكدة من حذف هذا العقار؟"
                );


            if (!confirmed) return;


            sub.properties =
                sub.properties.filter(
                    item => item.id !== id
                );


            saveData();

            renderProperties();

            renderMainArea();

            renderAreas();

            showToast(
                "تم حذف العقار"
            );

        }


        /* =========================================================
           MAIN AREA ADD
        ========================================================= */

        function openMainAddModal() {

            document
                .getElementById("mainName")
                .value = "";

            document
                .getElementById("mainDescription")
                .value = "";

            document
                .getElementById("mainModal")
                .classList.add("show");

        }


        function saveMainArea() {

            const name =
                document
                    .getElementById("mainName")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("mainDescription")
                    .value
                    .trim();


            if (!name) {

                showToast(
                    "اكتبي اسم المنطقة"
                );

                return;

            }


            data.push({

                id:
                    "main_" +
                    Date.now(),

                name,

                description,

                image:
                    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85",

                subAreas: []

            });


            saveData();

            closeModal("mainModal");

            renderAreas();

            showToast(
                "تمت إضافة المنطقة"
            );

        }


        /* =========================================================
           MODAL
        ========================================================= */

        function closeModal(id) {

            document
                .getElementById(id)
                .classList.remove("show");

        }


        document
            .querySelectorAll(".modal")
            .forEach(modal => {

                modal.addEventListener(
                    "click",
                    function(event) {

                        if (
                            event.target === modal
                        ) {

                            modal.classList.remove(
                                "show"
                            );

                        }

                    }
                );

            });


        /* =========================================================
           TOAST
        ========================================================= */

        function showToast(message) {

            const toast =
                document.getElementById(
                    "toast"
                );

            toast.textContent =
                message;

            toast.classList.add("show");


            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

        }


        /* =========================================================
           SEARCH
        ========================================================= */

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        const searchResults =
            document.getElementById(
                "searchResults"
            );


        searchInput.addEventListener(
            "input",
            function() {

                const query =
                    this.value
                        .trim()
                        .toLowerCase();


                if (!query) {

                    searchResults.classList.remove(
                        "show"
                    );

                    return;

                }


                const results = [];


                /* MAIN AREAS */

                data.forEach(area => {

                    if (
                        area.name
                            .toLowerCase()
                            .includes(query)
                    ) {

                        results.push({

                            type:
                                "منطقة رئيسية",

                            title:
                                area.name,

                            subtitle:
                                area.description,

                            action:
                                () => {

                                    searchResults
                                        .classList.remove(
                                            "show"
                                        );

                                    searchInput.value =
                                        "";

                                    openMainArea(
                                        area.id
                                    );

                                }

                        });

                    }


                    /* SUB AREAS */

                    area.subAreas.forEach(sub => {

                        if (
                            sub.name
                                .toLowerCase()
                                .includes(query)
                        ) {

                            results.push({

                                type:
                                    "منطقة فرعية",

                                title:
                                    sub.name,

                                subtitle:
                                    area.name,

                                action:
                                    () => {

                                        searchResults
                                            .classList.remove(
                                                "show"
                                            );

                                        searchInput.value =
                                            "";

                                        openMainArea(
                                            area.id
                                        );

                                        setTimeout(
                                            () => {

                                                openSubArea(
                                                    sub.id
                                                );

                                            },
                                            100
                                        );

                                    }

                            });

                        }


                        /* PROPERTIES */

                        sub.properties.forEach(
                            property => {

                                const text =
                                    [

                                        property.title,
                                        property.type,
                                        property.purpose,
                                        property.status,
                                        property.address,
                                        property.street,
                                        property.landmark,
                                        property.owner

                                    ]
                                    .filter(Boolean)
                                    .join(" ")
                                    .toLowerCase();


                                if (
                                    text.includes(
                                        query
                                    )
                                ) {

                                    results.push({

                                        type:
                                            "عقار / شقة",

                                        title:
                                            property.title,

                                        subtitle:
                                            area.name +
                                            " ← " +
                                            sub.name,

                                        propertyId:
                                            property.id,

                                        areaId:
                                            area.id,

                                        subId:
                                            sub.id

                                    });

                                }

                            }
                        );

                    });

                });


                searchResults.innerHTML = `

                    <div class="search-title">
                        نتائج البحث
                    </div>

                `;


                if (!results.length) {

                    searchResults.innerHTML += `

                        <div class="no-search">

                            لا توجد نتائج لـ
                            "<strong>
                                ${escapeHTML(query)}
                            </strong>"

                        </div>

                    `;

                    searchResults.classList.add(
                        "show"
                    );

                    return;

                }


                results
                    .slice(0, 15)
                    .forEach(result => {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "search-result";


                        item.innerHTML = `

                            <div class="result-icon">

                                ${
                                    result.type ===
                                    "عقار / شقة"
                                    ? "⌂"
                                    : "◇"
                                }

                            </div>

                            <div class="result-info">

                                <strong>
                                    ${escapeHTML(
                                        result.title
                                    )}
                                </strong>

                                <span>

                                    ${escapeHTML(
                                        result.type
                                    )}

                                    ${
                                        result.subtitle
                                        ?
                                        " • " +
                                        escapeHTML(
                                            result.subtitle
                                        )
                                        :
                                        ""
                                    }

                                </span>

                            </div>

                        `;


                        item.addEventListener(
                            "click",
                            function() {

                                searchResults
                                    .classList.remove(
                                        "show"
                                    );

                                searchInput.value =
                                    "";


                                if (
                                    result.type ===
                                    "منطقة رئيسية"
                                ) {

                                    openMainArea(
                                        result.action
                                            ? data.find(
                                                a =>
                                                    a.name ===
                                                    result.title
                                            )?.id
                                            : null
                                    );

                                    return;

                                }


                                if (
                                    result.type ===
                                    "منطقة فرعية"
                                ) {

                                    const area =
                                        data.find(
                                            a =>
                                                a.name ===
                                                result.subtitle
                                        );

                                    if (area) {

                                        openMainArea(
                                            area.id
                                        );

                                        setTimeout(
                                            () => {

                                                const sub =
                                                    area.subAreas.find(
                                                        s =>
                                                            s.name ===
                                                            result.title
                                                    );

                                                if (sub) {

                                                    openSubArea(
                                                        sub.id
                                                    );

                                                }

                                            },
                                            100
                                        );

                                    }

                                    return;

                                }


                                if (
                                    result.type ===
                                    "عقار / شقة"
                                ) {

                                    openMainArea(
                                        result.areaId
                                    );

                                    setTimeout(
                                        () => {

                                            openSubArea(
                                                result.subId
                                            );

                                            setTimeout(
                                                () => {

                                                    openDetails(
                                                        result.propertyId
                                                    );

                                                },
                                                150
                                            );

                                        },
                                        100
                                    );

                                }

                            }
                        );


                        searchResults.appendChild(
                            item
                        );

                    });


                searchResults.classList.add(
                    "show"
                );

            }
        );


        /* =========================================================
           CLOSE SEARCH OUTSIDE
        ========================================================= */

        document.addEventListener(
            "click",
            function(event) {

                if (
                    !event.target.closest(
                        ".nav-search"
                    ) &&
                    !event.target.closest(
                        ".search-results"
                    )
                ) {

                    searchResults.classList.remove(
                        "show"
                    );

                }

            }
        );


        /* =========================================================
           INITIAL
        ========================================================= */

        renderAreas();
