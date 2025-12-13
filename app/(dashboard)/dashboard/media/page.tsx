import { UserRole } from "@/generated/prisma/enums";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import MediaGallery from "./_components/media-gallery";

const MediaPage = async () => {
    const user = await currentUser();
    let isAdmin = false;

    if (user && user.emailAddresses && user.emailAddresses.length > 0) {
        const dbUser = await db.user.findUnique({
            where: { email: user.emailAddresses[0].emailAddress },
            select: { role: true },
        });
        isAdmin = dbUser?.role === UserRole.ADMIN;
        console.log("Current user email:", user.emailAddresses[0].emailAddress);
        console.log("User from DB:", dbUser);
    }

    console.log("isAdmin:", isAdmin);

    const mediaPromise = db.media.findMany({
        include: {
            mediaAsset: true,
        },
    });

    return <MediaGallery mediaPromise={mediaPromise} isAdmin={isAdmin} />;
};

export default MediaPage;
