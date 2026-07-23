/******************************************************************
 * Maha Manthra Bhajana Mandali
 * Bhajana Programme Invitation Portal
 * Version 2.1
 ******************************************************************/

/******************************
 * SUPABASE CONFIGURATION
 ******************************/

const SUPABASE_URL =
    "https://qbexbzdnevrxjxzldepy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OdSrzj_esf5vemOMPJzZRg_Sa2Ud7bi";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

/******************************
 * HTML ELEMENTS
 ******************************/

const form = document.getElementById("invitationForm");

const occasion = document.getElementById("occasion");
const otherOccasion = document.getElementById("otherOccasion");
const otherOccasionDiv = document.getElementById("otherOccasionDiv");

const eventDate = document.getElementById("eventDate");
const eventTime = document.getElementById("eventTime");

const fullName = document.getElementById("fullName");
const mobile = document.getElementById("mobile");
const email = document.getElementById("email");
const city = document.getElementById("city");

const venue = document.getElementById("venue");
const address = document.getElementById("address");

const devotees = document.getElementById("devotees");

const contactPerson =
    document.getElementById("contactPerson");

const alternateMobile =
    document.getElementById("alternateMobile");

const landmark =
    document.getElementById("landmark");

const maps =
    document.getElementById("maps");

const remarks =
    document.getElementById("remarks");

const generateLetterButton =
    document.getElementById("generateLetter");

const submitButton =
    document.getElementById("submitRequest");

const letterPreview =
    document.getElementById("letterPreview");

const generatedLetter =
    document.getElementById("generatedLetter");

/******************************
 * OTHER OCCASION
 ******************************/

occasion.addEventListener("change", () => {

    if (occasion.value === "Other") {

        otherOccasionDiv.style.display = "block";

        otherOccasion.required = true;

    }
    else {

        otherOccasionDiv.style.display = "none";

        otherOccasion.required = false;

        otherOccasion.value = "";

    }

});

/******************************
 * GET OCCASION
 ******************************/

function getOccasion() {

    if (occasion.value === "Other") {

        return otherOccasion.value.trim();

    }

    return occasion.value;

}

/******************************
 * FORMAT DATE
 ******************************/

function formatDate(dateValue) {

    return new Date(dateValue).toLocaleDateString(
        "en-IN",
        {

            day: "numeric",

            month: "long",

            year: "numeric"

        }

    );

}

/******************************
 * LETTER GENERATION
 ******************************/

generateLetterButton.addEventListener(
    "click",
    function () {

        if (!form.reportValidity()) {

            return;

        }

        const letter = `To

The President
Maha Manthra Bhajana Mandali
Chennai

Respected Sir,

Jai Sri Ram.

I, ${fullName.value}, respectfully request Maha Manthra Bhajana Mandali to conduct Bhajana & Nama Sankeerthanam on the occasion of ${getOccasion()}.

Programme Details

Date                : ${formatDate(eventDate.value)}

Time                : ${eventTime.value}

Venue               : ${venue.value}

Address             : ${address.value}

Expected Devotees   : ${devotees.value}

Contact Person      : ${contactPerson.value}

Mobile              : ${mobile.value}

Alternate Mobile    : ${alternateMobile.value}

Landmark            : ${landmark.value}

Google Maps         : ${maps.value}

Special Instructions

${remarks.value}

I humbly request the Mandali to kindly accept this invitation and bless the occasion with Divine Nama Sankeerthanam.

Thanking You,

Yours Faithfully,

${fullName.value}
`;

        generatedLetter.textContent = letter;

        letterPreview.style.display = "block";

        submitButton.style.display = "inline-block";

        letterPreview.scrollIntoView({

            behavior: "smooth"

        });

    }
);/******************************
 * SUBMIT REQUEST
 ******************************/

submitButton.addEventListener(
    "click",
    async function () {

        if (!form.reportValidity()) {
            return;
        }

        if (generatedLetter.textContent.trim() === "") {

            alert("Please generate the request letter first.");

            return;

        }

        submitButton.disabled = true;

        submitButton.innerHTML = "Submitting...";

        try {

            const requestData = {

                full_name: fullName.value.trim(),

                mobile: mobile.value.trim(),

                email: email.value.trim(),

                city: city.value.trim(),

                occasion: getOccasion(),

                event_date: eventDate.value,

                event_time: eventTime.value,

                venue: venue.value.trim(),

                address: address.value.trim(),

                expected_devotees: Number(devotees.value),

                contact_person: contactPerson.value.trim(),

                alternate_mobile: alternateMobile.value.trim(),

                landmark: landmark.value.trim(),

                maps: maps.value.trim(),

                remarks: remarks.value.trim(),

                generated_letter: generatedLetter.textContent,

                status: "Pending"

            };

            const { data, error } =
                await supabaseClient

                    .from("bhajana_requests")

                    .insert([requestData])

                    .select();

            if (error) {

                console.error(error);

                alert(
                    "Unable to submit request.\n\n" +
                    error.message
                );

                return;

            }

            const arn = data[0].request_no;
            
// Generate PDF
const pdfBlob = await generatePDF(arn);
            const fileName = `${arn}.pdf`;

const { error: uploadError } = await supabaseClient.storage
    .from("bhajana-request-pdfs")
    .upload(fileName, pdfBlob, {
        contentType: "application/pdf",
        upsert: true
    });

if (uploadError) {
    throw uploadError;
}
            const { error: updateError } = await supabaseClient
    .from("bhajana_requests")
    .update({
        pdf_url: fileName,
        pdf_generated: true
    })
    .eq("request_no", arn);

if (updateError) {
    throw updateError;
}
            alert(
`🎉 Request Submitted Successfully!

Your Bhajana Programme Invitation Request has been submitted successfully.

Application Reference Number (ARN)

${arn}

Please save this ARN for future communication.

Thank you for choosing

Maha Manthra Bhajana Mandali

Jai Sri Ram 🙏`
            );

            form.reset();

            generatedLetter.textContent = "";

            letterPreview.style.display = "none";

            submitButton.style.display = "none";

            otherOccasionDiv.style.display = "none";

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }

        catch (err) {

            console.error(err);

            alert(
                "Unexpected error occurred.\n\nPlease try again."
            );

        }

        finally {

            submitButton.disabled = false;

            submitButton.innerHTML = "Submit Request";

        }

    }

);

