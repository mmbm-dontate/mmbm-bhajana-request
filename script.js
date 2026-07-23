/******************************************************************
 * Maha Manthra Bhajana Mandali
 * Bhajana Invitation Portal
 * Version 2.0
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

const occasion =
    document.getElementById("occasion");

const otherOccasion =
    document.getElementById("otherOccasion");

const otherOccasionDiv =
    document.getElementById("otherOccasionDiv");

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

occasion.addEventListener("change", function () {

    if (occasion.value === "Other") {

        otherOccasionDiv.style.display = "block";

    } else {

        otherOccasionDiv.style.display = "none";

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

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}

/******************************
 * GENERATE REQUEST LETTER
 ******************************/

generateLetterButton.addEventListener("click", function () {

    if (!form.reportValidity()) {
        return;
    }

    const letter = `
To

The Secretary,
Maha Manthra Bhajana Mandali,
Chennai.

Respected Sir,

Jai Sri Ram.

I, ${document.getElementById("fullName").value}, respectfully request Maha Manthra Bhajana Mandali to conduct a Bhajana Programme on the occasion of ${getOccasion()}.

Programme Details

Date            : ${formatDate(document.getElementById("programmeDate").value)}
Time            : ${document.getElementById("programmeTime").value}
Venue           : ${document.getElementById("venue").value}
Address         : ${document.getElementById("venueAddress").value}

Expected Devotees : ${document.getElementById("expectedDevotees").value}

Contact Person   : ${document.getElementById("contactPerson").value}
Mobile           : ${document.getElementById("mobile").value}

Alternate Mobile : ${document.getElementById("alternateMobile").value}

Landmark         : ${document.getElementById("landmark").value}

Google Maps      : ${document.getElementById("maps").value}

Special Instructions

${document.getElementById("remarks").value}

I humbly request the Mandali to kindly accept my request and bless the occasion with Nama Sankeerthanam.

Thanking You,

Yours Faithfully,

${document.getElementById("fullName").value}
`;

    generatedLetter.textContent = letter;

    letterPreview.style.display = "block";

    letterPreview.scrollIntoView({
        behavior: "smooth"
    });

});

/******************************
 * SUBMIT REQUEST
 ******************************/

submitButton.addEventListener("click", async function () {

    // Validate form
    if (!form.reportValidity()) {
        return;
    }

    // Generate letter automatically if not already generated
    if (generatedLetter.textContent.trim() === "") {
        generateLetterButton.click();
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {

        const requestData = {

            full_name: document.getElementById("fullName").value.trim(),

            mobile: document.getElementById("mobile").value.trim(),

            email: document.getElementById("email").value.trim(),

            city: document.getElementById("city").value.trim(),

            occasion: getOccasion(),

            event_date: document.getElementById("programmeDate").value,

            event_time: document.getElementById("programmeTime").value,

            venue: document.getElementById("venue").value.trim(),

            address: document.getElementById("venueAddress").value.trim(),

            landmark: document.getElementById("landmark").value.trim(),

            maps: document.getElementById("maps").value.trim(),

            expected_devotees: parseInt(document.getElementById("expectedDevotees").value),

            contact_person: document.getElementById("contactPerson").value.trim(),

            alternate_mobile: document.getElementById("alternateMobile").value.trim(),

            remarks: document.getElementById("remarks").value.trim(),

            generated_letter: generatedLetter.textContent,

            status: "Pending"

        };

        const { data, error } = await supabaseClient
            .from("bhajana_requests")
            .insert([requestData])
            .select();

        if (error) {

            console.error(error);

            alert(
                "Unable to submit your request.\n\n" +
                error.message
            );

            return;

        }

        const arn = data[0].request_no;

        alert(
`🎉 Request Submitted Successfully!

Your Bhajana Invitation Request has been submitted successfully.

Application Reference Number (ARN):
${data[0].request_no}

Please save this ARN for future communication and status tracking.

Jai Sri Ram 🙏`
);
        
        form.reset();

        generatedLetter.textContent = "";

        letterPreview.style.display = "none";

        otherOccasionDiv.style.display = "none";

    }
    catch (err) {

        console.error(err);

        alert(
            "Unexpected error occurred.\n\nPlease try again."
        );

    }
    finally {

        submitButton.disabled = false;

        submitButton.textContent = "Submit Request";

    }

});
