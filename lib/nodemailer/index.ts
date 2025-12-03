import nodemailer from 'nodemailer';
import {
    WELCOME_EMAIL_TEMPLATE,
    NEWS_SUMMARY_EMAIL_TEMPLATE,
    STOCK_ALERT_UPPER_EMAIL_TEMPLATE,
    STOCK_ALERT_LOWER_EMAIL_TEMPLATE
} from "@/lib/nodemailer/templates";

interface WelcomeEmailData {
    email: string;
    name: string;
    intro: string;
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: parseInt(process.env.NODEMAILER_MAX_CONNECTIONS || '5', 10),
    maxMessages: parseInt(process.env.NODEMAILER_MAX_MESSAGES || '100', 10),
    rateDelta: 1000,
    rateLimit: parseInt(process.env.NODEMAILER_RATE_LIMIT || '5', 10),
    connectionTimeout: parseInt(process.env.NODEMAILER_CONNECTION_TIMEOUT || '10000', 10),
    socketTimeout: parseInt(process.env.NODEMAILER_SOCKET_TIMEOUT || '10000', 10),
    greetingTimeout: parseInt(process.env.NODEMAILER_GREETING_TIMEOUT || '5000', 10),
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"NexTrade" <nextrade@andlivshukla>`,
        to: email,
        subject: `Welcome to NexTrade - your stock market toolkit is ready!`,
        text: 'Thanks for joining NexTrade',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"NexTrade News" <nextrade@andlivshukla>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from NexTrade`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};
<<<<<<< HEAD

export const sendPriceAlertEmail = async ({
    email,
    symbol,
    currentPrice,
    targetPrice,
    condition,
    timestamp,
}: {
    email: string;
    symbol: string;
    currentPrice: number;
    targetPrice: number;
    condition: "ABOVE" | "BELOW";
    timestamp: string;
}) => {
    const template =
        condition === "ABOVE"
            ? STOCK_ALERT_UPPER_EMAIL_TEMPLATE
            : STOCK_ALERT_LOWER_EMAIL_TEMPLATE;

    const htmlTemplate = template
        .replace("{{symbol}}", symbol)
        .replace("{{currentPrice}}", currentPrice.toFixed(2))
        .replace("{{targetPrice}}", targetPrice.toFixed(2))
        .replace("{{timestamp}}", timestamp)
        .replace("{{company}}", "Stock Alert");

    const subject = `Price Alert: ${symbol} is ${condition === "ABOVE" ? "above" : "below"
        } ${targetPrice}`;

    const mailOptions = {
        from: `"NexTrade Alerts" <nextrade@andlivshukla>`,
        to: email,
        subject,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};
=======
>>>>>>> ba6af2941306b3366bd6ecd28c80780894ee77ca