async function generatePDF(arn) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const margin = 20;
    const pageWidth = 210;
    const usableWidth = 170;

    let y = 20;

    const lineGap = 7;

    // ---------- Read Form Values ----------
    const fullName = document.getElementById("fullName").value.trim();
    const occasion = document.getElementById("occasion").value;
    const otherOccasion = document.getElementById("otherOccasion").value.trim();
    const finalOccasion = occasion === "Other" ? otherOccasion : occasion;

    const eventDate = document.getElementById("eventDate").value;
    const eventTime = document.getElementById("eventTime").value;

    const venue = document.getElementById("venue").value.trim();
    const address = document.getElementById("address").value.trim();
    const devotees = document.getElementById("devotees").value.trim();
    const contactPerson = document.getElementById("contactPerson").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const alternateMobile = document.getElementById("alternateMobile").value.trim();
    const landmark = document.getElementById("landmark").value.trim();
    const maps = document.getElementById("maps").value.trim();
    const remarks = document.getElementById("remarks").value.trim();

    const submittedOn = new Date().toLocaleString("en-IN");

    // ---------- Heading ----------
    doc.setFont("times", "bold");
    doc.setFontSize(16);

    doc.text("Bhajana Programme Request", pageWidth / 2, y, {
        align: "center"
    });

    y += 12;

    doc.setFontSize(11);
    doc.setFont("times", "normal");

    doc.text(`Application Reference No : ${arn}`, margin, y);
    y += lineGap;

    doc.text(`Submitted On : ${submittedOn}`, margin, y);

    y += 12;

    // ---------- Address ----------
    doc.text("To", margin, y);
    y += lineGap;

    doc.setFont("times", "bold");
    doc.text("The President", margin, y);
    y += 6;

    doc.text("Maha Manthra Bhajana Mandali", margin, y);
    y += 6;

    doc.text("Chennai", margin, y);

    y += 12;

    doc.setFont("times", "bold");
    doc.text("Subject: Request for Bhajana & Nama Sankeerthanam Programme", margin, y);

    y += 10;

    doc.setFont("times", "normal");

    doc.text("Respected Sir,", margin, y);

    y += 8;

    doc.text("Jai Sri Ram.", margin, y);

    y += 10;

    const intro =
        `I, ${fullName}, respectfully request Maha Manthra Bhajana Mandali to conduct Bhajana & Nama Sankeerthanam on the occasion of ${finalOccasion}.`;

    const introLines = doc.splitTextToSize(intro, usableWidth);

    doc.text(introLines, margin, y);

    y += introLines.length * 6 + 8;

    // ---------- Programme Details ----------
    doc.setFont("times", "bold");
    doc.text("Programme Details", margin, y);

    y += 6;

    doc.line(margin, y, 190, y);

    y += 8;

    doc.setFont("times", "normal");

    const details = [
        ["Occasion", finalOccasion],
        ["Date", eventDate],
        ["Time", eventTime],
        ["Venue", venue],
        ["Address", address],
        ["Expected Devotees", devotees],
        ["Contact Person", contactPerson],
        ["Mobile Number", mobile],
        ["Alternate Mobile", alternateMobile || "-"],
        ["Landmark", landmark || "-"],
        ["Google Maps", maps || "-"]
    ];

    details.forEach(item => {

        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("times", "bold");
        doc.text(item[0], margin, y);

        doc.setFont("times", "normal");

        const valueLines = doc.splitTextToSize(item[1], 105);

        doc.text(":", 72, y);
        doc.text(valueLines, 76, y);

        y += valueLines.length * 6 + 2;

    });

    y += 6;

    // ---------- Special Instructions ----------
    doc.setFont("times", "bold");
    doc.text("Special Instructions", margin, y);

    y += 6;

    doc.line(margin, y, 190, y);

    y += 8;

    doc.setFont("times", "normal");

    const special =
        remarks === "" ? "Nil" : remarks;

    const specialLines =
        doc.splitTextToSize(special, usableWidth);

    doc.text(specialLines, margin, y);

    y += specialLines.length * 6 + 10;

    const closing =
        "I humbly request the Mandali to kindly accept this invitation and bless the occasion with Divine Nama Sankeerthanam.";

    const closingLines =
        doc.splitTextToSize(closing, usableWidth);

    doc.text(closingLines, margin, y);

    y += closingLines.length * 6 + 10;

    doc.text("Thanking You.", margin, y);

    y += 10;

    doc.text("Yours Faithfully,", margin, y);

    y += 18;

    doc.text(fullName, margin, y);

    return doc.output("blob");
}
