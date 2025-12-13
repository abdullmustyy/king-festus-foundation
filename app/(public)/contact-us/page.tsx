import { ContactItem } from "@/components/features/contact/contact-item";
import Facebook from "@/components/ui/icons/facebook";
import Instagram from "@/components/ui/icons/instagram";
import LinkedIn from "@/components/ui/icons/linkedin";
import Whatsapp from "@/components/ui/icons/whatsapp";
import X from "@/components/ui/icons/x";
import { baseSocialLinks, METADATA_TITLE } from "@/lib/constants";
import { Mail, MapPin, User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Contact Us`,
    description: `Get in touch with ${METADATA_TITLE}. Reach our secretary, support services, or connect with us on social media.`,
};

const contactDetails = [
    {
        title: "Secretary",
        items: [
            {
                value: "Chukwuemeka Mbah",
                icon: User,
            },
            {
                value: "1 Ukehe Street, Off Ezillo Avenue, Independence layout, Enugu, Nigeria",
                icon: MapPin,
                href: "https://www.google.com/maps/search/?api=1&query=1+Ukehe+Street,+Off+Ezillo+Avenue,+Independence+layout,+Enugu,+Nigeria",
            },
            {
                value: "emekambah2@yahoo.com",
                icon: Mail,
                href: "mailto:emekambah2@yahoo.com",
            },
        ],
    },
    {
        title: "Secretariats Support",
        items: [
            {
                value: "Ademola Adeyanju",
                icon: User,
            },
            {
                value: "Alsec Nominees Limited, 13th Floor, St. Nicholas House, Catholic Mission Street, Lagos Island, Lagos, Nigeria",
                icon: MapPin,
                href: "https://www.google.com/maps/search/?api=1&query=Alsec+Nominees+Limited,+13th+Floor,+St.+Nicholas+House,+Catholic+Mission+Street,+Lagos+Island,+Lagos,+Nigeria",
            },
            {
                value: "Ademola.adeyanju@alsecnominees.com",
                icon: Mail,
                href: "mailto:Ademola.adeyanju@alsecnominees.com",
            },
        ],
    },
    {
        title: "Audit Firm",
        items: [
            {
                value: "Adeniyi christopher & co",
                icon: User,
            },
            {
                value: "Right wing, 2nd floor emmanuel plaza 23b, Fatai Atere way, Matori-Mushin, Lagos",
                icon: MapPin,
                href: "https://www.google.com/maps/search/?api=1&query=Right+wing,+2nd+floor+emmanuel+plaza+23b,+Fatai+Atere+way,+Matori-Mushin,+Lagos",
            },
            {
                value: "Info@acco.ng",
                icon: Mail,
                href: "mailto:Info@acco.ng",
            },
        ],
    },
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
            label = "@king_festusfoundation";
            break;
        case "LinkedIn":
            Icon = LinkedIn;
            label = "@king-festus-foundation-family-office";
            break;
        case "X(Twitter)":
            Icon = X;
            label = "@KFF2021";
            break;
        case "WhatsApp":
            Icon = Whatsapp;
            label = "+1 (470) 637-8404";
            break;
    }

    return { ...link, Icon, label };
});

const ContactUsPage = () => {
    return (
        <main className="w-contain grid gap-10 py-10 lg:grid-cols-2 lg:gap-50">
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl text-primary">Contact details</h1>

                <div className="flex flex-col gap-4">
                    {contactDetails.map((group, index) => (
                        <div key={group.title + index} className="flex flex-col gap-2 border-b border-black/20 pb-5">
                            <h2 className="w-fit rounded border border-primary px-2 text-lg text-foreground/80">
                                <span>{group.title}</span> -{" "}
                                <span className="text-primary uppercase">{group.items[0].value}</span>
                            </h2>
                            <div className="flex flex-col gap-3">
                                {group.items.slice(1).map((item, i) => (
                                    <ContactItem
                                        key={i}
                                        href={item.href}
                                        title={item.value}
                                        icon={<item.icon className="size-5 opacity-50" />}
                                        label={item.value}
                                        value={item.value}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h1 className="text-2xl text-primary">Social media</h1>

                <div className="flex flex-col gap-4">
                    {socialLinks.map(({ Icon, href, label, name }, index) => (
                        <div key={name + index} className="flex flex-col gap-2 border-b border-black/20 pb-5">
                            <h2 className="w-fit rounded border border-primary px-2 text-lg text-foreground/80">
                                {name}
                            </h2>
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
