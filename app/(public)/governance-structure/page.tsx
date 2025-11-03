import AyoMakinde from "@/public/images/Ayo Makinde.png";
import KingsleyMbah from "@/public/images/Kingsley Mbah.png";
import Image from "next/image";

const governance = [
    { image: KingsleyMbah, name: "Ayo Makinde", position: "THE CHAIRMAN" },
    { image: AyoMakinde, name: "Kingsley Mbah", position: "THE SECRETARY" },
    { image: AyoMakinde, name: "Kingsley Mbah", position: "PUBLIC RELATIONS OFFICER" },
    { image: AyoMakinde, name: "Kingsley Mbah", position: "FINANCIAL SECRETARY" },
    { image: AyoMakinde, name: "Kingsley Mbah", position: "TREASURER" },
    { image: AyoMakinde, name: "Kingsley Mbah", position: "THE SECRETARY" },
];

const GovernanceStructurePage = () => {
    return (
        <section className="py-10">
            <div className="flex flex-col items-center gap-12.5">
                <h3 className="text-3xl text-center">Governance & organisational structure</h3>

                <div className="grid lg:grid-cols-6 grid-cols-2 lg:gap-12.5 gap-4">
                    {governance.map(({ image, name, position }, index) => (
                        <div key={name + index} className="flex flex-col gap-5">
                            <div>
                                <Image src={image} alt={name} className="size-full object-cover" />
                            </div>
                            <div className="text-center flex flex-col gap-1">
                                <span className="text-xl font-medium text-primary">{name}</span>
                                <span className="text-foreground/50">{position}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GovernanceStructurePage;
