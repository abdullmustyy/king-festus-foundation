import { METADATA_DESCRIPTION, METADATA_TITLE } from "@/lib/constants";
import db from "@/lib/db";
import AccountsClarification from "@/public/images/accounts-clarification.svg";
import ITSupport from "@/public/images/it-support.svg";
import LegalConsultation from "@/public/images/legal-consultation.svg";
import MedicareConsultation from "@/public/images/medicare-consultation.svg";
import PersonalAccount from "@/public/images/personal-account.svg";
import SecretariatSupport from "@/public/images/secretariat-support.svg";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: `Governance Structure`,
    description: `Explore the ${METADATA_TITLE}'s governance and organizational structure, including our board of trustees and support services. ${METADATA_DESCRIPTION}`,
};

const organisationalStructure = [
    { image: MedicareConsultation, name: "Medicare", organizer: null },
    { image: LegalConsultation, name: "Legal consultation", organizer: null },
    { image: SecretariatSupport, name: "Secretariat support services", organizer: "AlSECs" },
    { image: AccountsClarification, name: "Accounting services", organizer: "Adeniyi Christopher & co" },
    { image: PersonalAccount, name: "Personal account ledger review", organizer: "Elijah Igoko" },
    { image: ITSupport, name: "IT support", organizer: null },
];

const GovernanceStructurePage = async () => {
    const governanceBodies = await db.governanceBody.findMany({
        include: {
            mediaAsset: true,
        },
    });

    return (
        <section className="w-contain flex flex-col gap-8 py-10">
            <div className="flex flex-col items-center gap-8">
                <h1 className="text-center text-3xl">Governance structure</h1>

                <div className="flex flex-col items-start gap-6 lg:flex-row">
                    <h3 className="text-xl text-black/70 lg:mt-2 lg:[writing-mode:sideways-lr]">Board of trustees:</h3>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                        {governanceBodies.map((item) => (
                            <div key={item.id} className="flex flex-col gap-5">
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                    <Image
                                        src={item.mediaAsset?.url || ""}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 text-center">
                                    <span className="text-xl font-medium text-primary">{item.name}</span>
                                    <span className="text-foreground/50 uppercase">{item.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8">
                <h2 className="text-center text-3xl">Organisational Structure</h2>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
                    {organisationalStructure.map((item, index) => (
                        <div key={item.name + index} className="flex flex-col items-center gap-2.5">
                            <Image src={item.image} alt={item.name} />
                            <div className="flex flex-col gap-1 text-center">
                                <span className="text-xl font-medium text-primary">{item.name}</span>
                                <span className="text-foreground/50 uppercase">{item.organizer}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GovernanceStructurePage;
