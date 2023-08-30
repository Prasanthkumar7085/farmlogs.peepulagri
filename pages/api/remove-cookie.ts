import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get all cookie names (split by ;)
        const cookies = req.headers.cookie ? req.headers.cookie.split('; ') : [];

        // Iterate through cookies and set their expiration time to a past date
        const pastDate = new Date(0).toUTCString();
        const cookieOptions = {
            httpOnly: true,   // Cookie cannot be accessed by JavaScript
            secure: true,     // Cookie is only sent over HTTPS
            expires: pastDate, // Set the expiration time to a date in the past
            path: '/',        // Cookie is accessible across the entire domain
        };

        cookies.forEach((cookie) => {
            const [name] = cookie.split('=');
            res.setHeader('Set-Cookie', `${name}=; ${Object.entries(cookieOptions).map(([key, value]) => `${key}=${value}`).join('; ')}`);
        });

        return res.status(200).json({ message: 'All cookies removed successfully' });
    } else {
        return res.status(405).end(); // Method Not Allowed
    }
}