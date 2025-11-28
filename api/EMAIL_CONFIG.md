# SMER Email Configuration Guide

## Email Account Details

**Email Address:** smer@sme-res.org  
**Mail Server:** mail.sme-res.org

### SMTP Settings (Recommended - SSL/TLS)

| Setting | Value |
|---------|-------|
| **Incoming Server (IMAP)** | mail.sme-res.org |
| **IMAP Port** | 993 |
| **Incoming Server (POP3)** | mail.sme-res.org |
| **POP3 Port** | 995 |
| **Outgoing Server (SMTP)** | mail.sme-res.org |
| **SMTP Port** | 465 |
| **Username** | smer@sme-res.org |
| **Password** | [Use the email account's password] |
| **Security** | SSL/TLS |

## PHP Configuration

### Option 1: Using Environment Variables (Recommended)

1. Create a `.env` file in the project root:
```
SMER_EMAIL_PASSWORD=your_email_password_here
```

2. Load the environment variables in your PHP application:
```php
// In your main PHP file or bootstrap
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        putenv("$key=$value");
    }
}
```

3. The PHP script will automatically use `send-membership-smtp.php` which reads from environment variables.

### Option 2: Using php.ini Configuration

Edit your `php.ini` file:

```ini
[mail function]
SMTP = mail.sme-res.org
smtp_port = 465
sendmail_path = "/usr/sbin/sendmail -t -i"
```

**Note:** Windows users may need to configure SMTP differently. Consider using PHPMailer library instead.

### Option 3: Using PHPMailer Library (Best Practice)

Install PHPMailer via Composer:
```bash
composer require phpmailer/phpmailer
```

Example usage:
```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'mail.sme-res.org';
    $mail->SMTPAuth = true;
    $mail->Username = 'smer@sme-res.org';
    $mail->Password = getenv('SMER_EMAIL_PASSWORD');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    $mail->setFrom('smer@sme-res.org', 'SMER');
    $mail->addAddress('smer@sme-res.org');
    $mail->addReplyTo($userEmail, $userName);
    
    $mail->isHTML(false);
    $mail->Subject = 'SMER Membership Application - ' . $userName;
    $mail->Body = $messageBody;
    
    $mail->send();
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
```

## Files

- **send-membership.php** - Basic implementation using PHP mail() function
- **send-membership-smtp.php** - Enhanced implementation with SMTP authentication
- **EMAIL_CONFIG.md** - This configuration guide

## Testing

To test the email configuration:

1. Submit a membership application through the form
2. Check the `membership_submissions.log` file for submission records
3. Verify that emails are received at smer@sme-res.org

## Troubleshooting

### Emails not sending?

1. **Check PHP mail configuration:**
   ```bash
   php -i | grep -i mail
   ```

2. **Check server logs:**
   - Linux/Mac: `/var/log/mail.log` or `/var/log/syslog`
   - Windows: Check Event Viewer

3. **Enable debug mode:**
   - Uncomment `error_reporting(E_ALL);` and `ini_set('display_errors', 1);` in the PHP files

4. **Verify SMTP credentials:**
   - Test connection to mail.sme-res.org:465 using telnet or openssl

5. **Check firewall/port:**
   - Ensure port 465 is open and not blocked by firewall

## Security Notes

⚠️ **Important:**
- Never hardcode passwords in PHP files
- Always use environment variables or secure configuration files
- Add `.env` to `.gitignore` to prevent accidental commits
- Use SSL/TLS for all email communications
- Validate and sanitize all user inputs

## Support

For email configuration issues, contact your hosting provider or system administrator.
