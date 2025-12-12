import { METADATA_DESCRIPTION, METADATA_TITLE } from "@/lib/constants";
import db from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `About Us`,
    description: `Learn about the ${METADATA_TITLE}'s vision and missions to empower families through support and development initiatives. ${METADATA_DESCRIPTION}`,
};

const defaultMissions = [
    {
        id: "1",
        heading: "Mission One",
        text: "To care for and improve the welfare of descendants of LATE PA FESTUS MBAH",
    },
    {
        id: "2",
        heading: "Mission Two",
        text: "To facilitate opportunities for self development and empowerment of descendants of PA FESTUS MBAH towards fostering prosperity of the family and society in general.",
    },
    {
        id: "3",
        heading: "Mission Three",
        text: "To develop and strengthen the ties of kinship between the descendants of PA FESTUS MBAH and stimulate exchange of positive ideas through its programs and projects.",
    },
];

const AboutUspage = async () => {
    const aboutUs = await db.aboutUs.findFirst({
        include: {
            missions: true,
        },
    });

    const vision =
        aboutUs?.vision ||
        "Our Vision is to help the descendants of Pa Festus and Madam Roseline Mbah attain and maintain middle-class status by providing support for their essential needs, access to affordable financing, basic health care and legal services, as well as vocational training and empowerment initiatives.";

    const missions =
        aboutUs?.missions.length === 3
            ? aboutUs.missions.map((mission, index) => ({
                  id: mission.id,
                  heading: index === 0 ? "Mission One" : index === 1 ? "Mission Two" : "Mission Three",
                  text: mission.text,
              }))
            : defaultMissions;

    return (
        <section className="w-contain grid gap-12.5 py-10 text-xl lg:grid-cols-2 lg:gap-50">
            <div className="flex flex-col gap-12.5">
                <h2 className="text-3xl text-primary">Vision</h2>
                <p>{vision}</p>
            </div>

            <div className="flex flex-col gap-12.5">
                <h2 className="text-3xl text-primary">Mission</h2>
                <div className="flex flex-col gap-10">
                    {missions.map((item) => (
                        <div key={item.id} className="space-y-2">
                            <h3 className="text-2xl text-foreground/50">{item.heading}</h3>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutUspage;
