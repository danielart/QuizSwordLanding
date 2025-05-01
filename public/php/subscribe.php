<?php
// Handle form submission for email subscription
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : 'Anonymous User';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $newsletter = isset($_POST['newsletter']) ? true : false;
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Set up email parameters
    $to = "your-email@example.com"; // Replace with your email address
    $subject = "New QuizSword Subscription from $name";
    
    // Create a more engaging HTML email message
    $htmlMessage = "
    <html>
    <head>
        <title>New QuizSword Subscriber</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #8b4513; border-radius: 5px; }
            h1 { color: #8b4513; border-bottom: 2px solid #ffcc00; padding-bottom: 10px; }
            .highlight { background-color: #ffcc00; padding: 2px 5px; font-weight: bold; }
            .data-row { margin: 10px 0; }
            .label { font-weight: bold; width: 100px; display: inline-block; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
            .logo { text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='logo'>
                <h1>⚔️ QuizSword Subscriber ⚔️</h1>
            </div>
            <p>A new adventurer has joined the quest for knowledge!</p>
            
            <div class='data-row'>
                <span class='label'>Name:</span> <span class='highlight'>$name</span>
            </div>
            <div class='data-row'>
                <span class='label'>Email:</span> <span>$email</span>
            </div>
            <div class='data-row'>
                <span class='label'>Newsletter:</span> <span>" . ($newsletter ? "Yes" : "No") . "</span>
            </div>
            <div class='data-row'>
                <span class='label'>Date:</span> <span>" . date("Y-m-d H:i:s") . "</span>
            </div>
            <div class='data-row'>
                <span class='label'>IP:</span> <span>" . $_SERVER['REMOTE_ADDR'] . "</span>
            </div>
            
            <p>Remember to add this brave warrior to your mailing list for the upcoming launch on May 30, 2025!</p>
            
            <div class='footer'>
                <p>This email was automatically sent from your QuizSword landing page.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Plain text version of the message as a fallback
    $plainMessage = "New QuizSword Subscriber\n\n";
    $plainMessage .= "Name: $name\n";
    $plainMessage .= "Email: $email\n";
    $plainMessage .= "Newsletter: " . ($newsletter ? "Yes" : "No") . "\n";
    $plainMessage .= "Date: " . date("Y-m-d H:i:s") . "\n";
    $plainMessage .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n\n";
    $plainMessage .= "Remember to add this brave warrior to your mailing list for the upcoming launch!";
    
    // Set headers for HTML email
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: QuizSword <info@quizsword.com>\r\n"; // Make sure this is an email on your domain
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email with HTML content
    $success = mail($to, $subject, $htmlMessage, $headers);
    
    // Optional: Store subscriber in a database or file
    if ($success) {
        // Save to a file as a simple storage method
        $logFile = 'subscribers.txt';
        $logMessage = date("Y-m-d H:i:s") . " | $name | $email | Newsletter: " . ($newsletter ? "Yes" : "No") . "\n";
        file_put_contents($logFile, $logMessage, FILE_APPEND);
    }
    
    // Send JSON response for AJAX handling
    echo json_encode(['success' => $success, 'message' => $success ? 'Thank you for subscribing!' : 'There was a problem sending your email. Please try again later.']);
    exit;
}

// If accessed directly without POST data
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit;
?>