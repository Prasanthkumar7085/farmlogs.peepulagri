import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { cookie_name, cookie_value } = JSON.parse(req.body);

            if (!cookie_name || !cookie_value) {
                return res.status(400).json({ error: 'Both cookie_name and cookie_value are required in the request body' });
            }

            const cookieOptions = {
                httpOnly: false,// Cookie cannot be accessed by JavaScript
                httpsOnly: true, // Cookie is only sent over HTTPS
                secure: true, // Expiration time of 1 day in seconds
                maxAge: 86400, // Cookie is accessible across the entire domain
                path: '/',
                priority: 'HIGH'
            };

            res.setHeader('Set-Cookie', `${cookie_name}=${cookie_value}; ${Object.entries(cookieOptions).map(([key, value]) => `${key}=${value}`).join('; ')}`);
            return res.status(200).json({ message: 'Cookie set successfully' });
        } catch (error) {
            return res.status(400).json({ error: 'Invalid JSON format in the request body' });
        }
    } else {
        return res.status(405).end(); // Method Not Allowed
    }
}