<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the feedback from the form
    $feedback = $_POST["feedback"];

    // Send an email with the feedback
    $to = "zyneeduno@gmail.com"; // Replace with your email address
    $subject = "Feedback from Dessy Website";
    $message = "Feedback: " . $feedback;
    $headers = "From: zyneeduno@gmail.com"; // Replace with your email address

    // Send the email
    $mail_sent = mail($to, $subject, $message, $headers);

    // Check if the email was sent successfully
    if ($mail_sent) {
        // Set a session variable to indicate successful submission
        session_start();
        $_SESSION["feedback_sent"] = true;
    } else {
        // Set a session variable to indicate submission failure
        $_SESSION["feedback_sent"] = false;
    }
}
?>
