import { ContactItem } from "@/components/features/contact/contact-item";
import Facebook from "@/components/ui/icons/facebook";
import Instagram from "@/components/ui/icons/instagram";
import LinkedIn from "@/components/ui/icons/linkedin";
import Phone from "@/components/ui/icons/phone";
import Whatsapp from "@/components/ui/icons/whatsapp";
import { baseSocialLinks, METADATA_TITLE } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Contact Us`,
    description: `Get in touch with ${METADATA_TITLE}. Reach our secretary, support services, or connect with us on social media.`,
};

const contactDetails = [
    { name: "Phone number of Secretary", label: "+1 (639) 998-0042", value: "+16399980042" },
    { name: "Sectarians Support Services Provider", label: "+234 706 821 8779", value: "+2347068218779" },
    { name: "Audit firm", label: "+234 803 430 2582", value: "+2348034302582" },
];

const socialLinks = baseSocialLinks.map((link) => {
    let Icon;
    let label;

    switch (link.name) {
        case "Facebook":
            Icon = Facebook;
            label = "@kingfestusfoundation";
            break;
        case "Instagram":
            Icon = Instagram;
            label = "@kingfestusfoundation";
            break;
        case "LinkedIn":
            Icon = LinkedIn;
            label = "@kingfestusfoundation";
            break;
        case "WhatsApp":
            Icon = Whatsapp;
            label = "+1 (253) 902 3456";
            break;
    }

    return { ...link, Icon, label };
});

const ContactUsPage = () => {
    return (
        <main className="w-contain grid gap-10 py-10 text-xl lg:grid-cols-2 lg:gap-50">
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl text-primary">Contact details</h1>

                <div className="flex flex-col gap-4">
                    {contactDetails.map((detail, index) => (
                        <div key={detail.name + index} className="flex flex-col gap-2 border-b border-black/20 pb-5">
                            <h2 className="text-2xl text-foreground/80">{detail.name}</h2>
                            <ContactItem
                                href={`tel:${detail.value}`}
                                title={detail.label}
                                icon={<Phone className="size-5 opacity-50" />}
                                label={detail.label}
                                value={detail.value}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h1 className="text-3xl text-primary">Social media</h1>

                <div className="flex flex-col gap-4">
                    {socialLinks.map(({ Icon, href, label, name }, index) => (
                        <div key={name + index} className="flex flex-col gap-2 border-b border-black/20 pb-5">
                            <h2 className="text-2xl text-foreground/80">{name}</h2>
                            <ContactItem
                                href={href}
                                title={label ?? name}
                                icon={Icon && <Icon className="size-5 opacity-50" />}
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
