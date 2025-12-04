import db from "@/lib/db";
import Image from "next/image";

const GovernanceStructurePage = async () => {
    const governanceBodies = await db.governanceBody.findMany({
        include: {
            image: true,
        },
    });

    return (
        <section className="w-contain flex flex-col gap-8 py-10">
            <div className="flex flex-col items-center gap-8">
                <h3 className="text-center text-3xl">Governance & organisational structure</h3>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-12.5">
                    {governanceBodies.map((item) => (
                        <div key={item.id} className="flex flex-col gap-5">
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                <Image src={item.image?.url || ""} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-1 text-center">
                                <span className="text-xl font-medium text-primary">{item.name}</span>
                                <span className="text-foreground/50">{item.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center gap-8">
                <h3 className="text-center text-3xl">Support structure</h3>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-12.5">
                    {governanceBodies.map((item) => (
                        <div key={item.id} className="flex flex-col gap-5">
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                <Image src={item.image?.url || ""} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-1 text-center">
                                <span className="text-xl font-medium text-primary">{item.name}</span>
                                <span className="text-foreground/50">{item.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GovernanceStructurePage;
