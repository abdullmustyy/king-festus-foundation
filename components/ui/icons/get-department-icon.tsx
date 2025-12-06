import AccountsClarification from "@/components/ui/icons/accounts-clarification";
import Department from "@/components/ui/icons/department";
import ITSupport from "@/components/ui/icons/it-support";
import LegalConsultation from "@/components/ui/icons/legal-consultation";
import MedicareConsultation from "@/components/ui/icons/medicare-consultation";
import PersonalAccount from "@/components/ui/icons/personal-account";
import SecretariatSupportServices from "@/components/ui/icons/secretariat-support-services";

export const getDepartmentIcon = (departmentName: string) => {
    const commonProps = { className: "size-5 text-primary" };
    switch (departmentName.toLowerCase()) {
        case "medicare consultation":
            return <MedicareConsultation {...commonProps} />;
        case "legal consultation":
            return <LegalConsultation {...commonProps} />;
        case "secretariat support services":
            return <SecretariatSupportServices {...commonProps} />;
        case "accounts clarification":
            return <AccountsClarification {...commonProps} />;
        case "personal account / ledger review":
            return <PersonalAccount {...commonProps} />;
        case "it support":
            return <ITSupport {...commonProps} />;
        default:
            return <Department {...commonProps} />; // Default icon
    }
};
