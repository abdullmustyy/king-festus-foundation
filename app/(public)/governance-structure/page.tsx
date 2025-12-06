import db from "@/lib/db";
import AccountsClarification from "@/public/images/accounts-clarification.svg";
import ITSupport from "@/public/images/it-support.svg";
import LegalConsultation from "@/public/images/legal-consultation.svg";
import MedicareConsultation from "@/public/images/medicare-consultation.svg";
import PersonalAccount from "@/public/images/personal-account.svg";
import SecretariatSupport from "@/public/images/secretariat-support.svg";
import Image from "next/image";

const structure = [
    { image: MedicareConsultation, name: "Medicare Consultation" },
    { image: LegalConsultation, name: "Legal Consultation" },
    { image: SecretariatSupport, name: "Secretariat Support Services" },
    { image: AccountsClarification, name: "Accounts Clarification" },
    { image: PersonalAccount, name: "Personal Account / Ledger Review" },
    { image: ITSupport, name: "IT Support" },
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
                <h3 className="text-center text-3xl">Governance structure</h3>

                <div className="flex flex-col items-start gap-6 lg:flex-row">
                    <h6 className="text-xl text-black/70 lg:mt-2 lg:[writing-mode:sideways-lr]">Board of trustees:</h6>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-12.5">
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
                <h3 className="text-center text-3xl">Organisational Structure</h3>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-12.5">
                    {structure.map((item, index) => (
                        <div key={item.name + index} className="flex flex-col items-center gap-2.5">
                            <Image src={item.image} alt={item.name} />
                            <span className="text-center text-xl text-black/50">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GovernanceStructurePage;
