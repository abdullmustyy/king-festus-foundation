import { baseSocialLinks } from "@/lib/constants";
import Facebook from "@/public/icons/facebook.svg";
import Instagram from "@/public/icons/instagram.svg";
import Linkedin from "@/public/icons/linkedin.svg";
import Whatsapp from "@/public/icons/whatsapp.svg";
import X from "@/public/icons/x.svg";
import Image from "next/image";

const socialLinks = baseSocialLinks.map((link) => {
    let icon;

    switch (link.name) {
        case "Facebook":
            icon = Facebook;
            break;
        case "Instagram":
            icon = Instagram;
            break;
        case "LinkedIn":
            icon = Linkedin;
            break;
        case "X(Twitter)":
            icon = X;
            break;
        case "WhatsApp":
            icon = Whatsapp;
            break;
    }

    return { ...link, icon };
});

const Footer = () => {
    return (
        <footer className="w-contain flex flex-col gap-4 py-8.5 lg:flex-row lg:items-center lg:justify-center lg:gap-30">
            {socialLinks.map(({ icon, name, href }) => (
                <a
                    key={name}
                    href={href}
                    title={name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80"
                >
                    <Image src={icon} alt={name} />
                    <span className="text-xl text-secondary">{name}</span>
                </a>
            ))}
        </footer>
    );
};

export default Footer;
