"use client";

import { Button } from "@/components/ui/button";
import Copy from "@/components/ui/icons/copy";
import Facebook from "@/components/ui/icons/facebook";
import Instagram from "@/components/ui/icons/instagram";
import LinkedIn from "@/components/ui/icons/linkedin";
import Phone from "@/components/ui/icons/phone";
import Whatsapp from "@/components/ui/icons/whatsapp";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { baseSocialLinks } from "@/lib/constants";
import { Check } from "lucide-react";
import Link from "next/link";

const contactDetails = [
    { name: "Phone number of Secretary", label: "+1 (253) 902 3456", value: "+1 (253) 902 3456" },
    { name: "Sectarians Support Services Provider", label: "+1 (253) 902 3456", value: "+1 (253) 902 3456" },
    { name: "Audit firm", label: "+1 (253) 902 3456", value: "+1 (253) 902 3456" },
];

const socialLinks = baseSocialLinks.map((link) => {
    let Icon;
    let label;

    switch (link.name) {
        case "Facebook":
            Icon = Facebook;
            label = "foundation_org";
            break;
        case "Instagram":
            Icon = Instagram;
            label = "Foundation_org";
            break;
        case "LinkedIn":
            Icon = LinkedIn;
            label = "Foundation_org";
            break;
        case "WhatsApp":
            Icon = Whatsapp;
            label = "+1 (253) 902 3456";
            break;
    }

    return { ...link, Icon, label };
});

const ContactItem = ({
    href,
    title,
    Icon,
    label,
    value,
}: {
    href: string;
    title: string;
    Icon?: React.ElementType;
    label: string | null;
    value: string;
}) => {
    const { isCopied, copy } = useCopyToClipboard();

    return (
        <div className="flex items-center justify-between">
            <Link href={href} title={title} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-1.5">
                    {Icon && <Icon className="size-5 opacity-50" />}
                    <span>{label}</span>
                </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => copy(value)}>
                {isCopied ? <Check className="size-5 opacity-20" /> : <Copy className="size-5 opacity-20" />}
            </Button>
        </div>
    );
};

const ContactUsPage = () => {
    return (
        <main className="w-contain py-10 grid lg:grid-cols-2 lg:gap-50 gap-10 text-xl">
            <div className="flex flex-col gap-6">
                <h4 className="text-3xl text-primary">Contact details</h4>

                <div className="flex flex-col gap-4">
                    {contactDetails.map((detail, index) => (
                        <div key={detail.name + index} className="flex flex-col gap-2 pb-5 border-b border-black/20">
                            <h5 className="text-2xl text-foreground/80">{detail.name}</h5>
                            <ContactItem
                                href={`tel:${detail.value}`}
                                title={detail.label}
                                Icon={Phone}
                                label={detail.label}
                                value={detail.value}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h4 className="text-3xl text-primary">Social media</h4>

                <div className="flex flex-col gap-4">
                    {socialLinks.map(({ Icon, href, label, name }, index) => (
                        <div key={name + index} className="flex flex-col gap-2 pb-5 border-b border-black/20">
                            <h5 className="text-2xl text-foreground/80">{name}</h5>
                            <ContactItem
                                href={href}
                                title={label ?? name}
                                Icon={Icon}
                                label={label ?? ""}
                                value={label ?? ""}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ContactUsPage;
