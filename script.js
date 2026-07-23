// Show "Other Occasion" field
document.getElementById("occasion").addEventListener("change", function () {

    if (this.value === "Other") {
        document.getElementById("otherOccasionDiv").style.display = "block";
    } else {
        document.getElementById("otherOccasionDiv").style.display = "none";
        document.getElementById("otherOccasion").value = "";
    }

});

// Generate Letter
document.getElementById("generateLetter").addEventListener("click", function () {

    let occasion = document.getElementById("occasion").value;

    if (occasion === "Other") {
        occasion = document.getElementById("otherOccasion").value;
    }

    const letter = `
<b>To</b><br><br>

The President<br>
Maha Manthra Bhajana Mandali<br>
Chennai.<br><br>

<b>Respected Sir,</b><br><br>

I respectfully invite the members of <b>Maha Manthra Bhajana Mandali</b> to conduct Bhajana and Nama Sankeerthanam at our <b>${document.getElementById("venue").value}</b> on the occasion of <b>${occasion}</b>.

The programme is proposed to be held on <b>${document.getElementById("eventDate").value}</b> at <b>${document.getElementById("eventTime").value}</b>.

The venue address is:

${document.getElementById("address").value.replace(/\n/g,"<br>")}

<br><br>

We humbly request the Mandali to kindly accept our invitation and bless the occasion with your divine presence and Bhajana Seva.

<br><br>

Thanking you,

<br><br>

Yours faithfully,

<br><br>

<b>${document.getElementById("fullName").value}</b>

`;

    document.getElementById("generatedLetter").innerHTML = letter;

    document.getElementById("letterPreview").style.display = "block";

    document.getElementById("submitRequest").style.display = "block";

    window.scrollTo({
        top: document.getElementById("letterPreview").offsetTop,
        behavior: "smooth"
    });

});
