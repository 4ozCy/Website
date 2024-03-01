<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the feedback from the form
    $feedback = $_POST["feedback"];

    // Send an email with the feedback
    $to = "zyneeduno@gmail.com"; // Replace with your email address
    $subject = "Feedback from Dessy Website";
    $message = "Feedback: " . $feedback;
    $headers = "https://dessy-website.vercel.app/"; // Replace with your email address or website name

    // Send the email
    mail($to, $subject, $message, $headers);

    // Redirect the user back to the website
    header("Location: index.html");
    exit;
}
?>
