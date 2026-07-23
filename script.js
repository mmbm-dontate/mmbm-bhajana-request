/******************************************************************
 * Maha Manthra Bhajana Mandali
 * Bhajana Invitation Portal
 * Version 1.0
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
 * FORMAT TIME
 ******************************/

function formatTime(time) {

    return new Date(
        "1970-01-01T" + time
    ).toLocaleTimeString(
        "en-IN",
        {

            hour: "numeric",

            minute: "2-digit",

            hour12: true

        }

    );

}

/******************************
 * VALIDATION
 ******************************/

function validateForm() {

    if (
        document.getElementById("fullName").value.trim() === ""
    ) {

        alert("Please enter Full Name.");

        return false;

    }

    if (
        document.getElementById("mobile").value.trim() === ""
    ) {

        alert("Please enter Mobile Number.");

        return false;

    }

    if (
        getOccasion() === ""
    ) {

        alert("Please select Occasion.");

        return false;

    }

    if (
        document.getElementById("eventDate").value === ""
    ) {

        alert("Please select Programme Date.");

        return false;

    }

    if (
        document.getElementById("eventTime").value === ""
    ) {

        alert("Please select Programme Time.");

        return false;

    }

    if (
        document.getElementById("venue").value.trim() === ""
    ) {

        alert("Please enter Venue.");

        return false;

    }

    if (
        document.getElementById("address").value.trim() === ""
    ) {

        alert("Please enter Venue Address.");

        return false;

    }

    if (
        document.getElementById("devotees").value.trim() === ""
    ) {

        alert("Please enter Expected Number of Devotees.");

        return false;

    }

    if (
        document.getElementById("contactPerson").value.trim() === ""
    ) {

        alert("Please enter Contact Person.");

        return false;

    }

    return true;

}

/******************************
 * GENERATE LETTER
 ******************************/

function generateLetter() {

    const fullName =
        document.getElementById("fullName").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const venue =
        document.getElementById("venue").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const devotees =
        document.getElementById("devotees").value;

    const contactPerson =
        document.getElementById("contactPerson").value.trim();

    const alternateMobile =
        document.getElementById("alternateMobile").value.trim();

    const landmark =
        document.getElementById("landmark").value.trim();

    const maps =
        document.getElementById("maps").value.trim();

    const remarks =
        document.getElementById("remarks").value.trim();

    const occasionName =
        getOccasion();

    const programmeDate =
        formatDate(
            document.getElementById("eventDate").value
        );

    const programmeTime =
        formatTime(
            document.getElementById("eventTime").value
        );

    const letter = `

<p><strong>To</strong></p>

<p>

The President<br>
Maha Manthra Bhajana Mandali<br>
Chennai.

</p>

<p>

<strong>Respected Sir,</strong>

</p>

<p>

I respectfully invite the members of
<strong>Maha Manthra Bhajana Mandali</strong>
to conduct Bhajana and Nama Sankeerthanam
at our
<strong>${venue}</strong>
on the occasion of
<strong>${occasionName}</strong>.

</p>

<p>

The programme is proposed to be held on

<strong>${programmeDate}</strong>

at

<strong>${programmeTime}</strong>.

</p>

<p>

<strong>Venue Address</strong>

<br><br>

${address.replace(/\n/g,"<br>")}

</p>

<p>

<strong>Expected Number of Devotees :</strong>
${devotees}

</p>

<p>

<strong>Contact Person :</strong>
${contactPerson}

</p>

${
alternateMobile !== ""
?
`<p><strong>Alternate Mobile :</strong> ${alternateMobile}</p>`
:
""
}

${
landmark !== ""
?
`<p><strong>Landmark :</strong> ${landmark}</p>`
:
""
}

${
maps !== ""
?
`<p><strong>Google Maps :</strong> <a href="${maps}" target="_blank">${maps}</a></p>`
:
""
}

${
remarks !== ""
?
`<p><strong>Special Instructions :</strong><br>${remarks}</p>`
:
""
}

<p>

We humbly request the Mandali
to kindly accept our invitation
and bless the occasion
with your divine presence
and Bhajana Seva.

</p>

<p>

Thanking You,

</p>

<p>

Yours Faithfully,

<br><br><br>

<strong>${fullName}</strong><br>

${mobile}

${
email !== ""
?
`<br>${email}`
:
""
}

${
city !== ""
?
`<br>${city}`
:
""
}

</p>

`;

    generatedLetter.innerHTML = letter;

    letterPreview.style.display = "block";

    submitButton.style.display = "inline-block";

    window.scrollTo({

        top: letterPreview.offsetTop,

        behavior: "smooth"

    });

}

/******************************
 * GENERATE LETTER BUTTON
 ******************************/

generateLetterButton.addEventListener("click", function () {

    if (!validateForm()) {
        return;
    }

    generateLetter();

});


/******************************
 * SUBMIT REQUEST
 ******************************/

submitButton.addEventListener("click", async function () {

    submitButton.disabled = true;
    submitButton.innerHTML = "Submitting...";

    const requestData = {

        full_name:
            document.getElementById("fullName").value.trim(),

        mobile:
            document.getElementById("mobile").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        city:
            document.getElementById("city").value.trim(),

        occasion:
            getOccasion(),

        event_date:
            document.getElementById("eventDate").value,

        event_time:
            document.getElementById("eventTime").value,

        venue:
            document.getElementById("venue").value.trim(),

        address:
            document.getElementById("address").value.trim(),

        expected_devotees:
            parseInt(document.getElementById("devotees").value),

        contact_person:
            document.getElementById("contactPerson").value.trim(),

        alternate_mobile:
            document.getElementById("alternateMobile").value.trim(),

        landmark:
            document.getElementById("landmark").value.trim(),

        maps:
            document.getElementById("maps").value.trim(),

        remarks:
            document.getElementById("remarks").value.trim(),

        generated_letter:
            generatedLetter.innerHTML,

        request_no: null,

        status: "Pending"

    };

    console.log("Submitting Request...");
    console.table(requestData);

    try {

        const { data, error } = await supabaseClient

            .from("bhajana_requests")

            .insert([requestData])

            .select();

        if (error) {

            console.error(error);

            alert(
                "Unable to submit request.\n\n" +
                error.message
            );

            submitButton.disabled = false;
            submitButton.innerHTML = "Submit Request";

            return;

        }

        console.log("Saved Successfully");
        console.table(data);

        alert(
            "Your Bhajana Invitation Request has been submitted successfully."
        );

        /******************************
         * RESET FORM
         ******************************/

        form.reset();

        otherOccasionDiv.style.display = "none";

        generatedLetter.innerHTML = "";

        letterPreview.style.display = "none";

        submitButton.style.display = "none";

        submitButton.disabled = false;

        submitButton.innerHTML = "Submit Request";

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    catch (err) {

        console.error(err);

        alert(
            "Unexpected Error.\n\n" +
            err.message
        );

        submitButton.disabled = false;

        submitButton.innerHTML = "Submit Request";

    }

});


/******************************
 * PAGE LOADED
 ******************************/

console.log("======================================");

console.log("MMBM Bhajana Invitation Portal");

console.log("Version : 1.0");

console.log("Supabase Connected Successfully");

console.log("======================================");
