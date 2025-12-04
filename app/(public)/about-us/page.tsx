import db from "@/lib/db";

const defaultMissions = [
    {
        id: "1",
        heading: "Mission One",
        text: "To care for and improve the welfare of the descendants of the LATE PA FESTUS MBAH",
    },
    {
        id: "2",
        heading: "Mission Two",
        text: "To facilitate opportunities for self development and empowerment of the descendants of PA FESTUS MBAH and foster prosperity of the family and society in general",
    },
    {
        id: "3",
        heading: "Mission Three",
        text: "To develop and strengthen the ties of kinship between the descendants of PA FESTUS MBAH and stimulate the exchange of positive ideas through its programs and projects.",
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
                <h4 className="text-3xl text-primary">Vision</h4>
                <p>{vision}</p>
            </div>

            <div className="flex flex-col gap-12.5">
                <h4 className="text-3xl text-primary">Mission</h4>
                <div className="flex flex-col gap-10">
                    {missions.map((item) => (
                        <div key={item.id} className="space-y-2">
                            <h5 className="text-2xl text-foreground/50">{item.heading}</h5>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutUspage;
