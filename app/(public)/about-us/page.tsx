const mission = [
    {
        id: 1,
        heading: "Mission One",
        description: "To care for and improve the welfare of the descendants of the LATE PA FESTUS MBAH",
    },
    {
        id: 2,
        heading: "Mission Two",
        description:
            "To facilitate opportunities for self development and empowerment of the descendants of PA FESTUS MBAH and foster prosperity of the family and society in general",
    },
    {
        id: 3,
        heading: "Mission Three",
        description:
            "To develop and strengthen the ties of kinship between the descendants of PA FESTUS MBAH and stimulate the exchange of positive ideas through its programs and projects.",
    },
];

const AboutUspage = () => {
    return (
        <section className="w-contain py-10 grid lg:grid-cols-2 lg:gap-50 gap-12.5 text-xl">
            <div className="flex flex-col gap-12.5">
                <h4 className="text-3xl text-primary">Vision</h4>
                <p>
                    Our Vision is to help the descendants of Pa Festus and Madam Roseline Mbah attain and maintain
                    middle-class status by providing support for their essential needs, access to affordable financing,
                    basic health care and legal services, as well as vocational training and empowerment initiatives.
                </p>
            </div>

            <div className="flex flex-col gap-12.5">
                <h4 className="text-3xl text-primary">Mission</h4>
                <div className="flex flex-col gap-10">
                    {mission.map((item) => (
                        <div key={item.id} className="space-y-2">
                            <h5 className="text-2xl text-foreground/50">{item.heading}</h5>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutUspage;
