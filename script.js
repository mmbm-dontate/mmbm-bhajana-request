/*****************************************************************
 * Maha Manthra Bhajana Mandali
 * Bhajana Invitation Portal
 * Version 1.0
 *****************************************************************/

/***********************
 * SUPABASE CONNECTION
 ***********************/

const SUPABASE_URL =
    "https://qbexbzdnevrxjxzldepy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OdSrzj_esf5vemOMPJzZRg_Sa2Ud7bi";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

/***********************
 * HTML ELEMENTS
 ***********************/

const form = document.getElementById("invitationForm");

const occasion = document.getElementById("occasion");
const otherOccasionDiv = document.getElementById("otherOccasionDiv");
const otherOccasion = document.getElementById("otherOccasion");

const generateLetterButton =
    document.getElementById("generateLetter");

const submitButton =
    document.getElementById("submitRequest");

const letterPreview =
    document.getElementById("letterPreview");

const generatedLetter =
    document.getElementById("generatedLetter");

/***********************
 * SHOW / HIDE
 * OTHER OCCASION
 ***********************/

occasion.addEventListener("change", function () {

    if (occasion.value === "Other") {

        otherOccasionDiv.style.display = "block";

    } else {

        otherOccasionDiv.style.display = "none";

        otherOccasion.value = "";

    }

});

/***********************
 * GET OCCASION
 ***********************/

function getOccasion() {

    if (occasion.value === "Other") {

        return otherOccasion.value.trim();

    }

    return occasion.value;

}

/***********************
 * VALIDATION
 ***********************/

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

        alert("Please enter Venue Name.");

        return false;

    }

    if (
        document.getElementById("address").value.trim() === ""
    ) {

        alert("Please enter Venue Address.");

        return false;

    }

    return true;

}

/***********************
 * FORMAT DATE
 ***********************/

function formatDate(dateValue) {

    const options = {

        day: "numeric",

        month: "long",

        year: "numeric"

    };

    return new Date(dateValue).toLocaleDateString(
        "en-IN",
        options
    );

}

/***********************
 * FORMAT TIME
 ***********************/

function formatTime(timeValue) {

    return new Date(
        "1970-01-01T" + timeValue
    ).toLocaleTimeString(
        "en-IN",
        {

            hour: "numeric",

            minute: "2-digit",

            hour12: true

        }

    );

}

/***********************
 * GENERATE LETTER
 ***********************/

function generateLetter() {

    const fullName =
        document.getElementById("fullName").value;

    const venue =
        document.getElementById("venue").value;

    const address =
        document.getElementById("address").value;

    const occasionName =
        getOccasion();

    const eventDate =
        formatDate(
            document.getElementById("eventDate").value
        );

    const eventTime =
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

<strong>${eventDate}</strong>

at

<strong>${eventTime}</strong>.

</p>

<p>

<strong>Venue Address</strong>

<br><br>

${address.replace(/\n/g, "<br>")}

</p>

<p>

We humbly request the Mandali
to kindly accept our invitation
and bless the occasion with
your divine presence and
Bhajana Seva.

</p>

<p>

Thanking You,

</p>

<p>

Yours Faithfully,

<br><br><br>

<strong>${fullName}</strong>

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

/***********************
 * GENERATE LETTER BUTTON
 ***********************/

generateLetterButton.addEventListener("click", function () {

    if (!validateForm()) {
        return;
    }

    generateLetter();

});


/***********************
 * SUBMIT REQUEST
 ***********************/

submitButton.addEventListener("click", async function () {

    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";

    try {

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

            landmark:
                document.getElementById("landmark").value.trim(),

            maps:
                document.getElementById("maps").value.trim(),

            generated_letter:
                generatedLetter.innerHTML,

            status:
                "Pending"

        };

        console.log("Submitting Request...");
        console.log(requestData);

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
            submitButton.innerText = "Submit Request";

            return;

        }

        console.log("Saved Successfully");
        console.log(data);

        alert(
            "Your Bhajana Invitation Request has been submitted successfully."
        );

        form.reset();

        otherOccasionDiv.style.display = "none";

        generatedLetter.innerHTML = "";

        letterPreview.style.display = "none";

        submitButton.style.display = "none";

        submitButton.disabled = false;
        submitButton.innerText = "Submit Request";

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    catch (err) {

        console.error(err);

        alert(
            "Unexpected error occurred.\n\n" +
            err.message
        );

        submitButton.disabled = false;
        submitButton.innerText = "Submit Request";

    }

});


/***********************
 * PAGE LOADED
 ***********************/

console.log("========================================");
console.log("MMBM Bhajana Invitation Portal Loaded");
console.log("Supabase Connected");
console.log("========================================");
